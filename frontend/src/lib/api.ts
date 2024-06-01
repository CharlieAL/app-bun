import { hc } from 'hono/client'
import { type ApiRoutes } from '@server/app'
import { Expense } from '@server/shareTypes'
import { queryOptions } from '@tanstack/react-query'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) throw new Error('Failed to fetch user')
  const data = await res.json()
  return data
}

export const userQueryOptions = {
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity
}

async function getAllExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) throw new Error('Failed to fetch total spent')
  const data = await res.json()
  return data
}

export const expensesQueryOptions = {
  queryKey: ['get-all-expenses'],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5
}

export async function createExpense(expense: Expense) {
  await new Promise((r) => setTimeout(r, 3000))
  // throw new Error('Failed to create expense')
  const res = await api.expenses.$post({ json: expense })
  if (!res.ok) throw new Error('Failed to create expense')
  const data = await res.json()
  return data
}

export const loadingExpenseQueryOptions = queryOptions<{ expense?: Expense }>({
  queryKey: ['loading-create-expense'],
  staleTime: Infinity,
  queryFn: async () => {
    return {}
  }
})

export const deleteExpense = async ({ id }: { id: number }) => {
  await new Promise((r) => setTimeout(r, 3000))
  // throw new Error('Failed to delete expense')
  const res = await api.expenses[':id{[0-9]+}'].$delete({
    param: { id: id.toString() }
  })
  if (!res.ok) throw new Error('Failed to delete expense')
}
