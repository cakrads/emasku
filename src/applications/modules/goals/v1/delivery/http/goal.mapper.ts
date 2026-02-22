/**
 * Goal Response Mapper
 * 
 * Transforms domain models to API response format.
 */

import { GoalDomain, GoalSummaryDomain } from '../../domain/goal.domain'
import { GoalDetailResult } from '../../usecases/get-goal-detail.usecase'

/**
 * Map a GoalDomain to the API response shape used for create/update operations.
 *
 * @param goal - The domain model representing the goal to convert
 * @returns The response object containing goal fields:
 * - `id`, `name`, `description`, `targetAmount`, `lifecycleStatus`, `completedValue`, `createdAt`, `updatedAt`
 * - `targetDate`: ISO date string in `YYYY-MM-DD` format or `null`
 * - `completedAt`: ISO timestamp string or `null`
 */
export function toGoalResponse(goal: GoalDomain) {
    return {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : null,
        lifecycleStatus: goal.lifecycleStatus,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : null,
        completedValue: goal.completedValue,
        createdAt: goal.createdAt.toISOString(),
        updatedAt: goal.updatedAt.toISOString(),
    }
}

/**
 * Convert a GoalSummaryDomain into an API-facing goal summary response object.
 *
 * @param goal - The domain-level goal summary to convert.
 * @returns An object with fields: `id`, `name`, `description`, `targetAmount`, `targetDate` (ISO date `YYYY-MM-DD` or `null`), `holdingCount`, `totalCurrentValue`, `progressPercentage`, `isAchieved`, `lifecycleStatus`, `completedAt` (ISO timestamp or `null`), `completedValue`, and `createdAt` (ISO timestamp).
 */
export function toGoalSummaryResponse(goal: GoalSummaryDomain) {
    return {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : null,
        holdingCount: goal.holdingCount,
        totalCurrentValue: goal.totalCurrentValue,
        progressPercentage: goal.progressPercentage,
        isAchieved: goal.isAchieved,
        lifecycleStatus: goal.lifecycleStatus,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : null,
        completedValue: goal.completedValue,
        createdAt: goal.createdAt.toISOString(),
    }
}

/**
 * Transform a GoalDetailResult into the API goal detail response.
 *
 * @param detail - The domain-level goal detail to convert.
 * @returns An object containing goal detail fields suitable for API responses. Date fields are formatted: `targetDate` as `YYYY-MM-DD` or `null`, `completedAt`, `createdAt`, and `updatedAt` as ISO timestamp strings (or `null` for `completedAt`).
 */
export function toGoalDetailResponse(detail: GoalDetailResult) {
    return {
        id: detail.id,
        name: detail.name,
        description: detail.description,
        targetAmount: detail.targetAmount,
        targetDate: detail.targetDate ? detail.targetDate.toISOString().split('T')[0] : null,
        holdingCount: detail.holdingCount,
        totalCurrentValue: detail.totalCurrentValue,
        totalInvestedValue: detail.totalInvestedValue,
        progressPercentage: detail.progressPercentage,
        isAchieved: detail.isAchieved,
        lifecycleStatus: detail.lifecycleStatus,
        completedAt: detail.completedAt ? detail.completedAt.toISOString() : null,
        completedValue: detail.completedValue,
        holdings: detail.holdings,
        createdAt: detail.createdAt.toISOString(),
        updatedAt: detail.updatedAt.toISOString(),
    }
}