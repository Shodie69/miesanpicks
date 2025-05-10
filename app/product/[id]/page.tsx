import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getProductById } from "@/lib/shop-data"
import { Share2, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Link href="/" className="text-blue-600 hover:underline flex items-center gap-1 mb-4">
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to shop
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-64 bg-gray-100">
          {product.image ? (
            <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-2xl font-bold text-gray-400">{product.title.substring(0, 1)}</h3>
            </div>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-xl font-bold mb-2">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-500">{product.source}</span>
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= product.rating! ? "text-orange-400" : "text-gray-300"} fill-current`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>
          )}

          {product.price && (
            <div className="mb-6">
              {product.discount && (
                <p className="text-sm text-gray-500 line-through">
                  ₱ {(product.price * (1 + product.discount / 100)).toFixed(0)}
                </p>
              )}
              <p className="text-2xl font-bold text-orange-600">₱ {product.price.toLocaleString()}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              Visit Store
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
