"use server"

import { cookies } from "next/headers"

// This is a simple authentication function for demo purposes
// In a real application, you would use a proper authentication system
export async function authenticate(username: string, password: string): Promise<boolean> {
  // For demo purposes, we'll use a hardcoded admin user
  // In a real application, you would check against a database
  if (username === "admin" && password === "password") {
    // Set a cookie to indicate the user is logged in
    cookies().set("auth-token", "demo-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return true
  }

  return false
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get("auth-token")
  return !!token
}

export async function logout(): Promise<void> {
  cookies().delete("auth-token")
}
