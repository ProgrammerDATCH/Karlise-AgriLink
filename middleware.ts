// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/settings',
  '/marketplace/checkout',
]

// Paths that are accessible only for non-authenticated users
const AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
]

// Function to check if a path matches any of the protected paths
const isProtectedPath = (path: string): boolean => {
  return PROTECTED_PATHS.some(protectedPath => path.startsWith(protectedPath))
}

// Function to check if a path matches any of the auth-only paths
const isAuthPath = (path: string): boolean => {
  return AUTH_PATHS.some(authPath => path === authPath)
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname
  
  // Get the token from cookie
  const token = request.cookies.get('token')?.value
  
  // Check if user is authenticated
  let isAuthenticated = false
  
  if (token) {
    try {
      // Verify the token
      // In a real application, this would use a proper JWT verification with the secret
      const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_jwt_secret_here')
      await jwtVerify(token, JWT_SECRET)
      isAuthenticated = true
    } catch (error) {
      // Token is invalid or expired
      isAuthenticated = false
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPath(path)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Redirect unauthenticated users away from protected pages
  if (!isAuthenticated && isProtectedPath(path)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // Continue for all other cases
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}