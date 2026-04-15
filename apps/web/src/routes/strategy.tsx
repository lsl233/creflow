import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/storage'
import {
  recommendStrategyFn,
  generateTopicBatchFn,
} from '@/functions/strategy'
import type { ContentStrategyType } from '@creflow/ai'

export const Route = createFileRoute('/strategy')({
  component: StrategyPage,
})

// 策略中文描述
const STRATEGY_INFO: Record<ContentStrategyType, { name: string; desc: string; icon: string }> = {
  professional: { name: '专业背书型', desc: '立专业人设，分享行业知识和见解，建立权威感', icon: '🎓' },
  humorous: { name: '搞笑/轻松型', desc: '幽默风趣，轻松愉快的内容风格', icon: '😄' },
  emotional: { name: '情感共鸣型', desc: '从情感出发，引发共鸣，适合个人成长话题', icon: '💕' },
  educational: { name: '干货教程型', desc: '提供实用知识、技能教程，帮助读者学习', icon: '📚' },
  authentic: { name: '真实分享型', desc: '真实日常分享，亲切自然，适合个人IP打造', icon: '✨' },
  review: { name: '测评型', desc: '产品测评、使用对比，帮助用户做购买决策', icon: '🔬' },
  vlog: { name: 'vlog叙事型', desc: '第一人称视角，记录真实生活，有故事感', icon: '🎬' },
}

interface StrategyResult {
  recommendations: Array<{
    strategy: ContentStrategyType
    reason: string
    suitableFor: string
    suggestedContentTypes: string[]
  }>
  recommendedStrategy: ContentStrategyType
  reasoning: string
}

function StrategyPage() {
  const navigate = useNavigate()
  const [strategies, setStrategies] = useState<StrategyResult | null>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<ContentStrategyType | null>(null)
  const [planType, setPlanType] = useState<'30days' | '7days'>('30days')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载策略推荐
  useEffect(() => {
    const loadStrategies = async () => {
      const plan = storage.getContentPlanV2()
      if (!plan) {
        navigate({ to: '/onboarding' })
        return
      }

      try {
        const result = await recommendStrategyFn({ data: { accountProfile: plan.accountProfile } })
        if (result.success && result.data) {
          setStrategies(result.data as StrategyResult)
          setSelectedStrategy((result.data as StrategyResult).recommendedStrategy)
        } else {
          throw new Error(result.error || 'Failed to load strategies')
        }
      } catch (err) {
        console.error('Failed to load strategies:', err)
        setError('加载策略失败，请重试')
        // Fallback
        setStrategies({
          recommendations: [
            { strategy: 'authentic', reason: '适合新账号', suitableFor: '起步阶段', suggestedContentTypes: ['共鸣', '记录'] },
            { strategy: 'educational', reason: '提供价值', suitableFor: '建立信任', suggestedContentTypes: ['干货', '教程'] },
          ],
          recommendedStrategy: 'authentic',
          reasoning: 'Fallback',
        })
        setSelectedStrategy('authentic')
      } finally {
        setLoading(false)
      }
    }

    loadStrategies()
  }, [navigate])

  const handleGenerate = async () => {
    if (!selectedStrategy) return

    const plan = storage.getContentPlanV2()
    if (!plan) {
      navigate({ to: '/onboarding' })
      return
    }

    setGenerating(true)
    setError(null)

    try {
      const count = planType === '30days' ? '30' : '7'
      const result = await generateTopicBatchFn({
        data: {
          niche: plan.accountProfile.niche,
          strategy: selectedStrategy,
          accountProfile: plan.accountProfile,
          count,
        },
      })

      if (result.success && result.data) {
        // 更新计划
        plan.strategy = selectedStrategy
        plan.planType = planType
        plan.topics = result.data as any
        plan.createdAt = new Date().toISOString()
        storage.saveContentPlanV2(plan)

        // 跳转到选题列表
        navigate({ to: '/topics' })
      } else {
        throw new Error(result.error || 'Failed to generate topics')
      }
    } catch (err) {
      console.error('Failed to generate topics:', err)
      setError('生成选题失败，请重试')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#dc2641] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#6b6b6b]">分析账号状态中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2 text-center">
          选择你的内容策略
        </h1>
        <p className="text-[#6b6b6b] mb-8 text-center">
          根据你的账号情况，我们推荐以下策略
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* 策略列表 */}
        <div className="space-y-3 mb-8">
          {strategies?.recommendations.map((rec) => {
            const info = STRATEGY_INFO[rec.strategy]
            const isSelected = selectedStrategy === rec.strategy

            return (
              <button
                key={rec.strategy}
                type="button"
                onClick={() => setSelectedStrategy(rec.strategy)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#dc2641] bg-[#dc2641]/5'
                    : 'border-gray-100 hover:border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#1a1a1a]">{info.name}</h3>
                      {rec.strategy === strategies.recommendedStrategy && (
                        <span className="px-2 py-0.5 bg-[#dc2641] text-white text-xs rounded-full">
                          推荐
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6b6b6b] mb-2">{info.desc}</p>
                    <p className="text-xs text-[#dc2641]">{rec.reason}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                      isSelected
                        ? 'border-[#dc2641] bg-[#dc2641]'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* 生成模式选择 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
            选择生成计划
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlanType('30days')}
              className={`p-4 rounded-xl border-2 transition-all ${
                planType === '30days'
                  ? 'border-[#dc2641] bg-[#dc2641]/5'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="font-semibold text-[#1a1a1a]">30天计划</div>
              <div className="text-xs text-[#6b6b6b] mt-1">适合新账号/策略重塑</div>
            </button>
            <button
              type="button"
              onClick={() => setPlanType('7days')}
              className={`p-4 rounded-xl border-2 transition-all ${
                planType === '7days'
                  ? 'border-[#dc2641] bg-[#dc2641]/5'
                  : 'border-gray-100 hover:border-gray-200 bg-white'
              }`}
            >
              <div className="font-semibold text-[#1a1a1a]">7天计划</div>
              <div className="text-xs text-[#6b6b6b] mt-1">老账号日常维护</div>
            </button>
          </div>
        </div>

        {/* 生成按钮 */}
        <Button
          onClick={handleGenerate}
          disabled={!selectedStrategy || generating}
          className="w-full h-14 rounded-xl bg-[#dc2641] hover:bg-[#b91c36] text-white text-base font-semibold"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              生成中...
            </span>
          ) : (
            `生成${planType === '30days' ? '30' : '7'}天选题`
          )}
        </Button>
      </div>
    </main>
  )
}
