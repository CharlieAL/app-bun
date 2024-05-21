import { createFileRoute } from '@tanstack/react-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/')({
  component: Index
})

async function fetchTotalSpent() {
  const res = await api.expenses['total-spent'].$get()
  if (!res.ok) throw new Error('Failed to fetch total spent')
  const data = await res.json()
  return data
}

function Index() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: fetchTotalSpent
  })

  if (isError) return <div>Error</div>

  return (
    <>
      <div className='h-dvh w-full flex justify-center items-center'>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>{isLoading ? '...' : data?.total}</CardContent>
        </Card>
      </div>
    </>
  )
}
