/**
 * POST /api/content-plan
 * 内容日历生成 API
 */

import { Hono } from 'hono'
import { generateContentPlan, MiniMaxError } from '@creflow/ai'
import {
  logger,
  createErrorResponse,
  ErrorCodes,
  FallbackResponses,
  type ErrorResponse,
} from '../lib/errors.js'

// 内容类型
type ContentType = '共鸣' | '记录' | '干货' | '种草'

// 请求参数
interface ContentPlanRequest {
  niche: string        // 领域/定位
  goal?: string        // 目标: 涨粉 / 变现
  persona?: string     // 人设: 真实 / 专业
  frequency?: number   // 发布频率 (默认 2)
}

// 返回的日程项
interface ContentPlanItem {
  day: number
  type: ContentType
  topic: string
  intent: string
}

// API 响应
interface ContentPlanResponse {
  success: boolean
  data?: ContentPlanItem[]
  error?: string
  code?: string
  timestamp?: string
  fallback?: boolean
}

const api = new Hono()

// 验证请求参数
function validateRequest(body: unknown): ContentPlanRequest | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const req = body as Record<string, unknown>

  // niche 是必填的
  if (!req.niche || typeof req.niche !== 'string' || req.niche.trim() === '') {
    return null
  }

  return {
    niche: req.niche.trim(),
    goal: req.goal === '变现' ? '变现' : '涨粉',
    persona: req.persona === '专业' ? '专业' : '真实',
    frequency: typeof req.frequency === 'number' ? Math.max(1, Math.min(7, req.frequency)) : 2,
  }
}

// POST /api/content-plan
api.post('/content-plan', async (c) => {
  logger.info('content-plan', 'Request received')

  try {
    // 解析请求体
    const body = await c.req.json()
    const params = validateRequest(body)

    if (!params) {
      logger.warn('content-plan', 'Validation failed', { body })
      return c.json<ErrorResponse>(
        createErrorResponse('参数错误：niche 为必填项', ErrorCodes.VALIDATION_ERROR),
        400
      )
    }

    logger.info('content-plan', 'Generating plan', { niche: params.niche, goal: params.goal })

    // 调用 AI 生成内容日历
    const { data, fallback } = await generateContentPlan(params)

    logger.info('content-plan', 'Generated content plan', { itemCount: data.length, fallback })

    return c.json<ContentPlanResponse>({
      success: true,
      data,
      fallback,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('content-plan', 'Error occurred', { error: error instanceof Error ? error.message : String(error) })

    if (error instanceof MiniMaxError) {
      // MiniMax 调用失败，使用降级响应
      logger.warn('content-plan', 'MiniMax API failed, returning fallback')
      return c.json<ContentPlanResponse>({
        success: true,
        data: FallbackResponses.contentPlan,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    return c.json<ErrorResponse>(
      createErrorResponse('生成内容日历失败，请重试', ErrorCodes.INTERNAL_ERROR),
      500
    )
  }
})

export default api
