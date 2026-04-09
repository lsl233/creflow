# 项目计划: AI 共享包架构重构

## 概述
- **项目目标**: 将 AI 功能从 backend 抽离到共享包，使 web 和 backend 都能直接调用，同时建立统一的配置中心
- **背景**: 当前 AI 逻辑仅在 backend 中，web 需要通过 HTTP 调用 backend API。这种架构增加了网络开销，且配置分散在两个应用中
- **预期成果**:
  - packages/ai: 可复用的 AI 客户端和 prompt 模板
  - packages/config: 统一的配置管理和验证
  - backend: 重构后使用共享包
  - web: 使用 server function 直接调用 AI

## 技术栈
- **语言**: TypeScript
- **包管理**: pnpm workspace
- **配置验证**: Zod
- **AI 服务**: MiniMax API
- **后端框架**: Hono
- **前端框架**: TanStack Start

---

## 里程碑 1: 基础设施搭建
**目标**: 创建 packages/config 和 packages/ai 两个共享包，建立基础结构

### 任务列表
- [ ] Task-1: 创建 packages/config 配置中心
- [ ] Task-2: 创建 packages/ai 共享包结构
- [ ] Task-3: 配置根目录环境变量

#### Task-1: 创建 packages/config 配置中心
- **描述**: 创建统一的配置管理包，支持服务端和客户端配置分离，使用 Zod 进行运行时验证
- **依赖**: -
- **验收标准**:
  - [ ] 创建 `packages/config/package.json`，正确配置 pnpm workspace 依赖
  - [ ] 创建 `packages/config/src/index.ts` 导出通用配置
  - [ ] 创建 `packages/config/src/server.ts` 导出服务端配置（含 AI 密钥等敏感信息）
  - [ ] 创建 `packages/config/src/schema.ts` 定义 Zod 验证 schema
  - [ ] 配置 tsconfig.json 支持 TypeScript 编译
  - [ ] 支持从 monorepo 根目录加载 `.env` 文件

#### Task-2: 创建 packages/ai 共享包结构
- **描述**: 创建 AI 功能共享包，封装 MiniMax 客户端和 prompt 模板
- **依赖**: Task-1
- **验收标准**:
  - [ ] 创建 `packages/ai/package.json`，依赖 `@creflow/config`
  - [ ] 创建 `packages/ai/src/client.ts` 封装 MiniMaxClient 类
  - [ ] 创建 `packages/ai/src/prompts/` 目录存放 prompt 模板
  - [ ] 创建 `packages/ai/src/types.ts` 定义 AI 相关类型
  - [ ] 创建 `packages/ai/src/index.ts` 统一导出
  - [ ] 配置 tsconfig.json

#### Task-3: 配置根目录环境变量
- **描述**: 将环境变量统一到 monorepo 根目录，移除 apps 级别的重复配置
- **依赖**: Task-1
- **验收标准**:
  - [ ] 在根目录创建 `.env` 文件，包含 MiniMax 相关配置
  - [ ] 在根目录创建 `.env.example` 作为模板
  - [ ] 更新 `.gitignore` 确保 `.env` 不被提交
  - [ ] 验证配置能从根目录正确加载到 packages/config

---

## 里程碑 2: AI 逻辑迁移
**目标**: 将现有 AI 逻辑从 backend 迁移到 packages/ai

### 任务列表
- [ ] Task-4: 迁移 MiniMax 客户端
- [ ] Task-5: 迁移 Prompt 模板
- [ ] Task-6: 封装 AI 功能函数

#### Task-4: 迁移 MiniMax 客户端
- **描述**: 将 `apps/backend/src/lib/minimax.ts` 迁移到 packages/ai，并适配新的配置方式
- **依赖**: Task-2
- **验收标准**:
  - [ ] 复制 `MiniMaxClient` 类到 `packages/ai/src/client.ts`
  - [ ] 修改构造函数，接收配置对象而非直接读取 process.env
  - [ ] 保留错误处理逻辑（MiniMaxError 类）
  - [ ] 添加工厂函数 `createAIClient(config)` 便于创建实例
  - [ ] 添加类型导出

#### Task-5: 迁移 Prompt 模板
- **描述**: 将 content-plan 和 generate-post 中的 prompt 提取为可复用模板
- **依赖**: Task-4
- **验收标准**:
  - [ ] 创建 `packages/ai/src/prompts/content-plan.ts`，包含内容日历生成的 prompt
  - [ ] 创建 `packages/ai/src/prompts/generate-post.ts`，包含单篇内容生成的 prompt
  - [ ] 创建 `packages/ai/src/prompts/index.ts` 统一导出
  - [ ] Prompt 模板支持参数化（如领域、目标、人设等）
  - [ ] 保持与原有 prompt 内容一致

#### Task-6: 封装 AI 功能函数
- **描述**: 创建高阶函数，封装完整的 AI 调用流程
- **依赖**: Task-4, Task-5
- **验收标准**:
  - [ ] 创建 `generateContentPlan(params)` 函数，返回内容日历
  - [ ] 创建 `generatePost(params)` 函数，返回单篇内容
  - [ ] 函数内部处理 AI 调用和响应解析
  - [ ] 添加适当的错误处理和日志
  - [ ] 导出函数类型定义

---

## 里程碑 3: Backend 重构
**目标**: 使用共享包重构 backend，保持 API 兼容性

### 任务列表
- [ ] Task-7: 更新 backend 依赖
- [ ] Task-8: 重构 content-plan 路由
- [ ] Task-9: 重构 generate-post 路由
- [ ] Task-10: 测试 backend API

#### Task-7: 更新 backend 依赖
- **描述**: 在 backend 中添加对共享包的依赖
- **依赖**: Task-2
- **验收标准**:
  - [ ] 在 `apps/backend/package.json` 添加 `"@creflow/ai": "workspace:*"`
  - [ ] 在 `apps/backend/package.json` 添加 `"@creflow/config": "workspace:*"`
  - [ ] 运行 `pnpm install` 确保依赖正确链接
  - [ ] 删除 `apps/backend/src/lib/minimax.ts`（已迁移到共享包）

#### Task-8: 重构 content-plan 路由
- **描述**: 使用 packages/ai 重构内容日历生成接口
- **依赖**: Task-6, Task-7
- **验收标准**:
  - [ ] 更新 `apps/backend/src/routes/content-plan.ts`
  - [ ] 使用 `generateContentPlan` 替代直接调用 MiniMaxClient
  - [ ] 从 `@creflow/config/server` 导入配置
  - [ ] 保持 API 端点路径和响应格式不变
  - [ ] 保留原有的错误处理和降级逻辑

#### Task-9: 重构 generate-post 路由
- **描述**: 使用 packages/ai 重构单篇内容生成接口
- **依赖**: Task-6, Task-7
- **验收标准**:
  - [ ] 更新 `apps/backend/src/routes/generate-post.ts`
  - [ ] 使用 `generatePost` 替代直接调用 MiniMaxClient
  - [ ] 从 `@creflow/config/server` 导入配置
  - [ ] 保持 API 端点路径和响应格式不变
  - [ ] 保留原有的错误处理和降级逻辑

#### Task-10: 测试 backend API
- **描述**: 确保重构后的 backend API 功能正常
- **依赖**: Task-8, Task-9
- **验收标准**:
  - [ ] 启动 backend 服务无报错
  - [ ] 调用 `POST /api/content-plan` 正常返回内容日历
  - [ ] 调用 `POST /api/generate-post` 正常返回生成内容
  - [ ] 验证降级逻辑在 AI 服务不可用时正常工作

---

## 里程碑 4: Web 迁移到 Server Function
**目标**: 将 web 从 fetch 调用 backend 改为使用 createServerFn 直接调用 AI

### 任务列表
- [ ] Task-11: 创建 Server Functions
- [ ] Task-12: 重构 Calendar 页面
- [ ] Task-13: 重构 Generate 页面
- [ ] Task-14: 删除旧的 API 客户端

#### Task-11: 创建 Server Functions
- **描述**: 在 web 中创建 server functions，直接调用 packages/ai
- **依赖**: Task-6
- **验收标准**:
  - [ ] 创建 `apps/web/src/functions/content.ts`
  - [ ] 使用 `createServerFn` 创建 `generateContentPlanFn`
  - [ ] 使用 `createServerFn` 创建 `generatePostFn`
  - [ ] 在 server function 中导入 `@creflow/ai` 和 `@creflow/config/server`
  - [ ] 添加适当的错误处理

#### Task-12: 重构 Calendar 页面
- **描述**: 更新 calendar 页面使用 server function 而非 API 调用
- **依赖**: Task-11
- **验收标准**:
  - [ ] 更新 `apps/web/src/components/CalendarView.tsx`
  - [ ] 将 `api.generateContentPlan()` 改为调用 `generateContentPlanFn()`
  - [ ] 移除对 `apps/web/src/lib/api.ts` 的依赖
  - [ ] 页面功能保持正常

#### Task-13: 重构 Generate 页面
- **描述**: 更新 generate 页面使用 server function 而非 API 调用
- **依赖**: Task-11
- **验收标准**:
  - [ ] 更新 `apps/web/src/routes/generate.$day.tsx`
  - [ ] 将 `api.generatePost()` 改为调用 `generatePostFn()`
  - [ ] 移除对 `apps/web/src/lib/api.ts` 的依赖
  - [ ] 页面功能保持正常

#### Task-14: 删除旧的 API 客户端
- **描述**: 清理 web 中不再使用的 API 客户端代码
- **依赖**: Task-12, Task-13
- **验收标准**:
  - [ ] 删除 `apps/web/src/lib/api.ts`
  - [ ] 检查并删除其他对 backend API 的直接调用
  - [ ] 更新 `apps/web/.env`（如有 web 特有配置则保留，否则删除重复项）
  - [ ] 确保 web 构建无错误

---

## 里程碑 5: 验证与清理
**目标**: 确保整个系统正常工作，清理临时文件

### 任务列表
- [ ] Task-15: 端到端测试
- [ ] Task-16: 文档更新

#### Task-15: 端到端测试
- **描述**: 完整测试从 web 到 AI 服务的调用链路
- **依赖**: Task-10, Task-14
- **验收标准**:
  - [ ] 在 setup 页面填写参数后跳转到 calendar
  - [ ] calendar 页面正确生成内容日历
  - [ ] 点击某一天进入 generate 页面正确生成内容
  - [ ] 断网/AI 服务异常时显示降级提示
  - [ ] 检查 pnpm dev 能同时启动所有服务

#### Task-16: 文档更新
- **描述**: 更新项目文档，说明新的架构和配置方式
- **依赖**: Task-15
- **验收标准**:
  - [ ] 更新 CLAUDE.md 中的架构说明
  - [ ] 在根目录 README.md 中添加配置说明
  - [ ] 记录环境变量配置要求
  - [ ] 说明 packages/ai 和 packages/config 的使用方法

---

## 附录

### 文件结构（目标状态）

```
creflow/
├── .env                          # 统一的环境变量
├── .env.example
├── packages/
│   ├── ai/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── index.ts          # 统一导出
│   │   │   ├── client.ts         # MiniMaxClient 封装
│   │   │   ├── types.ts          # AI 类型定义
│   │   │   └── prompts/
│   │   │       ├── index.ts
│   │   │       ├── content-plan.ts
│   │   │       └── generate-post.ts
│   │   └── tsconfig.json
│   └── config/
│       ├── package.json
│       ├── src/
│       │   ├── index.ts          # 通用配置
│       │   ├── server.ts         # 服务端配置
│       │   └── schema.ts         # Zod schema
│       └── tsconfig.json
├── apps/
│   ├── backend/
│   │   └── src/
│   │       └── routes/
│   │           ├── content-plan.ts   # 使用 @creflow/ai
│   │           └── generate-post.ts  # 使用 @creflow/ai
│   └── web/
│       └── src/
│           └── functions/
│               └── content.ts        # createServerFn
```

### 依赖关系图

```
packages/config (基础层)
    ↑
packages/ai (依赖 config)
    ↑
apps/backend, apps/web (依赖 ai 和 config)
```

### 风险点
- **环境变量加载**: 需要确保 packages/config 能从根目录正确加载 .env，可能涉及 __dirname 计算
- **TanStack Start SSR**: 需要确保 server functions 中的环境变量在 SSR 时可用
- **类型导出**: 确保 packages/ai 和 packages/config 的类型能被正确导出和使用
- **向后兼容**: 重构期间保持 API 响应格式不变，避免前端解析错误

### 配置示例（.env）
```
# AI 配置
MINIMAX_API_KEY=your-api-key-here
MINIMAX_BASE_URL=https://api.minimaxi.chat/v1
MINIMAX_MODEL=MiniMax-Text-01

# 服务端配置
NODE_ENV=development
PORT=3001
```
