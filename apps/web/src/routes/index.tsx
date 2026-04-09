import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, TrendingUp, CalendarDays, PenTool, ArrowRight, ChevronDown, Zap, Shield } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// Dynamic typewriter effect
function TypewriterText({ texts, className }: { texts: string[]; className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentIndex]

      if (!isDeleting) {
        setCurrentText(fullText.slice(0, currentText.length + 1))
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        setCurrentText(fullText.slice(0, currentText.length - 1))
        if (currentText === '') {
          setIsDeleting(false)
          setCurrentIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, texts])

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// Floating decorative elements
function FloatingElements() {
  return (
    <>
      {/* Gradient orbs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-gradient-to-br from-[#dc2641]/8 to-transparent rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -left-48 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6b7a]/6 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-[#ff8fa3]/5 to-transparent rounded-full blur-3xl animate-float-gentle" />

      {/* Decorative shapes */}
      <div className="absolute top-40 right-[20%] w-20 h-20 border border-[#dc2641]/10 rounded-2xl rotate-12 animate-float hidden lg:block" />
      <div className="absolute bottom-48 left-[15%] w-14 h-14 bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/5 rounded-xl -rotate-6 animate-float-slow hidden lg:block" />
      <div className="absolute top-1/2 right-[10%] w-8 h-8 bg-[#dc2641]/5 rotate-45 animate-float-gentle hidden lg:block" />

      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
    </>
  )
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType
  title: string
  description: string
  index: number
}) {
  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-black/[0.06] transition-all duration-500 opacity-0 animate-fade-in-up hover:shadow-xl hover:shadow-[#dc2641]/5 hover:-translate-y-1"
      style={{ animationDelay: `${0.5 + index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#dc2641]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Icon className="h-7 w-7 text-[#dc2641]" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] tracking-tight">{title}</h3>
        <p className="text-[#6b6b6b] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

// Stat item component
function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">{value}</div>
      <div className="text-xs sm:text-sm text-[#6b6b6b]">{label}</div>
    </div>
  )
}

function LandingPage() {
  const navigate = useNavigate()
  const [niche, setNiche] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (niche.trim()) {
      navigate({ to: '/setup', search: { niche: niche.trim() } })
    }
  }

  const exampleNiches = ['极简家居', '数码测评', '美食探店', '职场干货', '旅行攻略']

  return (
    <main className="min-h-screen bg-[#faf9f7] relative overflow-hidden pt-20">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Kicker */}
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-[#dc2641]/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#dc2641] animate-pulse" />
              <span className="text-sm font-medium text-[#dc2641]">AI 驱动的小红书增长引擎</span>
            </div>
          </div>

          {/* Main Heading - Editorial Style */}
          <div className="text-center mb-8">
            <h1 className="editorial-heading-xl text-[#1a1a1a] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              让你的小红书
              <br />
              <span className="gradient-text">10 倍出彩</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#6b6b6b] max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              不再对着空白页面发呆。几秒钟内生成完整的
              <span className="font-semibold text-[#dc2641]"> 7 天内容日历 </span>
              和爆款笔记，精准匹配你的领域定位。
            </p>
          </div>

          {/* Dynamic Example Text */}
          <div className="text-center mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            <p className="text-xs text-[#6b6b6b] mb-2 uppercase tracking-wider">已为数千位创作者生成内容</p>
            <div className="inline-flex items-center gap-2 text-[#dc2641] bg-[#dc2641]/5 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4" />
              <TypewriterText
                texts={exampleNiches.map((n) => `${n}博主的内容日历`)}
                className="text-sm font-medium"
              />
            </div>
          </div>

          {/* Main Input */}
          <form
            onSubmit={handleStart}
            className={`max-w-2xl mx-auto opacity-0 animate-fade-in-up transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}
            style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-[#dc2641]/20 via-[#ff6b7a]/20 to-[#dc2641]/20 rounded-2xl blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-black/5 border border-black/[0.08] p-2">
                <div className="pl-5 pr-3">
                  <PenTool className="w-5 h-5 text-[#6b6b6b]" />
                </div>
                <Input
                  type="text"
                  placeholder="你的账号定位是什么？"
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base px-0 h-14 bg-transparent placeholder:text-[#6b6b6b]/60"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] text-white px-6 h-12 btn-shine shadow-lg shadow-[#dc2641]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#dc2641]/30"
                  disabled={!niche.trim()}
                >
                  <span className="hidden sm:inline font-semibold">开始创作</span>
                  <ArrowRight className="sm:ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-5">
              <span className="text-xs text-[#6b6b6b]">热门领域：</span>
              {exampleNiches.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setNiche(example)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-black/[0.08] hover:border-[#dc2641]/30 text-[#6b6b6b] hover:text-[#dc2641] transition-all duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 mt-12 text-sm text-[#6b6b6b] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#dc2641]/20 to-[#ff6b7a]/20 border-2 border-white flex items-center justify-center text-xs font-bold text-[#dc2641]"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="font-medium">10,000+ 创作者信赖</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-black/[0.1]" />
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#dc2641]" />
              <span>无需信用卡</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-black/[0.1]" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#dc2641]" />
              <span>永久免费试用</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up hidden sm:block" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center text-[#6b6b6b] animate-scroll">
            <span className="text-xs mb-2 uppercase tracking-wider">探索更多</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-y border-black/[0.06] bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <StatItem value="10K+" label="活跃创作者" />
            <StatItem value="50K+" label="生成内容" />
            <StatItem value="98%" label="满意度" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent" />

        <div className="max-w-6xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <span className="kicker mb-4 opacity-0 animate-fade-in-up block" style={{ animationFillMode: 'forwards' }}>
              核心功能
            </span>
            <h2 className="editorial-heading-lg text-[#1a1a1a] mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              助你打造爆款的一切
            </h2>
            <p className="text-[#6b6b6b] max-w-xl mx-auto text-lg opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              从内容规划到文案生成，AI 助手全程陪伴你的创作之旅
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={CalendarDays}
              title="7 天内容日历"
              description="灵感永不枯竭。获取一整周结构化的话题安排，精准匹配你的目标受众，让内容规划变得轻松高效。"
              index={0}
            />
            <FeatureCard
              icon={PenTool}
              title="爆款文案"
              description="生成吸睛标题、丰富表情符号、口语化正文，完美契合小红书风格，大幅提升内容吸引力。"
              index={1}
            />
            <FeatureCard
              icon={TrendingUp}
              title="视觉指导"
              description="获得图片排版建议和精准话题标签，最大化你的曝光和互动，助力账号快速成长。"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="kicker mb-4 block opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              使用流程
            </span>
            <h2 className="editorial-heading-lg text-[#1a1a1a] opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              三步开启创作
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: '输入定位', desc: '告诉我们你的账号领域和目标受众' },
              { step: '02', title: '生成日历', desc: 'AI 为你量身定制 7 天内容规划' },
              { step: '03', title: '发布内容', desc: '逐日生成爆款文案，一键复制发布' },
            ].map((item, index) => (
              <div
                key={item.step}
                className="relative text-center opacity-0 animate-fade-in-up group"
                style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-[#dc2641]">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6b6b6b]">{item.desc}</p>

                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-[2px] bg-gradient-to-r from-[#dc2641]/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] p-8 sm:p-12 text-center shadow-2xl shadow-[#dc2641]/20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                准备好提升你的内容了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                加入数千位成功创作者的行列，让 AI 成为你内容创作的得力助手
              </p>
              <Button
                onClick={() => document.querySelector('input')?.focus()}
                size="lg"
                className="rounded-full bg-white text-[#dc2641] hover:bg-white/90 px-8 h-14 text-base font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                立即免费开始
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
