/**
 * 统一错误处理和日志工具
 */

// 错误码定义
export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  MINIMAX_ERROR: 'MINIMAX_ERROR',
} as const

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes]

// 统一错误响应格式
export interface ErrorResponse {
  success: false
  error: string
  code?: ErrorCode
  timestamp: string
}

// 创建错误响应
export function createErrorResponse(
  message: string,
  code?: ErrorCode
): ErrorResponse {
  return {
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString(),
  }
}

// 日志级别
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// 日志配置
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

// 日志函数
function formatMessage(level: LogLevel, prefix: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString()
  const dataStr = data ? ` ${JSON.stringify(data)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] [${prefix}] ${message}${dataStr}`
}

export const logger = {
  debug(prefix: string, message: string, data?: unknown) {
    if ((LOG_LEVELS[currentLevel] as number) <= LOG_LEVELS.debug) {
      console.debug(formatMessage('debug', prefix, message, data))
    }
  },

  info(prefix: string, message: string, data?: unknown) {
    if ((LOG_LEVELS[currentLevel] as number) <= LOG_LEVELS.info) {
      console.info(formatMessage('info', prefix, message, data))
    }
  },

  warn(prefix: string, message: string, data?: unknown) {
    if ((LOG_LEVELS[currentLevel] as number) <= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', prefix, message, data))
    }
  },

  error(prefix: string, message: string, data?: unknown) {
    if ((LOG_LEVELS[currentLevel] as number) <= LOG_LEVELS.error) {
      console.error(formatMessage('error', prefix, message, data))
    }
  },
}

// 降级响应模板
type FallbackContentType = '共鸣' | '记录' | '干货' | '种草'

export const FallbackResponses = {
  contentPlan: [
    { day: 1, type: '共鸣' as FallbackContentType, topic: '今天遇到的暖心小事', intent: '分享生活中的小确幸' },
    { day: 2, type: '记录' as FallbackContentType, topic: '日常工作的记录', intent: '展示真实的工作状态' },
    { day: 3, type: '干货' as FallbackContentType, topic: '一个实用小技巧', intent: '提供有价值的信息' },
    { day: 4, type: '种草' as FallbackContentType, topic: '最近在用的好东西', intent: '分享真实使用体验' },
    { day: 5, type: '记录' as FallbackContentType, topic: '周末生活记录', intent: '展示生活方式' },
    { day: 6, type: '干货' as FallbackContentType, topic: '一个常见问题的解决方法', intent: '帮助他人解决问题' },
    { day: 7, type: '共鸣' as FallbackContentType, topic: '最近的一些感悟', intent: '引发情感共鸣' },
  ],

  generatePost: {
    title: '今日分享',
    content: '今天想和大家分享一些心得体会...\n\n希望对你们有帮助！',
    tags: ['分享', '日常', '记录'],
    imageSuggestions: ['生活场景照片', '简洁的文字配图'],
  },
}
