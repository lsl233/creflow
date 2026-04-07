import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api'
import { storage } from '#/lib/storage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const navigate = useNavigate()
  const [niche, setNiche] = useState('')
  const [goal, setGoal] = useState<'涨粉' | '变现'>('涨粉')
  const [persona, setPersona] = useState<'真实' | '专业'>('真实')
  const [frequency, setFrequency] = useState(2)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!niche.trim()) {
      setError('请输入你的内容定位')
      return
    }

    setLoading(true)

    try {
      const response = await api.generateContentPlan({
        niche: niche.trim(),
        goal,
        persona,
        frequency,
      })

      if (response.data) {
        storage.saveContentPlan(response.data, { niche: niche.trim(), goal, persona, frequency })
        navigate({ to: '/calendar' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-10">
      <section className="island-shell rise-in relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8 sm:py-10">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[rgba(255,36,66,0.15)] to-transparent" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-tl from-[rgba(251,114,153,0.12)] to-transparent" />

        <h1 className="mb-2 text-2xl font-bold text-[var(--sea-ink)] sm:text-3xl">
          告诉我你想做什么
        </h1>
        <p className="mb-6 text-sm text-[var(--sea-ink-soft)]">
          输入你的内容定位，我来帮你规划一周的内容
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 领域/定位 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sea-ink)]">
              你的内容定位 <span className="text-[var(--xhs-primary)]">*</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="例如：职场成长、美食探店、宝妈育儿..."
              className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-[var(--sea-ink)] placeholder:text-gray-400 focus:border-[var(--xhs-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,36,66,0.1)]"
            />
          </div>

          {/* 目标 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sea-ink)]">
              你的目标是什么？
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setGoal('涨粉')}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  goal === '涨粉'
                    ? 'border-[var(--xhs-primary)] bg-[rgba(255,36,66,0.05)] text-[var(--xhs-primary)]'
                    : 'border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--xhs-primary)]'
                }`}
              >
                涨粉
              </button>
              <button
                type="button"
                onClick={() => setGoal('变现')}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  goal === '变现'
                    ? 'border-[var(--xhs-primary)] bg-[rgba(255,36,66,0.05)] text-[var(--xhs-primary)]'
                    : 'border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--xhs-primary)]'
                }`}
              >
                变现
              </button>
            </div>
          </div>

          {/* 人设 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sea-ink)]">
              你想呈现什么样的人设？
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPersona('真实')}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  persona === '真实'
                    ? 'border-[var(--xhs-primary)] bg-[rgba(255,36,66,0.05)] text-[var(--xhs-primary)]'
                    : 'border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--xhs-primary)]'
                }`}
              >
                真实
              </button>
              <button
                type="button"
                onClick={() => setPersona('专业')}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  persona === '专业'
                    ? 'border-[var(--xhs-primary)] bg-[rgba(255,36,66,0.05)] text-[var(--xhs-primary)]'
                    : 'border-[var(--line)] text-[var(--sea-ink-soft)] hover:border-[var(--xhs-primary)]'
                }`}
              >
                专业
              </button>
            </div>
          </div>

          {/* 发布频率 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--sea-ink)]">
              每周发布几次？
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={frequency}
              onChange={(e) => setFrequency(Math.max(1, Math.min(7, parseInt(e.target.value) || 1)))}
              className="w-24 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-[var(--sea-ink)] focus:border-[var(--xhs-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,36,66,0.1)]"
            />
            <span className="ml-3 text-sm text-[var(--sea-ink-soft)]">次/周</span>
          </div>

          {/* 错误提示 */}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">
              {error}
            </p>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--xhs-primary)] to-[var(--xhs-secondary)] px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              '生成我的内容日历'
            )}
          </button>
        </form>
      </section>
    </main>
  )
}
