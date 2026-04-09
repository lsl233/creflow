import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { generatePostFn } from '@/functions/content'
import { storage, type ContentPlanItem, type GeneratedPost } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, Copy, Check } from 'lucide-react'

export const Route = createFileRoute('/generate/$day')({
  component: GeneratePage,
})

const TYPE_VARIANTS: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  '共鸣': { variant: 'default' as const, className: 'bg-rose-100 text-rose-700 hover:bg-rose-100' },
  '记录': { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
  '干货': { variant: 'secondary' as const, className: 'bg-blue-50 text-blue-600 hover:bg-blue-50' },
  '种草': { variant: 'secondary' as const, className: 'bg-green-50 text-green-600 hover:bg-green-50' },
}

function GeneratePage() {
  const { day } = Route.useParams()
  const navigate = useNavigate()

  const [planItem, setPlanItem] = useState<ContentPlanItem | null>(null)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

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

    // 检查是否已有生成的帖子
    const savedPost = storage.getGeneratedPost(dayNum)
    if (savedPost) {
      setGeneratedPost(savedPost)
      setLoading(false)
      return
    }

    // 生成新帖子
    generatePost(item, params.niche)
  }, [day, navigate])

  const generatePost = async (item: ContentPlanItem, niche: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await generatePostFn({ data: {
        topic: item.topic,
        type: item.type,
        niche,
      }})

      if (response.success && response.data) {
        setGeneratedPost(response.data)
        storage.saveGeneratedPost(item.day, response.data)
      } else {
        setError(response.error || '生成失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    }
  }

  if (loading) {
    return (
      <main className="page-wrap px-4 pb-8 pt-10">
        <Card className="border-none shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Skeleton className="mb-4 h-12 w-12 rounded-full" />
            <p className="text-sm text-muted-foreground">正在生成内容...</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page-wrap px-4 pb-8 pt-10">
        <Card className="border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">😢</div>
            <h2 className="mb-2 text-xl font-bold text-foreground">生成失败</h2>
            <p className="mb-6 text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => planItem && generatePost(planItem, storage.getContentPlanParams()?.niche || '')}
            >
              重试
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!planItem || !generatedPost) {
    return null
  }

  const typeStyle = TYPE_VARIANTS[planItem.type] || TYPE_VARIANTS['记录']

  return (
    <main className="page-wrap px-4 pb-8 pt-6">
      {/* 返回按钮 */}
      <Button variant="ghost" className="mb-4 -ml-2" asChild>
        <Link to="/calendar" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
          返回日历
        </Link>
      </Button>

      {/* 选题信息 */}
      <div className="mb-6 flex items-center gap-3">
        <Badge variant={typeStyle.variant} className={cn("px-3 py-1", typeStyle.className)}>
          Day{planItem.day} · {planItem.type}
        </Badge>
        <h1 className="text-lg font-medium text-foreground">
          {planItem.topic}
        </h1>
      </div>

      {/* 生成的内容 */}
      <div className="space-y-4">
        {/* 标题 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">标题</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedPost.title, 'title')}
                className="text-primary hover:text-primary/80"
              >
                {copied === 'title' ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    复制
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground">
              {generatedPost.title}
            </p>
          </CardContent>
        </Card>

        {/* 正文 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">正文</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedPost.content, 'content')}
                className="text-primary hover:text-primary/80"
              >
                {copied === 'content' ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    复制
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {generatedPost.content}
            </div>
          </CardContent>
        </Card>

        {/* 标签 */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">标签</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(generatedPost.tags.map(t => `#${t}`).join(' '), 'tags')}
                className="text-primary hover:text-primary/80"
              >
                {copied === 'tags' ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    复制
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generatedPost.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="bg-rose-50 text-rose-600 hover:bg-rose-50">
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 图片建议 */}
        {generatedPost.imageSuggestions && generatedPost.imageSuggestions.length > 0 && (
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">图片建议</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {generatedPost.imageSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs text-rose-600">
                      {index + 1}
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* 复制全部按钮 */}
        <Button
          onClick={() => {
            const fullContent = `${generatedPost.title}\n\n${generatedPost.content}\n\n${generatedPost.tags.map(t => `#${t}`).join(' ')}`
            copyToClipboard(fullContent, 'all')
          }}
          className="w-full h-14 text-base font-semibold"
          size="lg"
        >
          {copied === 'all' ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              已复制全部内容
            </>
          ) : (
            <>
              <Copy className="mr-2 h-5 w-5" />
              复制全部内容
            </>
          )}
        </Button>
      </div>
    </main>
  )
}
