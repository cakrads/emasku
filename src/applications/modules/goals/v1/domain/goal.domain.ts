/**
 * Goal Domain Models
 * 
 * Domain representation for goal data.
 * Pure TypeScript — no framework imports.
 */

/**
 * Raw goal (factual data from database).
 */
export interface GoalDomain {
  id: string
  userId: string
  name: string
  description: string | null
  targetAmount: number | null  // IDR
  targetDate: Date | null
  lifecycleStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED'
  completedAt: Date | null
  completedValue: number | null    // snapshot of total value at completion time
  createdAt: Date
  updatedAt: Date
}

/**
 * Goal enriched with calculated progress data.
 * Used in list and detail views.
 */
export interface GoalSummaryDomain extends GoalDomain {
  holdingCount: number
  totalCurrentValue: number         // sum of linked holdings' current value
  progressPercentage: number | null // null if no targetAmount
  isAchieved: boolean               // true if progress >= 100%
}
