import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { storage, type ContentPlanItem } from '#/lib/storage'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})

const TYPE_COLORS: Record<string, string> = {
  '共鸣': 'tag-gongming',
  '记录': 'tag-jilu',
  '干货': 'tag-gganhuo',
  '种草': 'tag-zhongcao',
}

function CalendarPage() {
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[] | null>(null)
  const [params, setParams] = useState<{ niche: string } | null>(null)

  useEffect(() => {
    const plan = storage.getContentPlan()
    const planParams = storage.getContentPlanParams()
    setContentPlan(plan)
    setParams(planParams ? { niche: planParams.niche } : null)
  }, [])

  if (!contentPlan || contentPlan.length === 0) {
    return (
      <main className="page-wrap px-4 pb-8 pt-10">
        <section className="island-shell rounded-2xl p-8 text-center">
          <div className="mb-4 text-4xl">📅</div>
          <h2 className="mb-2 text-xl font-bold text-[var(--sea-ink)]">暂无内容计划</h2>
          <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
            还没有生成内容日历，点击下方按钮开始
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-gradient-to-r from-[var(--xhs-primary)] to-[var(--xhs-secondary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            去生成
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-10">
      {/* 返回按钮 */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--xhs-primary)]"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        重新生成
      </Link>

      {/* 标题 */}
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-[var(--sea-ink)]">
          {params?.niche || '内容日历'}
        </h1>
        <p className="text-sm text-[var(--sea-ink-soft)]">
          共 {contentPlan.length} 天内容计划，点击查看详情
        </p>
      </div>

      {/* 内容列表 */}
      <div className="space-y-3">
        {contentPlan.map((item) => (
          <Link
            key={item.day}
            to="/generate/$day"
            params={{ day: String(item.day) }}
            className="island-shell rise-in block rounded-2xl p-4 transition hover:-translate-y-0.5"
            style={{ animationDelay: `${(item.day - 1) * 60}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(255,36,66,0.08)] text-lg font-bold text-[var(--xhs-primary)]">
                Day{item.day}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-[var(--sea-ink)]">
                  {item.topic}
                </h3>
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  {item.intent}
                </p>
              </div>
              <svg className="h-5 w-5 flex-shrink-0 text-[var(--sea-ink-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
