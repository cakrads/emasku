/**
 * Base URL Utility
 * 
 * Determines the correct absolute base URL for server-side fetches.
 */
export function getBaseUrl(): string {
    if (typeof window !== 'undefined') return ''

    // During Next.js build time, fetching against localhost will fail because
    // the server isn't running yet. We provide a mock/dummy URL if we detect we're building,
    // or rely on the build system's env vars.
    if (process.env.NEXT_PHASE === 'phase-production-build') {
        // Next.js static generation phase
        return 'http://localhost:3000' // It will still fail the fetch, but we catch it gracefully
    }

    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

    return `http://localhost:${process.env.PORT ?? 3000}`
}
