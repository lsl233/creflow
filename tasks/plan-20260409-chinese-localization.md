# 项目计划: 文案中文本地化

## 概述
- **项目目标**: 将小红书内容助手产品的所有英文界面文案调整为中文，提升本土用户体验
- **背景**: 产品面向中文用户（小红书创作者），但当前界面存在大量英文文案，需要统一中文化
- **预期成果**: 所有用户可见的界面文案均为地道中文表达

## 技术栈
- **语言**: TypeScript / React
- **框架**: TanStack Start
- **样式**: Tailwind CSS
- **UI组件**: shadcn/ui

## 任务列表

- [ ] Task-1: 首页 (index.tsx) 文案中文化
- [ ] Task-2: 设置页 (setup.tsx) 文案中文化
- [ ] Task-3: 日历页 (calendar.tsx) 文案中文化
- [ ] Task-4: 日历视图组件 (CalendarView.tsx) 文案中文化
- [ ] Task-5: 内容生成页 (generate.$day.tsx) 文案检查与补充

---

#### Task-1: 首页 (index.tsx) 文案中文化
- **描述**: 将首页所有英文文案翻译为中文，包括 Hero 区域、功能介绍等
- **依赖**: -
- **验收标准**:
  - [ ] Badge 文字 "AI-Powered Xiaohongshu Growth" → "AI 驱动的小红书增长"
  - [ ] 主标题 "10x Your Xiaohongshu Content" → "让你的小红书内容 10 倍出彩"
  - [ ] 副标题 "Stop staring at a blank page..." → 中文描述
  - [ ] 输入框占位符 "What is your account about?..." → "你的账号定位是什么？..."
  - [ ] 按钮文字 "Start Creating" → "开始创作"
  - [ ] 小字 "No credit card required..." → "无需信用卡，立即开始生成"
  - [ ] 功能区标题 "Everything you need to go viral" → "助你爆红的一切"
  - [ ] 三个功能卡片标题和描述全部中文化

---

#### Task-2: 设置页 (setup.tsx) 文案中文化
- **描述**: 将账号设置页面的表单标签、描述文字翻译为中文
- **依赖**: Task-1
- **验收标准**:
  - [ ] "Step 2 of 3" → "第 2 步，共 3 步"
  - [ ] "Flesh out your profile" → "完善你的账号信息"
  - [ ] 页面描述中文化
  - [ ] 三个检查项描述中文化
  - [ ] "Account Details" → "账号详情"
  - [ ] "Refine your Xiaohongshu persona." → "完善你的小红书人设。"
  - [ ] "Positioning / Niche" → "定位 / 领域"
  - [ ] "Target Audience" → "目标受众"
  - [ ] "Content Tone" → "内容风格"
  - [ ] "Optional" → "可选"
  - [ ] 所有 placeholder 中文化
  - [ ] "Generate Content Calendar" → "生成内容日历"

---

#### Task-3: 日历页 (calendar.tsx) 文案中文化
- **描述**: 将日历页面标题和描述翻译为中文
- **依赖**: Task-2
- **验收标准**:
  - [ ] "Your Content Calendar" → "你的内容日历"
  - [ ] "Review your 7-day plan and generate posts." → "查看你的 7 天计划并生成笔记。"

---

#### Task-4: 日历视图组件 (CalendarView.tsx) 文案中文化
- **描述**: 将日历视图组件中的加载提示、空状态、按钮文字翻译为中文
- **依赖**: Task-3
- **验收标准**:
  - [ ] "Generating your content calendar..." → "正在生成内容日历..."
  - [ ] "Failed to generate content" → "内容生成失败"
  - [ ] "Try Again" → "重试"
  - [ ] "No Content Plan" → "暂无内容计划"
  - [ ] 空状态描述中文化
  - [ ] "Get Started" → "开始使用"
  - [ ] "Your 7-Day Content Calendar" → "你的 7 天内容日历"
  - [ ] "Click on any day to generate detailed content" → "点击任意一天生成详细内容"
  - [ ] "New Calendar" → "新建日历"

---

#### Task-5: 内容生成页 (generate.$day.tsx) 文案检查与补充
- **描述**: 检查内容生成页面，补充完善中文文案（该页面大部分已是中文，需检查是否有遗漏）
- **依赖**: Task-4
- **验收标准**:
  - [ ] 检查所有错误提示文案
  - [ ] 检查所有按钮文字
  - [ ] 确保中英文混合使用处符合产品风格
  - [ ] 检查加载状态文案

## 附录

### 翻译原则
1. **保持品牌调性**: 使用亲切、有活力的中文表达，符合小红书创作者工具的定位
2. **简洁明了**: 避免过长翻译，保持界面简洁
3. **一致性**: 相同概念使用统一译法（如 "Generate" 统一译为 "生成"）
4. **用户视角**: 使用创作者熟悉的术语（如 "笔记" 而非 "帖子"）

### 关键术语对照表
| 英文 | 中文 |
|------|------|
| Content Calendar | 内容日历 |
| Niche | 领域 / 定位 |
| Generate | 生成 |
| Viral | 爆款 / 走红 |
| Post | 笔记 |
| Target Audience | 目标受众 |
| Content Tone | 内容风格 |

### 风险点
- **过度翻译**: 某些英文术语（如 AI、OK）在中文互联网产品中可保留英文
- **长度差异**: 中文表达可能比英文长，需检查 UI 是否因此变形

### 变更记录
- 2026-04-09: 创建计划
