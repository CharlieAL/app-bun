import { z } from 'zod'

import { insertExpensesSchema } from './db/schema/expenses'

export const createExpenseSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
  id: true
})

export type Expense = z.infer<typeof createExpenseSchema>
