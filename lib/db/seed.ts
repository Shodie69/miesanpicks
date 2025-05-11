"use server"

import { createServerSupabaseClient } from "../supabase"

export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  const supabase = createServerSupabaseClient()

  try {
    // Check if we already have categories
    const { data: existingCategories } = await supabase.from("categories").select("id").limit(1)

    if (existingCategories && existingCategories.length > 0) {
      return { success: false, message: "Database already has data" }
    }

    // Create a test user if it doesn't exist
    const testEmail = "admin@example.com"
    const testPassword = "password123"

    // Create user in auth
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    })

    if (authError) {
      console.error("Error creating test user:", authError)
      return { success: false, message: `Failed to create test user: ${authError.message}` }
    }

    const userId = newUser.user.id

    // Create user profile
    const { error: profileError } = await supabase.from("users").insert({
      id: userId,
      email: testEmail,
      username: "admin",
      full_name: "Admin User",
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      return { success: false, message: `Failed to create user profile: ${profileError.message}` }
    }

    // Create default categories
    const categoryData = [
      { name: "Everything", slug: "everything", is_default: true, display_order: 0 },
      { name: "Tablet", slug: "tablet", display_order: 1 },
      { name: "Laptop", slug: "laptop", display_order: 2 },
      { name: "Keyboard", slug: "keyboard", display_order: 3 },
      { name: "Mousepad", slug: "mousepad", display_order: 4 },
      { name: "Guide", slug: "guide", display_order: 5 },
    ]

    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .insert(categoryData)
      .select("id, slug")

    if (categoryError) {
      console.error("Error creating categories:", categoryError)
      return { success: false, message: `Failed to create categories: ${categoryError.message}` }
    }

    // Create a map of slug to category ID
    const categoryMap = {}
    categories.forEach((cat) => {
      categoryMap[cat.slug] = cat.id
    })

    // Create sample products
    const productsData = [
      {
        title: "Shopple's Starter Guide for You",
        image_url: "/placeholder.svg?height=160&width=160",
        source: "shopple.ph",
        clicks: 1,
        shares: 0,
        commission: 0,
        user_id: userId,
      },
      {
        title: "NUMVIBE P60 Pro Max New 5G Tablet Android Original Computer WiFi Dual SIM",
        image_url: "/placeholder.svg?height=160&width=160",
        price: 2699,
        source: "shopple.ph",
        rating: 5,
        review_count: 114,
        discount_percentage: 10,
        clicks: 1,
        shares: 3,
        commission: 0,
        user_id: userId,
      },
      {
        title: "(SONTU®) Tablet Mini 1 2 3 4 (Best Quality Guaranteed)",
        image_url: "/placeholder.svg?height=160&width=160",
        source: "shopple.ph",
        clicks: 1,
        shares: 0,
        commission: 0,
        user_id: userId,
      },
      {
        title: "K221 Kechi K7 Pro+ Wireless Three-Mode Mechanical Keyboard",
        image_url: "/placeholder.svg?height=160&width=160",
        price: 2899,
        source: "shopple.ph",
        rating: 5,
        review_count: 222,
        discount_percentage: 15,
        clicks: 0,
        shares: 6,
        commission: 0,
        user_id: userId,
      },
      {
        title: "Lenovo Laptop | Intel i7/i5/i3 & Celeron 4GB 16GB RAM 128GB SSD",
        image_url: "/placeholder.svg?height=160&width=160",
        price: 2999,
        source: "shopple.ph",
        rating: 5,
        review_count: 321,
        discount_percentage: 5,
        clicks: 0,
        shares: 0,
        commission: 0,
        user_id: userId,
      },
      {
        title: "ARTISAN mouse pad NINJA FX Zero ( S / M / L / XL | Soft / Mid / Hard )",
        image_url: "/placeholder.svg?height=160&width=160",
        price: 2200,
        source: "shopple.ph",
        rating: 5,
        review_count: 84,
        clicks: 10,
        shares: 0,
        commission: 0,
        user_id: userId,
      },
    ]

    const { data: products, error: productError } = await supabase
      .from("products")
      .insert(productsData)
      .select("id, title")

    if (productError) {
      console.error("Error creating products:", productError)
      return { success: false, message: `Failed to create products: ${productError.message}` }
    }

    // Create product-category relationships
    const productCategoryRelations = [
      { product_id: products[0].id, category_id: categoryMap["guide"] },
      { product_id: products[1].id, category_id: categoryMap["tablet"] },
      { product_id: products[2].id, category_id: categoryMap["tablet"] },
      { product_id: products[3].id, category_id: categoryMap["keyboard"] },
      { product_id: products[4].id, category_id: categoryMap["laptop"] },
      { product_id: products[5].id, category_id: categoryMap["mousepad"] },
      // Add everything category to all products
      ...products.map((product) => ({ product_id: product.id, category_id: categoryMap["everything"] })),
    ]

    const { error: relationError } = await supabase.from("product_categories").insert(productCategoryRelations)

    if (relationError) {
      console.error("Error creating product-category relationships:", relationError)
      return { success: false, message: `Failed to create product-category relationships: ${relationError.message}` }
    }

    return { success: true, message: "Database seeded successfully with test user (admin@example.com / password123)" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Failed to seed database: " + (error.message || "Unknown error") }
  }
}
