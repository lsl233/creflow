/**
 * AI 相关类型定义
 */

// 内容类型
export type ContentType = '共鸣' | '记录' | '干货' | '种草'

// 内容日历请求参数
export interface ContentPlanRequest {
  niche: string        // 领域/定位
  goal?: string        // 目标: 涨粉 / 变现
  persona?: string     // 人设: 真实 / 专业
  frequency?: number   // 发布频率
}

// 内容日历单项
export interface ContentPlanItem {
  day: number
  type: ContentType
  topic: string
  intent: string
}

// 生成单篇内容请求参数
export interface GeneratePostRequest {
  topic: string       // 选题
  type: ContentType   // 内容类型
  niche: string       // 领域/定位
}

// 生成的单篇内容
export interface GeneratedPost {
  title: string              // 标题
  content: string            // 正文
  tags: string[]             // 标签
  imageSuggestions: string[] // 图片建议
}

// AI 客户端配置
export interface AIClientConfig {
  apiKey: string
  baseUrl?: string
  model?: string
}

// 聊天消息
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// 聊天补全选项
export interface ChatCompletionOptions {
  messages: ChatMessage[]
  model?: string
  max_tokens?: number
  temperature?: number
}

// 聊天补全响应
export interface ChatCompletionResponse {
  id: string
  model: string
  choices: Array<{
    index: number
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}
