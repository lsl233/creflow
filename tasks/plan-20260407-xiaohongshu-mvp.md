# 项目计划: 小红书内容运营助手 MVP

## 概述

- **项目目标**: 构建最小可用产品，帮助用户明确每天发什么内容，快速生成可发布的小红书内容
- **背景**: 小红书创作者常面临"不知道发什么"的痛点，需要一个简单工具帮助选题和生成内容
- **预期成果**: 3个页面的 Web 应用，实现"输入定位 → 生成日历 → 选择一天 → 生成内容 → 复制发布"的核心闭环

## 技术栈

- **前端框架**: TanStack Start + React
- **UI 组件库**: Shadcn UI
- **后端框架**: Hono (Node.js)
- **AI 服务**: MiniMax API
- **存储**: localStorage (MVP 阶段)
- **样式**: Tailwind CSS v4

## 里程碑1: 后端基础
**目标**: 完成 Hono 后端搭建，集成 MiniMax AI，实现内容日历和内容生成两个 API

### 任务列表

- [x] Task-1: 创建后端项目结构和依赖
- [x] Task-2: 配置 Hono 路由和 CORS
- [x] Task-3: 创建 MiniMax AI 客户端封装
- [x] Task-4: 实现 POST /api/content-plan 端点
- [x] Task-5: 实现 POST /api/generate-post 端点
- [x] Task-6: 添加 API 错误处理和日志

#### Task-1: 创建后端项目结构和依赖

- **描述**: 在 apps/backend 中创建 TypeScript 项目结构，安装 Hono、@hono/node-server、minimax SDK 等依赖
- **依赖**: -
- **验收标准**:
  - [x] tsconfig.json 配置正确
  - [x] package.json 包含所有必要依赖
  - [x] src/index.ts 入口文件可运行
  - [x] `pnpm dev` 可启动服务

#### Task-2: 配置 Hono 路由和 CORS

- **描述**: 设置基础路由结构，配置 CORS 支持前端跨域请求
- **依赖**: Task-1
- **验收标准**:
  - [x] CORS 中间件正确配置
  - [x] /api 路由前缀正常工作
  - [x] 健康检查端点 /api/health 可访问

#### Task-3: 创建 MiniMax AI 客户端封装

- **描述**: 创建 MiniMax API 客户端封装，处理认证、请求和响应
- **依赖**: Task-1
- **验收标准**:
  - [x] MiniMaxClient 类正确封装
  - [x] 环境变量 MINIMAX_API_KEY 可配置
  - [x] 支持聊天补全调用
  - [x] 错误处理完善

#### Task-4: 实现 POST /api/content-plan 端点

- **描述**: 实现内容日历生成 API，接收用户输入，使用 MiniMax 生成 7 天内容计划
- **依赖**: Task-2, Task-3
- **验收标准**:
  - [x] 请求体验证 (niche 必填)
  - [x] 返回格式: ContentPlanItem[] 数组
  - [x] 每项包含 day, type, topic, intent
  - [x] type 为 "共鸣" | "记录" | "干货" | "种草" 之一

#### Task-5: 实现 POST /api/generate-post 端点

- **描述**: 实现单篇内容生成 API，根据选题生成标题、正文、标签、图片建议
- **依赖**: Task-2, Task-3
- **验收标准**:
  - [x] 请求体验证 (topic, type, niche 必填)
  - [x] 返回格式: { title, content, tags[], imageSuggestions }
  - [x] 标题 20 字以内
  - [x] 标签 5 个
  - [x] 内容真实、有生活气息

#### Task-6: 添加 API 错误处理和日志

- **描述**: 完善错误处理，添加请求日志，便于调试
- **依赖**: Task-4, Task-5
- **验收标准**:
  - [x] API 错误返回统一格式
  - [x] 关键操作有日志输出
  - [x] MiniMax 调用失败有降级处理

---

## 里程碑2: 前端输入页
**目标**: 完成首页表单，实现与内容日历 API 的对接

### 任务列表

- [x] Task-7: 创建前端项目结构和路由
- [x] Task-8: 安装配置 Shadcn UI 组件库
- [x] Task-9: 实现输入表单组件
- [x] Task-10: 实现表单提交和 API 调用
- [x] Task-11: 添加表单验证和错误提示

#### Task-7: 创建前端项目结构和路由

- **描述**: 在 apps/web 中设置 TanStack Start 项目，创建基础路由结构
- **依赖**: -
- **验收标准**:
  - [x] 路由文件结构符合 TanStack Start 规范
  - [x] / (首页) 路由可访问
  - [x] /calendar (日历页) 路由可访问
  - [x] /generate/:day (生成页) 路由可访问

#### Task-8: 安装配置 Shadcn UI 组件库

- **描述**: 在项目中安装 Shadcn UI，配置 Button、Input、Select 等基础组件
- **依赖**: Task-7
- **验收标准**:
  - [x] shadcn-ui 正确安装
  - [x] Button、Input、Select 组件可用
  - [x] Tailwind CSS 样式正常

#### Task-9: 实现输入表单组件

- **描述**: 创建包含领域输入、目标选择、人设选择、频率输入的表单
- **依赖**: Task-8
- **验收标准**:
  - [x] 领域输入框 (必填，带 label)
  - [x] 目标下拉框 (涨粉 / 变现，默认涨粉)
  - [x] 人设下拉框 (真实 / 专业，默认真实)
  - [x] 频率数字输入 (默认 2)
  - [x] 提交按钮

#### Task-10: 实现表单提交和 API 调用

- **描述**: 表单提交时调用后端 /api/content-plan 接口，跳转到日历页
- **依赖**: Task-9
- **验收标准**:
  - [x] 提交时显示 loading 状态
  - [x] 成功时保存数据到 localStorage
  - [x] 跳转到 /calendar 页面
  - [x] 失败时显示错误提示

#### Task-11: 添加表单验证和错误提示

- **描述**: 添加客户端验证，领域为空时阻止提交
- **依赖**: Task-10
- **验收标准**:
  - [x] 领域为空时显示验证错误
  - [x] 频率最小值为 1
  - [x] 错误信息友好显示

---

## 里程碑3: 内容日历页
**目标**: 实现日历展示页面，支持点击跳转到内容生成页

### 任务列表

- [x] Task-12: 实现日历列表组件
- [x] Task-13: 实现点击交互和路由跳转

#### Task-12: 实现日历列表组件

- **描述**: 从 localStorage 读取内容计划，渲染为可点击的列表
- **依赖**: Task-10
- **验收标准**:
  - [x] 读取并解析 localStorage 中的 contentPlan
  - [x] 列表样式: Day1 [共鸣] 宝宝不吃饭让我崩溃
  - [x] 类型标签使用不同颜色 (共鸣=粉, 干货=蓝, 记录=灰, 种草=绿)
  - [x] 无数据时显示空状态

#### Task-13: 实现点击交互和路由跳转

- **描述**: 点击列表项跳转到内容生成页，传递 day 参数
- **依赖**: Task-12
- **验收标准**:
  - [x] 点击列表项跳转到 /generate/:day
  - [x] 返回按钮可回到首页
  - [x] URL 参数正确传递

---

## 里程碑4: 内容生成页
**目标**: 实现内容生成和展示页面，支持一键复制

### 任务列表

- [x] Task-14: 实现内容生成页面 UI
- [x] Task-15: 调用生成 API 获取内容
- [x] Task-16: 实现复制功能

#### Task-14: 实现内容生成页面 UI

- **描述**: 创建内容展示区域，包含标题、正文、标签、图片建议四个区块
- **依赖**: Task-13
- **验收标准**:
  - [x] 标题区域 (大字号)
  - [x] 正文区域 (支持多行)
  - [x] 标签区域 (横向排列)
  - [x] 图片建议区域
  - [x] 加载中骨架屏

#### Task-15: 调用生成 API 获取内容

- **描述**: 页面加载时调用 /api/generate-post，将结果保存到 localStorage
- **依赖**: Task-14
- **验收标准**:
  - [x] 从 URL 参数获取 day 和 topic
  - [x] 调用 API 并显示 loading
  - [x] 成功保存到 localStorage
  - [x] 失败显示错误和重试按钮

#### Task-16: 实现复制功能

- **描述**: 为标题、正文、标签、全部内容添加复制按钮
- **依赖**: Task-15
- **验收标准**:
  - [x] 复制标题按钮
  - [x] 复制正文按钮
  - [x] 复制标签按钮
  - [x] 复制全部按钮
  - [x] 复制成功显示 toast 提示

---

## 里程碑5: 优化整合
**目标**: 完善状态管理、错误处理和 UI 细节

### 任务列表

- [x] Task-17: 添加全局状态管理和 Loading 状态
- [x] Task-18: 添加错误边界和重试机制
- [x] Task-19: UI/UX 优化和响应式适配
- [x] Task-20: 添加环境变量配置文档

#### Task-17: 添加全局状态管理和 Loading 状态

- **描述**: 实现统一的 Loading 状态管理和全局错误处理
- **依赖**: Task-16
- **验收标准**:
  - [x] API 请求时全局 loading
  - [x] 按钮禁用状态
  - [x] 请求取消处理

#### Task-18: 添加错误边界和重试机制

- **描述**: 添加错误边界组件，API 失败时显示重试按钮
- **依赖**: Task-17
- **验收标准**:
  - [x] 页面级错误边界
  - [x] API 重试按钮
  - [x] 友好错误提示

#### Task-19: UI/UX 优化和响应式适配

- **描述**: 优化移动端显示，完善交互细节
- **依赖**: Task-18
- **验收标准**:
  - [x] 移动端适配
  - [x] 动画过渡
  - [x] 按钮 hover/active 状态

#### Task-20: 添加环境变量配置文档

- **描述**: 编写 .env.example，文档说明如何配置 MiniMax API Key
- **依赖**: Task-19
- **验收标准**:
  - [x] .env.example 文件
  - [x] README.md 更新

---

## 附录

### 风险点

- **MiniMax API 限制**: API 调用可能有速率限制，需要添加请求间隔和重试机制
- **内容质量**: AI 生成的内容可能不符合预期，需要保留优化 Prompt 的余地

### 参考资料

- [TanStack Start 文档](https://tanstack.com/start)
- [Hono 文档](https://hono.dev)
- [Shadcn UI 文档](https://ui.shadcn.com)
- [MiniMax API 文档](https://platform.minimaxi.com/docs/api-reference/text-anthropic-api)

### 变更记录

- 2026-04-07: 初始创建计划
