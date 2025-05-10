import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Instagram, Twitter, Share2 } from "lucide-react"
import { getShopData, getProducts } from "@/lib/shop-data"

export default async function ShopPage() {
  const shopData = await getShopData()
  const products = await getProducts()

  return (
    <div className="max-w-3xl mx-auto bg-white">
      {/* Profile Header */}
      <div className="relative h-32 bg-amber-100/50">
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
          <div className="relative">
            <Image
              src={shopData.profileImage || "/placeholder.svg?height=80&width=80"}
              alt="Profile picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-white"
            />
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
              <span className="text-xs font-bold">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 pb-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <h1 className="text-xl font-bold text-yellow-500">{shopData.name}</h1>
        </div>
        <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
          @{shopData.handle}
          <Badge variant="outline" className="h-4 ml-1 px-1 rounded-sm">
            <span className="text-[10px]">C</span>
          </Badge>
        </p>
        <div className="flex gap-3 mt-2 justify-center">
          {shopData.socialLinks.facebook && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <Facebook className="h-4 w-4" />
            </Button>
          )}
          {shopData.socialLinks.twitter && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <Twitter className="h-4 w-4" />
            </Button>
          )}
          {shopData.socialLinks.instagram && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <Instagram className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          <Tabs defaultValue="everything">
            <TabsList className="bg-transparent h-9 p-0">
              {shopData.categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-md px-3 h-8 text-xs"
                >
                  {category.name} ({category.count})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden">
            <div className="relative h-40 bg-gray-100">
              {product.image ? (
                <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg font-bold">{product.title.substring(0, 1)}</h3>
                </div>
              )}
              {product.discount && (
                <div className="absolute bottom-0 right-0 p-1 bg-red-500 text-white text-[10px]">
                  -{product.discount}%
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-xs font-medium line-clamp-2">{product.title}</p>
              <div className="flex items-center mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-[10px] text-gray-500">{product.source}</span>
                </div>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-2 h-2 ${
                          star <= product.rating ? "text-orange-400" : "text-gray-300"
                        } fill-current`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500">({product.reviewCount})</span>
                </div>
              )}
              {product.price && <p className="text-xs font-semibold mt-1">₱ {product.price.toLocaleString()}</p>}
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span>${product.commission || 0}</span>
                  <span>•</span>
                  <span>{product.clicks || 0}</span>
                  <span>•</span>
                  <span>{product.shares || 0}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
