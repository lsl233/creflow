import { Link } from '@tanstack/react-router'
import type { ContentPlanItem } from '#/lib/storage'

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  '共鸣': {
    bg: 'bg-[rgba(255,36,66,0.08)]',
    text: 'text-[var(--xhs-primary)]',
    border: 'border-[var(--xhs-primary)]',
    gradient: 'from-[var(--xhs-primary)] to-[var(--xhs-secondary)]',
  },
  '记录': {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-400',
    gradient: 'from-gray-400 to-gray-500',
  },
  '干货': {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-400',
    gradient: 'from-blue-400 to-blue-500',
  },
  '种草': {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-400',
    gradient: 'from-green-400 to-green-500',
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
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4">
        <div>
          <h3 className="font-semibold text-[var(--sea-ink)]">{niche || '内容日历'}</h3>
          <p className="text-sm text-[var(--sea-ink-soft)]">共 {contentPlan.length} 天内容计划</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          📅
        </div>
      </div>

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
                  <div className="absolute top-10 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gray-300 to-gray-200" />
                )}

                {/* Day Node */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${colors.gradient} text-sm font-bold text-white shadow-md transition-transform group-hover:scale-110`}
                >
                  {item.day}
                </div>
              </div>

              {/* Content Card */}
              <div className={`mb-6 flex-1 rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all group-hover:shadow-md`}>
                {/* Card Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 ${colors.text}`}>
                    <span>{icon}</span>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <span className="text-xs text-[var(--sea-ink-soft)]">
                    第 {item.day} 天
                  </span>
                </div>

                {/* Topic */}
                <h4 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
                  {item.topic}
                </h4>

                {/* Intent */}
                <p className="mb-3 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
                  {item.intent}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/60 px-2 py-0.5 text-xs text-[var(--sea-ink-soft)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Hint */}
                <div className="flex items-center gap-1 text-sm text-[var(--xhs-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                  <span>查看详情</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-4">
        {Object.entries(TYPE_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full ${colors.bg} flex items-center justify-center text-sm`}>
              {TYPE_ICONS[type]}
            </div>
            <span className="text-sm text-[var(--sea-ink-soft)]">{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
