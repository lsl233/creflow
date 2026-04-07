/**
 * POST /api/content-plan
 * 内容日历生成 API
 */

import { Hono } from 'hono'
import { minimax, MiniMaxError } from '../lib/minimax.js'
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

// 生成 Prompt
function buildPrompt(niche: string, goal: string, persona: string): string {
  return `你是小红书内容策划专家。请为以下定位的创作者生成7天内容日历。

创作者定位: ${niche}
变现目标: ${goal}
人设风格: ${persona}

请按以下格式生成7天的内容计划，每项必须是真实、有生活气息的话题：
JSON数组格式:
[
  {"day": 1, "type": "共鸣/记录/干货/种草", "topic": "具体话题", "intent": "创作意图/角度"}
]

要求:
1. type 必须是 "共鸣"、"记录"、"干货"、"种草" 之一
2. topic 要具体、有吸引力、真实可信
3. intent 要说明为什么这个话题值得创作
4. 话题要多样化，覆盖不同类型
5. 不要使用 emoji
6. 只返回 JSON 数组，不要其他文字`
}

// 解析 AI 返回的 JSON
function parseAIResponse(content: string): ContentPlanItem[] {
  // 尝试提取 JSON 数组
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 返回的内容')
  }

  const parsed = JSON.parse(jsonMatch[0])

  // 验证并规范化数据
  if (!Array.isArray(parsed)) {
    throw new Error('返回格式错误：不是数组')
  }

  return parsed.map((item, index) => ({
    day: typeof item.day === 'number' ? item.day : index + 1,
    type: ['共鸣', '记录', '干货', '种草'].includes(item.type) ? item.type as ContentType : '干货',
    topic: String(item.topic || '').replace(/[\n\r]/g, '').trim(),
    intent: String(item.intent || '').replace(/[\n\r]/g, '').trim(),
  }))
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

    // 检查 MiniMax 是否可用
    if (!minimax.isConfigured()) {
      logger.warn('content-plan', 'MiniMax not configured, using fallback')
      return c.json<ContentPlanResponse>({
        success: true,
        data: FallbackResponses.contentPlan,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    // 调用 MiniMax API
    const prompt = buildPrompt(params.niche, params.goal!, params.persona!)
    const aiResponse = await minimax.chat(prompt)

    // 解析返回内容
    const contentPlan = parseAIResponse(aiResponse)

    logger.info('content-plan', 'Generated content plan', { itemCount: contentPlan.length })

    return c.json<ContentPlanResponse>({
      success: true,
      data: contentPlan,
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
