/**
 * API 客户端
 */

import type { ContentPlanItem } from './storage'

const API_BASE = 'http://localhost:3001/api'

interface ContentPlanRequest {
  niche: string
  goal?: '涨粉' | '变现'
  persona?: '真实' | '专业'
  frequency?: number
}

interface ContentPlanResponse {
  success: boolean
  data?: ContentPlanItem[]
  error?: string
  fallback?: boolean
}

interface GeneratePostRequest {
  topic: string
  type: '共鸣' | '记录' | '干货' | '种草'
  niche: string
}

interface GeneratePostResponse {
  success: boolean
  data?: {
    title: string
    content: string
    tags: string[]
    imageSuggestions: string[]
  }
  error?: string
  fallback?: boolean
}

class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`请求失败: ${response.status}`, response.status)
  }
  const data = await response.json()
  if (!data.success) {
    throw new ApiError(data.error || '请求失败')
  }
  return data
}

export const api = {
  // 生成内容日历
  async generateContentPlan(params: ContentPlanRequest): Promise<ContentPlanResponse> {
    const response = await fetch(`${API_BASE}/content-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    return handleResponse<ContentPlanResponse>(response)
  },

  // 生成单篇内容
  async generatePost(params: GeneratePostRequest): Promise<GeneratePostResponse> {
    const response = await fetch(`${API_BASE}/generate-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    return handleResponse<GeneratePostResponse>(response)
  },

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`)
      if (!response.ok) return false
      const data = await response.json()
      return data.status === 'ok'
    } catch {
      return false
    }
  },
}

export { ApiError }
