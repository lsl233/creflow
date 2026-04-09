import { z } from 'zod'

/**
 * 服务端配置 Schema（包含敏感信息）
 */
export const serverConfigSchema = z.object({
  // AI 配置
  MINIMAX_API_KEY: z.string().min(1, 'MINIMAX_API_KEY is required'),
  MINIMAX_BASE_URL: z.string().url().default('https://api.minimaxi.com/v1'),
  MINIMAX_MODEL: z.string().default('MiniMax-M2.5'),

  // 服务端配置
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
})

/**
 * 客户端配置 Schema（非敏感信息）
 */
export const clientConfigSchema = z.object({
  // 应用配置
  APP_NAME: z.string().default('Creflow'),
  API_BASE_URL: z.string().default('http://localhost:3001/api'),
})

export type ServerConfig = z.infer<typeof serverConfigSchema>
export type ClientConfig = z.infer<typeof clientConfigSchema>
