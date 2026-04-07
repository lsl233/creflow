import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '#/lib/api'
import { storage, type ContentPlanItem, type GeneratedPost } from '#/lib/storage'

export const Route = createFileRoute('/generate/$day')({
  component: GeneratePage,
})

const TYPE_COLORS: Record<string, string> = {
  '共鸣': 'tag-gongming',
  '记录': 'tag-jilu',
  '干货': 'tag-gganhuo',
  '种草': 'tag-zhongcao',
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
      const response = await api.generatePost({
        topic: item.topic,
        type: item.type,
        niche,
      })

      if (response.data) {
        setGeneratedPost(response.data)
        storage.saveGeneratedPost(item.day, response.data)
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
        <div className="island-shell rounded-2xl p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-[rgba(255,36,66,0.1)]" />
            <p className="text-sm text-[var(--sea-ink-soft)]">正在生成内容...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page-wrap px-4 pb-8 pt-10">
        <div className="island-shell rounded-2xl p-8 text-center">
          <div className="mb-4 text-4xl">😢</div>
          <h2 className="mb-2 text-xl font-bold text-[var(--sea-ink)]">生成失败</h2>
          <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">{error}</p>
          <button
            onClick={() => planItem && generatePost(planItem, storage.getContentPlanParams()?.niche || '')}
            className="inline-block rounded-xl bg-gradient-to-r from-[var(--xhs-primary)] to-[var(--xhs-secondary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            重试
          </button>
        </div>
      </main>
    )
  }

  if (!planItem || !generatedPost) {
    return null
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-6">
      {/* 返回按钮 */}
      <Link
        to="/calendar"
        className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--xhs-primary)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回日历
      </Link>

      {/* 选题信息 */}
      <div className="mb-6 flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${TYPE_COLORS[planItem.type]}`}>
          Day{planItem.day} · {planItem.type}
        </span>
        <h1 className="text-lg font-medium text-[var(--sea-ink)]">
          {planItem.topic}
        </h1>
      </div>

      {/* 生成的内容 */}
      <div className="space-y-4">
        {/* 标题 */}
        <section className="island-shell rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--sea-ink-soft)]">标题</h2>
            <button
              onClick={() => copyToClipboard(generatedPost.title, 'title')}
              className="flex items-center gap-1 text-sm text-[var(--xhs-primary)] transition hover:opacity-70"
            >
              {copied === 'title' ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <p className="text-xl font-bold text-[var(--sea-ink)]">
            {generatedPost.title}
          </p>
        </section>

        {/* 正文 */}
        <section className="island-shell rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--sea-ink-soft)]">正文</h2>
            <button
              onClick={() => copyToClipboard(generatedPost.content, 'content')}
              className="flex items-center gap-1 text-sm text-[var(--xhs-primary)] transition hover:opacity-70"
            >
              {copied === 'content' ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <div className="whitespace-pre-wrap text-[var(--sea-ink)] leading-relaxed">
            {generatedPost.content}
          </div>
        </section>

        {/* 标签 */}
        <section className="island-shell rounded-2xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-[var(--sea-ink-soft)]">标签</h2>
            <button
              onClick={() => copyToClipboard(generatedPost.tags.map(t => `#${t}`).join(' '), 'tags')}
              className="flex items-center gap-1 text-sm text-[var(--xhs-primary)] transition hover:opacity-70"
            >
              {copied === 'tags' ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  已复制
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  复制
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {generatedPost.tags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full bg-[rgba(255,36,66,0.08)] px-3 py-1 text-sm text-[var(--xhs-primary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </section>

        {/* 图片建议 */}
        {generatedPost.imageSuggestions && generatedPost.imageSuggestions.length > 0 && (
          <section className="island-shell rounded-2xl p-5">
            <h2 className="mb-3 text-sm font-medium text-[var(--sea-ink-soft)]">图片建议</h2>
            <ul className="space-y-2">
              {generatedPost.imageSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-[var(--sea-ink)]">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(255,36,66,0.1)] text-xs text-[var(--xhs-primary)]">
                    {index + 1}
                  </span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 复制全部按钮 */}
        <button
          onClick={() => {
            const fullContent = `${generatedPost.title}\n\n${generatedPost.content}\n\n${generatedPost.tags.map(t => `#${t}`).join(' ')}`
            copyToClipboard(fullContent, 'all')
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--xhs-primary)] to-[var(--xhs-secondary)] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90"
        >
          {copied === 'all' ? (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              已复制全部内容
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              复制全部内容
            </>
          )}
        </button>
      </div>
    </main>
  )
}
