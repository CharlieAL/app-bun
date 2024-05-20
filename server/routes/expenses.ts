import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

// type Expense = {
//   id: number
//   title: string
//   amount: number
// }

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(50),
  amount: z.number().int().positive()
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

const fakeExpenses: Expense[] = [
  {
    id: 1,
    amount: 100,
    title: 'Lunch'
  },
  {
    id: 2,
    amount: 200,
    title: 'Dinner'
  },
  {
    id: 3,
    amount: 300,
    title: 'Breakfast'
  },
  {
    id: 4,
    amount: 400,
    title: 'Snack'
  }
]

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpenses })
  })
  .get('/total-spent', (c) => {
    const total = fakeExpenses.reduce((acc, e) => acc + e.amount, 0)
    return c.json({ total: total })
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const expense = await c.req.valid('json')
    fakeExpenses.push({ ...expense, id: fakeExpenses.length + 1 })
    return c.json({ expense: expense })
  })
  .get('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const expense = fakeExpenses.find((e) => e.id === id)
    if (!expense) return c.json({ message: 'Expense not found' }, 404)
    c.status(201)
    return c.json({ expense: expense })
  })

  .delete('/:id{[0-9]+}', (c) => {
    const id = Number.parseInt(c.req.param('id'))
    const index = fakeExpenses.findIndex((e) => e.id === id)
    if (index === -1) return c.notFound()
    const deleteExpense = fakeExpenses.splice(index, 1)
    return c.json({ expense: deleteExpense })
  })
