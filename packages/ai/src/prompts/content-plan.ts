import type { ContentType, ContentPlanRequest, ContentPlanItem } from '../types.js'

/**
 * 构建内容日历生成的 Prompt
 */
export function buildContentPlanPrompt(params: ContentPlanRequest): string {
  const goal = params.goal === '变现' ? '变现' : '涨粉'
  const persona = params.persona === '专业' ? '专业' : '真实'

  return `你是小红书内容策划专家。请为以下定位的创作者生成7天内容日历。

创作者定位: ${params.niche}
变现目标: ${goal}
人设风格: ${persona}

请按以下格式生成7天的内容计划，每项必须是真实、有生活气息的话题：
JSON数组格式:
[
  {"day": 1, "type": "共鸣/记录/干货/种草", "topic": "具体话题", "intent": "创作意图/角度"}
]

要求:
1. type 必须是 "共鸣"、"记录"、"干货"、"种草" 之一
2. topic 要具体、有吸引力、真实可信
3. intent 要说明为什么这个话题值得创作
4. 话题要多样化，覆盖不同类型
5. 不要使用 emoji
6. 只返回 JSON 数组，不要其他文字`
}

/**
 * 解析 AI 返回的内容日历 JSON
 */
export function parseContentPlanResponse(content: string): ContentPlanItem[] {
  // 尝试提取 JSON 数组
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 返回的内容')
  }

  const parsed = JSON.parse(jsonMatch[0])

  // 验证并规范化数据
  if (!Array.isArray(parsed)) {
    throw new Error('返回格式错误：不是数组')
  }

  const validTypes: ContentType[] = ['共鸣', '记录', '干货', '种草']

  return parsed.map((item, index) => ({
    day: typeof item.day === 'number' ? item.day : index + 1,
    type: validTypes.includes(item.type) ? (item.type as ContentType) : '干货',
    topic: String(item.topic || '').replace(/[\n\r]/g, '').trim(),
    intent: String(item.intent || '').replace(/[\n\r]/g, '').trim(),
  }))
}
