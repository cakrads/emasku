/**
 * Shared Goal Domain Contracts
 * 
 * Centralized interfaces for goal-related domain models.
 */

export interface GoalDomain {
    id: string
    userId: string
    name: string
    description: string | null
    targetAmount: number | bigint | null
    targetDate: Date | null
    lifecycleStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED'
    completedAt: Date | null
    completedValue: number | bigint | null
    createdAt: Date
    updatedAt: Date
}

export interface CreateGoalData {
    name: string
    description?: string
    targetAmount?: number | bigint
    targetDate?: Date
}

export interface UpdateGoalData {
    name?: string
    description?: string | null
    targetAmount?: number | bigint | null
    targetDate?: Date | null
    lifecycleStatus?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED'
    completedAt?: Date | null
    completedValue?: number | bigint | null
}
