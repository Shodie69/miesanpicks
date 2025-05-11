import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/db/seed"

export async function POST() {
  try {
    const result = await seedDatabase()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { success: false, message: "Failed to seed database: " + (error.message || "Unknown error") },
      { status: 500 },
    )
  }
}
