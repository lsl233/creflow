import { createServerFn } from '@tanstack/react-start'
import { generateContentPlan, generatePost } from '@creflow/ai'
import type { ContentPlanRequest, GeneratePostRequest } from '@creflow/ai'

/**
 * 生成内容日历
 */
export const generateContentPlanFn = createServerFn({ method: 'POST' })
  .handler(async ({ data }: { data: ContentPlanRequest }) => {
    try {
      const result = await generateContentPlan(data)
      return {
        success: true,
        data: result.data,
        fallback: result.fallback,
      }
    } catch (error) {
      console.error('[Server] Failed to generate content plan:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成内容日历失败',
      }
    }
  })

/**
 * 生成单篇内容
 */
export const generatePostFn = createServerFn({ method: 'POST' })
  .handler(async ({ data }: { data: GeneratePostRequest }) => {
    try {
      const result = await generatePost(data)
      return {
        success: true,
        data: result.data,
        fallback: result.fallback,
      }
    } catch (error) {
      console.error('[Server] Failed to generate post:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成内容失败',
      }
    }
  })
