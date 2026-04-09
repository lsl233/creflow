import type { ContentType, GeneratePostRequest, GeneratedPost } from '../types.js'

const typeInstructions: Record<ContentType, string> = {
  '共鸣': '情感共鸣型：从个人经历出发，引发读者情感共鸣，让读者觉得"说的就是我"',
  '记录': '生活记录型：真实记录日常生活，分享真实感受和体验',
  '干货': '实用干货型：提供有价值的信息、方法、技巧，让读者学到东西',
  '种草': '好物推荐型：推荐产品或服务，带有购买建议',
}

/**
 * 构建单篇内容生成的 Prompt
 */
export function buildGeneratePostPrompt(params: GeneratePostRequest): string {
  return `你是小红书内容创作者。请根据以下选题创作一篇可发布的小红书笔记。

创作者定位: ${params.niche}
选题: ${params.topic}
内容类型: ${params.type}
创作要求: ${typeInstructions[params.type]}

请按以下 JSON 格式返回:
{
  "title": "标题(20字以内，有吸引力)",
  "content": "正文内容(分段清晰，有层次感，适当使用emoji)",
  "tags": ["标签1", "标签2", "标签3", "标签4", "标签5"],
  "imageSuggestions": ["图片建议1", "图片建议2", "图片建议3"]
}

要求:
1. 标题不超过20个字，要吸引人
2. 正文要真实、有生活气息、有代入感
3. 标签要贴合内容，符合小红书风格
4. 图片建议要具体、可执行
5. 不要使用 markdown 格式，只返回 JSON
6. 正文长度 200-500 字`
}

/**
 * 解析 AI 返回的单篇内容 JSON
 */
export function parseGeneratePostResponse(content: string): GeneratedPost {
  // 尝试提取 JSON
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析 AI 返回的内容')
  }

  const parsed = JSON.parse(jsonMatch[0])

  // 验证和规范化
  const title = String(parsed.title || '').trim()
  if (title.length > 20) {
    throw new Error('标题超过20字')
  }

  const content_str = String(parsed.content || '').replace(/[\n\r]+/g, '\n').trim()
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags.slice(0, 5).map((t: unknown) => String(t).trim()).filter(Boolean)
    : []
  const imageSuggestions = Array.isArray(parsed.imageSuggestions)
    ? parsed.imageSuggestions.map((s: unknown) => String(s).trim()).filter(Boolean)
    : []

  return {
    title,
    content: content_str,
    tags,
    imageSuggestions,
  }
}
