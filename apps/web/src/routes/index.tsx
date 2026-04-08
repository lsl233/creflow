import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { storage } from '@/lib/storage'
import { FormFieldWithExplanation } from '@/components/FormFieldWithExplanation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const FIELD_EXPLANATIONS = {
  niche: {
    why: 'AI 需要了解你的专业领域和细分市场，才能生成与你受众相关、有针对性的内容。清晰的定位帮助 AI 理解你希望覆盖的话题范围。',
    impact: '内容定位决定了整个内容策略的走向——从选题方向、语言风格到专业术语的使用。专注的定位能吸引更精准的受众群体。',
  },
  goal: {
    why: '不同的运营目标需要完全不同的内容策略。涨粉和变现在内容结构、互动设计上都有显著差异。',
    impact: '选择「涨粉」会让内容更注重个人魅力展示和互动性；选择「变现」会侧重信任建立和行动号召。',
  },
  persona: {
    why: '你呈现给受众的形象会影响内容的表达方式和语气。真实人设更容易建立情感连接，专业人设更容易建立权威感。',
    impact: '「真实」人设会让内容更口语化、有个人故事、更接地气；「专业」人设会让内容更严谨、有行业洞察、更具权威性。',
  },
  frequency: {
    why: '小红书算法偏好持续稳定的更新频率。保持规律发布能提高账号活跃度，获得更多推荐流量。',
    impact: '高频发布（5-7次/周）能快速积累粉丝和曝光；低频发布（1-2次/周）能让每篇内容更精致。建议选择你能长期坚持的频率。',
  },
}

function HomePage() {
  const navigate = useNavigate()
  const [niche, setNiche] = useState('')
  const [goal, setGoal] = useState<'涨粉' | '变现'>('涨粉')
  const [persona, setPersona] = useState<'真实' | '专业'>('真实')
  const [frequency, setFrequency] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!niche.trim()) {
      setError('请输入你的内容定位')
      return
    }

    setLoading(true)

    try {
      const response = await api.generateContentPlan({
        niche: niche.trim(),
        goal,
        persona,
        frequency,
      })

      if (response.data) {
        storage.saveContentPlan(response.data, { niche: niche.trim(), goal, persona, frequency })
        navigate({ to: '/calendar' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-10">
      <Card className="rise-in relative overflow-hidden border-none shadow-lg">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-rose-100 to-transparent" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-tl from-rose-50 to-transparent" />

        <CardContent className="relative px-6 py-8 sm:px-8 sm:py-10">
          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            告诉我你想做什么
          </h1>
          <p className="mb-6 text-base text-muted-foreground">
            输入你的内容定位，我来帮你规划一周的内容
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 领域/定位 */}
            <FormFieldWithExplanation
              label="你的内容定位"
              required
              explanation={FIELD_EXPLANATIONS.niche}
            >
              <Input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="例如：职场成长、美食探店、宝妈育儿..."
                className="h-12"
              />
            </FormFieldWithExplanation>

            {/* 目标 */}
            <FormFieldWithExplanation
              label="你的目标是什么？"
              explanation={FIELD_EXPLANATIONS.goal}
            >
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={goal === '涨粉' ? 'default' : 'outline'}
                  onClick={() => setGoal('涨粉')}
                  className="flex-1 h-12"
                >
                  涨粉
                </Button>
                <Button
                  type="button"
                  variant={goal === '变现' ? 'default' : 'outline'}
                  onClick={() => setGoal('变现')}
                  className="flex-1 h-12"
                >
                  变现
                </Button>
              </div>
            </FormFieldWithExplanation>

            {/* 人设 */}
            <FormFieldWithExplanation
              label="你想呈现什么样的人设？"
              explanation={FIELD_EXPLANATIONS.persona}
            >
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={persona === '真实' ? 'default' : 'outline'}
                  onClick={() => setPersona('真实')}
                  className="flex-1 h-12"
                >
                  真实
                </Button>
                <Button
                  type="button"
                  variant={persona === '专业' ? 'default' : 'outline'}
                  onClick={() => setPersona('专业')}
                  className="flex-1 h-12"
                >
                  专业
                </Button>
              </div>
            </FormFieldWithExplanation>

            {/* 发布频率 */}
            <FormFieldWithExplanation
              label="每周发布几次？"
              explanation={FIELD_EXPLANATIONS.frequency}
            >
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={frequency}
                  onChange={(e) => setFrequency(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
                  className="w-24 h-12"
                />
                <span className="text-base text-muted-foreground">次/周</span>
              </div>
            </FormFieldWithExplanation>

            {/* 错误提示 */}
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-base text-destructive">
                {error}
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-semibold"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  生成中...
                </span>
              ) : (
                '生成我的内容日历'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
