import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient
    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      return { user: null }
    }
  },
  component: Component
})

function Login() {
  return (
    <Card className='w-[350px]'>
      <CardHeader className='flex flex-row gap-x-2'>
        <h4
          className='font-semibold
        '
        >
          Please log in or sign up to continue
        </h4>
      </CardHeader>

      <CardFooter className='flex justify-between'>
        <Button
          asChild
          variant={'outline'}
        >
          <a href='/api/login'>sign In</a>
        </Button>
        <div>
          <h4 className='font-semibold'>or</h4>
        </div>
        <Button asChild>
          <a href='/api/register'>sign Up</a>
        </Button>
      </CardFooter>
    </Card>
  )
}

function Component() {
  const { user } = Route.useRouteContext()
  if (!user) {
    return (
      <div className=' w-full flex justify-center pt-10'>
        <Login />
      </div>
    )
  }

  return (
    <div className=' w-full flex justify-center pt-10'>
      <Outlet />
    </div>
  )
}
