import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  const isAdminRoute = path.startsWith("/admin")

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If trying to access admin routes without authentication, redirect to login
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return res
}

// Configure the paths that should trigger this middleware
export const config = {
  matcher: ["/admin/:path*"],
}
