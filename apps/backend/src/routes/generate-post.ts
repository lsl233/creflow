/**
 * POST /api/generate-post
 * 单篇内容生成 API
 */

import { Hono } from 'hono'
import { generatePost, MiniMaxError } from '@creflow/ai'
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
interface GeneratePostRequest {
  topic: string      // 选题
  type: ContentType   // 内容类型
  niche: string       // 领域/定位
}

// 返回结果
interface GeneratedPost {
  title: string       // 标题 (20字以内)
  content: string    // 正文
  tags: string[]     // 标签 (5个)
  imageSuggestions: string[]  // 图片建议
}

// API 响应
interface GeneratePostResponse {
  success: boolean
  data?: GeneratedPost
  error?: string
  code?: string
  timestamp?: string
  fallback?: boolean
}

const api = new Hono()

// 验证请求参数
function validateRequest(body: unknown): GeneratePostRequest | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const req = body as Record<string, unknown>

  const niche = req.niche
  const topic = req.topic
  const type = req.type

  if (!niche || typeof niche !== 'string' || niche.trim() === '') {
    return null
  }

  if (!topic || typeof topic !== 'string' || topic.trim() === '') {
    return null
  }

  if (!type || !['共鸣', '记录', '干货', '种草'].includes(type as string)) {
    return null
  }

  return {
    niche: niche.trim(),
    topic: topic.trim(),
    type: type as ContentType,
  }
}

// POST /api/generate-post
api.post('/generate-post', async (c) => {
  logger.info('generate-post', 'Request received')

  try {
    // 解析请求体
    const body = await c.req.json()
    const params = validateRequest(body)

    if (!params) {
      logger.warn('generate-post', 'Validation failed', { body })
      return c.json<ErrorResponse>(
        createErrorResponse('参数错误：topic、type、niche 均为必填项', ErrorCodes.VALIDATION_ERROR),
        400
      )
    }

    logger.info('generate-post', 'Generating post', { topic: params.topic, type: params.type })

    // 调用 AI 生成内容
    const { data, fallback } = await generatePost(params)

    logger.info('generate-post', 'Generated post', { title: data.title, fallback })

    return c.json<GeneratePostResponse>({
      success: true,
      data,
      fallback,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('generate-post', 'Error occurred', { error: error instanceof Error ? error.message : String(error) })

    if (error instanceof MiniMaxError) {
      // MiniMax 调用失败，使用降级响应
      logger.warn('generate-post', 'MiniMax API failed, returning fallback')
      return c.json<GeneratePostResponse>({
        success: true,
        data: FallbackResponses.generatePost,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    return c.json<ErrorResponse>(
      createErrorResponse('生成内容失败，请重试', ErrorCodes.INTERNAL_ERROR),
      500
    )
  }
})

export default api
