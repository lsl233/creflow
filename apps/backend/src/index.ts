import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import contentPlanRoute from './routes/content-plan.js'
import generatePostRoute from './routes/generate-post.js'

const app = new Hono()

// CORS 中间件配置
app.use('*', cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// API 路由组
const api = new Hono()

// 健康检查端点
api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 内容计划 API
api.route('/', contentPlanRoute)

// 内容生成 API
api.route('/', generatePostRoute)

// 挂载 API 路由
app.route('/api', api)

serve({
  fetch: app.fetch,
  port: 3001,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
