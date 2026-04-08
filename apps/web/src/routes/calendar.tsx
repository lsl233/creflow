import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { storage, type ContentPlanItem } from '@/lib/storage'
import { TimelineCalendar } from '@/components/TimelineCalendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

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
        <Card className="border-none shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mb-4 text-4xl">📅</div>
            <h2 className="mb-2 text-xl font-bold text-foreground">暂无内容计划</h2>
            <p className="mb-6 text-base text-muted-foreground">
              还没有生成内容日历，点击下方按钮开始
            </p>
            <Button asChild size="lg">
              <Link to="/">去生成</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-10">
      {/* 返回按钮 */}
      <Button variant="ghost" className="mb-6 -ml-2" asChild>
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
          重新生成
        </Link>
      </Button>

      {/* 标题 */}
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-foreground">
          {params?.niche || '内容日历'}
        </h1>
        <p className="text-base text-muted-foreground">
          共 {contentPlan.length} 天内容计划，点击查看详情
        </p>
      </div>

      {/* 时间线日历 */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <TimelineCalendar contentPlan={contentPlan} niche={params?.niche} />
        </CardContent>
      </Card>
    </main>
  )
}
