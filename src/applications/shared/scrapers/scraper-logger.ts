/**
 * Scraper Logger
 * 
 * Writes structured logs to .scrap/logs/ with execution details
 */

import fs from 'fs'
import path from 'path'

export interface ScraperLogEntry {
  timestamp: string
  status: 'started' | 'success' | 'error'
  itemsExtracted?: number
  brandCombinations?: number
  recordsInserted?: number
  recordsSkipped?: number
  brandsSkipped?: string[]
  insertedRecords?: Array<{
    brand: string
    priceType: string
    denominationGram: number
    price: number
    priceAt: string
    source: string
  }>
  error?: string
  duration?: number
}

export class ScraperLogger {
  private logDir: string
  private logFile: string
  private startTime: number
  private entries: ScraperLogEntry[] = []

  constructor() {
    const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL

    // Create .scrap/logs directory if it doesn't exist (skip on Vercel)
    this.logDir = path.join(process.cwd(), '.scrap', 'logs')

    if (!isVercel) {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true })
      }

      // Create timestamped log file
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
      this.logFile = path.join(this.logDir, `scraper-${timestamp}.log`)
    } else {
      console.log('[Logger] Running on Vercel, skipping file logging')
      this.logFile = '' // Mark as no file
    }

    this.startTime = Date.now()

    // Perform cleanup of old logs (only if not on Vercel)
    if (!isVercel) {
      this.cleanOldLogs(30)
    }

    this.log('started', {})
  }

  /**
   * Delete logs older than retentionDays
   */
  private cleanOldLogs(retentionDays: number) {
    try {
      const files = fs.readdirSync(this.logDir)
      const now = Date.now()
      const maxAge = retentionDays * 24 * 60 * 60 * 1000
      let deletedCount = 0

      for (const file of files) {
        if (!file.startsWith('scraper-') || !file.endsWith('.log')) continue

        const filePath = path.join(this.logDir, file)
        const stats = fs.statSync(filePath)

        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath)
          deletedCount++
        }
      }

      if (deletedCount > 0) {
        console.log(`[Logger] Cleaned up ${deletedCount} old log files (> ${retentionDays} days)`)
      }
    } catch (error) {
      console.error('[Logger] Failed to clean old logs:', error)
    }
  }

  /**
   * Log an entry
   */
  log(status: ScraperLogEntry['status'], data: Partial<ScraperLogEntry>) {
    const entry: ScraperLogEntry = {
      timestamp: new Date().toISOString(),
      status,
      ...data,
    }

    if (status === 'success' || status === 'error') {
      entry.duration = Date.now() - this.startTime
    }

    this.entries.push(entry)
    this.writeToFile(entry)
  }

  /**
   * Write log entry to file
   */
  private writeToFile(entry: ScraperLogEntry) {
    const logLine = JSON.stringify(entry, null, 2) + '\n---\n'
    if (this.logFile) {
      try {
        fs.appendFileSync(this.logFile, logLine)
      } catch (error) {
        console.error('[Logger] Failed to write to log file:', error)
      }
    } else {
      // In Vercel or environments without file access, still log to console
      console.log(`[Scraper Log] ${entry.status.toUpperCase()}:`, JSON.stringify(entry))
    }
  }

  /**
   * Get summary for console output
   */
  getSummary(): string {
    const latest = this.entries[this.entries.length - 1]

    if (latest.status === 'error') {
      return `❌ Scraper failed: ${latest.error}`
    }

    if (latest.status === 'success') {
      return [
        `✅ Scraper completed in ${(latest.duration! / 1000).toFixed(2)}s`,
        `   Items extracted: ${latest.itemsExtracted}`,
        `   Brand combinations: ${latest.brandCombinations}`,
        `   Records inserted: ${latest.recordsInserted}`,
        `   Records skipped: ${latest.recordsSkipped}`,
        latest.brandsSkipped && latest.brandsSkipped.length > 0
          ? `   Brands skipped: ${latest.brandsSkipped.join(', ')}`
          : null,
      ]
        .filter(Boolean)
        .join('\n')
    }

    return ''
  }

  /**
   * Get the last log entry (success or error)
   */
  getLastEntry(): ScraperLogEntry | undefined {
    return this.entries[this.entries.length - 1]
  }

  /**
   * Get log file path
   */
  getLogPath(): string {
    return this.logFile
  }
}
