import { Hono } from 'hono'

import { zValidator } from '@hono/zod-validator'

import { getUser } from '../kinde'
import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses'
import { and, desc, eq, sum } from 'drizzle-orm'
import { createExpenseSchema } from '../shareTypes'
import {
  insertExpensesSchema,
  selectExpensesSchema
} from '../db/schema/expenses'

// const fakeExpenses: Expense[] = [
//   {
//     id: 1,
//     amount: '100',
//     title: 'Lunch'
//   },
//   {
//     id: 2,
//     amount: '200',
//     title: 'Dinner'
//   },
//   {
//     id: 3,
//     amount: '300',
//     title: 'Breakfast'
//   },
//   {
//     id: 4,
//     amount: '400',
//     title: 'Snack'
//   }
// ]

export const expensesRoute = new Hono()
  .get('/', getUser, async (c) => {
    const user = c.var.user
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.createdAt))
      .limit(100)
    return c.json({ expenses })
  })
  .post('/', getUser, zValidator('json', createExpenseSchema), async (c) => {
    const expense = await c.req.valid('json')
    const user = c.var.user

    const validatedExpense = insertExpensesSchema.parse({
      ...expense,
      userId: user.id
    })

    const result = await db
      .insert(expensesTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0])
    return c.json(result)
  })
  .get('/total-spent', getUser, async (c) => {
    const user = c.var.user
    const [result] = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .limit(1)
    return c.json({ total: result.total })
  })
  .get('/:id{[0-9]+}', getUser, async (c) => {
    const id = Number.parseInt(c.req.param('id'))

    const user = c.var.user
    const [expense] = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
    if (!expense) return c.notFound()
    return c.json({ expense: expense })
  })

  .delete('/:id{[0-9]+}', getUser, async (c) => {
    const user = c.var.user
    const id = Number.parseInt(c.req.param('id'))

    const [expense] = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
      .returning()

    if (!expense) return c.notFound()

    return c.json({ expense })
  })
