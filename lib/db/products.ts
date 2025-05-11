"use server"

import { createServerSupabaseClient } from "../supabase"
import { getCurrentUser } from "../auth"

export type Product = {
  id: string
  title: string
  description?: string
  price?: number
  discount_percentage?: number
  image_url?: string
  source?: string
  source_url?: string
  rating?: number
  review_count?: number
  is_hidden?: boolean
  is_pinned?: boolean
  clicks?: number
  shares?: number
  commission?: number
  user_id?: string
  created_at?: string
  updated_at?: string
  categories?: string[]
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  let query = supabase
    .from("products")
    .select(`
      *,
      product_categories(
        category_id
      )
    `)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  // If user is authenticated, only show their products
  if (user) {
    query = query.eq("user_id", user.id)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  // Transform the data to match our expected format
  return data.map((product) => {
    const categories = product.product_categories?.map((pc) => pc.category_id) || []

    return {
      ...product,
      categories,
      product_categories: undefined,
    }
  })
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_categories(
        category_id
      )
    `)
    .eq("id", id)
    .single()

  if (error || !data) {
    console.error("Error fetching product:", error)
    return null
  }

  // Transform the data
  const categories = data.product_categories?.map((pc) => pc.category_id) || []

  return {
    ...data,
    categories,
    product_categories: undefined,
  }
}

// Create a new product
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerSupabaseClient()

  // If user_id is not provided, get the current user
  let userId = product.user_id
  if (!userId) {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }
    userId = user.id
  }

  // Extract categories before inserting
  const { categories, ...productData } = product

  // Insert the product
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...productData,
      user_id: userId,
    })
    .select("id")
    .single()

  if (error || !data) {
    console.error("Error creating product:", error)
    return { success: false, error: error?.message || "Failed to create product" }
  }

  // If categories are provided, create the relationships
  if (categories && categories.length > 0) {
    const categoryRelations = categories.map((categoryId) => ({
      product_id: data.id,
      category_id: categoryId,
    }))

    const { error: relError } = await supabase.from("product_categories").insert(categoryRelations)

    if (relError) {
      console.error("Error creating product-category relationships:", relError)
      // We don't fail the whole operation if just the categories fail
    }
  }

  return { success: true, id: data.id }
}

// Update a product
export async function updateProduct(
  id: string,
  updates: Partial<Product>,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Extract categories before updating
  const { categories, ...productUpdates } = updates

  // Update the product
  const { error } = await supabase.from("products").update(productUpdates).eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error updating product:", error)
    return { success: false, error: error.message }
  }

  // If categories are provided, update the relationships
  if (categories) {
    // First delete existing relationships
    const { error: delError } = await supabase.from("product_categories").delete().eq("product_id", id)

    if (delError) {
      console.error("Error deleting product-category relationships:", delError)
      return { success: false, error: delError.message }
    }

    // Then create new relationships
    if (categories.length > 0) {
      const categoryRelations = categories.map((categoryId) => ({
        product_id: id,
        category_id: categoryId,
      }))

      const { error: relError } = await supabase.from("product_categories").insert(categoryRelations)

      if (relError) {
        console.error("Error creating product-category relationships:", relError)
        return { success: false, error: relError.message }
      }
    }
  }

  return { success: true }
}

// Delete a product
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  // Delete the product (product_categories will be deleted via cascade)
  const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Increment product clicks
export async function incrementProductClicks(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  await supabase.rpc("increment_product_clicks", { product_id: id })
}

// Increment product shares
export async function incrementProductShares(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  await supabase.rpc("increment_product_shares", { product_id: id })
}
