import { z } from 'zod'
import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarView } from '@/components/CalendarView'
import { Loader2, Sparkles } from 'lucide-react'

const routeSearchSchema = z.object({
  niche: z.optional(z.string()),
})

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
  validateSearch: (search) => routeSearchSchema.parse(search),
})

function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#faf9f7] relative overflow-hidden pt-24 pb-16">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#dc2641]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6b7a]/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dc2641]/10">
                    <Sparkles className="w-4 h-4 text-[#dc2641]" />
                    <span className="text-sm font-semibold text-[#dc2641]">第 3 步，共 3 步</span>
                  </div>
                </div>
                <h1 className="editorial-heading-lg text-[#1a1a1a]">
                  你的<span className="gradient-text">内容日历</span>
                </h1>
              </div>
            </div>
          </div>

          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-[#dc2641] mb-4" />
                <p className="text-[#6b6b6b]">正在准备你的内容日历...</p>
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
