import type { AccountProfile } from '../types.js'

export interface DiagnosisResult {
  status: AccountProfile['status']
  reasoning: string
  scores: {
    followers: number   // 0-40
    postsCount: number   // 0-30
    viralHistory: number // 0-30
    total: number        // 0-100
  }
}

/**
 * 构建账号诊断 Prompt
 * 根据粉丝量、发布历史、爆款经历综合判断账号状态
 */
export function buildAccountDiagnosisPrompt(profile: Omit<AccountProfile, 'status'>): string {
  const followersScore = {
    '0-100': '极少（0-100粉丝）',
    '100-1000': '较少（100-1000粉丝）',
    '1000+': '较多（1000+粉丝）',
  }[profile.followers]

  const postsScore = {
    '0': '从未发布（0篇）',
    '1-10': '少量发布（1-10篇）',
    '10+': '有发布历史（10+篇）',
  }[profile.postsCount]

  const viralNote = profile.hasViralPost ? '有过爆款经历' : '没有爆款经历'

  return `你是小红书账号运营专家。请分析以下账号信息，判断账号所处阶段并给出理由。

账号信息：
- 粉丝量：${followersScore}
- 发布历史：${postsScore}
- 爆款经历：${viralNote}

账号阶段定义：
- new（新账号）：粉丝 0-100，几乎没有发布历史，没有爆款经历
- growing（成长期账号）：粉丝 100-1000，有少量发布记录或有过爆款经历
- established（成熟账号）：粉丝 1000+，有丰富发布历史

请分析账号情况，判断阶段，并输出 JSON 格式：
{
  "status": "new" | "growing" | "established",
  "reasoning": "判断理由（50字以内）",
  "scores": {
    "followers": 0-40,
    "postsCount": 0-30,
    "viralHistory": 0-30,
    "total": 0-100
  }
}

评分标准：
- followers: 0-100=5分, 100-1000=20分, 1000+=40分
- postsCount: 0篇=0分, 1-10篇=15分, 10+篇=30分
- viralHistory: 无爆款=0分, 有爆款=30分

请直接返回 JSON，不要有其他内容。`
}

/**
 * 解析账号诊断结果
 */
export function parseAccountDiagnosisResponse(content: string): DiagnosisResult {
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法解析账号诊断结果')
  }

  const parsed = JSON.parse(jsonMatch[0])

  const status = parsed.status as AccountProfile['status']
  if (!['new', 'growing', 'established'].includes(status)) {
    throw new Error('无效的账号状态')
  }

  return {
    status,
    reasoning: String(parsed.reasoning || '').trim(),
    scores: {
      followers: Number(parsed.scores?.followers) || 0,
      postsCount: Number(parsed.scores?.postsCount) || 0,
      viralHistory: Number(parsed.scores?.viralHistory) || 0,
      total: Number(parsed.scores?.total) || 0,
    },
  }
}
