import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag, TrendingUp } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import { getUserProfile } from "@/lib/db/users"
import { protectRoute } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase"

export default async function AdminDashboard() {
  // Protect this route
  await protectRoute()

  // Get Supabase client
  const supabase = createServerSupabaseClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null // This should be handled by protectRoute, but just in case
  }

  // Get data
  const products = await getProducts()
  const categories = await getCategories()
  const userProfile = await getUserProfile(user.id)

  // Calculate analytics data from products
  const analytics = {
    views: 36, // Mock data for now
    clicks: products.reduce((sum, product) => sum + (product.clicks || 0), 0),
    conversions: 0, // Mock data for now
    earnings: products.reduce((sum, product) => sum + (product.commission || 0), 0),
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/admin/products/add">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Views</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {analytics.views}
              <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Clicks</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {analytics.clicks}
              <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversions</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {analytics.conversions}
              <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Earnings</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              ${analytics.earnings.toFixed(2)}
              <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>You have {products.length} products in your shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <ShoppingBag className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{product.title}</p>
                    <p className="text-xs text-gray-500">{product.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱ {product.price?.toLocaleString() || "N/A"}</p>
                  <p className="text-xs text-gray-500">{product.clicks || 0} clicks</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link href="/admin/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
