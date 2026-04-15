import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { storage } from '@/lib/storage'
import type { AccountProfile } from '@creflow/ai'

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

// 预设赛道选项
const PRESET_NICHES = [
  { label: '母婴', value: '母婴' },
  { label: '美妆', value: '美妆' },
  { label: '独立开发者', value: '独立开发者' },
  { label: '职场', value: '职场' },
  { label: '美食', value: '美食' },
  { label: '旅行', value: '旅行' },
]

// 账号状态选项
const FOLLOWERS_OPTIONS = [
  { label: '0-100', value: '0-100' as const, desc: '刚起步' },
  { label: '100-1000', value: '100-1000' as const, desc: '有一点粉丝' },
  { label: '1000+', value: '1000+' as const, desc: '粉丝较多' },
]

const POSTS_OPTIONS = [
  { label: '0篇', value: '0' as const, desc: '还没发过' },
  { label: '1-10篇', value: '1-10' as const, desc: '少量发布' },
  { label: '10+篇', value: '10+' as const, desc: '有发布历史' },
]

function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  // Step 1: 选择赛道
  const [niche, setNiche] = useState('')
  const [customNiche, setCustomNiche] = useState('')

  // Step 2: 账号诊断
  const [followers, setFollowers] = useState<AccountProfile['followers'] | null>(null)
  const [postsCount, setPostsCount] = useState<AccountProfile['postsCount'] | null>(null)
  const [hasViralPost, setHasViralPost] = useState<boolean | null>(null)

  const handleNicheSelect = (value: string) => {
    setNiche(value)
  }

  const handleNicheConfirm = () => {
    const finalNiche = niche === 'custom' ? customNiche.trim() : niche
    if (!finalNiche) return
    storage.saveContentPlanV2({
      accountProfile: {
        niche: finalNiche,
        followers: '0-100',
        postsCount: '0',
        hasViralPost: false,
        status: 'new',
      },
      strategy: 'authentic',
      topics: [],
      planType: '30days',
      createdAt: new Date().toISOString(),
      version: 1,
    } as any)
    setStep(2)
  }

  const handleDiagnosisComplete = () => {
    if (followers === null || postsCount === null || hasViralPost === null) return

    // 计算账号状态
    let status: AccountProfile['status'] = 'new'
    const followerScore =
      followers === '0-100' ? 5 : followers === '100-1000' ? 20 : 40
    const postsScore =
      postsCount === '0' ? 0 : postsCount === '1-10' ? 15 : 30
    const viralScore = hasViralPost ? 30 : 0
    const total = followerScore + postsScore + viralScore

    if (total >= 60) {
      status = 'established'
    } else if (total >= 25) {
      status = 'growing'
    } else {
      status = 'new'
    }

    // 更新账号档案
    const existingPlan = storage.getContentPlanV2()
    if (existingPlan) {
      existingPlan.accountProfile = {
        ...existingPlan.accountProfile,
        followers,
        postsCount,
        hasViralPost,
        status,
      }
      storage.saveContentPlanV2(existingPlan)
    }

    // 跳转到策略选择页
    navigate({ to: '/strategy' })
  }

  const isStep1Valid = niche === 'custom' ? customNiche.trim().length > 0 : niche.length > 0
  const isStep2Valid = followers !== null && postsCount !== null && hasViralPost !== null

  return (
    <main className="min-h-screen bg-[#faf9f7] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* 进度指示器 */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= s
                    ? 'bg-[#dc2641] text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 transition-colors ${
                    step > s ? 'bg-[#dc2641]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 选择赛道 */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              你的账号定位是什么？
            </h1>
            <p className="text-[#6b6b6b] mb-8">
              选择或输入你的小红书账号领域
            </p>

            {/* 预设选项 */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRESET_NICHES.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleNicheSelect(preset.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    niche === preset.value
                      ? 'border-[#dc2641] bg-[#dc2641]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <span className="font-medium text-[#1a1a1a]">
                    {preset.label}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNicheSelect('custom')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  niche === 'custom'
                    ? 'border-[#dc2641] bg-[#dc2641]/5'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <span className="font-medium text-[#1a1a1a]">自定义</span>
              </button>
            </div>

            {/* 自定义输入 */}
            {niche === 'custom' && (
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="输入你的账号定位..."
                  value={customNiche}
                  onChange={(e) => setCustomNiche(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <Button
              onClick={handleNicheConfirm}
              disabled={!isStep1Valid}
              className="w-full h-12 rounded-xl bg-[#dc2641] hover:bg-[#b91c36] text-white"
            >
              下一步
            </Button>
          </div>
        )}

        {/* Step 2: 账号诊断 */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">
              诊断你的账号状态
            </h1>
            <p className="text-[#6b6b6b] mb-8">
              帮助我们了解你的账号阶段，提供更精准的策略建议
            </p>

            {/* 粉丝量 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
                1. 你的粉丝量是多少？
              </label>
              <div className="grid grid-cols-3 gap-3">
                {FOLLOWERS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFollowers(opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      followers === opt.value
                        ? 'border-[#dc2641] bg-[#dc2641]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-[#1a1a1a]">{opt.label}</div>
                    <div className="text-xs text-[#6b6b6b] mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 发布历史 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
                2. 你发布过多少篇内容？
              </label>
              <div className="grid grid-cols-3 gap-3">
                {POSTS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPostsCount(opt.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      postsCount === opt.value
                        ? 'border-[#dc2641] bg-[#dc2641]/5'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="font-semibold text-[#1a1a1a]">{opt.label}</div>
                    <div className="text-xs text-[#6b6b6b] mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 爆款经历 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
                3. 有没有出过爆款？
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasViralPost(true)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    hasViralPost === true
                      ? 'border-[#dc2641] bg-[#dc2641]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-[#1a1a1a]">有</div>
                  <div className="text-xs text-[#6b6b6b] mt-1">出现过万赞笔记</div>
                </button>
                <button
                  type="button"
                  onClick={() => setHasViralPost(false)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    hasViralPost === false
                      ? 'border-[#dc2641] bg-[#dc2641]/5'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="font-semibold text-[#1a1a1a]">没有</div>
                  <div className="text-xs text-[#6b6b6b] mt-1">暂时还没有</div>
                </button>
              </div>
            </div>

            <Button
              onClick={handleDiagnosisComplete}
              disabled={!isStep2Valid}
              className="w-full h-12 rounded-xl bg-[#dc2641] hover:bg-[#b91c36] text-white"
            >
              完成诊断
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
