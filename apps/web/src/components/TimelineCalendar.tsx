import { Link } from '@tanstack/react-router'
import type { ContentPlanItem } from '@/lib/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string; badge: string }> = {
  '共鸣': {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    gradient: 'from-rose-400 to-rose-500',
    badge: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
  },
  '记录': {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    gradient: 'from-gray-400 to-gray-500',
    badge: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
  '干货': {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    gradient: 'from-blue-400 to-blue-500',
    badge: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  '种草': {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    gradient: 'from-green-400 to-green-500',
    badge: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
}

const TYPE_ICONS: Record<string, string> = {
  '共鸣': '💭',
  '记录': '📝',
  '干货': '📚',
  '种草': '🌱',
}

interface TimelineCalendarProps {
  contentPlan: ContentPlanItem[]
  niche?: string
}

export function TimelineCalendar({ contentPlan, niche }: TimelineCalendarProps) {
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-none bg-gradient-to-r from-muted/50 to-muted">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-semibold text-foreground">{niche || '内容日历'}</h3>
            <p className="text-sm text-muted-foreground">共 {contentPlan.length} 天内容计划</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-2xl shadow-sm">
            📅
          </div>
        </CardContent>
      </Card>

      {/* Vertical Timeline */}
      <div className="relative">
        {contentPlan.map((item, index) => {
          const colors = TYPE_COLORS[item.type] || TYPE_COLORS['记录']
          const icon = TYPE_ICONS[item.type] || '📝'
          const isLast = index === contentPlan.length - 1

          return (
            <Link
              key={item.day}
              to="/generate/$day"
              params={{ day: String(item.day) }}
              className="group relative flex gap-4"
            >
              {/* Timeline Left Side - Line & Node */}
              <div className="relative flex flex-col items-center">
                {/* Connection Line */}
                {!isLast && (
                  <div className="absolute top-10 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-border to-muted" />
                )}

                {/* Day Node */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-md transition-transform group-hover:scale-110",
                    colors.gradient
                  )}
                >
                  {item.day}
                </div>
              </div>

              {/* Content Card */}
              <Card className={cn(
                "mb-6 flex-1 border transition-all group-hover:shadow-md",
                colors.border,
                colors.bg
              )}>
                <CardContent className="p-4">
                  {/* Card Header */}
                  <div className="mb-3 flex items-center justify-between">
                    <Badge variant="secondary" className={cn(colors.badge)}>
                      <span className="mr-1">{icon}</span>
                      {item.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      第 {item.day} 天
                    </span>
                  </div>

                  {/* Topic */}
                  <h4 className="mb-2 text-base font-semibold text-foreground">
                    {item.topic}
                  </h4>

                  {/* Intent */}
                  <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {item.intent}
                  </p>

                  {/* Action Hint */}
                  <div className="flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    <span>查看详情</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted p-4 sm:grid-cols-4">
        {Object.entries(TYPE_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm", colors.bg)}>
              {TYPE_ICONS[type]}
            </div>
            <span className="text-sm text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
