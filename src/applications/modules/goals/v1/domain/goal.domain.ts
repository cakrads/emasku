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
export class GoalSummaryDomain extends SharedGoalDomain {
  constructor(
    goal: SharedGoalDomain,
    public holdingCount: number,
    public totalCurrentValue: number | bigint,
    public progressPercentage: number | null,
    public isAchieved: boolean
  ) {
    super(
      goal.id,
      goal.userId,
      goal.name,
      goal.description,
      goal.targetAmount,
      goal.targetDate,
      goal.lifecycleStatus,
      goal.completedAt,
      goal.completedValue,
      goal.createdAt,
      goal.updatedAt
    )
  }
}
