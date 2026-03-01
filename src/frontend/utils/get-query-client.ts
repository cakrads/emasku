import { QueryClient, isServer, defaultShouldDehydrateQuery } from '@tanstack/react-query'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 60 seconds default stale time
            },
            dehydrate: {
                shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
            }
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

/**
 * Returns a QueryClient instance that is safe to use in both Server and Client Components.
 */
export function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}
