/**
 * Create Goal Usecase
 * 
 * Business logic for creating new goals.
 */

import { ValidationError } from '@/applications/shared/lib/errors'
import { logger } from '@/applications/shared/lib/logger'
import { PrismaGoalRepository } from '@/applications/shared/persistence/repositories/prisma-goal-repository'
import { CreateGoalRequest } from '@/shared/contracts/goals.contract'
import { GoalDomain } from '../domain/goal.domain'

export class CreateGoalUsecase {
    constructor(private goalRepo: PrismaGoalRepository) { }

    async execute(userId: string, request: CreateGoalRequest): Promise<GoalDomain> {
        logger.info('Creating new goal', { userId, name: request.name })

        // Validate target date is not in past (if provided)
        // Normalize both dates to UTC midnight to avoid timezone mismatches
        if (request.targetDate) {
            const targetDate = new Date(request.targetDate)
            if (Number.isNaN(targetDate.getTime())) {
                throw new ValidationError('Invalid target date format', {
                    targetDate: 'Must be a valid date string (e.g. YYYY-MM-DD)',
                })
            }
            targetDate.setUTCHours(0, 0, 0, 0)
            const today = new Date()
            today.setUTCHours(0, 0, 0, 0)
            if (targetDate < today) {
                throw new ValidationError('Invalid target date', {
                    targetDate: 'Target date cannot be in the past',
                })
            }
        }

        const goal = await this.goalRepo.create(userId, {
            name: request.name,
            description: request.description,
            targetAmount: request.targetAmount,
            targetDate: request.targetDate ? new Date(request.targetDate) : undefined,
        })

        logger.info('Goal created successfully', { goalId: goal.id })
        return goal
    }
}
