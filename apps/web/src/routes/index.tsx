import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, TrendingUp, CalendarDays, PenTool, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const navigate = useNavigate()
  const [niche, setNiche] = useState('')

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    if (niche.trim()) {
      navigate({ to: '/setup', search: { niche: niche.trim() } })
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ff2442]/10 via-white to-white -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-[#ff2442]/30 bg-[#ff2442]/5 px-3 py-1 text-sm font-medium text-[#ff2442]">
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Xiaohongshu Growth
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-neutral-900">
            10x Your <span className="text-[#ff2442]">Xiaohongshu</span> Content
          </h1>

          <p className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Stop staring at a blank page. Generate a full 7-day content calendar and viral-ready posts tailored exactly to your niche in seconds.
          </p>

          <form onSubmit={handleStart} className="max-w-xl mx-auto mt-10 relative flex items-center shadow-2xl shadow-[#ff2442]/10 rounded-full bg-white p-2 border border-neutral-200">
            <Input
              type="text"
              placeholder="What is your account about? (e.g. Minimalist home decor)"
              className="border-0 shadow-none focus-visible:ring-0 text-base px-6 h-12"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              required
            />
            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-[#ff2442] hover:bg-[#e01f39] text-white px-8 h-12"
              disabled={!niche.trim()}
            >
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="text-sm text-neutral-400 mt-4">No credit card required. Start generating immediately.</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral-900">Everything you need to go viral</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-[#ff2442]/10 rounded-xl flex items-center justify-center mb-6">
                <CalendarDays className="h-6 w-6 text-[#ff2442]" />
              </div>
              <h3 className="text-xl font-bold mb-3">7-Day Content Calendar</h3>
              <p className="text-neutral-500 leading-relaxed">
                Never run out of ideas. Get a structured week of engaging topics and descriptions tailored to your specific audience.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-[#ff2442]/10 rounded-xl flex items-center justify-center mb-6">
                <PenTool className="h-6 w-6 text-[#ff2442]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Viral Copywriting</h3>
              <p className="text-neutral-500 leading-relaxed">
                Generate click-worthy titles, emoji-rich formatting, and conversational body text that perfectly matches the Xiaohongshu vibe.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
              <div className="w-12 h-12 bg-[#ff2442]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-[#ff2442]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visual Direction</h3>
              <p className="text-neutral-500 leading-relaxed">
                Get specific suggestions for your image carousel and the exact hashtags you need to maximize your reach and engagement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
