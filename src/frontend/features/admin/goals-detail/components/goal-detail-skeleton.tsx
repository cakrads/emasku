import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Section, Stack } from '@/frontend/components/ui/layout'
import { Card, CardContent } from '@/frontend/components/ui/card'

export function GoalDetailSkeleton() {
    return (
        <div className="w-full max-w-xl mx-auto pb-24 sm:min-w-[500px]">
            {/* Header Skeleton */}
            <Section className="py-6 px-6 text-center mb-6">
                <Stack gap="xs" className="items-center">
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="h-5 w-24 rounded-md mt-2" />
                    <Skeleton className="h-4 w-40 mt-3" />
                </Stack>
            </Section>

            {/* Summary Card Skeleton */}
            <Section className="px-0 mb-6">
                <Card className="bg-surface-elevated border-border shadow-sm">
                    <CardContent className="p-5">
                        <Stack gap="md">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                            <Skeleton className="h-2.5 w-full rounded-full opacity-50" />
                            <Stack gap="md" className="mt-2">
                                <div className="flex justify-between items-start">
                                    <Skeleton className="h-4 w-32 mt-1" />
                                    <div className="text-right flex flex-col items-end gap-1.5">
                                        <Skeleton className="h-6 w-40" />
                                        <Skeleton className="h-4 w-24 opacity-60" />
                                    </div>
                                </div>
                                <div className="h-px bg-border w-full opacity-50" />
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-5 w-28" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Section>

            {/* Holdings List Skeleton */}
            <Section className="px-0 mt-6">
                <Card className="bg-surface-elevated border-border shadow-sm">
                    <CardContent className="p-5">
                        <Stack gap="md">
                            <Skeleton className="h-5 w-48 mb-2" />
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-border pb-2">
                                    <Skeleton className="h-3 w-16 opacity-40" />
                                    <Skeleton className="h-3 w-16 opacity-40" />
                                    <Skeleton className="h-3 w-16 opacity-40" />
                                </div>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex justify-between items-center py-1">
                                        <Skeleton className="h-5 w-40" />
                                        <Skeleton className="h-5 w-12" />
                                        <Skeleton className="h-5 w-28" />
                                    </div>
                                ))}
                            </div>
                        </Stack>
                    </CardContent>
                </Card>
            </Section>
        </div>
    )
}
