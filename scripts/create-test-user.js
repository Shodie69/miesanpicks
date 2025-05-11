// This script creates a test user in Supabase Auth
// Run with: node scripts/create-test-user.js

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  try {
    console.log("Creating test user in Supabase Auth...")

    const testEmail = "admin@example.com"
    const testPassword = "password123"

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.getUserByEmail(testEmail)

    if (checkError && checkError.message !== "User not found") {
      console.error("Error checking for existing user:", checkError.message)
      return
    }

    if (existingUser?.user) {
      console.log("Test user already exists:", existingUser.user.id)
      return
    }

    // Create user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
    })

    if (error) {
      console.error("Error creating test user:", error.message)
      return
    }

    console.log("✅ Test user created successfully!")
    console.log(`Email: ${testEmail}`)
    console.log(`Password: ${testPassword}`)
    console.log(`User ID: ${data.user.id}`)

    // Update the user_id in the products table to match the new auth user
    const { error: updateError } = await supabase
      .from("products")
      .update({ user_id: data.user.id })
      .eq("user_id", "00000000-0000-0000-0000-000000000000")

    if (updateError) {
      console.error("Error updating product user_id:", updateError.message)
    } else {
      console.log("✅ Updated product user_id to match the new auth user")
    }

    // Update the user profile to match the new auth user
    const { error: profileError } = await supabase.from("users").update({ id: data.user.id }).eq("email", testEmail)

    if (profileError) {
      console.error("Error updating user profile:", profileError.message)
    } else {
      console.log("✅ Updated user profile to match the new auth user")
    }
  } catch (error) {
    console.error("Unexpected error:", error.message)
  }
}

createTestUser()
