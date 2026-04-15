import type { AccountProfile, ContentStrategyType } from '../types.js'

export interface StrategyRecommendation {
  strategy: ContentStrategyType
  reason: string
  suitableFor: string
  suggestedContentTypes: string[]
}

export interface StrategyRecommendResult {
  recommendations: StrategyRecommendation[]
  recommendedStrategy: ContentStrategyType
  reasoning: string
}

/**
 * 构建内容策略推荐 Prompt
 * 根据账号档案推荐合适的内容策略
 */
export function buildStrategyRecommendPrompt(
  profile: AccountProfile
): string {
  const statusDesc = {
    new: '新账号（粉丝少，发布历史短）',
    growing: '成长期账号（有一定粉丝基础，正在成长）',
    established: '成熟账号（粉丝量大，有丰富发布历史）',
  }[profile.status]

  return `你是小红书内容运营专家。请根据以下账号信息，推荐最合适的内容策略。

账号信息：
- 目标赛道：${profile.niche}
- 当前阶段：${statusDesc}
- 粉丝量：${profile.followers}
- 发布历史：${profile.postsCount} 篇
- 爆款经历：${profile.hasViralPost ? '有' : '无'}

内容策略类型：
1. professional（专业背书型）：立专业人设，分享行业知识和见解，建立权威感
2. humorous（搞笑/轻松型）：幽默风趣，轻松愉快的内容风格，适合泛娱乐内容
3. emotional（情感共鸣型）：从情感出发，引发共鸣，适合个人成长、情感话题
4. educational（干货教程型）：提供实用知识、技能教程，帮助读者学习
5. authentic（真实分享型）：真实日常分享，亲切自然，适合个人IP打造
6. review（测评型）：产品测评、使用对比，帮助用户做购买决策
7. vlog（vlog叙事型）：第一人称视角，记录真实生活，有故事感

请根据账号情况，推荐 2-3 个最合适的策略，并给出理由。返回 JSON 格式：
{
  "recommendations": [
    {
      "strategy": "策略类型",
      "reason": "推荐理由（30字以内）",
      "suitableFor": "适用场景（20字以内）",
      "suggestedContentTypes": ["建议的内容类型1", "建议的内容类型2"]
    }
  ],
  "recommendedStrategy": "最推荐的策略类型",
  "reasoning": "推荐理由（50字以内）"
}

请直接返回 JSON，不要有其他内容。`
}

/**
 * 解析策略推荐结果
 */
export function parseStrategyRecommendResponse(
  content: string
): StrategyRecommendResult {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析策略推荐结果')
  }

  const parsed = JSON.parse(jsonMatch[0])

  const validStrategies: ContentStrategyType[] = [
    'professional',
    'humorous',
    'emotional',
    'educational',
    'authentic',
    'review',
    'vlog',
  ]

  const recommendations = (parsed.recommendations || []).map(
    (r: Record<string, unknown>) => ({
      strategy: validStrategies.includes(r.strategy as ContentStrategyType)
        ? (r.strategy as ContentStrategyType)
        : 'authentic',
      reason: String(r.reason || '').trim(),
      suitableFor: String(r.suitableFor || '').trim(),
      suggestedContentTypes: Array.isArray(r.suggestedContentTypes)
        ? r.suggestedContentTypes.map(String)
        : [],
    })
  )

  const recommendedStrategy = validStrategies.includes(
    parsed.recommendedStrategy as ContentStrategyType
  )
    ? (parsed.recommendedStrategy as ContentStrategyType)
    : 'authentic'

  return {
    recommendations,
    recommendedStrategy,
    reasoning: String(parsed.reasoning || '').trim(),
  }
}
