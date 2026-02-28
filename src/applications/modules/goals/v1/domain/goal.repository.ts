/**
 * Goal Repository Interface
 * 
 * Pure domain contract — no Prisma or framework imports.
 */

import { GoalDomain, CreateGoalData, UpdateGoalData } from '@/applications/shared/domain/goal.contract'

export type { CreateGoalData, UpdateGoalData } from '@/applications/shared/domain/goal.contract'

export interface IGoalRepository {
    findAllByUserId(userId: string): Promise<GoalDomain[]>
    findById(id: string): Promise<GoalDomain | null>
    create(userId: string, data: CreateGoalData): Promise<GoalDomain>
    update(userId: string, id: string, data: UpdateGoalData): Promise<GoalDomain>
    delete(userId: string, id: string): Promise<void>
    hasLinkedHoldings(id: string): Promise<boolean>
}
