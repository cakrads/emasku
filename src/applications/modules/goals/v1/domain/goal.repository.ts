/**
 * Goal Repository Interface
 * 
 * Pure domain contract — no Prisma or framework imports.
 */

import { GoalDomain, CreateGoalData, UpdateGoalData } from '@/applications/shared/domain/goal.contract'

export type { CreateGoalData, UpdateGoalData } from '@/applications/shared/domain/goal.contract'

export interface IGoalRepository {
    findAllByUserId(userId: string): Promise<GoalDomain[]>
    findById(id: string, tx?: any): Promise<GoalDomain | null>
    create(userId: string, data: CreateGoalData): Promise<GoalDomain>
    update(userId: string, id: string, data: UpdateGoalData, tx?: any): Promise<GoalDomain>
    delete(userId: string, id: string): Promise<void>
    hasLinkedHoldings(id: string): Promise<boolean>
    unlinkHoldings(goalId: string, tx?: any): Promise<void>
    findHoldingsByGoalId(goalId: string, tx?: any): Promise<Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        buyPrice: number | bigint
        status: 'ACTIVE' | 'SOLD'
        sellPrice?: number | bigint
        sellDate?: Date
    }>>
    findHoldingsByGoalIds(goalIds: string[]): Promise<Record<string, Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        buyPrice: number | bigint
        status: 'ACTIVE' | 'SOLD'
        sellPrice?: number | bigint
        sellDate?: Date
    }>>>
    executeInTransaction<T>(callback: (tx: any) => Promise<T>): Promise<T>
}
