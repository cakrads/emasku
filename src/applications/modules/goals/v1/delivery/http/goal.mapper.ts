/**
 * Goal Response Mapper
 * 
 * Transforms domain models to API response format.
 */

import { GoalDomain, GoalSummaryDomain } from '../../domain/goal.domain'
import { GoalDetailResult } from '../../usecases/get-goal-detail.usecase'

/**
 * Map goal domain to create/update response.
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
 * Map goal summary domain to list response item.
 */
export function toGoalSummaryResponse(goal: GoalSummaryDomain) {
    return {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        targetAmount: goal.targetAmount != null ? Number(goal.targetAmount) : null,
        targetDate: goal.targetDate ? goal.targetDate.toISOString().split('T')[0] : null,
        holdingCount: goal.holdingCount,
        totalCurrentValue: Number(goal.totalCurrentValue),
        progressPercentage: goal.progressPercentage,
        isAchieved: goal.isAchieved,
        lifecycleStatus: goal.lifecycleStatus,
        completedAt: goal.completedAt ? goal.completedAt.toISOString() : null,
        completedValue: goal.completedValue != null ? Number(goal.completedValue) : null,
        createdAt: goal.createdAt.toISOString(),
    }
}

/**
 * Map goal detail to full response.
 */
export function toGoalDetailResponse(detail: GoalDetailResult) {
    return {
        id: detail.id,
        name: detail.name,
        description: detail.description,
        targetAmount: detail.targetAmount != null ? Number(detail.targetAmount) : null,
        targetDate: detail.targetDate ? detail.targetDate.toISOString().split('T')[0] : null,
        holdingCount: detail.holdingCount,
        totalCurrentValue: Number(detail.totalCurrentValue),
        totalInvestedValue: Number(detail.totalInvestedValue),
        progressPercentage: detail.progressPercentage,
        isAchieved: detail.isAchieved,
        lifecycleStatus: detail.lifecycleStatus,
        completedAt: detail.completedAt ? detail.completedAt.toISOString() : null,
        completedValue: detail.completedValue != null ? Number(detail.completedValue) : null,
        holdings: detail.holdings,
        createdAt: detail.createdAt.toISOString(),
        updatedAt: detail.updatedAt.toISOString(),
    }
}
