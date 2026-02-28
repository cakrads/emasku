/**
 * Goal Domain Models
 * 
 * Domain representation for goal data.
 * Pure TypeScript — no framework imports.
 */

/**
 * Raw goal (factual data from database).
 */
import { GoalDomain as SharedGoalDomain } from '@/applications/shared/domain/goal.contract'

export type { GoalDomain } from '@/applications/shared/domain/goal.contract'

/**
 * Goal enriched with calculated progress data.
 * Used in list and detail views.
 */
export interface GoalSummaryDomain extends SharedGoalDomain {
  holdingCount: number
  totalCurrentValue: number | bigint  // sum of linked holdings' current value
  progressPercentage: number | null // null if no targetAmount
  isAchieved: boolean               // true if progress >= 100%
}
