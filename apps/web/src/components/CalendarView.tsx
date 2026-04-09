import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  RefreshCcw,
  ChevronRight,
  Calendar,
  Users,
  Palette,
  FileText,
  Wand2,
  Lightbulb,
} from 'lucide-react'
import { storage, type ContentPlanItem } from '@/lib/storage'
import { generateContentPlanFn } from '@/functions/content'

// Content type configuration
const TYPE_CONFIG: Record<
  string,
  {
    bg: string
    text: string
    border: string
    hover: string
    icon: React.ElementType
    description: string
    gradient: string
  }
> = {
  共鸣: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    hover: 'hover:border-rose-300 hover:bg-rose-50/80',
    icon: Sparkles,
    description: '引发情感共鸣',
    gradient: 'from-rose-400 to-pink-500',
  },
  记录: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:border-gray-300 hover:bg-gray-50/80',
    icon: FileText,
    description: '日常生活记录',
    gradient: 'from-gray-400 to-slate-500',
  },
  干货: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:border-blue-300 hover:bg-blue-50/80',
    icon: Wand2,
    description: '实用知识分享',
    gradient: 'from-blue-400 to-cyan-500',
  },
  种草: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:border-green-300 hover:bg-green-50/80',
    icon: Lightbulb,
    description: '好物推荐分享',
    gradient: 'from-green-400 to-emerald-500',
  },
}

// Calendar item component
function CalendarItem({
  item,
  isSelected,
  onClick,
}: {
  item: ContentPlanItem
  isSelected: boolean
  onClick: () => void
}) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG['记录']
  const Icon = config.icon

  return (
    <Link
      to="/generate/$day"
      params={{ day: String(item.day) }}
      onClick={onClick}
      className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 block ${
        isSelected
          ? 'border-[#dc2641] bg-[#dc2641]/5 shadow-lg shadow-[#dc2641]/10'
          : `border-transparent bg-white ${config.hover} hover:shadow-md hover:shadow-black/5`
      }`}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-[#dc2641] to-[#ff6b7a] rounded-r-full" />
      )}

      <div className="flex items-start gap-4">
        {/* Day marker */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
            isSelected
              ? 'bg-gradient-to-br from-[#dc2641] to-[#ff6b7a] text-white shadow-md shadow-[#dc2641]/20'
              : 'bg-black/[0.04] text-[#6b6b6b] group-hover:bg-[#dc2641]/10 group-hover:text-[#dc2641]'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider">Day</span>
          <span className="text-xl font-bold leading-none">{item.day}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.type}
            </span>
            <span className="text-xs text-[#6b6b6b]">{config.description}</span>
          </div>

          {/* Topic */}
          <h4 className="font-semibold text-sm text-[#1a1a1a] mb-1 truncate group-hover:text-[#dc2641] transition-colors">
            {item.topic}
          </h4>

          {/* Intent */}
          <p className="text-xs text-[#6b6b6b] line-clamp-2 leading-relaxed">{item.intent}</p>
        </div>

        {/* Arrow */}
        <ChevronRight
          className={`flex-shrink-0 w-5 h-5 transition-all duration-300 ${
            isSelected ? 'text-[#dc2641] translate-x-1' : 'text-black/20 group-hover:text-[#dc2641] group-hover:translate-x-1'
          }`}
        />
      </div>
    </Link>
  )
}

// Info tag component
function InfoTag({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/[0.08] text-sm shadow-sm">
      <Icon className="w-4 h-4 text-[#dc2641]" />
      <span className="text-[#6b6b6b]">{label}:</span>
      <span className="font-semibold text-[#1a1a1a]">{value}</span>
    </div>
  )
}

// Quick preview card
function QuickPreviewCard({ item, index }: { item: ContentPlanItem; index: number }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG['记录']

  return (
    <Link
      to="/generate/$day"
      params={{ day: String(item.day) }}
      className="group p-4 rounded-xl bg-white border border-black/[0.08] hover:border-[#dc2641]/40 hover:shadow-lg hover:shadow-[#dc2641]/5 transition-all duration-300 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
          Day {item.day}
        </span>
        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.gradient}`} />
      </div>
      <p className="text-sm text-[#1a1a1a] line-clamp-2 group-hover:text-[#dc2641] transition-colors font-medium">
        {item.topic}
      </p>
    </Link>
  )
}

export function CalendarView() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/calendar' })
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDay, setSelectedDay] = useState<ContentPlanItem | null>(null)
  const hasFetched = useRef(false)

  const niche = (search.niche as string) || ''
  const audience = (search.audience as string) || ''
  const tone = (search.tone as string) || ''

  useEffect(() => {
    if (!niche) {
      navigate({ to: '/' })
      return
    }

    const storedPlan = storage.getContentPlan()
    const storedParams = storage.getContentPlanParams()

    if (!hasFetched.current) {
      hasFetched.current = true
      if (storedPlan && storedParams?.niche === niche) {
        setContentPlan(storedPlan)
        setLoading(false)
      } else {
        generateContent(niche, audience, tone)
      }
    }
  }, [niche, audience, tone, navigate])

  const generateContent = async (niche: string, audience: string, tone: string) => {
    setLoading(true)
    setError('')
    setContentPlan([])
    setSelectedDay(null)

    try {
      const response = await generateContentPlanFn({
        data: {
          niche,
          goal: '涨粉',
          persona: '真实',
          frequency: 7,
        },
      })

      if (response.success && response.data) {
        storage.saveContentPlan(response.data, { niche, goal: '涨粉', persona: '真实', frequency: 7 })
        setContentPlan(response.data)
        toast.success('7天内容日历已生成！')
      } else {
        setError(response.error || '生成内容失败')
        toast.error('生成日历失败，请重试')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '内容生成失败')
      toast.error('生成日历失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = (day: ContentPlanItem) => {
    setSelectedDay(day)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <span className="text-4xl">😢</span>
        </div>
        <p className="text-red-500 mb-2 font-semibold">{error}</p>
        <p className="text-[#6b6b6b] text-sm mb-6">抱歉，生成过程中出现了问题</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate({ to: '/' })} className="rounded-xl">
            返回重试
          </Button>
          <Button onClick={() => generateContent(niche, audience, tone)} className="bg-[#dc2641] hover:bg-[#b91c36] rounded-xl">
            <RefreshCcw className="mr-2 h-4 w-4" />
            重新生成
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top info bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="text-[#6b6b6b] hover:text-[#dc2641] hover:bg-[#dc2641]/5 rounded-full px-4 w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回设置
        </Button>

        <div className="flex flex-wrap gap-2">
          <InfoTag icon={Calendar} label="领域" value={niche} />
          {audience && <InfoTag icon={Users} label="受众" value={audience} />}
          {tone && <InfoTag icon={Palette} label="风格" value={tone} />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Calendar list */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            className="border-0 shadow-xl shadow-black/5 overflow-hidden opacity-0 animate-fade-in-up bg-white/95 backdrop-blur-sm"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <CardHeader className="bg-gradient-to-r from-[#dc2641]/5 to-[#ff6b7a]/5 border-b border-black/[0.06]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#dc2641]/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#dc2641]" />
                    </div>
                    <span>内容日历</span>
                  </CardTitle>
                  <CardDescription className="mt-1">点击任意一天生成详细内容</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => generateContent(niche, audience, tone)}
                  disabled={loading}
                  className="rounded-xl border-black/[0.08] hover:border-[#dc2641]/40 hover:bg-[#dc2641]/5"
                  title="重新生成日历"
                >
                  <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin text-[#dc2641]' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-black/[0.02]">
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-14 h-14 rounded-xl flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-2">
                  <div className="space-y-3">
                    {contentPlan.map((day, index) => (
                      <div
                        key={day.day}
                        className="opacity-0 animate-fade-in-up"
                        style={{ animationDelay: `${0.3 + index * 0.05}s`, animationFillMode: 'forwards' }}
                      >
                        <CalendarItem item={day} isSelected={selectedDay?.day === day.day} onClick={() => handleDayClick(day)} />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Preview area */}
        <div className="lg:col-span-7">
          <Card
            className="h-full min-h-[600px] border-0 shadow-xl shadow-black/5 flex flex-col opacity-0 animate-fade-in-scale bg-white/95 backdrop-blur-sm"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <CardHeader className="bg-gradient-to-r from-[#ff6b7a]/5 to-[#dc2641]/5 border-b border-black/[0.06]">
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#ff6b7a]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#dc2641]" />
                </div>
                <span>内容预览</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {selectedDay ? (
                  <span className="flex items-center gap-2">
                    已选择
                    <span className="font-semibold text-[#dc2641]">Day {selectedDay.day}</span>
                    <span className="text-[#6b6b6b]">| {selectedDay.topic}</span>
                  </span>
                ) : (
                  '从左侧日历选择一天查看或生成详细内容'
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {!selectedDay ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#dc2641]/10 to-[#ff6b7a]/5 flex items-center justify-center mb-6 animate-float">
                    <Sparkles className="w-12 h-12 text-[#dc2641]/40" />
                  </div>

                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-bold text-[#1a1a1a]">准备好生成精彩内容了吗？</h3>
                    <p className="text-[#6b6b6b] max-w-md">点击左侧任意一天，即可生成完整的小红书帖子内容，包括标题、正文和标签</p>
                  </div>

                  {!loading && contentPlan.length > 0 && (
                    <div className="w-full max-w-lg">
                      <p className="text-sm text-[#6b6b6b] mb-4 uppercase tracking-wider text-xs">热门选题</p>
                      <div className="grid grid-cols-2 gap-3">
                        {contentPlan.slice(0, 4).map((day, index) => (
                          <QuickPreviewCard key={day.day} item={day} index={index} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-full max-w-md text-center">
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 ${TYPE_CONFIG[selectedDay.type]?.bg || 'bg-black/[0.04]'}`}
                    >
                      <span className={`text-sm font-semibold ${TYPE_CONFIG[selectedDay.type]?.text || 'text-[#6b6b6b]'}`}>
                        {selectedDay.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">{selectedDay.topic}</h3>

                    <p className="text-[#6b6b6b] mb-8 leading-relaxed">{selectedDay.intent}</p>

                    <Link to="/generate/$day" params={{ day: String(selectedDay.day) }} className="w-full">
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#dc2641] to-[#ff6b7a] hover:from-[#b91c36] hover:to-[#e85a68] text-white shadow-lg shadow-[#dc2641]/25 btn-shine rounded-xl"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            准备中...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            生成 Day {selectedDay.day} 详细内容
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
