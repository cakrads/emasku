import { Skeleton } from '@/frontend/components/ui/skeleton'
import { Section, Stack, Divider } from '@/frontend/components/ui/layout'
import { Card, CardContent } from '@/frontend/components/ui/card'

export function GoalDetailSkeleton() {
    return (
        <div className="w-full max-w-xl mx-auto pb-24 sm:min-w-[500px]">

            {/* Hero — mirrors: div.flex-col.items-center.gap-2 > h2 text-4xl + div.flex-col.items-center.gap-1 */}
            <Section className="py-6 px-6 text-center mb-6">
                <Stack direction="vertical" className="items-center gap-2">
                    <Skeleton className="h-10 w-52" />
                    <Stack direction="vertical" className="items-center gap-1">
                        <Skeleton className="h-6 w-20" />
                        <Stack direction="horizontal" className="items-center gap-1.5 mt-1">
                            <Skeleton className="h-4 w-4 rounded-sm" />
                            <Skeleton className="h-5 w-28" />
                        </Stack>
                    </Stack>
                </Stack>
            </Section>

            {/* Summary Card — mirrors: Card > CardContent p-5 > Stack gap="md" */}
            <Section className="px-0 mb-6">
                <Card className="bg-surface-elevated border-border shadow-sm">
                    <CardContent className="p-5">
                        <Stack gap="md">
                            {/* Row: h3 text-sm + body font-semibold */}
                            <Stack direction="horizontal" className="justify-between items-center">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-6 w-10" />
                            </Stack>

                            {/* Progress bar */}
                            <Skeleton className="h-2.5 w-full rounded-full" />

                            {/* Inner rows — mirrors: Stack gap="md" mt-2 */}
                            <Stack gap="md" className="mt-2">
                                {/* Current value: body-sm pt-1 left + body text-lg + caption right */}
                                <Stack direction="horizontal" className="justify-between items-start">
                                    <Skeleton className="h-5 w-28 mt-1" />
                                    <Stack direction="vertical" className="items-end gap-1">
                                        <Skeleton className="h-7 w-36" />
                                        <Skeleton className="h-4 w-24" />
                                    </Stack>
                                </Stack>

                                <Divider className="mt-2" />

                                {/* Target amount: body-sm + body */}
                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-6 w-32" />
                                </Stack>

                                {/* Remaining: body-sm + body */}
                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-6 w-28" />
                                </Stack>

                                {/* Time remaining: body-sm + body */}
                                <Stack direction="horizontal" className="justify-between items-center">
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="h-6 w-20" />
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Section>

            {/* Holdings Card — mirrors: Card > CardContent p-5 > Stack gap="md" > table */}
            <Section className="px-0 mt-6">
                <Card className="bg-surface-elevated border-border shadow-sm">
                    <CardContent className="p-5">
                        <Stack gap="md">
                            {/* h3 text-sm font-medium */}
                            <Skeleton className="h-5 w-44" />

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="py-2 px-2 text-left">
                                                <Skeleton className="h-4 w-14" />
                                            </th>
                                            <th className="py-2 px-2 text-right">
                                                <Skeleton className="h-4 w-24 ml-auto" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[1, 2, 3].map(i => (
                                            <tr key={i} className="border-b border-border">
                                                {/* Left: brand + gram on one line = body-sm h-5 */}
                                                <td className="py-3 px-2">
                                                    <Skeleton className="h-5 w-36" />
                                                </td>
                                                {/* Right: body-sm h-5 + gap-1 + caption h-4 */}
                                                <td className="py-3 px-2">
                                                    <Stack direction="vertical" className="items-end gap-1">
                                                        <Skeleton className="h-5 w-24" />
                                                        <Skeleton className="h-4 w-16" />
                                                    </Stack>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-border">
                                            <td className="py-3 px-2">
                                                <Skeleton className="h-5 w-16" />
                                            </td>
                                            <td className="py-3 px-2">
                                                <Stack direction="horizontal" className="justify-end">
                                                    <Skeleton className="h-5 w-28" />
                                                </Stack>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Stack>
                    </CardContent>
                </Card>
            </Section>

            {/* Delete button — mirrors: Button h-14 w-full rounded-xl */}
            <Section className="px-0 mt-8">
                <Skeleton className="h-14 w-full rounded-xl" />
            </Section>
        </div>
    )
}
