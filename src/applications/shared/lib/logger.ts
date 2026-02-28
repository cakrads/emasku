/**
 * Centralized Structured Logger
 * 
 * Production-grade logging using Winston with:
 * - JSON format for production (queryable, parseable)
 * - Human-readable format for development
 * - Request tracking with trace IDs
 * - Performance monitoring
 * - Error auditing with stack traces
 */

import winston from 'winston'
import { IS_PRODUCTION } from './env'

const { combine, timestamp, printf, json, colorize, errors } = winston.format

/**
 * Development format: Human-readable with colors
 */
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : ''
    return `${timestamp} [${level}]: ${message} ${metaStr}`
  })
)

/**
 * Production format: JSON for log aggregation tools
 */
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
)

/**
 * Singleton logger instance
 */
export const logger = winston.createLogger({
  level: IS_PRODUCTION ? 'info' : 'debug',
  format: IS_PRODUCTION ? prodFormat : devFormat,
  defaultMeta: { service: 'emasku-api' },
  transports: [
    new winston.transports.Console(),

    // In serverless environments (Vercel), we must rely on stdout/stderr
    // File system is read-only, so writing to 'logs/' would crash the app.
    // Vercel/AWS automatically capture console logs.

  ],
})

/**
 * Log an HTTP request with standardized metadata
 */
export function logRequest(
  method: string,
  path: string,
  statusCode: number,
  duration: number,
  meta?: object
) {
  logger.info(`${method} ${path}`, {
    method,
    path,
    statusCode,
    duration,
    ...meta,
  })
}

/**
 * Log a database query for performance monitoring
 */
export function logQuery(
  query: string,
  duration: number,
  meta?: object
) {
  const level = duration > 100 ? 'warn' : 'debug'
  logger.log(level, 'Database query executed', {
    query: query.substring(0, 100), // Truncate long queries
    duration,
    slow: duration > 100,
    ...meta,
  })
}

/**
 * Log an error with full context
 */
export function logError(
  message: string,
  error: Error | unknown,
  meta?: object
) {
  logger.error(message, {
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : String(error),
    ...meta,
  })
}
