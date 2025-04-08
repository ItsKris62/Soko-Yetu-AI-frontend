import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/auth/reset']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  const pathname = request.nextUrl.pathname
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Allow public routes
  if (isPublic) return NextResponse.next()

  // Block if no token
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
    const decoded = jwt.decode(token) as { role: string }

    // Role-based protection
    if (pathname.startsWith('/my-products') && decoded.role !== 'farmer') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (pathname.startsWith('/insights') && decoded.role !== 'buyer') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/messages/:path*',
    '/insights/:path*',
    '/my-products/:path*',
  ],
}
