import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from './applications/shared/lib/env'
import { checkRateLimit, isRateLimitEnabled } from './applications/shared/lib/rate-limiter'
import { validatePublicApiKey, isBlockedUserAgent, isPublicApiKeyRequired } from './applications/shared/lib/public-api-key'

/**
 * Auth Middleware + Public API Security
 * 
 * - Protects routes by checking for valid session.
 * - Applies rate limiting and key validation to public API routes.
 */

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/auth/callback', '/privacy', '/prices']

// Routes that should skip middleware entirely
const SKIP_ROUTES = ['/_next/', '/favicon.ico']

// Public API routes that need rate limiting
const PUBLIC_API_ROUTES = {
  '/api/v1/prices/today': 'pricesToday' as const,
  '/api/v1/prices/spot': 'pricesSpot' as const,
}

/**
 * Handle public API requests with security checks
 */
async function handlePublicApiRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent')
  const publicKey = request.headers.get('x-public-key')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

  // 1. Block suspicious User-Agents
  if (isBlockedUserAgent(userAgent)) {
    return NextResponse.json({
      code: 403,
      success: false,
      message: 'Forbidden',
      data: null,
    }, { status: 403 })
  }

  // 2. Validate public API key (if required)
  if (isPublicApiKeyRequired()) {
    const keyInfo = validatePublicApiKey(publicKey)
    if (!keyInfo.isValid) {
      return NextResponse.json({
        code: 401,
        success: false,
        message: 'Invalid or missing API key. Use x-public-key header.',
        data: null,
      }, { status: 401 })
    }
  }

  // 3. Apply rate limiting
  const endpoint = Object.entries(PUBLIC_API_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  )?.[1]

  if (endpoint && isRateLimitEnabled()) {
    const identifier = publicKey ? `${publicKey}:${ip}` : ip
    const result = await checkRateLimit(endpoint, identifier)

    if (!result.success) {
      return NextResponse.json({
        code: 429,
        success: false,
        message: 'Rate limit exceeded. Please slow down.',
        data: null,
        details: {
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
      }, {
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.reset.toString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        },
      })
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', result.limit.toString())
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', result.reset.toString())
    return response
  }

  return NextResponse.next()
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files
  if (SKIP_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // 1. Handle Public API routes (Market Data)
  if (pathname.startsWith('/api/v1/prices/')) {
    return handlePublicApiRequest(request)
  }

  // 2. Handle Brands API (Master Data - Public but Rate Limited)
  if (pathname.startsWith('/api/v1/brands')) {
    if (isRateLimitEnabled()) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const result = await checkRateLimit('brands', ip)
      if (!result.success) return createRateLimitResponse(result)

      const response = NextResponse.next()
      addRateLimitHeaders(response, result)
      return response
    }
  }

  // 3. Handle System API (Scraper)
  if (pathname.startsWith('/api/v1/scraper')) {
    if (isRateLimitEnabled()) {
      // Use IP as identifier for system endpoints (simpler than parsing Bearer token here)
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
      const result = await checkRateLimit('system', ip)
      if (!result.success) return createRateLimitResponse(result)
    }
    // Continue to route handler for Auth check
    return NextResponse.next()
  }

  // 4. Handle Authenticated API routes (Portfolio)
  if (pathname.startsWith('/api/v1/portfolio')) {
    // Create Supabase client to get User ID
    const response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(
      SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // If authenticated, apply rate limit based on User ID
    if (user && isRateLimitEnabled()) {
      const isWrite = request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE'
      const endpoint = isWrite ? 'portfolioWrite' : 'portfolioRead'

      const result = await checkRateLimit(endpoint, user.id)
      if (!result.success) return createRateLimitResponse(result)

      addRateLimitHeaders(response, result)
    }

    return response
  }

  // Skip other API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public routes without auth
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  // Create response to modify cookies (standard auth flow for Pages)
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return response
}

// Helper to create 429 response
function createRateLimitResponse(result: any) {
  return NextResponse.json({
    code: 429,
    success: false,
    message: 'Rate limit exceeded. Please slow down.',
    data: null,
    details: {
      retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
    },
  }, {
    status: 429,
    headers: {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
      'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
    },
  })
}

// Helper to add headers to response
function addRateLimitHeaders(response: NextResponse, result: any) {
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.reset.toString())
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

