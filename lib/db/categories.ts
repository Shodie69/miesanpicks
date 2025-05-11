"use server"

import { createServerSupabaseClient } from "../supabase"
import { getCurrentUser } from "../auth"

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  is_default?: boolean
  display_order?: number
  created_at?: string
  updated_at?: string
  product_count?: number
}

// Get all categories with product counts
export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient()

  // First get all categories
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  // Then get product counts for each category
  const { data: productCounts, error: countError } = await supabase
    .from("product_categories")
    .select("category_id, count")
    .select("category_id, count(*)", { count: "exact" })
    .group("category_id")

  if (countError) {
    console.error("Error fetching product counts:", countError)
    // Continue with categories but without counts
  }

  // Create a map of category_id to count
  const countMap = new Map()
  productCounts?.forEach((item) => {
    countMap.set(item.category_id, Number.parseInt(item.count))
  })

  // Add product_count to each category
  return categories.map((category) => ({
    ...category,
    product_count: countMap.get(category.id) || 0,
  }))
}

// Create a new category
export async function createCategory(
  category: Omit<Category, "id" | "created_at" | "updated_at" | "product_count">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Generate slug if not provided
  if (!category.slug) {
    category.slug = category.name.toLowerCase().replace(/\s+/g, "-")
  }

  // Insert the category
  const { data, error } = await supabase.from("categories").insert(category).select("id").single()

  if (error) {
    console.error("Error creating category:", error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data.id }
}

// Update a category
export async function updateCategory(
  id: string,
  updates: Partial<Category>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Generate slug if name is updated but slug is not
  if (updates.name && !updates.slug) {
    updates.slug = updates.name.toLowerCase().replace(/\s+/g, "-")
  }

  // Update the category
  const { error } = await supabase.from("categories").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating category:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Delete a category
export async function deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Check if it's the default category
  const { data: category } = await supabase.from("categories").select("is_default").eq("id", id).single()

  if (category?.is_default) {
    return { success: false, error: "Cannot delete the default category" }
  }

  // Delete the category
  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("Error deleting category:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Reorder categories
export async function reorderCategories(orderedIds: string[]): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Update each category's display_order
  const updates = orderedIds.map((id, index) => {
    return supabase.from("categories").update({ display_order: index }).eq("id", id)
  })

  try {
    await Promise.all(updates)
    return { success: true }
  } catch (error) {
    console.error("Error reordering categories:", error)
    return { success: false, error: "Failed to reorder categories" }
  }
}
