import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'

import { api } from '@/lib/api'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense
})

function CreateExpense() {
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const res = await api.expenses.$post({ json: value })
      if (!res.ok) throw new Error('Failed to create expense')
      navigate({ to: '/expenses' })
    }
  })
  return (
    <div className=' w-full flex justify-center pt-10'>
      <Card className='w-[350px] '>
        <CardHeader>
          <CardTitle>Create New Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className='grid w-full max-w-sm items-center gap-1.5'
          >
            <form.Field
              name='title'
              children={(field) => (
                <>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type='text'
                    id='title'
                    placeholder='Snacks, Groceries, etc.'
                  />
                  {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                  ) : null}
                  {field.state.meta.isValidating ? 'Validating...' : null}
                </>
              )}
            />
            <form.Field
              name='amount'
              children={(field) => (
                <>
                  <Label htmlFor='amount'>Amount</Label>
                  <Input
                    onChange={(e) => {
                      const value = Number.parseFloat(e.target.value)
                      if (Number.isNaN(value)) return
                      field.handleChange(value)
                    }}
                    onBlur={field.handleBlur}
                    value={field.state.value}
                    type='number'
                    id='amount'
                    placeholder='amount'
                  />
                  {field.state.meta.touchedErrors ? (
                    <em>{field.state.meta.touchedErrors}</em>
                  ) : null}
                  {field.state.meta.isValidating ? 'Validating...' : null}
                </>
              )}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  className=' w-full'
                  type='submit'
                  disabled={!canSubmit}
                >
                  {isSubmitting ? '...' : 'Submit'}
                </Button>
              )}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
