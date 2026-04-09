import { getServerConfig } from '@creflow/config/server'
import { createAIClient, MiniMaxError } from './client.js'
import {
  buildContentPlanPrompt,
  parseContentPlanResponse,
  buildGeneratePostPrompt,
  parseGeneratePostResponse,
} from './prompts/index.js'
import type {
  ContentPlanRequest,
  ContentPlanItem,
  GeneratePostRequest,
  GeneratedPost,
} from './types.js'

// 重新导出类型
export type {
  ContentType,
  ContentPlanRequest,
  ContentPlanItem,
  GeneratePostRequest,
  GeneratedPost,
  AIClientConfig,
} from './types.js'

export { MiniMaxClient, MiniMaxError, createAIClient } from './client.js'
export * from './prompts/index.js'

/**
 * 生成内容日历
 * 使用服务端配置自动创建 AI 客户端
 */
export async function generateContentPlan(
  params: ContentPlanRequest
): Promise<{ data: ContentPlanItem[]; fallback?: boolean }> {
  const config = getServerConfig()

  // 如果未配置 API Key，返回降级响应
  if (!config.MINIMAX_API_KEY) {
    console.warn('[AI] MINIMAX_API_KEY not configured, using fallback')
    return { data: getFallbackContentPlan(), fallback: true }
  }

  const client = createAIClient({
    apiKey: config.MINIMAX_API_KEY,
    baseUrl: config.MINIMAX_BASE_URL,
    model: config.MINIMAX_MODEL,
  })

  try {
    const prompt = buildContentPlanPrompt(params)
    const response = await client.chat(prompt)
    const data = parseContentPlanResponse(response)
    return { data }
  } catch (error) {
    if (error instanceof MiniMaxError) {
      console.warn('[AI] MiniMax API error, using fallback:', error.message)
      return { data: getFallbackContentPlan(), fallback: true }
    }
    throw error
  }
}

/**
 * 生成单篇内容
 * 使用服务端配置自动创建 AI 客户端
 */
export async function generatePost(
  params: GeneratePostRequest
): Promise<{ data: GeneratedPost; fallback?: boolean }> {
  const config = getServerConfig()

  // 如果未配置 API Key，返回降级响应
  if (!config.MINIMAX_API_KEY) {
    console.warn('[AI] MINIMAX_API_KEY not configured, using fallback')
    return { data: getFallbackPost(), fallback: true }
  }

  const client = createAIClient({
    apiKey: config.MINIMAX_API_KEY,
    baseUrl: config.MINIMAX_BASE_URL,
    model: config.MINIMAX_MODEL,
  })

  try {
    const prompt = buildGeneratePostPrompt(params)
    const response = await client.chat(prompt)
    const data = parseGeneratePostResponse(response)
    return { data }
  } catch (error) {
    if (error instanceof MiniMaxError) {
      console.warn('[AI] MiniMax API error, using fallback:', error.message)
      return { data: getFallbackPost(), fallback: true }
    }
    throw error
  }
}

/**
 * 内容日历降级响应
 */
function getFallbackContentPlan(): ContentPlanItem[] {
  return [
    { day: 1, type: '共鸣', topic: '聊聊你刚开始做自媒体时的迷茫', intent: '分享真实经历，引发共鸣' },
    { day: 2, type: '干货', topic: '我是如何找到内容定位的', intent: '分享方法论，提供价值' },
    { day: 3, type: '记录', topic: '今天的工作日常', intent: '展示真实生活，拉近距离' },
    { day: 4, type: '种草', topic: '最近发现的好用工具分享', intent: '推荐实用工具' },
    { day: 5, type: '共鸣', topic: '那些没人告诉你的自媒体真相', intent: '分享行业洞察' },
    { day: 6, type: '干货', topic: '如何写出爆款标题', intent: '分享写作技巧' },
    { day: 7, type: '记录', topic: '周末的生活小确幸', intent: '展示生活方式' },
  ]
}

/**
 * 单篇内容降级响应
 */
function getFallbackPost(): GeneratedPost {
  return {
    title: '这是一个示例标题',
    content: '这里是示例内容。由于 AI 服务暂时不可用，我们为您提供了这个示例。请稍后重试或检查 API 配置。',
    tags: ['示例', '小红书', '文案'],
    imageSuggestions: ['配图建议1', '配图建议2', '配图建议3'],
  }
}
