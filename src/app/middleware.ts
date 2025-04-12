import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/reset-password']
const ROLE_ROUTES: Record<string, string[]> = {
  farmer: ['/farmer-dashboard', '/my-products'],
  buyer: ['/buyer-dashboard', '/insights'],
  admin: ['/admin/dashboard'],
}

function getUserFromToken(token: string) {
  try {
    const decoded = jwt.decode(token) as { role: string }
    return decoded
  } catch {
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Allow public pages without auth
  if (isPublic && !token) return NextResponse.next()

  // If authenticated and hitting /auth/* → redirect to dashboard
  if (isPublic && token) {
    const user = getUserFromToken(token)
    if (user?.role) {
      const dashboardPath = getDashboardForRole(user.role)
      return NextResponse.redirect(new URL(dashboardPath, request.url))
    }
  }

  // Require login for all other routes
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const user = getUserFromToken(token)
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const allowedRoutes = ROLE_ROUTES[user.role] || []

  const isAllowed = allowedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (!isAllowed && pathname !== '/unauthorized') {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return NextResponse.next()
}

function getDashboardForRole(role: string) {
  switch (role) {
    case 'farmer':
      return '/farmer-dashboard'
    case 'buyer':
      return '/buyer-dashboard'
    case 'admin':
      return '/admin/dashboard'
    default:
      return '/dashboard'
  }
}

export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|images|fonts).*)',
  ],
}
