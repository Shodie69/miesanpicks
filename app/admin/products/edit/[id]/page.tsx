"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import ImageUpload from "@/components/image-upload"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function EditProductPage({ params }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [product, setProduct] = useState(null)
  const [activeTab, setActiveTab] = useState("details")
  const [categories, setCategories] = useState([])
  const supabase = createClientSupabaseClient()

  // Form state
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [category, setCategory] = useState("everything")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isHidden, setIsHidden] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  useEffect(() => {
    // Check for authentication
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
        return
      }

      // Fetch product and categories
      fetchProduct()
      fetchCategories()
    }

    checkAuth()
  }, [id, router, supabase])

  const fetchProduct = async () => {
    try {
      const productData = await getProductById(id)

      if (!productData) {
        toast({
          title: "Product not found",
          description: "The requested product could not be found",
          variant: "destructive",
        })
        router.push("/admin/products")
        return
      }

      setProduct(productData)

      // Set form values
      setTitle(productData.title || "")
      setPrice(productData.price?.toString() || "")
      setDiscount(productData.discount_percentage?.toString() || "")
      setCategory(productData.categories?.[0] || "everything")
      setDescription(productData.description || "")
      setImageUrl(productData.image_url || "")
      setIsHidden(productData.is_hidden || false)
      setIsPinned(productData.is_pinned || false)

      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
      router.push("/admin/products")
    }
  }

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      })
    }
  }

  const handleImageUploaded = (url: string) => {
    setImageUrl(url)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Validate form
      if (!title.trim()) {
        toast({
          title: "Title required",
          description: "Please enter a product title",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // Prepare product data
      const productData = {
        title,
        description,
        price: price ? Number.parseFloat(price) : null,
        discount_percentage: discount ? Number.parseFloat(discount) : null,
        image_url: imageUrl,
        is_hidden: isHidden,
        is_pinned: isPinned,
        categories: [category],
      }

      // Update product
      const result = await updateProduct(id, productData)

      if (!result.success) {
        throw new Error(result.error || "Failed to update product")
      }

      toast({
        title: "Product updated",
        description: "The product has been successfully updated",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteProduct(id)

      if (!result.success) {
        throw new Error(result.error || "Failed to delete product")
      }

      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted",
        variant: "destructive",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Edit the basic information about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                      <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                      <Input
                        id="discount"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="0"
                        type="number"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Update the product image or video</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Product Image</Label>
                    <ImageUpload
                      initialImage={imageUrl}
                      onImageUploaded={handleImageUploaded}
                      onImageRemoved={() => setImageUrl("")}
                      className="h-64"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
                <CardDescription>Configure additional settings for this product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Visibility</h3>
                    <p className="text-sm text-gray-500">Hide this product from your shop</p>
                  </div>
                  <Switch checked={isHidden} onCheckedChange={setIsHidden} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pin to Top</h3>
                    <p className="text-sm text-gray-500">Pin this product to the top of your shop</p>
                  </div>
                  <Switch checked={isPinned} onCheckedChange={setIsPinned} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Source</h3>
                    <p className="text-sm text-gray-500">{product.source}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Product"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
