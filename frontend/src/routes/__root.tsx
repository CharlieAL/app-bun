import { type QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Link,
  Outlet
} from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root
})

function NavBar() {
  return (
    <>
      <div className='p-2 flex gap-2'>
        <Link
          to='/'
          className='[&.active]:font-bold'
        >
          Home
        </Link>
        <Link
          to='/expenses'
          className='[&.active]:font-bold'
        >
          Expenses
        </Link>
        <Link
          to='/create-expense'
          className='[&.active]:font-bold'
        >
          Create
        </Link>
        <Link
          to='/profile'
          className='[&.active]:font-bold'
        >
          Profile
        </Link>
      </div>
      <hr />
    </>
  )
}

function Root() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Toaster />
    </>
  )
}
