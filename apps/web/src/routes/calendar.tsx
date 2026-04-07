import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { storage, type ContentPlanItem } from '#/lib/storage'
import { TimelineCalendar } from '#/components/TimelineCalendar'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
})

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
          <p className="mb-6 text-base text-[var(--sea-ink-soft)]">
            还没有生成内容日历，点击下方按钮开始
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-gradient-to-r from-[var(--xhs-primary)] to-[var(--xhs-secondary)] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90"
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
        className="mb-6 inline-flex items-center gap-2 text-base text-[var(--sea-ink-soft)] transition hover:text-[var(--xhs-primary)]"
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
        <p className="text-base text-[var(--sea-ink-soft)]">
          共 {contentPlan.length} 天内容计划，点击查看详情
        </p>
      </div>

      {/* 时间线日历 */}
      <div className="island-shell rounded-2xl p-6">
        <TimelineCalendar contentPlan={contentPlan} niche={params?.niche} />
      </div>
    </main>
  )
}
