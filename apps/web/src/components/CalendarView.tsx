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
} from 'lucide-react'
import { storage, type ContentPlanItem } from '@/lib/storage'
import { generateContentPlanFn } from '@/functions/content'

// 内容类型配置
const TYPE_CONFIG: Record<
  string,
  {
    bg: string
    text: string
    border: string
    hover: string
    icon: React.ElementType
    description: string
  }
> = {
  共鸣: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    hover: 'hover:border-rose-400 hover:bg-rose-50/80',
    icon: Sparkles,
    description: '引发情感共鸣',
  },
  记录: {
    bg: 'bg-gray-50',
    text: 'text-gray-600',
    border: 'border-gray-200',
    hover: 'hover:border-gray-400 hover:bg-gray-50/80',
    icon: FileText,
    description: '日常生活记录',
  },
  干货: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
    hover: 'hover:border-blue-400 hover:bg-blue-50/80',
    icon: Wand2,
    description: '实用知识分享',
  },
  种草: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
    hover: 'hover:border-green-400 hover:bg-green-50/80',
    icon: Sparkles,
    description: '好物推荐分享',
  },
}

// 日历项组件
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
      className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 block ${
        isSelected
          ? 'border-[#ff2442] bg-[#ff2442]/5 shadow-lg shadow-[#ff2442]/10'
          : `border-transparent bg-white ${config.hover} hover:shadow-md`
      }`}
    >
      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#ff2442] rounded-r-full" />
      )}

      <div className="flex items-start gap-3">
        {/* 天数标记 */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-colors ${
            isSelected ? 'bg-[#ff2442] text-white' : 'bg-neutral-100 text-neutral-600 group-hover:bg-[#ff2442]/10 group-hover:text-[#ff2442]'
          }`}
        >
          <span className="text-xs font-medium">Day</span>
          <span className="text-lg font-bold leading-none">{item.day}</span>
        </div>

        <div className="flex-1 min-w-0">
          {/* 类型标签 */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
              <Icon className="w-3 h-3" />
              {item.type}
            </span>
            <span className="text-xs text-neutral-400">{config.description}</span>
          </div>

          {/* 主题 */}
          <h4 className="font-semibold text-sm text-neutral-900 mb-1 truncate group-hover:text-[#ff2442] transition-colors">
            {item.topic}
          </h4>

          {/* 意图 */}
          <p className="text-xs text-neutral-500 line-clamp-2">{item.intent}</p>
        </div>

        {/* 箭头 */}
        <ChevronRight
          className={`flex-shrink-0 w-5 h-5 transition-all duration-300 ${
            isSelected ? 'text-[#ff2442] translate-x-1' : 'text-neutral-300 group-hover:text-[#ff2442] group-hover:translate-x-1'
          }`}
        />
      </div>
    </Link>
  )
}

// 信息标签组件
function InfoTag({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  if (!value) return null
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-neutral-200 text-sm">
      <Icon className="w-4 h-4 text-[#ff2442]" />
      <span className="text-neutral-500">{label}:</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  )
}

// 快速预览卡片
function QuickPreviewCard({ item, index }: { item: ContentPlanItem; index: number }) {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG['记录']

  return (
    <Link
      to="/generate/$day"
      params={{ day: String(item.day) }}
      className="group p-4 rounded-xl bg-white border border-neutral-200 hover:border-[#ff2442]/50 hover:shadow-lg hover:shadow-[#ff2442]/5 transition-all duration-300 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${0.4 + index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
          Day {item.day}
        </span>
      </div>
      <p className="text-sm text-neutral-700 line-clamp-2 group-hover:text-[#ff2442] transition-colors">
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
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="text-4xl">😢</span>
        </div>
        <p className="text-red-500 mb-2 font-medium">{error}</p>
        <p className="text-neutral-500 text-sm mb-6">抱歉，生成过程中出现了问题</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate({ to: '/' })}>
            返回重试
          </Button>
          <Button onClick={() => generateContent(niche, audience, tone)} className="bg-[#ff2442] hover:bg-[#e01f39]">
            <RefreshCcw className="mr-2 h-4 w-4" />
            重新生成
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 顶部信息栏 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
        <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="text-neutral-500 hover:text-[#ff2442] w-fit">
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
        {/* 左侧：日历列表 */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            className="border-0 shadow-xl shadow-[#ff2442]/5 overflow-hidden opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
          >
            <CardHeader className="bg-gradient-to-r from-[#ff2442]/5 to-[#fb7299]/5 border-b border-neutral-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#ff2442]" />
                    内容日历
                  </CardTitle>
                  <CardDescription>点击任意一天生成详细内容</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => generateContent(niche, audience, tone)}
                  disabled={loading}
                  className="rounded-xl border-neutral-200 hover:border-[#ff2442]/50 hover:bg-[#ff2442]/5"
                  title="重新生成日历"
                >
                  <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin text-[#ff2442]' : ''}`} />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-50">
                      <div className="flex items-start gap-3">
                        <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
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

        {/* 右侧：预览区域 */}
        <div className="lg:col-span-7">
          <Card
            className="h-full min-h-[600px] border-0 shadow-xl shadow-[#ff2442]/5 flex flex-col opacity-0 animate-fade-in-scale"
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <CardHeader className="bg-gradient-to-r from-[#fb7299]/5 to-[#ff2442]/5 border-b border-neutral-100">
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff2442]" />
                内容预览
              </CardTitle>
              <CardDescription>
                {selectedDay ? (
                  <span className="flex items-center gap-2">
                    已选择
                    <span className="font-medium text-[#ff2442]">Day {selectedDay.day}</span>
                    <span className="text-neutral-400">| {selectedDay.topic}</span>
                  </span>
                ) : (
                  '从左侧日历选择一天查看或生成详细内容'
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {!selectedDay ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ff2442]/10 to-[#fb7299]/10 flex items-center justify-center mb-6 animate-float">
                    <Sparkles className="w-12 h-12 text-[#ff2442]/40" />
                  </div>

                  <div className="space-y-2 mb-8">
                    <h3 className="text-2xl font-bold text-neutral-900">准备好生成精彩内容了吗？</h3>
                    <p className="text-neutral-500 max-w-md">点击左侧任意一天，即可生成完整的小红书帖子内容，包括标题、正文和标签</p>
                  </div>

                  {!loading && contentPlan.length > 0 && (
                    <div className="w-full max-w-lg">
                      <p className="text-sm text-neutral-400 mb-4">热门选题</p>
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
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${TYPE_CONFIG[selectedDay.type]?.bg || 'bg-neutral-100'}`}
                    >
                      <span className={`text-sm font-medium ${TYPE_CONFIG[selectedDay.type]?.text || 'text-neutral-600'}`}>
                        {selectedDay.type}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 mb-4">{selectedDay.topic}</h3>

                    <p className="text-neutral-500 mb-8">{selectedDay.intent}</p>

                    <Link to="/generate/$day" params={{ day: String(selectedDay.day) }} className="w-full">
                      <Button
                        size="lg"
                        className="w-full h-14 text-base font-bold bg-gradient-to-r from-[#ff2442] to-[#fb7299] hover:from-[#e01f39] hover:to-[#e85f87] text-white shadow-lg shadow-[#ff2442]/25 btn-shine"
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
