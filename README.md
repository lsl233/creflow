# 小红书内容助手

AI 驱动的小红书内容创作工具，帮助创作者快速生成内容日历和发布文案。

## 功能特点

- 🎯 输入内容定位，AI 自动生成 7 天内容日历
- ✨ 支持多种内容类型：共鸣、记录、干货、种草
- 📋 一键生成标题、正文、标签和图片建议
- 📋 一键复制内容，方便发布

## 技术栈

- **前端**: TanStack Start + React + Tailwind CSS v4
- **后端**: Hono + TypeScript
- **AI**: MiniMax Text-01

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

后端需要配置 MiniMax API Key：

```bash
cp apps/backend/.env.example apps/backend/.env
```

编辑 `.env` 文件，填入你的 API Key：
```
MINIMAX_API_KEY=your_api_key_here
```

获取 API Key: https://platform.minimaxi.com/

### 3. 启动开发服务器

```bash
pnpm dev
```

这会同时启动：
- 前端: http://localhost:3000
- 后端: http://localhost:3001

### 4. 开始使用

1. 在首页输入你的内容定位
2. 选择目标（涨粉/变现）和人设（真实/专业）
3. 点击「生成我的内容日历」
4. 在日历页选择一天，点击生成内容
5. 复制生成的内容到小红书发布

## 项目结构

```
creflow/
├── apps/
│   ├── backend/          # Hono 后端
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── lib/      # 工具函数
│   │   │   └── routes/   # API 路由
│   │   └── .env.example
│   └── web/              # TanStack Start 前端
│       ├── src/
│       │   ├── routes/   # 页面路由
│       │   ├── components/
│       │   └── lib/      # API 和存储工具
│       └── package.json
└── packages/
```

## API 端点

### 后端 API (端口 3001)

- `GET /api/health` - 健康检查
- `POST /api/content-plan` - 生成内容日历
- `POST /api/generate-post` - 生成单篇内容

## 许可

MIT
