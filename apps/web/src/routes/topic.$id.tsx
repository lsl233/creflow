import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { storage } from '@/lib/storage'
import { generatePostFn } from '@/functions/content'
import { analyzeAndAdjustStrategyFn } from '@/functions/adjust'
import {
  ArrowLeft,
  Check,
  Sparkles,
  Image,
  Tag,
  FileText,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import type { TopicItem, GeneratedPost, ContentStrategyType } from '@creflow/ai'

export const Route = createFileRoute('/topic/$id')({
  component: TopicDetailPage,
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

function TopicDetailPage() {
  const navigate = useNavigate()
  const params = Route.useParams()
  const topicId = parseInt(params.id, 10)

  const [topic, setTopic] = useState<TopicItem | null>(null)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const [generating, setGenerating] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [publishDate, setPublishDate] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [showAdjustDialog, setShowAdjustDialog] = useState(false)
  const [adjustResult, setAdjustResult] = useState<any>(null)

  const plan = storage.getContentPlanV2()

  useEffect(() => {
    if (!plan) {
      navigate({ to: '/onboarding' })
      return
    }

    const foundTopic = plan.topics.find((t) => t.id === topicId)
    if (!foundTopic) {
      navigate({ to: '/topics' })
      return
    }

    setTopic(foundTopic)
  }, [plan, topicId, navigate])

  if (!topic) {
    return (
      <main className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#dc2641]" />
      </main>
    )
  }

  const colors = TYPE_COLORS[topic.type] || { bg: 'bg-gray-100', text: 'text-gray-700' }

  const handleGeneratePost = async () => {
    if (!plan) return

    setGenerating(true)
    try {
      const result = await generatePostFn({
        data: {
          topic: topic.topic,
          type: topic.type,
          niche: plan.accountProfile.niche,
        },
      })

      if (result.success && result.data) {
        setGeneratedPost(result.data as GeneratedPost)
      }
    } catch (err) {
      console.error('Failed to generate post:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleMarkPublished = () => {
    if (!topic) return

    storage.markTopicPublished(topic.id, publishDate || undefined)
    setShowPublishDialog(false)

    // 刷新数据
    const updatedPlan = storage.getContentPlanV2()
    if (updatedPlan) {
      const updatedTopic = updatedPlan.topics.find((t) => t.id === topic.id)
      if (updatedTopic) {
        setTopic(updatedTopic)
      }
    }
  }

  const handleAdjustStrategy = async () => {
    if (!plan || !topic) return

    setAdjusting(true)
    try {
      const result = await analyzeAndAdjustStrategyFn({
        data: {
          currentTopicId: topic.id,
          topics: plan.topics,
          accountProfile: plan.accountProfile,
        },
      })

      if (result.success && result.data) {
        setAdjustResult(result.data)
        setShowAdjustDialog(true)
      }
    } catch (err) {
      console.error('Failed to adjust strategy:', err)
    } finally {
      setAdjusting(false)
    }
  }

  const handleConfirmAdjust = () => {
    if (!adjustResult) return

    // 合并新选题（保留已发布的）
    const updatedTopics = plan.topics.map((t) => {
      if (t.status === 'published') return t
      const newTopic = adjustResult.newTopics.find((nt: any) => nt.id === t.id)
      return newTopic || t
    })

    // 更新计划
    plan.topics = updatedTopics
    plan.strategy = adjustResult.newStrategy
    plan.version += 1
    storage.saveContentPlanV2(plan)

    setShowAdjustDialog(false)
    setAdjustResult(null)

    // 跳转到选题列表
    navigate({ to: '/topics' })
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 text-[#6b6b6b] hover:text-[#1a1a1a] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回选题列表
        </Link>

        {/* 选题信息 */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
            >
              {topic.type}
            </span>
            {topic.status === 'published' && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 flex items-center gap-1">
                <Check className="w-4 h-4" />
                已发布
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-[#1a1a1a] mb-2">{topic.topic}</h1>
          <p className="text-[#6b6b6b] mb-4">{topic.intent}</p>

          {/* 内容大纲 */}
          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#6b6b6b]" />
              <span className="font-medium text-[#1a1a1a]">内容大纲</span>
            </div>
            <p className="text-sm text-[#6b6b6b]">{topic.contentOutline}</p>
          </div>

          {/* 配图建议 */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-[#6b6b6b]" />
              <span className="font-medium text-[#1a1a1a]">配图建议</span>
            </div>
            <p className="text-sm text-[#6b6b6b]">{topic.imageSuggestion}</p>
          </div>
        </div>

        {/* AI 生成正文 */}
        {generatedPost ? (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#dc2641]" />
              <span className="font-bold text-[#1a1a1a]">生成的内容</span>
            </div>

            {/* 标题 */}
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">{generatedPost.title}</h2>

            {/* 正文 */}
            <div className="prose prose-sm max-w-none mb-4">
              <p className="text-[#1a1a1a] whitespace-pre-wrap">{generatedPost.content}</p>
            </div>

            {/* 标签 */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[#6b6b6b]" />
                <span className="font-medium text-[#1a1a1a]">标签</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-[#6b6b6b] text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Button
            onClick={handleGeneratePost}
            disabled={generating}
            className="w-full h-12 rounded-xl bg-[#dc2641] hover:bg-[#b91c36] text-white mb-6"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                生成中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI 生成正文
              </span>
            )}
          </Button>
        )}

        {/* 操作按钮 */}
        {topic.status === 'pending' && (
          <>
            <Button
              onClick={() => {
                setPublishDate(new Date().toISOString().split('T')[0])
                setShowPublishDialog(true)
              }}
              className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white mb-3"
            >
              <Check className="w-5 h-5 mr-2" />
              标记已发布
            </Button>
            <Button
              onClick={handleAdjustStrategy}
              disabled={adjusting}
              variant="outline"
              className="w-full h-12 rounded-xl border-[#dc2641] text-[#dc2641] hover:bg-[#dc2641]/5"
            >
              {adjusting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  分析中...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  调整策略
                </span>
              )}
            </Button>
          </>
        )}

        {/* 发布日期对话框 */}
        {showPublishDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">标记已发布</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  发布日期
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dc2641]"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPublishDialog(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleMarkPublished}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  确认
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 策略调整对话框 */}
        {showAdjustDialog && adjustResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">策略调整建议</h3>

              {/* 分析结果 */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="font-medium text-[#1a1a1a] mb-2">内容类型表现分析</div>
                <div className="space-y-2">
                  {Object.entries(adjustResult.analysis.typePerformance)
                    .sort((a: any, b: any) => b[1].avgRate - a[1].avgRate)
                    .map(([type, perf]: [string, any]) => (
                      <div key={type} className="flex justify-between text-sm">
                        <span className="text-[#6b6b6b]">{type}</span>
                        <span className="font-medium text-[#1a1a1a]">
                          {perf.avgRate.toFixed(2)}% 互动率
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* 推荐策略 */}
              <div className="mb-6 p-4 bg-[#dc2641]/5 rounded-xl">
                <div className="font-medium text-[#1a1a1a] mb-2">推荐策略调整</div>
                <div className="text-2xl font-bold text-[#dc2641] mb-1">
                  {adjustResult.newStrategy}
                </div>
                <p className="text-sm text-[#6b6b6b]">{adjustResult.reasoning}</p>
              </div>

              {/* 替代策略 */}
              {adjustResult.recommendations.length > 1 && (
                <div className="mb-6">
                  <div className="font-medium text-[#1a1a1a] mb-2">其他推荐策略</div>
                  <div className="space-y-2">
                    {adjustResult.recommendations
                      .filter((r: any) => r.strategy !== adjustResult.newStrategy)
                      .slice(0, 2)
                      .map((rec: any) => (
                        <div key={rec.strategy} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                          <span className="font-medium text-[#1a1a1a]">{rec.strategy}</span>
                          <span className="text-[#6b6b6b]">{rec.reason}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 影响范围 */}
              <div className="mb-6 p-4 bg-orange-50 rounded-xl">
                <div className="text-sm text-orange-800">
                  此操作将从 #{topic.id + 1} 开始重新生成后续所有选题，
                  已发布的 {plan.topics.filter((t) => t.status === 'published').length} 篇内容将保留。
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAdjustDialog(false)
                    setAdjustResult(null)
                  }}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  onClick={handleConfirmAdjust}
                  className="flex-1 bg-[#dc2641] hover:bg-[#b91c36] text-white"
                >
                  确认调整
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
