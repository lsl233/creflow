import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch, Link } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { ArrowLeft, Loader2, Sparkles, RefreshCcw, ChevronRight } from 'lucide-react'
import { storage, type ContentPlanItem } from '@/lib/storage'
import { generateContentPlanFn } from '@/functions/content'

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  '共鸣': {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    hover: 'hover:border-rose-400 hover:bg-rose-50',
  },
  '记录': {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:border-gray-400 hover:bg-gray-50',
  },
  '干货': {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:border-blue-400 hover:bg-blue-50',
  },
  '种草': {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:border-green-400 hover:bg-green-50',
  },
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

    // First check localStorage for existing plan
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
      const response = await generateContentPlanFn({ data: {
        niche,
        goal: '涨粉',
        persona: '真实',
        frequency: 7,
      }})

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
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate({ to: '/' })}>返回重试</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回设置
        </Button>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="font-medium text-foreground">领域:</span> {niche}
          {audience && <><span className="text-neutral-300">|</span><span className="font-medium text-foreground">受众:</span> {audience}</>}
          {tone && <><span className="text-neutral-300">|</span><span className="font-medium text-foreground">风格:</span> {tone}</>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Calendar */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>内容日历</CardTitle>
                <CardDescription>点击任意一天生成详细内容</CardDescription>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => generateContent(niche, audience, tone)}
                disabled={loading}
                title="重新生成日历"
              >
                <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {contentPlan.map((day) => {
                      const colors = TYPE_COLORS[day.type] || TYPE_COLORS['记录']
                      return (
                        <Link
                          key={day.day}
                          to="/generate/$day"
                          params={{ day: String(day.day) }}
                          onClick={() => handleDayClick(day)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors block ${
                            selectedDay?.day === day.day
                              ? "border-[#ff2442] bg-[#ff2442]/5"
                              : `border-border hover:border-[#ff2442]/50 hover:bg-neutral-50 ${colors.hover}`
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#ff2442]">Day {day.day}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                              {day.type}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{day.topic}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{day.intent}</p>
                        </Link>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview / Hint */}
        <div className="lg:col-span-7">
          <Card className="h-full min-h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>内容预览</CardTitle>
              <CardDescription>
                {selectedDay
                  ? `已选择 Day ${selectedDay.day}: ${selectedDay.topic}`
                  : "从左侧日历选择一天查看或生成详细内容"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-neutral-300" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">准备好生成精彩内容了吗？</p>
                <p className="text-sm">点击左侧任意一天，即可生成完整的小红书帖子内容</p>
              </div>

              {!loading && contentPlan.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
                  {contentPlan.slice(0, 4).map((day) => (
                    <Link
                      key={day.day}
                      to="/generate/$day"
                      params={{ day: String(day.day) }}
                      className="p-3 rounded-lg border border-border hover:border-[#ff2442]/50 hover:bg-neutral-50 transition-colors text-left"
                    >
                      <div className="text-xs text-[#ff2442] font-medium mb-1">Day {day.day}</div>
                      <div className="text-sm text-foreground truncate">{day.topic}</div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
            {selectedDay && !loading && (
              <CardFooter className="border-t pt-6">
                <Link
                  to="/generate/$day"
                  params={{ day: String(selectedDay.day) }}
                  className="w-full"
                >
                  <Button className="w-full bg-[#ff2442] hover:bg-[#e01f39]">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    查看 Day {selectedDay.day} 详细内容
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
