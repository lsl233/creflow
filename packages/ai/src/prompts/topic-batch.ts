import type {
  AccountProfile,
  ContentStrategyType,
  ContentType,
  TopicItem,
} from '../types.js'

export interface TopicBatchParams {
  niche: string
  strategy: ContentStrategyType
  profile: AccountProfile
  count: 7 | 30
}

/**
 * 构建选题批量生成 Prompt
 * 根据账号档案和内容策略生成批量选题
 */
export function buildTopicBatchPrompt(params: TopicBatchParams): string {
  const count = params.count
  const strategyDesc = {
    professional: '专业背书型：立专业人设，分享行业知识和见解',
    humorous: '搞笑/轻松型：幽默风趣，轻松愉快',
    emotional: '情感共鸣型：从情感出发，引发共鸣',
    educational: '干货教程型：提供实用知识、技能教程',
    authentic: '真实分享型：真实日常分享，亲切自然',
    review: '测评型：产品测评、使用对比',
    vlog: 'vlog叙事型：第一人称视角，记录真实生活',
  }[params.strategy]

  const statusDesc = {
    new: '新账号',
    growing: '成长期账号',
    established: '成熟账号',
  }[params.profile.status]

  // 内容类型分布指南
  const typeDistribution =
    count === 30
      ? `
内容类型分布（30天，均匀分布）：
- 共鸣型：4-5个
- 记录型：4-5个
- 干货型：4-5个
- 种草型：4-5个
- 测评型：3-4个
- 教程型：4-5个
- vlog式：3-4个
`
      : `
内容类型分布（7天）：
- 每种类型至少 1 个，共 7 个
`

  return `你是小红书内容策划专家。请为以下账号批量生成内容选题。

账号信息：
- 目标赛道：${params.niche}
- 账号阶段：${statusDesc}
- 内容策略：${strategyDesc}
- 需要生成：${count} 个选题

${typeDistribution}
每个选题需要包含：
1. type：内容类型（共鸣/记录/干货/种草/测评/教程/vlog式）
2. topic：选题标题（具体、有吸引力）
3. intent：创作意图（10字以内，说明想达成什么）
4. contentOutline：内容大纲（简要说明内容框架，50字以内）
5. imageSuggestion：配图建议（20字以内，说明需要什么样的图片）

请确保：
1. 选题多样化，不要重复
2. 符合目标赛道${params.niche}的特点
3. 适合${statusDesc}的发展阶段
4. 内容类型分布均衡

返回 JSON 数组格式：
[
  {
    "id": 0,
    "type": "内容类型",
    "topic": "选题标题",
    "intent": "创作意图",
    "contentOutline": "内容大纲",
    "imageSuggestion": "配图建议",
    "status": "pending"
  },
  ...
]

请生成 ${count} 个选题，直接返回 JSON 数组，不要有其他内容。`
}

/**
 * 解析选题批量生成结果
 */
export function parseTopicBatchResponse(
  content: string,
  startId: number = 0
): TopicItem[] {
  const jsonMatch = content.match(/(\[[\s\S]*\])/)
  if (!jsonMatch) {
    throw new Error('无法解析选题批量生成结果')
  }

  const parsed = JSON.parse(jsonMatch[0])

  if (!Array.isArray(parsed)) {
    throw new Error('选题数据应该是数组格式')
  }

  const validTypes: ContentType[] = [
    '共鸣',
    '记录',
    '干货',
    '种草',
    '测评',
    '教程',
    'vlog式',
  ]

  return parsed.slice(0, 30).map((item: Record<string, unknown>, index: number) => ({
    id: startId + index,
    type: validTypes.includes(item.type as ContentType)
      ? (item.type as ContentType)
      : '干货',
    topic: String(item.topic || `选题${index + 1}`).trim(),
    intent: String(item.intent || '').trim().slice(0, 20),
    contentOutline: String(item.contentOutline || '').trim().slice(0, 100),
    imageSuggestion: String(item.imageSuggestion || '').trim().slice(0, 50),
    status: 'pending' as const,
  }))
}

/**
 * 计算内容类型分布
 */
export function analyzeTypeDistribution(topics: TopicItem[]): Record<ContentType, number> {
  const distribution: Record<ContentType, number> = {
    '共鸣': 0,
    '记录': 0,
    '干货': 0,
    '种草': 0,
    '测评': 0,
    '教程': 0,
    'vlog式': 0,
  }

  for (const topic of topics) {
    if (distribution.hasOwnProperty(topic.type)) {
      distribution[topic.type]++
    }
  }

  return distribution
}
