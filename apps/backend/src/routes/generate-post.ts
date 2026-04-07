/**
 * POST /api/generate-post
 * 单篇内容生成 API
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

// 生成 Prompt
function buildPrompt(niche: string, topic: string, type: ContentType): string {
  const typeInstructions: Record<ContentType, string> = {
    '共鸣': '情感共鸣型：从个人经历出发，引发读者情感共鸣，让读者觉得"说的就是我"',
    '记录': '生活记录型：真实记录日常生活，分享真实感受和体验',
    '干货': '实用干货型：提供有价值的信息、方法、技巧，让读者学到东西',
    '种草': '好物推荐型：推荐产品或服务，带有购买建议',
  }

  return `你是小红书内容创作者。请根据以下选题创作一篇可发布的小红书笔记。

创作者定位: ${niche}
选题: ${topic}
内容类型: ${type}
创作要求: ${typeInstructions[type]}

请按以下 JSON 格式返回:
{
  "title": "标题(20字以内，有吸引力)",
  "content": "正文内容(分段清晰，有层次感，适当使用emoji)",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "imageSuggestions": ["图片建议1", "图片建议2", "图片建议3"]
}

要求:
1. 标题不超过20个字，要吸引人
2. 正文要真实、有生活气息、有代入感
3. 标签要贴合内容，符合小红书风格
4. 图片建议要具体、可执行
5. 不要使用 markdown 格式，只返回 JSON
6. 正文长度 200-500 字`
}

// 解析 AI 返回的 JSON
function parseAIResponse(content: string): GeneratedPost {
  // 尝试提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 返回的内容')
  }

  const parsed = JSON.parse(jsonMatch[0])

  // 验证和规范化
  const title = String(parsed.title || '').trim()
  if (title.length > 20) {
    throw new Error('标题超过20字')
  }

  const content_str = String(parsed.content || '').replace(/[\n\r]+/g, '\n').trim()
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.slice(0, 5).map((t: unknown) => String(t).trim()).filter(Boolean)
    : []
  const imageSuggestions = Array.isArray(parsed.imageSuggestions)
    ? parsed.imageSuggestions.map((s: unknown) => String(s).trim()).filter(Boolean)
    : []

  return {
    title,
    content: content_str,
    tags,
    imageSuggestions,
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

    // 检查 MiniMax 是否可用
    if (!minimax.isConfigured()) {
      logger.warn('generate-post', 'MiniMax not configured, using fallback')
      return c.json<GeneratePostResponse>({
        success: true,
        data: FallbackResponses.generatePost,
        fallback: true,
        timestamp: new Date().toISOString(),
      })
    }

    // 调用 MiniMax API
    const prompt = buildPrompt(params.niche, params.topic, params.type)
    const aiResponse = await minimax.chat(prompt)

    // 解析返回内容
    const generatedPost = parseAIResponse(aiResponse)

    logger.info('generate-post', 'Generated post', { title: generatedPost.title })

    return c.json<GeneratePostResponse>({
      success: true,
      data: generatedPost,
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
