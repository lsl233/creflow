import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarView } from '@/components/CalendarView'
import { Loader2, Sparkles } from 'lucide-react'

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
    <main className="min-h-screen bg-[#fff7f8] relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#ff2442]/5 to-[#fb7299]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-gradient-to-tr from-[#fb7299]/5 to-[#ff6b6b]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-[#ff2442]" />
                  <span className="text-sm font-medium text-[#ff2442]">第 3 步，共 3 步</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-neutral-900">
                  你的<span className="gradient-text">内容日历</span>
                </h1>
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-[#ff2442] mb-4" />
                <p className="text-neutral-500">正在准备你的内容日历...</p>
              </div>
            }
          >
            <CalendarView />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
