import { useState, useMemo } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/storage'
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Loader2,
  RefreshCw,
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// 内容类型颜色
const TYPE_COLORS: Record<string, string> = {
  '共鸣': '#ec4899',
  '记录': '#3b82f6',
  '干货': '#22c55e',
  '种草': '#a855f7',
  '测评': '#f97316',
  '教程': '#06b6d4',
  'vlog式': '#eab308',
}

function DashboardPage() {
  const navigate = useNavigate()
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [metricsInput, setMetricsInput] = useState({
    views: '',
    likes: '',
    comments: '',
    shares: '',
    bookmarks: '',
  })

  const plan = storage.getContentPlanV2()

  if (!plan) {
    navigate({ to: '/onboarding' })
    return null
  }

  // 计算统计数据
  const stats = useMemo(() => {
    const publishedTopics = plan.topics.filter((t) => t.status === 'published')
    const topicsWithMetrics = publishedTopics.filter((t) => t.metrics)

    let totalViews = 0
    let totalEngagement = 0

    topicsWithMetrics.forEach((t) => {
      if (t.metrics) {
        totalViews += t.metrics.views
        totalEngagement += t.metrics.likes + t.metrics.comments + t.metrics.shares + t.metrics.bookmarks
      }
    })

    const avgEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0

    // 各类型统计
    const typeStats: Record<string, { count: number; avgEngagement: number }> = {}
    plan.topics.forEach((t) => {
      if (!typeStats[t.type]) {
        typeStats[t.type] = { count: 0, avgEngagement: 0 }
      }
      typeStats[t.type].count++
      if (t.metrics) {
        const rate = t.metrics.views > 0
          ? ((t.metrics.likes + t.metrics.comments + t.metrics.shares + t.metrics.bookmarks) / t.metrics.views) * 100
          : 0
        typeStats[t.type].avgEngagement += rate
      }
    })

    // 计算每种类型的平均互动率
    Object.keys(typeStats).forEach((type) => {
      const publishedOfType = plan.topics.filter(
        (t) => t.type === type && t.status === 'published' && t.metrics
      ).length
      if (publishedOfType > 0) {
        typeStats[type].avgEngagement /= publishedOfType
      } else {
        typeStats[type].avgEngagement = 0
      }
    })

    return {
      totalTopics: plan.topics.length,
      publishedCount: publishedTopics.length,
      withMetricsCount: topicsWithMetrics.length,
      totalViews,
      avgEngagementRate,
      typeStats,
    }
  }, [plan.topics])

  const selectedTopic = selectedTopicId
    ? plan.topics.find((t) => t.id === selectedTopicId)
    : null

  const handleSaveMetrics = () => {
    if (!selectedTopicId) return

    const views = parseInt(metricsInput.views) || 0
    const likes = parseInt(metricsInput.likes) || 0
    const comments = parseInt(metricsInput.comments) || 0
    const shares = parseInt(metricsInput.shares) || 0
    const bookmarks = parseInt(metricsInput.bookmarks) || 0

    const engagementRate = views > 0
      ? ((likes + comments + shares + bookmarks) / views) * 100
      : 0

    storage.updateTopicMetrics(selectedTopicId, {
      views,
      likes,
      comments,
      shares,
      bookmarks,
      engagementRate,
    })

    // 清空输入
    setMetricsInput({ views: '', likes: '', comments: '', shares: '', bookmarks: '' })
    setSelectedTopicId(null)
  }

  const maxTypeCount = Math.max(...Object.values(stats.typeStats).map((s) => s.count), 1)

  return (
    <main className="min-h-screen bg-[#faf9f7] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 返回 */}
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] mb-6 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          返回选题列表
        </Link>

        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">数据看板</h1>

        {/* 概览统计 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-[#dc2641]" />
            <span className="font-bold text-[#1a1a1a]">概览</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-[#1a1a1a]">{stats.publishedCount}/{stats.totalTopics}</div>
              <div className="text-sm text-[#6b6b6b]">已发布</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-[#1a1a1a]">{stats.avgEngagementRate.toFixed(2)}%</div>
              <div className="text-sm text-[#6b6b6b]">平均互动率</div>
            </div>
          </div>

          {/* 内容类型分布 */}
          <div className="mb-4">
            <div className="text-sm font-medium text-[#1a1a1a] mb-3">内容类型分布</div>
            <div className="space-y-2">
              {Object.entries(stats.typeStats).map(([type, stat]) => (
                <div key={type} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-[#6b6b6b]">{type}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(stat.count / maxTypeCount) * 100}%`,
                        backgroundColor: TYPE_COLORS[type] || '#6b7280',
                      }}
                    />
                  </div>
                  <div className="w-8 text-sm text-[#6b6b6b] text-right">{stat.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 录入数据 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#dc2641]" />
            <span className="font-bold text-[#1a1a1a]">录入数据</span>
          </div>

          {/* 选择选题 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
              选择已发布的选题
            </label>
            <select
              value={selectedTopicId ?? ''}
              onChange={(e) => {
                const id = e.target.value ? parseInt(e.target.value) : null
                setSelectedTopicId(id)
              }}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
            >
              <option value="">选择一个选题</option>
              {plan.topics
                .filter((t) => t.status === 'published')
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.id + 1} {t.topic} ({t.type})
                  </option>
                ))}
            </select>
          </div>

          {/* 已有数据显示 */}
          {selectedTopic?.metrics && (
            <div className="mb-4 p-4 bg-green-50 rounded-xl">
              <div className="text-sm font-medium text-green-700 mb-2">当前数据</div>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Eye className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[#1a1a1a]">{selectedTopic.metrics.views}</div>
                  <div className="text-xs text-[#6b6b6b]">浏览</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Heart className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[#1a1a1a]">{selectedTopic.metrics.likes}</div>
                  <div className="text-xs text-[#6b6b6b]">点赞</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <MessageCircle className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[#1a1a1a]">{selectedTopic.metrics.comments}</div>
                  <div className="text-xs text-[#6b6b6b]">评论</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Share2 className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[#1a1a1a]">{selectedTopic.metrics.shares}</div>
                  <div className="text-xs text-[#6b6b6b]">分享</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-600">
                    <Bookmark className="w-3 h-3" />
                  </div>
                  <div className="font-bold text-[#1a1a1a]">{selectedTopic.metrics.bookmarks}</div>
                  <div className="text-xs text-[#6b6b6b]">收藏</div>
                </div>
              </div>
            </div>
          )}

          {/* 输入框 */}
          {selectedTopicId && (
            <div className="grid grid-cols-5 gap-3 mb-4">
              <div>
                <label className="block text-xs text-[#6b6b6b] mb-1">浏览</label>
                <input
                  type="number"
                  value={metricsInput.views}
                  onChange={(e) => setMetricsInput({ ...metricsInput, views: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6b6b6b] mb-1">点赞</label>
                <input
                  type="number"
                  value={metricsInput.likes}
                  onChange={(e) => setMetricsInput({ ...metricsInput, likes: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6b6b6b] mb-1">评论</label>
                <input
                  type="number"
                  value={metricsInput.comments}
                  onChange={(e) => setMetricsInput({ ...metricsInput, comments: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6b6b6b] mb-1">分享</label>
                <input
                  type="number"
                  value={metricsInput.shares}
                  onChange={(e) => setMetricsInput({ ...metricsInput, shares: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#6b6b6b] mb-1">收藏</label>
                <input
                  type="number"
                  value={metricsInput.bookmarks}
                  onChange={(e) => setMetricsInput({ ...metricsInput, bookmarks: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
            </div>
          )}

          {selectedTopicId && (
            <Button
              onClick={handleSaveMetrics}
              className="w-full bg-[#dc2641] hover:bg-[#b91c36] text-white"
            >
              保存数据
            </Button>
          )}
        </div>
      </div>
    </main>
  )
}
