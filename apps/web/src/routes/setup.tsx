import { useState, Suspense } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Target, Mic, Briefcase, ArrowRight, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/setup')({
  component: SetupPage,
  validateSearch: (search: Record<string, unknown>) => ({
    niche: (search.niche as string) || '',
  }),
})

// 步骤指示器组件
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-[#ff2442] text-white shadow-lg shadow-[#ff2442]/30 scale-110'
                  : isCompleted
                    ? 'bg-[#ff2442]/20 text-[#ff2442]'
                    : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-16 h-1 mx-2 rounded-full transition-colors duration-300 ${
                  isCompleted ? 'bg-[#ff2442]/30' : 'bg-neutral-100'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// 特性列表项
function FeatureItem({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-neutral-100 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff2442]/10 to-[#fb7299]/10 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-[#ff2442]" />
      </div>
      <span className="text-sm text-neutral-700 font-medium">{text}</span>
    </div>
  )
}

function SetupForm() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/setup' })

  const [niche, setNiche] = useState(search.niche || '')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche.trim()) return

    setIsSubmitting(true)

    // 模拟加载动画
    await new Promise((resolve) => setTimeout(resolve, 800))

    navigate({
      to: '/calendar',
      search: {
        niche,
        ...(audience && { audience }),
        ...(tone && { tone }),
      },
    })
  }

  // 预设选项
  const nicheExamples = ['极简家居', '数码测评', '美食探店', '职场干货', '穿搭分享']
  const audienceExamples = ['大学生', '职场新人', '新手妈妈', '旅行者', '健身爱好者']
  const toneExamples = ['幽默风趣', '专业权威', '温暖治愈', '犀利毒舌', '轻松日常']

  return (
    <main className="min-h-screen bg-[#fff7f8] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#ff2442]/5 to-[#fb7299]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-tr from-[#fb7299]/5 to-[#ff6b6b]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl">
          {/* 返回按钮 */}
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="text-neutral-500 hover:text-[#ff2442] -ml-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              返回首页
            </Button>
          </div>

          {/* 步骤指示器 */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <StepIndicator currentStep={2} totalSteps={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* 左侧：说明和特性 */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[#ff2442]/10 text-[#ff2442] text-sm font-semibold mb-4">
                  第 2 步，共 3 步
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-3 leading-tight">
                  完善你的
                  <br />
                  <span className="gradient-text">账号信息</span>
                </h1>
                <p className="text-neutral-500 leading-relaxed">
                  提供的信息越详细，AI 就能越好地为你量身定制符合品牌调性的内容。
                </p>
              </div>

              {/* 特性列表 */}
              <div className="space-y-3">
                <FeatureItem icon={Sparkles} text="用精准的定位让你脱颖而出" delay={0.3} />
                <FeatureItem icon={Target} text="直接击中目标受众的痛点" delay={0.4} />
                <FeatureItem icon={Mic} text="保持一致的调性，建立信任感" delay={0.5} />
              </div>

              {/* 提示卡片 */}
              <div
                className="p-4 rounded-xl bg-gradient-to-br from-[#ff2442]/5 to-[#fb7299]/5 border border-[#ff2442]/10 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
              >
                <p className="text-sm text-neutral-600">
                  <span className="font-semibold text-[#ff2442]">💡 小贴士：</span>
                  即使是简单的描述也能产生很好的效果。尝试具体一些，比如"都市极简家居"而不是"家居"。
                </p>
              </div>
            </div>

            {/* 右侧：表单 */}
            <div className="lg:col-span-3">
              <Card
                className="border-0 shadow-2xl shadow-[#ff2442]/5 overflow-hidden opacity-0 animate-fade-in-scale"
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
              >
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* 定位/领域 */}
                    <div className="space-y-3">
                      <Label htmlFor="niche" className="flex items-center gap-2 text-base font-bold text-neutral-900">
                        <Briefcase className="h-4 w-4 text-[#ff2442]" />
                        定位 / 领域
                        <span className="text-[#ff2442]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="niche"
                          placeholder="如：极简家居、数码测评"
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          onFocus={() => setFocusedField('niche')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-neutral-50/50 border-2 transition-all duration-300 ${
                            focusedField === 'niche'
                              ? 'border-[#ff2442]/50 shadow-lg shadow-[#ff2442]/10'
                              : 'border-neutral-200'
                          }`}
                          required
                        />
                        {niche && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* 快速选择 */}
                      <div className="flex flex-wrap gap-2">
                        {nicheExamples.map((example) => (
                          <button
                            key={example}
                            type="button"
                            onClick={() => setNiche(example)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                              niche === example
                                ? 'bg-[#ff2442] text-white border-[#ff2442]'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#ff2442]/50 hover:text-[#ff2442]'
                            }`}
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 目标受众 */}
                    <div className="space-y-3">
                      <Label htmlFor="audience" className="flex items-center gap-2 text-base font-bold text-neutral-900">
                        <Target className="h-4 w-4 text-[#ff2442]" />
                        目标受众
                        <span className="text-neutral-400 font-normal text-sm">（可选）</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="audience"
                          placeholder="如：大学生、新手妈妈"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          onFocus={() => setFocusedField('audience')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-neutral-50/50 border-2 transition-all duration-300 ${
                            focusedField === 'audience'
                              ? 'border-[#ff2442]/50 shadow-lg shadow-[#ff2442]/10'
                              : 'border-neutral-200'
                          }`}
                        />
                        {audience && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* 快速选择 */}
                      <div className="flex flex-wrap gap-2">
                        {audienceExamples.map((example) => (
                          <button
                            key={example}
                            type="button"
                            onClick={() => setAudience(example)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                              audience === example
                                ? 'bg-[#ff2442] text-white border-[#ff2442]'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#ff2442]/50 hover:text-[#ff2442]'
                            }`}
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 内容风格 */}
                    <div className="space-y-3">
                      <Label htmlFor="tone" className="flex items-center gap-2 text-base font-bold text-neutral-900">
                        <Mic className="h-4 w-4 text-[#ff2442]" />
                        内容风格
                        <span className="text-neutral-400 font-normal text-sm">（可选）</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="tone"
                          placeholder="如：幽默、专业、温情"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          onFocus={() => setFocusedField('tone')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-neutral-50/50 border-2 transition-all duration-300 ${
                            focusedField === 'tone'
                              ? 'border-[#ff2442]/50 shadow-lg shadow-[#ff2442]/10'
                              : 'border-neutral-200'
                          }`}
                        />
                        {tone && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* 快速选择 */}
                      <div className="flex flex-wrap gap-2">
                        {toneExamples.map((example) => (
                          <button
                            key={example}
                            type="button"
                            onClick={() => setTone(example)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                              tone === example
                                ? 'bg-[#ff2442] text-white border-[#ff2442]'
                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#ff2442]/50 hover:text-[#ff2442]'
                            }`}
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 提交按钮 */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!niche.trim() || isSubmitting}
                      className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white shadow-lg shadow-[#ff2442]/25 btn-shine disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          正在生成...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-5 w-5" />
                          生成内容日历
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function SetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fff7f8]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff2442]" />
            <p className="text-neutral-500">加载中...</p>
          </div>
        </div>
      }
    >
      <SetupForm />
    </Suspense>
  )
}

export default SetupPage
