import { useState, useEffect, Suspense } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Target, Mic, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/setup')({
  component: SetupPage,
  validateSearch: (search: Record<string, unknown>) => ({
    niche: (search.niche as string) || '',
  }),
})

function SetupForm() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/setup' })

  const [niche, setNiche] = useState(search.niche || '')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!niche.trim()) return

    navigate({
      to: '/calendar',
      search: {
        niche,
        ...(audience && { audience }),
        ...(tone && { tone }),
      },
    })
  }

  return (
    <main className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-5 gap-8 items-center">

        {/* Left Side: Info / Motivation */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <div className="inline-flex items-center rounded-full border border-[#ff2442]/30 bg-[#ff2442]/10 px-3 py-1 text-sm font-medium text-[#ff2442] mb-4">
              第 2 步，共 3 步
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              完善你的账号信息
            </h1>
            <p className="text-neutral-500">
              提供的信息越详细，AI 就能越好地为你量身定制符合品牌调性的内容。
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#ff2442] shrink-0" />
              <p className="text-sm text-neutral-600">用精准的定位让你脱颖而出。</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#ff2442] shrink-0" />
              <p className="text-sm text-neutral-600">直接击中目标受众的痛点。</p>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#ff2442] shrink-0" />
              <p className="text-sm text-neutral-600">保持一致的调性，建立信任感。</p>
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="md:col-span-3">
          <Card className="border-0 shadow-xl shadow-neutral-200/50">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">账号详情</CardTitle>
                <CardDescription>完善你的小红书人设。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">

                <div className="space-y-2">
                  <Label htmlFor="niche" className="flex items-center gap-2 font-semibold">
                    <Briefcase className="h-4 w-4 text-neutral-500" />
                    定位 / 领域 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="niche"
                    placeholder="如：极简家居、数码测评"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    className="bg-neutral-50/50 focus-visible:ring-[#ff2442]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="flex items-center gap-2 font-semibold">
                    <Target className="h-4 w-4 text-neutral-500" />
                    目标受众 <span className="text-neutral-400 font-normal text-xs">（可选）</span>
                  </Label>
                  <Input
                    id="audience"
                    placeholder="如：大学生、新手妈妈"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="bg-neutral-50/50 focus-visible:ring-[#ff2442]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="flex items-center gap-2 font-semibold">
                    <Mic className="h-4 w-4 text-neutral-500" />
                    内容风格 <span className="text-neutral-400 font-normal text-xs">（可选）</span>
                  </Label>
                  <Input
                    id="tone"
                    placeholder="如：幽默、专业、温情"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="bg-neutral-50/50 focus-visible:ring-[#ff2442]"
                  />
                </div>

              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[#ff2442] hover:bg-[#e01f39] text-white shadow-lg shadow-[#ff2442]/20"
                  disabled={!niche.trim()}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  生成内容日历
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

      </div>
    </main>
  )
}

function SetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SetupForm />
    </Suspense>
  )
}
