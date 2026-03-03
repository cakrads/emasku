import { Section, Stack } from '@/frontend/components/ui/layout'
import { Skeleton } from '@/frontend/components/ui/skeleton'

export function GoalsListSkeleton() {
    return (
        <Stack gap="sm">
            {/* Filter Tabs Skeleton */}
            <div className="flex flex-wrap items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-24 rounded-lg" />
                ))}
            </div>

            {/* Goals Table Skeleton */}
            <Section>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-border">
                                {['w-20', 'w-24', 'w-24', 'w-20', 'w-24'].map((w, i) => (
                                    <th key={i} className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                        <Skeleton className={`h-4 ${w}`} />
                                    </th>
                                ))}
                                <th className="py-3 px-4 text-left whitespace-nowrap font-medium">
                                    <Skeleton className="h-4 w-16" />
                                </th>
                                <th className="py-3 px-4 text-right whitespace-nowrap font-medium">
                                    Actions
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
                                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                                        <Skeleton className="h-5 w-28 ml-auto" />
                                    </td>
                                    <td className="py-4 px-4 text-right hidden md:table-cell">
                                        <div className="flex flex-col items-end gap-2">
                                            <Skeleton className="h-5 w-12" />
                                            <Skeleton className="h-1.5 w-16 rounded-full" />
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                                        <Skeleton className="h-5 w-28 ml-auto" />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Skeleton className="h-6 w-20 rounded-md" />
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
