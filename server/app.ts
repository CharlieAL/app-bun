import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expensesRoute } from './routes/expenses'
import { serveStatic } from 'hono/bun'
import { authRoute } from './routes/auth'
const app = new Hono()

app.use('*', logger())
app.use('*', (c, next) => {
  c.res.headers.append(
    'Accept-CH',
    'UA, UA-Arch, UA-Platform, UA-Model, UA-Form-Factor'
  )
  c.res.headers.append('Permissions-Policy', 'ch-ua-form-factor=*')
  return next()
})

const ApiRoutes = app
  .basePath('/api')
  .route('/expenses', expensesRoute)
  .route('/', authRoute)

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('/', serveStatic({ path: './frontend/dist/index.html' }))

export default app
export type ApiRoutes = typeof ApiRoutes
