import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getShopData, getProducts } from "@/lib/shop-data"
import ProductCard from "@/components/product-card"
import ShopHeader from "@/components/shop-header"

export default async function ShopPage() {
  const shopData = await getShopData()
  const products = await getProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <ShopHeader shopData={shopData} isLoggedIn={false} />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto bg-white">
          {/* Categories/Tabs Section */}
          <div className="px-4 py-2 flex items-center overflow-x-auto scrollbar-hide">
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
              <ProductCard key={product.id} product={product} isLoggedIn={false} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
