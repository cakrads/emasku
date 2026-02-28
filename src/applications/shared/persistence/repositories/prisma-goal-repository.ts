/**
 * Prisma Goal Repository
 * 
 * Data access layer for goals.
 * NO valuation logic - only data fetching and type conversion.
 */

import { prisma } from '../prisma-client'
import { Goal } from '@prisma/client'
import { GoalDomain } from '@/applications/modules/goals/v1/domain/goal.domain'
import { CreateGoalData, UpdateGoalData } from '@/applications/modules/goals/v1/domain/goal.repository'
import { logger } from '@/applications/shared/lib/logger'

export class PrismaGoalRepository {
    private prisma = prisma

    /**
     * Fetch all goals for a user.
     * Returns raw goal data only — no valuation.
     */
    async findAllByUserId(userId: string): Promise<GoalDomain[]> {
        const goals = await this.prisma.goal.findMany({
            where: { userId },
            orderBy: [
                { lifecycleStatus: 'asc' }, // ACTIVE first if sorted alphabetically ('ACTIVE' < 'COMPLETED')
                { createdAt: 'desc' }
            ],
        })

        logger.debug('Goals fetched', { userId, count: goals.length })
        return goals.map(this.toDomain)
    }

    /**
     * Fetch single goal by ID.
     */
    async findById(id: string): Promise<GoalDomain | null> {
        const goal = await this.prisma.goal.findUnique({
            where: { id },
        })

        if (!goal) {
            logger.debug('Goal not found', { id })
            return null
        }

        return this.toDomain(goal)
    }

    /**
     * Create a new goal.
     */
    async create(userId: string, data: CreateGoalData): Promise<GoalDomain> {
        const goal = await this.prisma.goal.create({
            data: {
                user: { connect: { id: userId } },
                name: data.name,
                description: data.description || null,
                targetAmount: data.targetAmount != null ? BigInt(data.targetAmount) : null,
                targetDate: data.targetDate || null,
            },
        })

        logger.info('Goal created', { goalId: goal.id, userId })
        return this.toDomain(goal)
    }

    /**
     * Update an existing goal.
     * Only updates provided fields.
     */
    async update(userId: string, id: string, data: UpdateGoalData): Promise<GoalDomain> {
        const updateData: Record<string, unknown> = {}

        if (data.name !== undefined) updateData.name = data.name
        if (data.description !== undefined) updateData.description = data.description
        if (data.targetAmount !== undefined) {
            updateData.targetAmount = data.targetAmount != null ? BigInt(data.targetAmount) : null
        }
        if (data.targetDate !== undefined) updateData.targetDate = data.targetDate
        if (data.lifecycleStatus !== undefined) updateData.lifecycleStatus = data.lifecycleStatus
        if (data.completedAt !== undefined) updateData.completedAt = data.completedAt
        if (data.completedValue !== undefined) {
            updateData.completedValue = data.completedValue != null
                ? (typeof data.completedValue === 'bigint' ? data.completedValue : BigInt(Math.round(data.completedValue)))
                : null
        }

        const goal = await this.prisma.goal.update({
            where: { id, userId },
            data: updateData,
        })

        logger.info('Goal updated', { goalId: id, userId })
        return this.toDomain(goal)
    }

    /**
     * Delete a goal.
     * Caller must check hasLinkedHoldings() first.
     */
    async delete(userId: string, id: string): Promise<void> {
        await this.prisma.goal.delete({
            where: { id, userId },
        })

        logger.info('Goal deleted', { goalId: id, userId })
    }

    /**
     * Check if a goal has any linked holdings.
     */
    async hasLinkedHoldings(id: string): Promise<boolean> {
        const count = await this.prisma.portfolioHolding.count({
            where: { goalId: id },
        })
        return count > 0
    }

    /**
     * Unlink all holdings from a goal (set goalId to null).
     * Used before deleting a goal so holdings are preserved.
     */
    async unlinkHoldings(goalId: string): Promise<void> {
        await this.prisma.portfolioHolding.updateMany({
            where: { goalId },
            data: { goalId: null },
        })
        logger.info('Holdings unlinked from goal', { goalId })
    }

    /**
     * Find all holdings linked to a goal.
     * Returns raw holding data for enrichment by use case.
     */
    async findHoldingsByGoalId(goalId: string): Promise<Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        buyPrice: number | bigint
        status: 'ACTIVE' | 'SOLD'
        sellPrice?: number | bigint
        sellDate?: Date
    }>> {
        const holdings = await this.prisma.portfolioHolding.findMany({
            where: { goalId },
            select: {
                id: true,
                brandCode: true,
                brandName: true,
                denominationGram: true,
                quantity: true,
                buyPrice: true,
                status: true,
                soldTransaction: {
                    select: {
                        price: true,
                        transactionDate: true,
                    }
                }
            },
        })

        return holdings.map(h => ({
            id: h.id,
            brandCode: h.brandCode,
            brandName: h.brandName,
            denominationGram: Number(h.denominationGram),
            quantity: h.quantity,
            buyPrice: h.buyPrice,
            status: h.status as 'ACTIVE' | 'SOLD',
            sellPrice: h.soldTransaction?.price,
            sellDate: h.soldTransaction?.transactionDate ? h.soldTransaction.transactionDate : undefined,
        }))
    }

    /**
     * Find all holdings linked to multiple goals.
     * Returns a map of goalId -> holdings[].
     */
    async findHoldingsByGoalIds(goalIds: string[]): Promise<Record<string, Array<{
        id: string
        brandCode: string
        brandName: string
        denominationGram: number
        quantity: number
        buyPrice: number | bigint
        status: 'ACTIVE' | 'SOLD'
        sellPrice?: number | bigint
        sellDate?: Date
    }>>> {
        const holdings = await this.prisma.portfolioHolding.findMany({
            where: { goalId: { in: goalIds } },
            select: {
                id: true,
                goalId: true,
                brandCode: true,
                brandName: true,
                denominationGram: true,
                quantity: true,
                buyPrice: true,
                status: true,
                soldTransaction: {
                    select: {
                        price: true,
                        transactionDate: true,
                    }
                }
            },
        })

        const mapped: Record<string, any[]> = {}
        for (const goalId of goalIds) {
            mapped[goalId] = []
        }

        for (const h of holdings) {
            if (!h.goalId) continue
            mapped[h.goalId].push({
                id: h.id,
                brandCode: h.brandCode,
                brandName: h.brandName,
                denominationGram: Number(h.denominationGram),
                quantity: h.quantity,
                buyPrice: h.buyPrice,
                status: h.status as 'ACTIVE' | 'SOLD',
                sellPrice: h.soldTransaction?.price,
                sellDate: h.soldTransaction?.transactionDate ? h.soldTransaction.transactionDate : undefined,
            })
        }

        return mapped
    }

    /**
     * Map Prisma model to domain model.
     * Converts BigInt → number.
     */
    private toDomain(goal: Goal): GoalDomain {
        return {
            id: goal.id,
            userId: goal.userId,
            name: goal.name,
            description: goal.description,
            targetAmount: goal.targetAmount,
            targetDate: goal.targetDate,
            lifecycleStatus: goal.lifecycleStatus as 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED',
            completedAt: goal.completedAt,
            completedValue: goal.completedValue,
            createdAt: goal.createdAt,
            updatedAt: goal.updatedAt,
        }
    }
}
