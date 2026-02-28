/**
 * Goal Repository Interface
 * 
 * Pure domain contract — no Prisma or framework imports.
 */

import { GoalDomain } from './goal.domain'

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

export interface IGoalRepository {
    findAllByUserId(userId: string): Promise<GoalDomain[]>
    findById(id: string): Promise<GoalDomain | null>
    create(userId: string, data: CreateGoalData): Promise<GoalDomain>
    update(userId: string, id: string, data: UpdateGoalData): Promise<GoalDomain>
    delete(userId: string, id: string): Promise<void>
    hasLinkedHoldings(id: string): Promise<boolean>
}
