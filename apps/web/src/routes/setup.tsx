import { z } from 'zod'
import { useState, Suspense } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Target, Mic, Briefcase, ArrowRight, CheckCircle2, ChevronLeft, Loader2, Lightbulb } from 'lucide-react'

const routeSearchSchema = z.object({
  niche: z.optional(z.string()),
})

export const Route = createFileRoute('/setup')({
  component: SetupPage,
  validateSearch: (search) => routeSearchSchema.parse(search),
})

// Step indicator component
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = step < currentStep

        return (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive
                  ? 'bg-[#dc2641] text-white shadow-lg shadow-[#dc2641]/30 scale-110'
                  : isCompleted
                    ? 'bg-[#dc2641]/15 text-[#dc2641]'
                    : 'bg-black/[0.04] text-[#6b6b6b]'
                }`}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-12 sm:w-20 h-[2px] mx-2 rounded-full transition-colors duration-300 ${isCompleted ? 'bg-[#dc2641]/30' : 'bg-black/[0.06]'
                  }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Feature list item
function FeatureItem({ icon: Icon, text, delay }: { icon: React.ElementType; text: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-black/[0.06] opacity-0 animate-fade-in-up hover:shadow-md hover:shadow-[#dc2641]/5 transition-all duration-300"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/5 flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-[#dc2641]" />
      </div>
      <span className="text-sm text-[#1a1a1a] font-medium">{text}</span>
    </div>
  )
}

// Suggestion chip
function SuggestionChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs sm:text-sm px-4 py-2 rounded-full border transition-all duration-200 ${selected
          ? 'bg-[#dc2641] text-white border-[#dc2641] shadow-md shadow-[#dc2641]/20'
          : 'bg-white border-black/[0.08] text-[#6b6b6b] hover:border-[#dc2641]/40 hover:text-[#dc2641]'
        }`}
    >
      {label}
    </button>
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
    await new Promise((resolve) => setTimeout(resolve, 800))

    navigate({
      to: '/calendar',
      search: {
        niche,
      },
    })
  }

  // Suggestions
  const nicheExamples = ['极简家居', '数码测评', '美食探店', '职场干货', '穿搭分享', '护肤心得']
  const audienceExamples = ['大学生', '职场新人', '新手妈妈', '旅行者', '健身爱好者', '准新娘']
  const toneExamples = ['幽默风趣', '专业权威', '温暖治愈', '犀利毒舌', '轻松日常', '励志正能量']

  return (
    <main className="min-h-screen bg-[#faf9f7] relative overflow-hidden pt-24 pb-16">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#dc2641]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6b7a]/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Back button */}
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/' })}
              className="text-[#6b6b6b] hover:text-[#dc2641] hover:bg-[#dc2641]/5 rounded-full px-4 -ml-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              返回首页
            </Button>
          </div>

          {/* Step indicator */}
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <StepIndicator currentStep={2} totalSteps={3} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left: Info and features */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dc2641]/10 text-[#dc2641] text-xs font-semibold tracking-wide mb-4">
                  第 2 步，共 3 步
                </span>
                <h1 className="editorial-heading-lg text-[#1a1a1a] mb-4">
                  完善你的
                  <br />
                  <span className="gradient-text">账号信息</span>
                </h1>
                <p className="text-[#6b6b6b] leading-relaxed">
                  提供的信息越详细，AI 就能越好地为你量身定制符合品牌调性的内容。
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-3">
                <FeatureItem icon={Sparkles} text="用精准的定位让你脱颖而出" delay={0.3} />
                <FeatureItem icon={Target} text="直接击中目标受众的痛点" delay={0.4} />
                <FeatureItem icon={Mic} text="保持一致的调性，建立信任感" delay={0.5} />
              </div>

              {/* Tip card */}
              <div
                className="p-5 rounded-2xl bg-gradient-to-br from-[#dc2641]/5 to-[#ff6b7a]/5 border border-[#dc2641]/10 opacity-0 animate-fade-in-up"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#dc2641] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a] mb-1">小贴士</p>
                    <p className="text-sm text-[#6b6b6b]">
                      即使是简单的描述也能产生很好的效果。尝试具体一些，比如"都市极简家居"而不是"家居"。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <Card
                className="border-0 shadow-xl shadow-black/5 overflow-hidden opacity-0 animate-fade-in-scale bg-white/95 backdrop-blur-sm"
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
              >
                <form onSubmit={handleSubmit}>
                  <CardContent className="p-6 sm:p-8 space-y-8">
                    {/* Niche field */}
                    <div className="space-y-4">
                      <Label htmlFor="niche" className="flex items-center gap-2 text-base font-bold text-[#1a1a1a]">
                        <div className="w-8 h-8 rounded-lg bg-[#dc2641]/10 flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-[#dc2641]" />
                        </div>
                        定位 / 领域
                        <span className="text-[#dc2641]">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="niche"
                          placeholder="如：极简家居、数码测评"
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          onFocus={() => setFocusedField('niche')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-black/[0.02] border-2 transition-all duration-300 rounded-xl ${focusedField === 'niche'
                              ? 'border-[#dc2641]/40 shadow-lg shadow-[#dc2641]/10 bg-white'
                              : 'border-black/[0.08]'
                            }`}
                          required
                        />
                        {niche && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {nicheExamples.map((example) => (
                          <SuggestionChip
                            key={example}
                            label={example}
                            selected={niche === example}
                            onClick={() => setNiche(example)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Audience field */}
                    <div className="space-y-4">
                      <Label htmlFor="audience" className="flex items-center gap-2 text-base font-bold text-[#1a1a1a]">
                        <div className="w-8 h-8 rounded-lg bg-[#dc2641]/10 flex items-center justify-center">
                          <Target className="h-4 w-4 text-[#dc2641]" />
                        </div>
                        目标受众
                        <span className="text-[#6b6b6b] font-normal text-sm">（可选）</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="audience"
                          placeholder="如：大学生、新手妈妈"
                          value={audience}
                          onChange={(e) => setAudience(e.target.value)}
                          onFocus={() => setFocusedField('audience')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-black/[0.02] border-2 transition-all duration-300 rounded-xl ${focusedField === 'audience'
                              ? 'border-[#dc2641]/40 shadow-lg shadow-[#dc2641]/10 bg-white'
                              : 'border-black/[0.08]'
                            }`}
                        />
                        {audience && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {audienceExamples.map((example) => (
                          <SuggestionChip
                            key={example}
                            label={example}
                            selected={audience === example}
                            onClick={() => setAudience(example)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tone field */}
                    <div className="space-y-4">
                      <Label htmlFor="tone" className="flex items-center gap-2 text-base font-bold text-[#1a1a1a]">
                        <div className="w-8 h-8 rounded-lg bg-[#dc2641]/10 flex items-center justify-center">
                          <Mic className="h-4 w-4 text-[#dc2641]" />
                        </div>
                        内容风格
                        <span className="text-[#6b6b6b] font-normal text-sm">（可选）</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="tone"
                          placeholder="如：幽默、专业、温情"
                          value={tone}
                          onChange={(e) => setTone(e.target.value)}
                          onFocus={() => setFocusedField('tone')}
                          onBlur={() => setFocusedField(null)}
                          className={`h-14 text-base px-4 bg-black/[0.02] border-2 transition-all duration-300 rounded-xl ${focusedField === 'tone'
                              ? 'border-[#dc2641]/40 shadow-lg shadow-[#dc2641]/10 bg-white'
                              : 'border-black/[0.08]'
                            }`}
                        />
                        {tone && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                        )}
                      </div>
                      {/* Quick suggestions */}
                      <div className="flex flex-wrap gap-2">
                        {toneExamples.map((example) => (
                          <SuggestionChip
                            key={example}
                            label={example}
                            selected={tone === example}
                            onClick={() => setTone(example)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      size="lg"
                      disabled={!niche.trim() || isSubmitting}
                      className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] text-white shadow-lg shadow-[#dc2641]/25 btn-shine rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[#dc2641]" />
            <p className="text-[#6b6b6b]">加载中...</p>
          </div>
        </div>
      }
    >
      <SetupForm />
    </Suspense>
  )
}

export default SetupPage
