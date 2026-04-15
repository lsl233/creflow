import { useState, useMemo } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/storage'
import { CalendarDays, Check, Eye, RefreshCw } from 'lucide-react'
import type { TopicItem } from '@creflow/ai'

export const Route = createFileRoute('/topics')({
  component: TopicsPage,
})

// 内容类型标签颜色
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  '共鸣': { bg: 'bg-pink-100', text: 'text-pink-700' },
  '记录': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '干货': { bg: 'bg-green-100', text: 'text-green-700' },
  '种草': { bg: 'bg-purple-100', text: 'text-purple-700' },
  '测评': { bg: 'bg-orange-100', text: 'text-orange-700' },
  '教程': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'vlog式': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
}

// 策略中文描述
const STRATEGY_NAMES: Record<string, string> = {
  professional: '专业背书型',
  humorous: '搞笑/轻松型',
  emotional: '情感共鸣型',
  educational: '干货教程型',
  authentic: '真实分享型',
  review: '测评型',
  vlog: 'vlog叙事型',
}

function TopicsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all')

  const plan = storage.getContentPlanV2()

  // 如果没有计划，重定向到引导页
  if (!plan) {
    navigate({ to: '/onboarding' })
    return null
  }

  const filteredTopics = useMemo(() => {
    if (filter === 'all') return plan.topics
    if (filter === 'pending') return plan.topics.filter((t) => t.status === 'pending')
    return plan.topics.filter((t) => t.status === 'published')
  }, [plan.topics, filter])

  const stats = useMemo(() => {
    const total = plan.topics.length
    const published = plan.topics.filter((t) => t.status === 'published').length
    const pending = total - published
    return { total, published, pending }
  }, [plan.topics])

  const typeColors = (type: string) =>
    TYPE_COLORS[type] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  return (
    <main className="min-h-screen bg-[#faf9f7] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 头部信息 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-[#1a1a1a] mb-1">
                {plan.accountProfile.niche} - 内容计划
              </h1>
              <p className="text-sm text-[#6b6b6b]">
                策略：{STRATEGY_NAMES[plan.strategy] || plan.strategy} | 版本：v{plan.version}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6b6b6b]">
              <CalendarDays className="w-4 h-4" />
              <span>{plan.planType === '30days' ? '30天' : '7天'}计划</span>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-[#1a1a1a]">{stats.total}</div>
              <div className="text-xs text-[#6b6b6b]">总选题</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-xs text-[#6b6b6b]">已发布</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <div className="text-xs text-[#6b6b6b]">待发布</div>
            </div>
          </div>
        </div>

        {/* 筛选标签 */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: `全部 ${plan.topics.length}` },
            { key: 'pending', label: `待发布 ${stats.pending}` },
            { key: 'published', label: `已发布 ${stats.published}` },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#dc2641] text-white'
                  : 'bg-white text-[#6b6b6b] hover:bg-gray-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 选题列表 */}
        <div className="space-y-3">
          {filteredTopics.map((topic) => {
            const colors = typeColors(topic.type)
            return (
              <Link
                key={topic.id}
                to="/topic/$id"
                params={{ id: String(topic.id) }}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* 序号 */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="font-semibold text-[#1a1a1a]">{topic.id + 1}</span>
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {/* 类型标签 */}
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {topic.type}
                      </span>
                      {/* 状态标签 */}
                      {topic.status === 'published' && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          已发布
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-[#1a1a1a] mb-1 truncate">
                      {topic.topic}
                    </h3>
                    <p className="text-sm text-[#6b6b6b] line-clamp-1">
                      {topic.intent}
                    </p>
                  </div>

                  {/* 箭头 */}
                  <div className="flex-shrink-0 text-[#6b6b6b]">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 空状态 */}
        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-[#6b6b6b]">
              {filter === 'pending' ? '暂无待发布的选题' : '暂无已发布的选题'}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
