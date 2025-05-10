"use server"

import { cookies } from "next/headers"

// Simple authentication function for demo purposes
export async function authenticate(username: string, password: string): Promise<boolean> {
  // For demo purposes, we'll use a hardcoded admin user
  if (username === "admin" && password === "password") {
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

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get("auth-token")
  return !!token
}

// Logout function
export async function logout(): Promise<void> {
  cookies().delete("auth-token")
}
