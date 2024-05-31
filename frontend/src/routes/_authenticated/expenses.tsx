import {
  deleteExpense,
  expensesQueryOptions,
  loadingExpenseQueryOptions
} from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { TrashIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses
})

function Expenses() {
  const { data, isPending, isError } = useQuery(expensesQueryOptions)
  const { data: loadingCreateExpense } = useQuery(loadingExpenseQueryOptions)

  if (isError) return <div>Error</div>
  return (
    <div className='max-w-xl w-full'>
      <Table>
        <TableCaption>A list of your all expenses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className=''>Id</TableHead>
            <TableHead className=''>Title</TableHead>
            <TableHead className=''>Amount</TableHead>
            <TableHead className=''>date</TableHead>
            <TableHead className=''>action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingCreateExpense?.expense && (
            <TableRow className='py-2'>
              <TableCell className=''>
                <Skeleton className='h-4' />
              </TableCell>
              <TableCell>{loadingCreateExpense.expense.title}</TableCell>
              <TableCell>{loadingCreateExpense.expense.amount}</TableCell>
              <TableCell>
                {loadingCreateExpense.expense?.date?.split('T')[0]}
              </TableCell>
            </TableRow>
          )}
          {isPending
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className=''>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4' />
                  </TableCell>
                </TableRow>
              ))
            : data?.expenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className='py-2'
                >
                  <TableCell className='font-medium'>{expense.id}</TableCell>
                  <TableCell>{expense.title}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense?.date?.split('T')[0]}</TableCell>
                  <TableCell>
                    <ExpeseDeleteButton id={expense.id} />
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ExpeseDeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onMutate: () => {},
    onError: () => {
      // An error happened!
      toast.error('Failed to delete expense')
    },
    onSuccess: () => {
      // Boom baby!
      toast.success('Expense deleted successfully')
      queryClient.setQueryData(
        expensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id)
        })
      )
    }
  })
  return (
    <Button
      onClick={() => mutation.mutate({ id })}
      disabled={mutation.isPending}
      variant='outline'
      size='icon'
    >
      <TrashIcon className='h-4 w-4' />
    </Button>
  )
}
