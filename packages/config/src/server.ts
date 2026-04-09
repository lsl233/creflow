import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { serverConfigSchema, type ServerConfig } from './schema.js'

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 计算 monorepo 根目录 (packages/config/src -> packages/config -> packages -> root)
const rootDir = resolve(__dirname, '../../..')

// 从根目录加载 .env 文件（如果存在）
config({ path: resolve(rootDir, '.env') })

/**
 * 验证并获取服务端配置
 * 如果在浏览器环境调用会抛出错误
 */
export function getServerConfig(): ServerConfig {
  // 检查是否在服务端环境
  if (typeof window !== 'undefined') {
    throw new Error('getServerConfig() can only be called on the server side')
  }

  return serverConfigSchema.parse(process.env)
}

/**
 * 创建配置验证函数（允许传入自定义环境变量对象，用于测试）
 */
export function createConfigValidator(env: Record<string, string | undefined>) {
  return serverConfigSchema.parse(env)
}

// 导出配置 Schema 和类型
export { serverConfigSchema, type ServerConfig }

// 懒加载的默认配置实例（首次访问时验证）
let _cachedConfig: ServerConfig | null = null

/**
 * 服务端配置单例（带缓存）
 * 注意：只在服务端代码中使用
 */
export function getCachedConfig(): ServerConfig {
  if (!_cachedConfig) {
    _cachedConfig = getServerConfig()
  }
  return _cachedConfig
}
