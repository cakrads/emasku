/**
 * Goal HTTP Controller
 * 
 * HTTP adapter for goal-related endpoints.
 */

import { NextRequest, NextResponse } from 'next/server'
import { successResponse, createdResponse } from '@/applications/shared/lib/response'
import { ValidationError } from '@/applications/shared/lib/errors'
import { verifyUser } from '@/applications/shared/auth/auth.utils'
import { CreateGoalRequestSchema, UpdateGoalRequestSchema } from '@/shared/contracts/goals.contract'

import { IGoalRepository } from '@/applications/modules/goals/v1/domain/goal.repository'
import { IPriceRepository } from '@/applications/shared/domain/price.contract'

import { CreateGoalUsecase } from '../../usecases/create-goal.usecase'
import { UpdateGoalUsecase } from '../../usecases/update-goal.usecase'
import { DeleteGoalUsecase } from '../../usecases/delete-goal.usecase'
import { ListGoalsUsecase } from '../../usecases/list-goals.usecase'
import { GetGoalDetailUsecase } from '../../usecases/get-goal-detail.usecase'

import { toGoalResponse, toGoalSummaryResponse, toGoalDetailResponse } from './goal.mapper'

export class GoalController {
    constructor(
        private readonly goalRepo: IGoalRepository,
        private readonly priceRepo: IPriceRepository
    ) { }

    /**
     * GET /api/v1/goals
     * Returns all goals for the authenticated user with summary data.
     */
    async listGoals(req: NextRequest): Promise<NextResponse> {
        const userId = await verifyUser(req)

        const usecase = new ListGoalsUsecase(this.goalRepo, this.priceRepo)
        const goals = await usecase.execute(userId)

        const response = {
            goals: goals.map(toGoalSummaryResponse),
            total: goals.length,
        }

        return successResponse(response, 'Goals fetched successfully')
    }

    /**
     * POST /api/v1/goals
     * Creates a new goal.
     */
    async createGoal(req: NextRequest): Promise<NextResponse> {
        const userId = await verifyUser(req)
        let body: any
        try {
            body = await req.json()
        } catch (e) {
            throw new ValidationError('Invalid JSON body')
        }

        const parsed = CreateGoalRequestSchema.safeParse(body)
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors
            throw new ValidationError('Validation failed', { errors: fieldErrors })
        }

        const usecase = new CreateGoalUsecase(this.goalRepo)
        const goal = await usecase.execute(userId, parsed.data)

        const response = toGoalResponse(goal)
        return createdResponse(response, 'Goal created successfully')
    }

    /**
     * GET /api/v1/goals/{id}
     * Returns a single goal with linked holdings and progress.
     */
    async getGoalDetail(req: NextRequest, id: string): Promise<NextResponse> {
        const userId = await verifyUser(req)

        const usecase = new GetGoalDetailUsecase(this.goalRepo, this.priceRepo)
        const detail = await usecase.execute(userId, id)

        const response = toGoalDetailResponse(detail)
        return successResponse(response, 'Goal detail fetched successfully')
    }

    /**
     * PUT /api/v1/goals/{id}
     * Updates an existing goal.
     */
    async updateGoal(req: NextRequest, id: string): Promise<NextResponse> {
        const userId = await verifyUser(req)
        let body: any
        try {
            body = await req.json()
        } catch (e) {
            throw new ValidationError('Invalid JSON body')
        }

        const parsed = UpdateGoalRequestSchema.safeParse(body)
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors
            throw new ValidationError('Validation failed', { errors: fieldErrors })
        }

        const usecase = new UpdateGoalUsecase(this.goalRepo, this.priceRepo)
        const goal = await usecase.execute(userId, id, parsed.data)

        const response = toGoalResponse(goal)
        return successResponse(response, 'Goal updated successfully')
    }

    /**
     * DELETE /api/v1/goals/{id}
     * Deletes a goal (only if no holdings are linked).
     */
    async deleteGoal(req: NextRequest, id: string): Promise<NextResponse> {
        const userId = await verifyUser(req)

        const usecase = new DeleteGoalUsecase(this.goalRepo)
        await usecase.execute(userId, id)

        return successResponse(null, 'Goal deleted successfully')
    }
}
