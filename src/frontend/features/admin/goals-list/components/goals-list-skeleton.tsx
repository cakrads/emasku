import { Grid, Section, Stack } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Card, CardContent } from '@/frontend/components/ui/card'

export function GoalsListSkeleton() {
    return (
        <Stack gap="sm">
            {/* Filter Chips Skeleton */}
            <Stack direction="horizontal" className="flex-wrap items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
            </Stack>

            {/* Mobile: 2-Column Card Grid Skeleton */}
            <Grid className="grid-cols-2 gap-3 md:hidden">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <Stack gap="sm">
                                <Stack gap="xs">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </Stack>
                                <Stack gap="xs">
                                    <Skeleton className="h-3 w-8" />
                                    <Skeleton className="h-1.5 w-full rounded-full" />
                                </Stack>
                                <Stack gap="xs">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                ))}
            </Grid>

            {/* Desktop: Table Skeleton */}
            <Section className="hidden md:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                {['w-20', 'w-24', 'w-24', 'w-20', 'w-24', 'w-16'].map((w, i) => (
                                    <th key={i} className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Skeleton className={`h-4 ${w}`} />
                                    </th>
                                ))}
                                <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                    <Skeleton className="h-4 w-14 ml-auto" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-border">
                                    <td className="py-4 px-4">
                                        <Skeleton className="h-5 w-40" />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Skeleton className="h-5 w-28 ml-auto" />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Skeleton className="h-5 w-28 ml-auto" />
                                    </td>
                                    <td className="py-4 px-4 hidden sm:table-cell">
                                        <Skeleton className="h-5 w-24" />
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <Stack direction="vertical" className="items-end gap-2">
                                            <Skeleton className="h-5 w-12" />
                                            <Skeleton className="h-1.5 w-16 rounded-full" />
                                        </Stack>
                                    </td>
                                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28 ml-auto" />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <Skeleton className="h-5 w-20 rounded-md mx-auto" />
                                    </td>
                                    <td className="py-4 px-4" />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </Stack>
    )
}
