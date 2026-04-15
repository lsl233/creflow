import { z } from 'zod'
import { createServerFn } from '@tanstack/react-start'
import { recommendStrategy, generateTopicBatch } from '@creflow/ai'
import type { ContentStrategyType, TopicItem } from '@creflow/ai'

const adjustStrategySchema = z.object({
  currentTopicId: z.number(),
  topics: z.array(z.any()),
  accountProfile: z.object({
    niche: z.string(),
    followers: z.enum(['0-100', '100-1000', '1000+']),
    postsCount: z.enum(['0', '1-10', '10+']),
    hasViralPost: z.boolean(),
    status: z.enum(['new', 'growing', 'established']),
  }),
})

/**
 * 分析内容表现并推荐策略调整
 */
export const analyzeAndAdjustStrategyFn = createServerFn({ method: 'POST' })
  .inputValidator(adjustStrategySchema)
  .handler(async (e) => {
    const { currentTopicId, topics, accountProfile } = e.data

    try {
      // 分析哪些类型表现好
      const typePerformance: Record<string, { total: number; count: number; avgRate: number }> = {}

      topics.forEach((t: any) => {
        if (t.metrics) {
          const rate = t.metrics.engagementRate || 0
          if (!typePerformance[t.type]) {
            typePerformance[t.type] = { total: 0, count: 0, avgRate: 0 }
          }
          typePerformance[t.type].total += rate
          typePerformance[t.type].count++
        }
      })

      // 计算每种类型的平均表现
      Object.keys(typePerformance).forEach((type) => {
        const p = typePerformance[type]
        p.avgRate = p.count > 0 ? p.total / p.count : 0
      })

      // 获取新的策略推荐
      const strategyResult = await recommendStrategy(accountProfile)

      // 找到表现最好的内容类型
      const bestTypes = Object.entries(typePerformance)
        .sort((a, b) => b[1].avgRate - a[1].avgRate)
        .slice(0, 3)
        .map(([type]) => type)

      // 计算从哪个 topic 开始重塑（保留已发布的）
      const startRegenerateFrom = currentTopicId

      // 重新生成后续选题
      const newTopics = await generateTopicBatch({
        niche: accountProfile.niche,
        strategy: strategyResult.recommendedStrategy,
        profile: accountProfile,
        count: 30, // 固定生成30个
      })

      return {
        success: true,
        data: {
          analysis: {
            typePerformance,
            bestTypes,
          },
          newStrategy: strategyResult.recommendedStrategy,
          reasoning: strategyResult.reasoning,
          recommendations: strategyResult.recommendations,
          newTopics: newTopics.map((t, i) => ({
            ...t,
            id: startRegenerateFrom + i,
          })),
          startRegenerateFrom,
        },
      }
    } catch (error) {
      console.error('[Server] Failed to adjust strategy:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '策略调整失败',
      }
    }
  })
