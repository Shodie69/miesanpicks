import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  const isAdminRoute = path.startsWith("/admin")

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("auth-token")

  // If trying to access admin routes without authentication, redirect to login
  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: ["/admin/:path*"],
}
