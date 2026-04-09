import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarView } from '@/components/CalendarView'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
  validateSearch: (search: Record<string, unknown>) => ({
    niche: search.niche as string | undefined,
    audience: search.audience as string | undefined,
    tone: search.tone as string | undefined,
  }),
})

function CalendarPage() {
  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#ff2442]">你的内容日历</h1>
          <p className="text-muted-foreground">查看你的 7 天计划并生成笔记。</p>
        </header>
        <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-[#ff2442]" /></div>}>
          <CalendarView />
        </Suspense>
      </div>
    </main>
  )
}
