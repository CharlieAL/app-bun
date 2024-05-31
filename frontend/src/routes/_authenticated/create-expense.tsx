import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createFileRoute,
  useNavigate,
  useLocation
} from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import {
  createExpense,
  expensesQueryOptions,
  loadingExpenseQueryOptions
} from '@/lib/api'
import { Expense, createExpenseSchema } from '@server/shareTypes'
import { Calendar } from '@/components/ui/calendar'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense
})
interface CustomHistoryState {
  data?: Expense
}
function CreateExpense() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as CustomHistoryState) || {}

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: state?.data?.title ?? '',
      amount: state?.data?.amount ?? '',
      date: state?.data?.date ?? new Date().toISOString()
    },
    onSubmit: async ({ value }) => {
      const existingExpenses =
        await queryClient.ensureQueryData(expensesQueryOptions)

      navigate({ to: '/expenses' })

      queryClient.setQueryData(loadingExpenseQueryOptions.queryKey, {
        expense: value
      })
      try {
        const newExpense = await createExpense(value)
        queryClient.setQueryData(expensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [newExpense, ...existingExpenses.expenses]
        })
        toast.success(`"${newExpense.title}" created successfully`, {
          description: newExpense.date
        })
      } catch (e) {
        console.log(e)
        toast.error(`Error al crear "${value.title}"`, {
          description: value.date,
          action: {
            label: 'Try Again',
            onClick: () =>
              navigate({
                to: '/create-expense',
                state: (prevState) => ({
                  ...prevState,
                  data: value
                })
              })
          }
        })
      } finally {
        queryClient.setQueryData(loadingExpenseQueryOptions.queryKey, {})
      }
    }
  })
  return (
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
          className='grid w-full max-w-sm items-center gap-1.5 gap-y-2'
        >
          <form.Field
            name='title'
            validators={{
              onChange: createExpenseSchema.shape.title
            }}
            children={(field) => (
              <div>
                <Label htmlFor='title'>Title</Label>
                {field.state.meta.touchedErrors && (
                  <p className='text-red-500 text-sm font-light'>
                    {field.state.meta.touchedErrors}
                  </p>
                )}
                {field.state.meta.isValidating ? 'Validating...' : null}
                <Input
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type='text'
                  id='title'
                  placeholder='Snacks, Groceries, etc.'
                />
              </div>
            )}
          />
          <form.Field
            name='amount'
            validators={{
              onChange: createExpenseSchema.shape.amount
            }}
            children={(field) => (
              <div>
                <Label htmlFor='amount'>Amount</Label>
                {field.state.meta.touchedErrors && (
                  <p className='text-red-500 text-sm font-light'>
                    {field.state.meta.touchedErrors}
                  </p>
                )}
                <Input
                  onChange={(e) => {
                    const value = e.target.value

                    field.handleChange(value)
                  }}
                  onBlur={field.handleBlur}
                  value={field.state.value}
                  type='number'
                  id='amount'
                  placeholder='amount'
                />

                {field.state.meta.isValidating ? 'Validating...' : null}
              </div>
            )}
          />
          <form.Field
            name='date'
            validators={{
              onChange: createExpenseSchema.shape.date
            }}
            children={(field) => (
              <div className=''>
                <Label
                  htmlFor='amount'
                  className='text-start w-full pb-1'
                >
                  Pick date
                </Label>
                {field.state.meta.touchedErrors && (
                  <p className='text-red-500 text-sm font-light'>
                    {field.state.meta.touchedErrors}
                  </p>
                )}
                <div>
                  <Calendar
                    mode='single'
                    selected={new Date(field.state.value)}
                    onSelect={(date) => {
                      const value = (date ?? new Date()).toISOString()
                      console.log(value)
                      field.handleChange(value)
                    }}
                    className='rounded-md border shadow w-full flex justify-center'
                  />
                </div>

                {field.state.meta.isValidating ? 'Validating...' : null}
              </div>
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
  )
}
