import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { userQueryOptions } from '@/lib/api'

import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile
})

function Profile() {
  const { data, isPending, isError } = useQuery(userQueryOptions)

  if (isError) return <div>Error</div>
  if (isPending) return <div>Loading...</div>
  return (
    <Card className='w-[350px]'>
      <CardHeader className='flex flex-row gap-x-2'>
        <Avatar>
          <AvatarImage
            src={data.user.picture || ''}
            alt={data.user.given_name}
          />
          <AvatarFallback>{data.user.given_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>Profile</CardTitle>
          <CardDescription>View and edit your profile.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <h4 className='font-semibold'>{data?.user.given_name}</h4>
          <p className='font-semibold'>{data?.user.email}</p>
        </div>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button
          asChild
          variant={'destructive'}
        >
          <a href='/api/logout'>logout!</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
