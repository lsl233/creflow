import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { generatePostFn } from '@/functions/content'
import { storage, type ContentPlanItem, type GeneratedPost } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, Copy, Check, Sparkles, FileText, Hash, Image, RefreshCw, Download, Wand2, Lightbulb, Share2 } from 'lucide-react'
import { toast } from 'sonner'

// Content type configuration
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
    icon: Wand2,
  },
  '种草': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    gradient: 'from-green-500 to-emerald-500',
    icon: Lightbulb,
  },
}

// Copy button component
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
        'text-sm font-medium transition-all duration-200 rounded-lg',
        copied ? 'text-green-600 bg-green-50' : 'text-[#dc2641] hover:text-[#dc2641] hover:bg-[#dc2641]/10'
      )}
    >
      {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {copied ? '已复制' : label}
    </Button>
  )
}

// Content card component
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
    <Card className="border-0 shadow-lg shadow-black/5 overflow-hidden group bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-black/[0.02] border-b border-black/[0.06] py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#dc2641]/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-[#dc2641]" />
            </div>
            <CardTitle className="text-sm font-semibold text-[#1a1a1a]">{title}</CardTitle>
          </div>
          <CopyButton text={copyText} label="复制" onCopy={onCopy} />
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}

// Tag display component
function TagDisplay({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="px-3 py-1.5 bg-gradient-to-r from-[#dc2641]/10 to-[#ff6b7a]/10 text-[#dc2641] border-0 font-medium hover:from-[#dc2641]/20 hover:to-[#ff6b7a]/20 transition-colors cursor-pointer rounded-full"
        >
          #{tag}
        </Badge>
      ))}
    </div>
  )
}

// Image suggestions component
function ImageSuggestions({ suggestions }: { suggestions: string[] }) {
  return (
    <ul className="space-y-4">
      {suggestions.map((suggestion, index) => (
        <li key={index} className="flex items-start gap-4 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold group-hover:scale-110 transition-transform shadow-md shadow-[#dc2641]/20">
            {index + 1}
          </div>
          <p className="text-sm text-[#1a1a1a] leading-relaxed pt-1">{suggestion}</p>
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
      <main className="min-h-screen bg-[#faf9f7] p-4 md:p-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-0 shadow-xl w-full max-w-md bg-white/95 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dc2641]/20 to-[#ff6b7a]/20 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-[#dc2641] animate-pulse" />
                  </div>
                  <div className="absolute -inset-2 rounded-2xl border-2 border-[#dc2641]/20 animate-ping" />
                </div>
                <p className="text-lg font-bold text-[#1a1a1a] mb-2">正在生成内容...</p>
                <p className="text-sm text-[#6b6b6b]">AI 正在为你创作爆款文案</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f7] p-4 md:p-8 pt-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="border-0 shadow-xl w-full max-w-md bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">😢</span>
                </div>
                <h2 className="mb-2 text-xl font-bold text-[#1a1a1a]">生成失败</h2>
                <p className="mb-6 text-sm text-[#6b6b6b]">{error}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => navigate({ to: '/calendar' })} className="rounded-xl">
                    返回日历
                  </Button>
                  <Button onClick={handleRegenerate} className="bg-[#dc2641] hover:bg-[#b91c36] rounded-xl">
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
    <main className="min-h-screen bg-[#faf9f7] relative overflow-hidden pt-24 pb-16">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#dc2641]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6b7a]/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <div className="mb-6 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/calendar' })}
              className="text-[#6b6b6b] hover:text-[#dc2641] hover:bg-[#dc2641]/5 rounded-full px-4"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              返回日历
            </Button>
          </div>

          {/* Topic info card */}
          <Card
            className="border-0 shadow-xl shadow-black/5 mb-6 overflow-hidden opacity-0 animate-fade-in-up bg-white/95 backdrop-blur-sm"
            style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
          >
            <div className={cn('h-1.5 bg-gradient-to-r', typeStyle.gradient)} />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl', typeStyle.bg)}>
                  <TypeIcon className={cn('h-4 w-4', typeStyle.text)} />
                  <span className={cn('font-bold', typeStyle.text)}>
                    Day {planItem.day} · {planItem.type}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-[#1a1a1a]">{planItem.topic}</h1>
              </div>
              <p className="mt-3 text-sm text-[#6b6b6b]">{planItem.intent}</p>
            </CardContent>
          </Card>

          {/* Generated content */}
          <div className="space-y-4">
            {/* Title */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
              <ContentCard title="标题" icon={FileText} copyText={generatedPost.title} onCopy={() => toast.success('标题已复制！')}>
                <p className="text-xl font-bold text-[#1a1a1a] leading-relaxed">{generatedPost.title}</p>
              </ContentCard>
            </div>

            {/* Content */}
            <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              <ContentCard
                title="正文"
                icon={FileText}
                copyText={generatedPost.content}
                onCopy={() => toast.success('正文已复制！')}
              >
                <div className="whitespace-pre-wrap text-[#1a1a1a] leading-relaxed text-sm">{generatedPost.content}</div>
              </ContentCard>
            </div>

            {/* Tags */}
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

            {/* Image suggestions */}
            {generatedPost.imageSuggestions && generatedPost.imageSuggestions.length > 0 && (
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
                <Card className="border-0 shadow-lg shadow-black/5 bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-black/[0.02] border-b border-black/[0.06] py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/10 flex items-center justify-center">
                        <Image className="h-4 w-4 text-[#dc2641]" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-[#1a1a1a]">图片建议</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ImageSuggestions suggestions={generatedPost.imageSuggestions} />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 pt-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
            >
              <Button
                onClick={handleCopyAll}
                size="lg"
                className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] text-white shadow-lg shadow-[#dc2641]/25 btn-shine rounded-xl"
              >
                <Copy className="mr-2 h-5 w-5" />
                复制全部内容
              </Button>

              <Button
                onClick={handleRegenerate}
                disabled={regenerating}
                size="lg"
                variant="outline"
                className="h-14 text-base font-semibold border-2 border-black/[0.08] hover:border-[#dc2641]/40 hover:bg-[#dc2641]/5 rounded-xl"
              >
                {regenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    重新生成中...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    重新生成
                  </>
                )}
              </Button>
            </div>

            {/* Tip */}
            <p className="text-center text-xs text-[#6b6b6b] pt-2">点击任意复制按钮，内容将自动保存到剪贴板</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export const Route = createFileRoute('/generate/$day')({
  component: GeneratePage,
})
