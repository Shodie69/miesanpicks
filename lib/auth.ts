"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "./supabase"
import { redirect } from "next/navigation"

// Authenticate user with email and password
export async function authenticate(
  email: string,
  password: string,
): Promise<{
  success: boolean
  message?: string
  user?: any
}> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  // Set session cookie
  const { data: sessionData } = await supabase.auth.getSession()

  if (sessionData?.session) {
    cookies().set("sb-auth-token", sessionData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  }

  return {
    success: true,
    user: data.user,
  }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.auth.getSession()
  return !!data.session
}

// Get current user
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()

  const { data } = await supabase.auth.getUser()
  return data?.user
}

// Logout function
export async function logout(): Promise<void> {
  const supabase = createServerSupabaseClient()

  await supabase.auth.signOut()
  cookies().delete("sb-auth-token")
}

// Protect route - use in server components
export async function protectRoute() {
  const isAuthed = await isAuthenticated()

  if (!isAuthed) {
    redirect("/login")
  }
}
