"use server"

import { createServerSupabaseClient } from "../supabase"
import { getCurrentUser } from "../auth"

export type UserProfile = {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  email?: string
  created_at?: string
  updated_at?: string
}

// Get user profile
export async function getUserProfile(userId?: string): Promise<UserProfile | null> {
  const supabase = createServerSupabaseClient()

  // If no userId is provided, get the current user
  if (!userId) {
    const user = await getCurrentUser()
    if (!user) return null
    userId = user.id
  }

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error || !data) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

// Update user profile
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Don't allow updating id or email through this function
  const { id, email, ...validUpdates } = updates

  const { error } = await supabase.from("users").update(validUpdates).eq("id", user.id)

  if (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Create user profile (called after signup)
export async function createUserProfile(profile: {
  username: string
  full_name?: string
  avatar_url?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase.from("users").select("id").eq("id", user.id).single()

  if (existingProfile) {
    return { success: false, error: "Profile already exists" }
  }

  // Create new profile
  const { error } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
  })

  if (error) {
    console.error("Error creating user profile:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
