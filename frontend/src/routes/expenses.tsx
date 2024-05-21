import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
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

export const Route = createFileRoute('/expenses')({
  component: Expenses
})

async function getAllExpenses() {
  const res = await api.expenses.$get()
  if (!res.ok) throw new Error('Failed to fetch total spent')
  const data = await res.json()
  return data
}

function Expenses() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses
  })

  if (isError) return <div>Error</div>
  return (
    <div className='h-dvh w-full flex justify-center pt-10 '>
      <div className='max-w-xl w-full'>
        <Table>
          <TableCaption>A list of your all expenses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className=''>Id</TableHead>
              <TableHead className=''>Title</TableHead>
              <TableHead className=''>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  </TableRow>
                ))
              : data?.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className='font-medium'>{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
