import { clientConfigSchema, type ClientConfig } from './schema.js'

/**
 * 客户端配置（可以在浏览器和 Node 中使用）
 * 只包含非敏感信息
 */
export function getClientConfig(): ClientConfig {
  // 在浏览器环境中使用 import.meta.env（Vite 等构建工具）
  // 在 Node 环境中使用 process.env
  const env =
    typeof process !== 'undefined' && process.env
      ? process.env
      : (import.meta as unknown as { env: Record<string, string> }).env || {}

  return clientConfigSchema.parse({
    APP_NAME: env.APP_NAME,
    API_BASE_URL: env.API_BASE_URL,
  })
}

// 客户端配置单例（带缓存）
let _cachedClientConfig: ClientConfig | null = null

export function getCachedClientConfig(): ClientConfig {
  if (!_cachedClientConfig) {
    _cachedClientConfig = getClientConfig()
  }
  return _cachedClientConfig
}

// 导出 Schema 和类型
export { clientConfigSchema, type ClientConfig } from './schema.js'
export { serverConfigSchema, type ServerConfig } from './schema.js'
