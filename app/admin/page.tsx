import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { getShopData, getProducts } from "@/lib/shop-data"
import ProductCard from "@/components/product-card"
import ShopHeader from "@/components/shop-header"
import AnalyticsSection from "@/components/analytics-section"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminShopPage() {
  // Check for authentication cookie
  const hasAuthCookie = cookies().has("auth-token")

  // Redirect if not authenticated
  if (!hasAuthCookie) {
    redirect("/login")
  }

  const shopData = await getShopData()
  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <ShopHeader shopData={shopData} isLoggedIn={true} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto bg-white">
          {/* Analytics Section */}
          <AnalyticsSection analytics={shopData.analytics} dateRange={shopData.analyticsDateRange} />

          {/* Links Section with Add Link Button */}
          <div className="px-6 py-2 flex justify-between items-center">
            <h2 className="font-semibold text-sm">Links</h2>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-md h-8 px-3 text-xs">
              <Plus className="h-3 w-3 mr-1" /> Add Link
            </Button>
          </div>

          {/* Categories/Tabs Section */}
          <div className="px-4 py-2 flex items-center overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>

            <Tabs defaultValue="everything" className="w-full">
              <TabsList className="bg-transparent h-9 p-0 w-full flex justify-start">
                {shopData.categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md px-3 h-8 text-xs whitespace-nowrap"
                  >
                    {category.name} ({category.count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 gap-3 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} isLoggedIn={true} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
