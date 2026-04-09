import { useEffect, useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CalendarIcon, Sparkles } from 'lucide-react'
import { storage, type ContentPlanItem } from '@/lib/storage'
import { generateContentPlanFn } from '@/functions/content'
import { TimelineCalendar } from '@/components/TimelineCalendar'

export function CalendarView() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/calendar' })
  const [contentPlan, setContentPlan] = useState<ContentPlanItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if we have search params from setup
    const niche = (search.niche as string) || ''
    const audience = (search.audience as string) || ''
    const tone = (search.tone as string) || ''

    // First check localStorage for existing plan
    const storedPlan = storage.getContentPlan()
    const storedParams = storage.getContentPlanParams()

    // If we have search params and either no stored plan or params changed, generate new
    if (niche && (!storedPlan || !storedParams || storedParams.niche !== niche)) {
      generateContent(niche, audience, tone)
    } else if (storedPlan) {
      setContentPlan(storedPlan)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [search])

  const generateContent = async (niche: string, audience: string, tone: string) => {
    setLoading(true)
    setError('')

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
      } else {
        setError(response.error || '生成内容失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff2442]" />
        <p className="text-neutral-500">Generating your content calendar...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => navigate({ to: '/' })}>Try Again</Button>
      </div>
    )
  }

  if (!contentPlan || contentPlan.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <CalendarIcon className="h-12 w-12 text-neutral-300" />
        <h2 className="text-xl font-semibold text-neutral-900">No Content Plan</h2>
        <p className="text-neutral-500">Start by setting up your niche to generate a content calendar.</p>
        <Button onClick={() => navigate({ to: '/' })} className="bg-[#ff2442] hover:bg-[#e01f39]">
          Get Started
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Your 7-Day Content Calendar</h2>
          <p className="text-neutral-500">Click on any day to generate detailed content</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="outline"
          className="border-[#ff2442] text-[#ff2442] hover:bg-[#ff2442]/10"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          New Calendar
        </Button>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <TimelineCalendar contentPlan={contentPlan} niche={storage.getContentPlanParams()?.niche} />
        </CardContent>
      </Card>
    </div>
  )
}
