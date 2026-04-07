/**
 * MiniMax AI 客户端封装
 * 使用 MiniMax Text-01 模型 (Anthropic Claude 兼容 API)
 */

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface ChatCompletionOptions {
  messages: ChatMessage[]
  model?: string
  max_tokens?: number
  temperature?: number
}

interface ChatCompletionResponse {
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

export class MiniMaxError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'MiniMaxError'
  }
}

export class MiniMaxClient {
  private apiKey: string
  private baseUrl: string
  private defaultModel: string

  constructor() {
    this.apiKey = process.env.MINIMAX_API_KEY || ''
    this.baseUrl = 'https://api.minimaxi.chat/v1'
    this.defaultModel = 'MiniMax-Text-01'

    if (!this.apiKey) {
      console.warn('[MiniMax] Warning: MINIMAX_API_KEY not set')
    }
  }

  /**
   * 验证 API Key 是否配置
   */
  isConfigured(): boolean {
    return Boolean(this.apiKey)
  }

  /**
   * 聊天补全
   */
  async chatCompletion(options: ChatCompletionOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new MiniMaxError('MINIMAX_API_KEY is not configured')
    }

    const { messages, model = this.defaultModel, max_tokens = 4096, temperature = 0.7 } = options

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new MiniMaxError(
        errorData.error?.message || `API request failed with status ${response.status}`,
        response.status,
        errorData.error?.type
      )
    }

    const data: ChatCompletionResponse = await response.json()

    if (!data.choices || data.choices.length === 0) {
      throw new MiniMaxError('No completion choices returned')
    }

    return data.choices[0].message.content
  }

  /**
   * 快捷方法：发送单条消息并获取回复
   */
  async chat(prompt: string, system?: string): Promise<string> {
    const messages: ChatMessage[] = []

    if (system) {
      messages.push({ role: 'system', content: system })
    }

    messages.push({ role: 'user', content: prompt })

    return this.chatCompletion({ messages })
  }
}

// 导出单例实例
export const minimax = new MiniMaxClient()
