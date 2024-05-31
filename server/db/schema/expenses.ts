import {
  numeric,
  pgTable,
  serial,
  text,
  index,
  timestamp,
  date
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

// declaring enum in database

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow()
  },
  (expenses) => {
    return {
      userIdIndex: index('name_idx').on(expenses.userId)
    }
  }
)

// Schema for inserting a user - can be used to validate API requests
export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z
    .string()
    .min(3, { message: 'must be at least 3 characters' })
    .max(50, { message: 'must be at most 50 characters' }),
  amount: z
    .string()
    .min(1, { message: 'must be at least 1 character' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'must be a valid monetary value' })
})
// Schema for selecting a user - can be used to validate API responses
export const selectExpensesSchema = createSelectSchema(expenses)
