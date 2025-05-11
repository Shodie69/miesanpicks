"use client"

import { useState } from "react"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2, Database } from "lucide-react"
import { seedDatabase } from "@/lib/db/seed"

export default function SeedDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null)

  const handleSeedDatabase = async () => {
    if (!confirm("Are you sure you want to seed the database? This will add sample data.")) {
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const result = await seedDatabase()
      setResult(result)

      if (result.success) {
        toast({
          title: "Database seeded",
          description: result.message,
        })
      } else {
        toast({
          title: "Seeding failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      setResult({
        success: false,
        message: "An unexpected error occurred",
      })
      toast({
        title: "Error",
        description: "An unexpected error occurred while seeding the database",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Database Management</h1>

        <Card>
          <CardHeader>
            <CardTitle>Seed Database</CardTitle>
            <CardDescription>
              Add sample data to your database for testing purposes. This will create categories and products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Warning:</strong> This action will add sample data to your database. It's designed to be run
                only once when setting up a new database.
              </p>
            </div>

            {result && (
              <div
                className={`${
                  result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                } border rounded-md p-4 mb-4`}
              >
                <p className={`${result.success ? "text-green-800" : "text-red-800"} text-sm`}>{result.message}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSeedDatabase} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}
