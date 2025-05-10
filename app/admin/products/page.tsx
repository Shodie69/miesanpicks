"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, GripVertical } from "lucide-react"
import Link from "next/link"
import { getProducts } from "@/lib/shop-data"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/product-card"
import { toast } from "@/hooks/use-toast"

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("everything")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([
    { id: "everything", name: "Everything", count: 0 },
    { id: "tablet", name: "Tablet", count: 0 },
    { id: "laptop", name: "Laptop", count: 0 },
    { id: "keyboard", name: "Keyboard", count: 0 },
    { id: "mousepad", name: "Mousepad", count: 0 },
  ])

  useEffect(() => {
    // Check for authentication
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("isLoggedIn") === "true" ||
      document.cookie.includes("auth-token=")

    if (!isLoggedIn) {
      redirect("/login")
    }

    // Fetch products
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts()
        setProducts(productsData)

        // Update category counts
        const updatedCategories = [...categories]
        updatedCategories[0].count = productsData.length // Everything category

        // Count products in each category
        productsData.forEach((product) => {
          const category = product.category || "everything"
          const categoryIndex = updatedCategories.findIndex((c) => c.id === category)
          if (categoryIndex > 0) {
            updatedCategories[categoryIndex].count += 1
          }
        })

        setCategories(updatedCategories)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(products)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setProducts(items)
    toast({
      title: "Products reordered",
      description: "The display order has been updated",
    })
  }

  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (activeCategory !== "everything" && product.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/add">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="everything" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-transparent h-9 p-0 w-full flex justify-start overflow-x-auto">
            {categories.map((category) => (
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

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200 animate-pulse"></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="products" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filteredProducts.map((product, index) => (
                  <Draggable key={product.id} draggableId={product.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} className="relative">
                        <div
                          {...provided.dragHandleProps}
                          className="absolute top-2 left-2 z-10 bg-black/30 rounded-full p-1 cursor-move"
                        >
                          <GripVertical className="h-4 w-4 text-white" />
                        </div>
                        <ProductCard product={product} isLoggedIn={true} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}
