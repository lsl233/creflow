import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, TrendingUp, CalendarDays, PenTool, ArrowRight, ChevronDown } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

// 动态打字机效果组件
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

// 浮动装饰元素
function FloatingElements() {
  return (
    <>
      {/* 大圆形装饰 */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#ff2442]/10 to-[#fb7299]/5 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-[#fb7299]/10 to-[#ff6b6b]/5 rounded-full blur-3xl animate-float-delayed" />

      {/* 小装饰形状 */}
      <div className="absolute top-32 right-[15%] w-16 h-16 border-2 border-[#ff2442]/20 shape-blob animate-float" />
      <div className="absolute bottom-48 left-[10%] w-12 h-12 bg-gradient-to-br from-[#ff2442]/20 to-[#fb7299]/20 shape-blob-2 animate-float-delayed" />
      <div className="absolute top-1/2 right-[8%] w-8 h-8 bg-[#ff2442]/10 rotate-45 animate-float" />

      {/* 点阵网格背景 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
    </>
  )
}

// 特性卡片组件
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
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-100 card-hover opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      {/* 悬停光效 */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#ff2442]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-br from-[#ff2442]/10 to-[#fb7299]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <Icon className="h-7 w-7 text-[#ff2442]" />
        </div>
        <h3 className="text-xl font-bold mb-3 text-neutral-900">{title}</h3>
        <p className="text-neutral-500 leading-relaxed">{description}</p>
      </div>
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
    <main className="min-h-screen bg-[#fff7f8] relative overflow-hidden">
      <FloatingElements />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* 标签 */}
          <div className="flex justify-center mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#ff2442]/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#ff2442] animate-pulse" />
              <span className="text-sm font-medium text-[#ff2442]">AI 驱动的小红书增长引擎</span>
            </div>
          </div>

          {/* 主标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-neutral-900 leading-[1.1] mb-6 opacity-0 animate-fade-in-up stagger-2" style={{ animationFillMode: 'forwards' }}>
              让你的
              <span className="gradient-text"> 小红书 </span>
              <br className="hidden sm:block" />
              内容
              <span className="highlight-mark"> 10 倍出彩</span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed opacity-0 animate-fade-in-up stagger-3" style={{ animationFillMode: 'forwards' }}>
              不再对着空白页面发呆。几秒钟内生成完整的
              <span className="font-semibold text-[#ff2442]"> 7 天内容日历 </span>
              和爆款笔记，精准匹配你的领域定位。
            </p>
          </div>

          {/* 动态示例文字 */}
          <div className="text-center mb-10 opacity-0 animate-fade-in-up stagger-4" style={{ animationFillMode: 'forwards' }}>
            <p className="text-sm text-neutral-400 mb-2">已为数千位创作者生成内容</p>
            <div className="inline-flex items-center gap-2 text-[#ff2442]">
              <Sparkles className="w-4 h-4" />
              <TypewriterText
                texts={exampleNiches.map((n) => `${n}博主的内容日历`)}
                className="text-sm font-medium"
              />
            </div>
          </div>

          {/* 主输入框 */}
          <form
            onSubmit={handleStart}
            className={`max-w-2xl mx-auto opacity-0 animate-fade-in-up stagger-5 ${isFocused ? 'scale-[1.02]' : ''} transition-transform duration-300`}
            style={{ animationFillMode: 'forwards' }}
          >
            <div className="relative">
              {/* 光晕背景 */}
              <div className={`absolute -inset-1 bg-gradient-to-r from-[#ff2442]/20 via-[#fb7299]/20 to-[#ff2442]/20 rounded-full blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-[#ff2442]/10 border border-neutral-200 p-2">
                <div className="pl-6 pr-3">
                  <PenTool className="w-5 h-5 text-neutral-400" />
                </div>
                <Input
                  type="text"
                  placeholder="你的账号定位是什么？"
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base px-0 h-12 bg-transparent"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white px-8 h-12 btn-shine shadow-lg shadow-[#ff2442]/25"
                  disabled={!niche.trim()}
                >
                  <span className="hidden sm:inline">开始创作</span>
                  <ArrowRight className="sm:ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 快速标签 */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-xs text-neutral-400">热门领域：</span>
              {exampleNiches.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setNiche(example)}
                  className="text-xs px-3 py-1 rounded-full bg-white/60 hover:bg-white border border-neutral-200 hover:border-[#ff2442]/30 text-neutral-600 hover:text-[#ff2442] transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </form>

          {/* 信任指标 */}
          <div className="flex justify-center items-center gap-8 mt-12 text-sm text-neutral-400 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff2442]/20 to-[#fb7299]/20 border-2 border-white flex items-center justify-center text-xs font-bold text-[#ff2442]"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>10,000+ 创作者信赖</span>
            </div>
            <div className="w-px h-4 bg-neutral-300" />
            <span>无需信用卡</span>
            <div className="w-px h-4 bg-neutral-300" />
            <span>永久免费试用</span>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col items-center text-neutral-400 animate-scroll">
            <span className="text-xs mb-2">向下滚动</span>
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent" />

        <div className="max-w-6xl mx-auto relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#ff2442]/10 text-[#ff2442] text-sm font-semibold mb-4 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
              核心功能
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              助你打造爆款的一切
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
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

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff2442] to-[#fb7299] p-8 sm:p-12 text-center">
            {/* 装饰背景 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                准备好提升你的内容了吗？
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                加入数千位成功创作者的行列，让 AI 成为你内容创作的得力助手
              </p>
              <Button
                onClick={() => document.querySelector('input')?.focus()}
                size="lg"
                className="rounded-full bg-white text-[#ff2442] hover:bg-white/90 px-8 h-14 text-base font-bold shadow-xl"
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
