import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // If the user is navigating to login or onboarding, let them pass
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/onboarding')) {
    return NextResponse.next()
  }

  // Check for the mock auth cookie
  const authCookie = request.cookies.get('auth')

  // If not authenticated, redirect to login
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - logo.png (public files)
     * - any .svg files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png|.*\\.svg).*)',
  ],
}
