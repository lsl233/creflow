import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { generatePostFn } from '@/functions/content'
import { storage, type ContentPlanItem, type GeneratedPost } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, Copy, Check, Sparkles, FileText, Hash, Image, Share2, Download, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/generate/$day')({
  component: GeneratePage,
})

// 内容类型配置
const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; gradient: string; icon: React.ElementType }> = {
  '共鸣': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    gradient: 'from-rose-500 to-pink-500',
    icon: Sparkles,
  },
  '记录': {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    gradient: 'from-gray-500 to-slate-500',
    icon: FileText,
  },
  '干货': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    gradient: 'from-blue-500 to-cyan-500',
    icon: FileText,
  },
  '种草': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-500',
    icon: Sparkles,
  },
}

// 复制按钮组件
function CopyButton({ text, label, onCopy }: { text: string; label: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy()
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={cn(
        'text-sm font-medium transition-all duration-200',
        copied ? 'text-green-600 bg-green-50' : 'text-[#ff2442] hover:text-[#ff2442] hover:bg-[#ff2442]/10'
      )}
    >
      {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {copied ? '已复制' : label}
    </Button>
  )
}

// 内容卡片组件
function ContentCard({
  title,
  icon: Icon,
  children,
  copyText,
  onCopy,
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  copyText: string
  onCopy: () => void
}) {
  return (
    <Card className="border-0 shadow-lg shadow-neutral-100 overflow-hidden group">
      <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff2442]/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-[#ff2442]" />
            </div>
            <CardTitle className="text-sm font-semibold text-neutral-600">{title}</CardTitle>
          </div>
          <CopyButton text={copyText} label="复制" onCopy={onCopy} />
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}

// 标签展示组件
function TagDisplay({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="px-3 py-1.5 bg-gradient-to-r from-[#ff2442]/10 to-[#fb7299]/10 text-[#ff2442] border-0 font-medium hover:from-[#ff2442]/20 hover:to-[#fb7299]/20 transition-colors cursor-pointer"
        >
          #{tag}
        </Badge>
      ))}
    </div>
  )
}

// 图片建议组件
function ImageSuggestions({ suggestions }: { suggestions: string[] }) {
  return (
    <ul className="space-y-3">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="flex items-start gap-3 group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff2442] to-[#fb7299] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold group-hover:scale-110 transition-transform">
            {index + 1}
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed pt-0.5">{suggestion}</p>
        </li>
      ))}
    </ul>
  )
}

function GeneratePage() {
  const { day } = Route.useParams()
  const navigate = useNavigate()

  const [planItem, setPlanItem] = useState<ContentPlanItem | null>(null)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(false)

  useEffect(() => {
    const plan = storage.getContentPlan()
    const params = storage.getContentPlanParams()
    const dayNum = parseInt(day)

    if (!plan || !params || dayNum < 1 || dayNum > plan.length) {
      navigate({ to: '/' })
      return
    }

    const item = plan[dayNum - 1]
    setPlanItem(item)

    const savedPost = storage.getGeneratedPost(dayNum)
    if (savedPost) {
      setGeneratedPost(savedPost)
      setLoading(false)
      return
    }

    generatePost(item, params.niche)
  }, [day, navigate])

  const generatePost = async (item: ContentPlanItem, niche: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await generatePostFn({
        data: {
          topic: item.topic,
          type: item.type,
          niche,
        },
      })

      if (response.success && response.data) {
        setGeneratedPost(response.data)
        storage.saveGeneratedPost(item.day, response.data)
        toast.success('内容生成成功！')
      } else {
        setError(response.error || '生成失败')
        toast.error('生成失败，请重试')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
      toast.error('生成失败，请重试')
    } finally {
      setLoading(false)
      setRegenerating(false)
    }
  }

  const handleRegenerate = () => {
    if (!planItem) return
    setRegenerating(true)
    storage.clearGeneratedPost(planItem.day)
    generatePost(planItem, storage.getContentPlanParams()?.niche || '')
  }

  const handleCopyAll = () => {
    if (!generatedPost) return
    const fullContent = `${generatedPost.title}\n\n${generatedPost.content}\n\n${generatedPost.tags.map((t) => `#${t}`).join(' ')}`
    navigator.clipboard.writeText(fullContent)
    toast.success('全部内容已复制到剪贴板！')
  }

  const typeStyle = TYPE_CONFIG[planItem?.type || '记录']
  const TypeIcon = typeStyle.icon

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fff7f8] p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-0 shadow-xl w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff2442]/20 to-[#fb7299]/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-[#ff2442] animate-pulse" />
                  </div>
                  <div className="absolute -inset-2 rounded-2xl border-2 border-[#ff2442]/20 animate-ping" />
                </div>
                <p className="text-lg font-semibold text-neutral-900 mb-2">正在生成内容...</p>
                <p className="text-sm text-neutral-500">AI 正在为你创作爆款文案</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#fff7f8] p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-0 shadow-xl w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">😢</span>
                </div>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">生成失败</h2>
                <p className="mb-6 text-sm text-neutral-500">{error}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate({ to: '/calendar' })}>
                    返回日历
                  </Button>
                  <Button onClick={handleRegenerate} className="bg-[#ff2442] hover:bg-[#e01f39]">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    重试
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (!planItem || !generatedPost) {
    return null
  }

  return (
    <main className="min-h-screen bg-[#fff7f8] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#ff2442]/5 to-[#fb7299]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-[#fb7299]/5 to-[#ff6b6b]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* 返回按钮 */}
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <Button variant="ghost" onClick={() => navigate({ to: '/calendar' })} className="text-neutral-500 hover:text-[#ff2442]">
              <ChevronLeft className="mr-1 h-4 w-4" />
              返回日历
            </Button>
          </div>

          {/* 选题信息卡片 */}
          <Card
            className="border-0 shadow-xl shadow-[#ff2442]/5 mb-6 overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <div className={cn('h-2 bg-gradient-to-r', typeStyle.gradient)} />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl', typeStyle.bg, typeStyle.border)}>
                  <TypeIcon className={cn('h-4 w-4', typeStyle.text)} />
                  <span className={cn('font-bold', typeStyle.text)}>
                    Day {planItem.day} · {planItem.type}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-neutral-900">{planItem.topic}</h1>
              </div>
              <p className="mt-3 text-sm text-neutral-500">{planItem.intent}</p>
            </CardContent>
          </Card>

          {/* 生成的内容 */}
          <div className="space-y-4">
            {/* 标题 */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <ContentCard title="标题" icon={FileText} copyText={generatedPost.title} onCopy={() => toast.success('标题已复制！')}>
                <p className="text-xl font-bold text-neutral-900 leading-relaxed">{generatedPost.title}</p>
              </ContentCard>
            </div>

            {/* 正文 */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <ContentCard title="正文" icon={FileText} copyText={generatedPost.content} onCopy={() => toast.success('正文已复制！')}>
                <div className="whitespace-pre-wrap text-neutral-700 leading-relaxed text-sm">{generatedPost.content}</div>
              </ContentCard>
            </div>

            {/* 标签 */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              <ContentCard
                title="标签"
                icon={Hash}
                copyText={generatedPost.tags.map((t) => `#${t}`).join(' ')}
                onCopy={() => toast.success('标签已复制！')}
              >
                <TagDisplay tags={generatedPost.tags} />
              </ContentCard>
            </div>

            {/* 图片建议 */}
            {generatedPost.imageSuggestions && generatedPost.imageSuggestions.length > 0 && (
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <Card className="border-0 shadow-lg shadow-neutral-100">
                  <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ff2442]/10 to-[#fb7299]/10 flex items-center justify-center">
                        <Image className="h-4 w-4 text-[#ff2442]" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-neutral-600">图片建议</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ImageSuggestions suggestions={generatedPost.imageSuggestions} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 操作按钮 */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
            >
              <Button
                onClick={handleCopyAll}
                size="lg"
                className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white shadow-lg shadow-[#ff2442]/25 btn-shine"
              >
                <Copy className="mr-2 h-5 w-5" />
                复制全部内容
              </Button>

              <Button
                onClick={handleRegenerate}
                disabled={regenerating}
                size="lg"
                variant="outline"
                className="h-14 text-base font-semibold border-2 border-neutral-200 hover:border-[#ff2442]/50 hover:bg-[#ff2442]/5"
              >
                {regenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    重新生成中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" />
                    重新生成
                  </>
                )}
              </Button>
            </div>

            {/* 提示 */}
            <p className="text-center text-xs text-neutral-400 pt-2">点击任意复制按钮，内容将自动保存到剪贴板</p>
          </div>
        </div>
      </div>
    </main>
  )
}
