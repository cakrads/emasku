/**
 * Shared Goal Domain Contracts
 * 
 * Centralized interfaces for goal-related domain models.
 */

export class GoalDomain {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public name: string,
        public description: string | null,
        public targetAmount: number | bigint | null,
        public targetDate: Date | null,
        public lifecycleStatus: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED',
        public completedAt: Date | null,
        public completedValue: number | bigint | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) {
        this.validate()
    }

    private validate() {
        if (!this.name || this.name.trim().length === 0) {
            throw new Error('Goal name is required')
        }
        if (this.targetAmount !== null && Number(this.targetAmount) < 0) {
            throw new Error('Target amount cannot be negative')
        }
    }

    public canComplete(): boolean {
        return this.lifecycleStatus === 'ACTIVE'
    }

    public markAsCompleted(value: number | bigint) {
        if (!this.canComplete()) {
            throw new Error(`Cannot complete goal in ${this.lifecycleStatus} status`)
        }
        this.lifecycleStatus = 'COMPLETED'
        this.completedAt = new Date()
        this.completedValue = value
    }

    public markAsActive() {
        this.lifecycleStatus = 'ACTIVE'
        this.completedAt = null
        this.completedValue = null
    }
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
