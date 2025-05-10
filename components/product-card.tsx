"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Share2, MoreVertical, Edit, Eye, EyeOff, Pin, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    title: string
    image?: string
    price?: number
    source: string
    rating?: number
    reviewCount?: number
    discount?: number
    clicks?: number
    shares?: number
    commission?: number
    category?: string
    isHidden?: boolean
    isPinned?: boolean
  }
  isLoggedIn: boolean
}

export default function ProductCard({ product, isLoggedIn }: ProductCardProps) {
  const router = useRouter()
  const [isHidden, setIsHidden] = useState(product.isHidden || false)
  const [isPinned, setIsPinned] = useState(product.isPinned || false)

  const handleEdit = () => {
    router.push(`/admin/products/edit/${product.id}`)
  }

  const handleToggleVisibility = () => {
    setIsHidden(!isHidden)
    toast({
      title: isHidden ? "Product visible" : "Product hidden",
      description: `${product.title} is now ${isHidden ? "visible" : "hidden"}`,
    })
  }

  const handleTogglePin = () => {
    setIsPinned(!isPinned)
    toast({
      title: isPinned ? "Product unpinned" : "Product pinned",
      description: `${product.title} has been ${isPinned ? "unpinned" : "pinned"}`,
    })
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      toast({
        title: "Product deleted",
        description: `${product.title} has been deleted`,
        variant: "destructive",
      })
    }
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${isHidden ? "opacity-60" : ""} ${isPinned ? "ring-2 ring-orange-500" : ""}`}
    >
      <div className="relative h-40 bg-gray-100">
        {product.image ? (
          <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-lg font-bold">{product.title.substring(0, 1)}</h3>
          </div>
        )}

        {product.discount && (
          <div className="absolute bottom-0 right-0 p-1 bg-red-500 text-white text-[10px]">-{product.discount}%</div>
        )}

        {isPinned && <div className="absolute top-0 left-0 p-1 bg-orange-500 text-white text-[10px]">PINNED</div>}

        {isLoggedIn && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 bg-white/80 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleVisibility} className="cursor-pointer">
                  {isHidden ? (
                    <>
                      <Eye className="h-4 w-4 mr-2" /> Show
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" /> Hide
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePin} className="cursor-pointer">
                  <Pin className="h-4 w-4 mr-2" /> {isPinned ? "Unpin" : "Pin"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                  className={`w-2 h-2 ${star <= product.rating! ? "text-orange-400" : "text-gray-300"} fill-current`}
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

        {product.category && (
          <div className="mt-1">
            <Badge variant="outline" className="text-[10px] px-1 py-0">
              {product.category}
            </Badge>
          </div>
        )}

        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span>${product.commission || 0}</span>
            <span>•</span>
            <span>{product.clicks || 0}</span>
            <span>•</span>
            <span>{product.shares || 0}</span>
          </div>
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Share2 className="h-3 w-3" />
            </Button>
          ) : (
            <Link href={`/product/${product.id}`}>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Share2 className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
        {product.title.includes("Starter Guide") && (
          <Button variant="ghost" size="sm" className="w-full h-7 text-[10px] mt-1 justify-start">
            Learn More
          </Button>
        )}
      </div>
    </div>
  )
}
