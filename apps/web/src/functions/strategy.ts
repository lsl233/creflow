import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import {
  recommendStrategy,
  generateTopicBatch,
  diagnoseAccount,
} from '@creflow/ai'
import type { AccountProfile, ContentStrategyType } from '@creflow/ai'

const diagnoseSchema = z.object({
  niche: z.string(),
  followers: z.enum(['0-100', '100-1000', '1000+']),
  postsCount: z.enum(['0', '1-10', '10+']),
  hasViralPost: z.boolean(),
})

const recommendSchema = z.object({
  accountProfile: z.object({
    niche: z.string(),
    followers: z.enum(['0-100', '100-1000', '1000+']),
    postsCount: z.enum(['0', '1-10', '10+']),
    hasViralPost: z.boolean(),
    status: z.enum(['new', 'growing', 'established']),
  }),
})

const generateTopicsSchema = z.object({
  niche: z.string(),
  strategy: z.enum([
    'professional',
    'humorous',
    'emotional',
    'educational',
    'authentic',
    'review',
    'vlog',
  ]),
  accountProfile: z.object({
    niche: z.string(),
    followers: z.enum(['0-100', '100-1000', '1000+']),
    postsCount: z.enum(['0', '1-10', '10+']),
    hasViralPost: z.boolean(),
    status: z.enum(['new', 'growing', 'established']),
  }),
  count: z.enum(['7', '30']).transform((v) => (v === '7' ? 7 : 30) as 7 | 30),
})

/**
 * 诊断账号状态
 */
export const diagnoseAccountFn = createServerFn({ method: 'POST' })
  .inputValidator(diagnoseSchema)
  .handler(async (e) => {
    const data = e.data
    try {
      const profile: Omit<AccountProfile, 'status'> = {
        niche: data.niche,
        followers: data.followers,
        postsCount: data.postsCount,
        hasViralPost: data.hasViralPost,
      }
      const result = await diagnoseAccount(profile)
      return { success: true, data: result }
    } catch (error) {
      console.error('[Server] Failed to diagnose account:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '诊断失败',
      }
    }
  })

/**
 * 推荐内容策略
 */
export const recommendStrategyFn = createServerFn({ method: 'POST' })
  .inputValidator(recommendSchema)
  .handler(async (e) => {
    const data = e.data
    try {
      const result = await recommendStrategy(data.accountProfile)
      return { success: true, data: result }
    } catch (error) {
      console.error('[Server] Failed to recommend strategy:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '推荐策略失败',
      }
    }
  })

/**
 * 批量生成选题
 */
export const generateTopicBatchFn = createServerFn({ method: 'POST' })
  .inputValidator(generateTopicsSchema)
  .handler(async (e) => {
    const data = e.data
    try {
      const topics = await generateTopicBatch({
        niche: data.niche,
        strategy: data.strategy,
        profile: data.accountProfile,
        count: data.count,
      })
      return { success: true, data: topics }
    } catch (error) {
      console.error('[Server] Failed to generate topics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成选题失败',
      }
    }
  })
