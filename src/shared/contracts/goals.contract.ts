/**
 * Goal Contracts
 * 
 * Shared Zod schemas for goal API request/response.
 * Used by both frontend and backend.
 */

import { z } from 'zod'

// ────────────────────────────────────────
// Create Goal
// ────────────────────────────────────────

export const CreateGoalRequestSchema = z.object({
    name: z.string().min(1, 'Goal name is required').max(100, 'Name cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    targetAmount: z.number().int().positive('Target amount must be positive').optional(),
    targetDate: z.string().date('Invalid date format').optional(),
})

export type CreateGoalRequest = z.infer<typeof CreateGoalRequestSchema>

export const CreateGoalResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    targetAmount: z.number().nullable(),
    targetDate: z.string().nullable(),
    lifecycleStatus: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED']),
    completedAt: z.string().nullable(),
    completedValue: z.number().nullable(),
    createdAt: z.string(),
})

export type CreateGoalResponse = z.infer<typeof CreateGoalResponseSchema>

// ────────────────────────────────────────
// Update Goal
// ────────────────────────────────────────

export const UpdateGoalRequestSchema = z.object({
    name: z.string().min(1, 'Goal name is required').max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    targetAmount: z.number().int().positive('Target amount must be positive').nullable().optional(),
    targetDate: z.string().date('Invalid date format').nullable().optional(),
    lifecycleStatus: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED']).optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    'At least one field must be provided for update'
)

export type UpdateGoalRequest = z.infer<typeof UpdateGoalRequestSchema>

export const UpdateGoalResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    targetAmount: z.number().nullable(),
    targetDate: z.string().nullable(),
    lifecycleStatus: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED']),
    completedAt: z.string().nullable(),
    completedValue: z.number().nullable(),
    updatedAt: z.string(),
})

export type UpdateGoalResponse = z.infer<typeof UpdateGoalResponseSchema>

// ────────────────────────────────────────
// Goal List
// ────────────────────────────────────────

export const GoalSummarySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    targetAmount: z.number().nullable(),
    targetDate: z.string().nullable(),
    holdingCount: z.number(),
    totalCurrentValue: z.number(),
    progressPercentage: z.number().nullable(),
    isAchieved: z.boolean(),
    lifecycleStatus: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED']),
    completedAt: z.string().nullable(),
    completedValue: z.number().nullable(),
    createdAt: z.string(),
})

export type GoalSummary = z.infer<typeof GoalSummarySchema>

export const GoalListSchema = z.object({
    goals: z.array(GoalSummarySchema),
    total: z.number(),
})

export type GoalList = z.infer<typeof GoalListSchema>

// ────────────────────────────────────────
// Goal Detail
// ────────────────────────────────────────

export const GoalDetailHoldingSchema = z.object({
    id: z.string(),
    brandCode: z.string(),
    brandName: z.string(),
    denominationGram: z.number(),
    quantity: z.number(),
    currentValue: z.number().nullable(),
    status: z.string(),
    isSold: z.boolean(),
    soldDate: z.string().nullable(),
})

export type GoalDetailHolding = z.infer<typeof GoalDetailHoldingSchema>

export const GoalDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    targetAmount: z.number().nullable(),
    targetDate: z.string().nullable(),
    holdingCount: z.number(),
    totalCurrentValue: z.number(),
    totalInvestedValue: z.number(),
    progressPercentage: z.number().nullable(),
    isAchieved: z.boolean(),
    lifecycleStatus: z.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED']),
    completedAt: z.string().nullable(),
    completedValue: z.number().nullable(),
    holdings: z.array(GoalDetailHoldingSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type GoalDetail = z.infer<typeof GoalDetailSchema>
