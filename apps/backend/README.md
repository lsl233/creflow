# 小红书内容助手 - 后端

## 环境配置

1. 复制环境变量模板：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 MiniMax API Key：
```
MINIMAX_API_KEY=your_api_key_here
```

获取 MiniMax API Key: https://platform.minimaxi.com/

## 安装和运行

```bash
pnpm install
pnpm dev
```

访问: http://localhost:3000

## API 端点

- `GET /api/health` - 健康检查
- `POST /api/content-plan` - 生成内容日历
- `POST /api/generate-post` - 生成单篇内容
