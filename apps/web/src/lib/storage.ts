/**
 * localStorage 工具函数
 */

export interface ContentPlanItem {
  day: number
  type: '共鸣' | '记录' | '干货' | '种草'
  topic: string
  intent: string
}

export interface GeneratedPost {
  title: string
  content: string
  tags: string[]
  imageSuggestions: string[]
}

export interface ContentPlanParams {
  niche: string
  goal: '涨粉' | '变现'
  persona: '真实' | '专业'
  frequency: number
}

const STORAGE_KEYS = {
  CONTENT_PLAN: 'creflow_content_plan',
  CONTENT_PLAN_PARAMS: 'creflow_content_plan_params',
  GENERATED_POST: 'creflow_generated_post',
} as const

export const storage = {
  // 保存内容计划
  saveContentPlan(plan: ContentPlanItem[], params: ContentPlanParams) {
    localStorage.setItem(STORAGE_KEYS.CONTENT_PLAN, JSON.stringify(plan))
    localStorage.setItem(STORAGE_KEYS.CONTENT_PLAN_PARAMS, JSON.stringify(params))
  },

  // 获取内容计划
  getContentPlan(): ContentPlanItem[] | null {
    const data = localStorage.getItem(STORAGE_KEYS.CONTENT_PLAN)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  // 获取内容计划参数
  getContentPlanParams(): ContentPlanParams | null {
    const data = localStorage.getItem(STORAGE_KEYS.CONTENT_PLAN_PARAMS)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  // 保存生成的帖子
  saveGeneratedPost(day: number, post: GeneratedPost) {
    localStorage.setItem(
      `${STORAGE_KEYS.GENERATED_POST}_${day}`,
      JSON.stringify(post)
    )
  },

  // 获取生成的帖子
  getGeneratedPost(day: number): GeneratedPost | null {
    const data = localStorage.getItem(`${STORAGE_KEYS.GENERATED_POST}_${day}`)
    if (!data) return null
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  },

  // 清除所有数据
  clear() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    // 清除所有生成的帖子
    for (let i = 1; i <= 7; i++) {
      localStorage.removeItem(`${STORAGE_KEYS.GENERATED_POST}_${i}`)
    }
  },
}
