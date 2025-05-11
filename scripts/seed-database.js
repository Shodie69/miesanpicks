// This script seeds the database with sample data
// Run with: node scripts/seed-database.js

const seedDatabase = async () => {
  try {
    console.log("Seeding database...")

    const response = await fetch("http://localhost:3000/api/seed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ Database seeded successfully!")
      console.log(result.message)
    } else {
      console.error("❌ Failed to seed database:")
      console.error(result.message)
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error.message)
  }
}

seedDatabase()
