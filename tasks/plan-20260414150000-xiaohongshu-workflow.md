# 项目计划: 小红书业务流程重构

## 概述

- **项目目标**: 重构为完整的"策略→执行→反馈→优化"闭环，支持 30 天和 7 天两种生成模式
- **背景**: 现有系统功能过于简化，无法支撑账号成长全流程
- **预期成果**: 目标赛道选择、账号状态诊断、内容策略匹配、选题批量生成、发布追踪、数据反馈、手动策略调整

## 技术栈

- **语言**: TypeScript
- **前端框架**: TanStack Start (React)
- **AI 集成**: `@creflow/ai` (MiniMax API)
- **存储**: localStorage (客户端)
- **样式**: Tailwind CSS v4

---

## 里程碑1: 数据模型与 AI Prompt 重构

**目标**: 定义新数据模型，两种生成模式

### 任务列表

- [x] Task-1: 定义核心数据模型
- [x] Task-2: 新增账号诊断 Prompt
- [x] Task-3: 新增内容策略推荐 Prompt
- [x] Task-4: 新增选题批量生成 Prompt（支持 30天/7天切换）

#### Task-1: 定义核心数据模型

- **描述**: 在 `packages/ai/src/types.ts` 中定义：

  ```ts
  // 账号档案
  interface AccountProfile {
    niche: string
    followers: '0-100' | '100-1000' | '1000+'
    postsCount: '0' | '1-10' | '10+'
    hasViralPost: boolean
    status: 'new' | 'growing' | 'established'
  }

  // 内容策略类型
  type ContentStrategyType =
    | 'professional' | 'humorous' | 'emotional'
    | 'educational' | 'authentic' | 'review' | 'vlog'

  // 内容类型
  type ContentType =
    | '共鸣' | '记录' | '干货' | '种草'
    | '测评' | '教程' | 'vlog式'

  // 单个选题
  interface TopicItem {
    id: number
    type: ContentType
    topic: string
    intent: string
    contentOutline: string
    imageSuggestion: string
    status: 'pending' | 'published'
    publishedAt?: string
    metrics?: PostMetrics
  }

  // 内容数据
  interface PostMetrics {
    views: number
    likes: number
    comments: number
    shares: number
    bookmarks: number
    engagementRate: number
  }

  // 内容计划
  interface ContentPlan {
    accountProfile: AccountProfile
    strategy: ContentStrategyType
    topics: TopicItem[]
    planType: '30days' | '7days'
    createdAt: string
    version: number
  }
  ```

- **依赖**: -
- **验收标准**:
  - [x] 类型定义完整
  - [x] TypeScript 编译无错误

---

#### Task-2: 新增账号诊断 Prompt

- **描述**: 新增 `packages/ai/src/prompts/account-diagnosis.ts`
  - 输入: `AccountProfile`
  - 输出: `status`（new/growing/established）+ 判断理由
  - 判断逻辑：粉丝量 + 发布历史 + 爆款经历 综合评分

- **依赖**: Task-1
- **验收标准**:
  - [x] 输出结构正确
  - [x] 判断逻辑合理

---

#### Task-3: 新增内容策略推荐 Prompt

- **描述**: 新增 `packages/ai/src/prompts/strategy-recommend.ts`
  - 输入: `AccountProfile`（含 status）
  - 输出: `ContentStrategyType[]`，每个附推荐理由
  - 策略类型: professional, humorous, emotional, educational, authentic, review, vlog

- **依赖**: Task-1, Task-2
- **验收标准**:
  - [x] 输出策略列表含说明
  - [x] 策略与账号状态匹配

---

#### Task-4: 新增选题批量生成 Prompt

- **描述**: 新增 `packages/ai/src/prompts/topic-batch.ts`
  - 输入: `niche`, `strategy`, `count`（7 或 30）
  - 输出: `TopicItem[]`，按内容类型均衡分配
  - 30天模式: 30 个选题，类型均匀分布
  - 7天模式: 7 个选题，每种类型可选
  - 每条包含: `type`, `topic`, `intent`, `contentOutline`, `imageSuggestion`

- **依赖**: Task-1, Task-3
- **验收标准**:
  - [x] 支持 count=7 和 count=30
  - [x] 内容类型分布均衡
  - [x] 选题按顺序排列

---

## 里程碑2: 前端页面重构

**目标**: 新增/重构页面支持完整工作流

### 任务列表

- [x] Task-5: 重构首页 `/` 为引导入口
- [x] Task-6: 新增账号诊断页 `/onboarding`
- [x] Task-7: 新增策略选择页 `/strategy`
- [x] Task-8: 重构日历/选题列表页 `/topics`

#### Task-5: 重构首页 `/`

- **描述**:
  - 判断 localStorage 有无 ContentPlan
  - 有 → 跳转 `/topics`
  - 无 → 跳转 `/onboarding`
  - 落地页展示产品价值主张

- **依赖**: Task-1
- **验收标准**:
  - [x] 路由判断逻辑正确
  - [x] 落地页 UI 符合产品定位

---

#### Task-6: 新增账号诊断页 `/onboarding`

- **描述**: 三步引导：

  **Step 1**: 目标赛道选择（预设+自定义）

  **Step 2**: 账号状态诊断
  - 问题：粉丝量、已发篇数、有无爆款
  - 调用 diagnosisFn 获取 status

  **Step 3**: 确认进入策略选择

- **依赖**: Task-2
- **验收标准**:
  - [x] `/onboarding` 可访问
  - [x] 诊断问题逻辑正确
  - [x] 结果存入 localStorage

---

#### Task-7: 新增策略选择页 `/strategy`

- **描述**:
  - 展示 AI 推荐策略列表
  - 用户选择策略
  - 选择生成模式：30天 / 7天
  - 调用 generateTopicBatchFn 生成选题
  - 完成后跳转 `/topics`

- **依赖**: Task-3, Task-4, Task-6
- **验收标准**:
  - [x] 策略列表正确展示
  - [x] 生成模式可选
  - [x] 生成完成后跳转

---

#### Task-8: 重构日历/选题列表页 `/topics`

- **描述**:
  - 顶部：策略信息（类型、创建时间、版本）
  - 主体：选题列表（按顺序 1-N）
  - 卡片内容：序号、类型标签、标题、状态
  - 操作：查看详情、标记已发布
  - 筛选：全部/待发布/已发布

- **依赖**: Task-5, Task-7
- **验收标准**:
  - [x] 选题列表正确渲染
  - [x] 状态筛选正常
  - [x] 状态显示正确

---

## 里程碑3: 选题详情与发布

**目标**: 选题详情查看、完整内容生成、发布记录

### 任务列表

- [x] Task-9: 新增选题详情页 `/topics/$id`
- [x] Task-10: AI 生成完整正文
- [x] Task-11: 标记已发布功能

#### Task-9: 新增选题详情页 `/topics/$id`

- **描述**:
  - 展示选题完整信息
  - 内容大纲、图片建议
  - AI 生成的正文章节
  - 操作按钮：生成正文、标记已发布、调整策略

- **依赖**: Task-8
- **验收标准**:
  - [x] 路径 `/topics/0` 等可访问
  - [x] 信息完整展示

---

#### Task-10: AI 生成完整正文

- **描述**: 调用 generatePostFn 生成完整帖子
  - 标题（20字内）
  - 正文（200-500字）
  - 标签建议
  - 配图建议
  - 在详情页展示

- **依赖**: Task-9
- **验收标准**:
  - [x] 生成功能正常
  - [x] 结果正确展示

---

#### Task-11: 标记已发布功能

- **描述**:
  - 弹窗录入：发布时间
  - 保存后更新选题状态为 published
  - 记录 publishedAt

- **依赖**: Task-9
- **验收标准**:
  - [x] 弹窗正常
  - [x] 状态更新正确

---

## 里程碑4: 数据反馈与策略调整

**目标**: 数据录入、策略调整（重塑当前及后续选题）

### 任务列表

- [x] Task-12: 新增数据看板 `/dashboard`
- [x] Task-13: 手动录入数据
- [x] Task-14: 策略调整触发器

#### Task-12: 新增数据看板 `/dashboard`

- **描述**:
  - 总发布数、平均互动率
  - 各内容类型对比
  - 数据录入入口

- **依赖**: Task-11
- **验收标准**:
  - [x] `/dashboard` 可访问
  - [x] 数据概览正确

---

#### Task-13: 手动录入数据

- **描述**:
  - 选择已发布选题
  - 录入 views, likes, comments, shares, bookmarks
  - 自动计算 engagementRate
  - 保存到选题

- **依赖**: Task-12
- **验收标准**:
  - [x] 录入功能正常
  - [x] 计算正确

---

#### Task-14: 策略调整触发器

- **描述**: "调整策略"按钮流程：

  1. 收集已发布内容的 metrics
  2. 调用 AI 分析（哪些类型表现好/差）
  3. 展示策略调整建议
  4. 用户确认后：
     - 保留当前选题不变
     - 从当前选题序号开始重新生成后续选题
     - 版本号 +1

- **依赖**: Task-9, Task-13
- **验收标准**:
  - [x] 按钮在详情页可见
  - [x] 分析结果正确展示
  - [x] 确认后重塑后续选题
  - [x] 已发布内容保留不变

---

## 里程碑5: 收尾

### 任务列表

- [x] Task-15: 移动端适配
- [x] Task-16: 空状态与错误处理
- [x] Task-17: 文档更新

#### Task-15: 移动端适配

- **描述**: 响应式优化，适配手机访问

- **依赖**: Task-8, Task-12
- **验收标准**:
  - [x] 移动端正常显示
  - [x] 无横向溢出

---

#### Task-16: 空状态与错误处理

- **描述**: 完善边界情况

- **依赖**: Task-8, Task-14
- **验收标准**:
  - [x] 空状态有引导
  - [x] AI 错误可重试

---

#### Task-17: 文档更新

- **描述**: 更新 CLAUDE.md

- **依赖**: Task-15, Task-16
- **验收标准**:
  - [x] 架构说明更新

---

## 附录

### 选题类型分布

| ContentType | 30天数量 | 7天数量 |
|-------------|----------|---------|
| 共鸣 | 4-5 | 1 |
| 记录 | 4-5 | 1 |
| 干货 | 4-5 | 1 |
| 种草 | 4-5 | 1 |
| 测评 | 3-4 | 1 |
| 教程 | 4-5 | 1 |
| vlog式 | 3-4 | 1 |

### 风险点

| 风险 | 应对 |
|------|------|
| 30 个选题一次性生成 token 超限 | 分批生成，每批 10 个 |
| AI 生成质量不稳定 | 增加多样性校验，提供重试 |

### 变更记录

- 2026/04/14: 初始计划，完全重构，支持 30天/7天两种模式
