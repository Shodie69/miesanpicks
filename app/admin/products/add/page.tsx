"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2, LinkIcon, Wand } from "lucide-react"
import ProductLinkPreview from "@/components/product-link-preview"
import { extractProductInfo } from "@/lib/product-extractor"
import { generateProductReview } from "@/lib/ai-review-generator"
import ImageUpload from "@/components/image-upload"
import { createProduct } from "@/lib/db/products"
import { getCategories } from "@/lib/db/categories"
import { createClientSupabaseClient } from "@/lib/supabase"

export default function AddProductPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("link")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isGeneratingReview, setIsGeneratingReview] = useState(false)
  const [productInfo, setProductInfo] = useState<{
    title: string
    image_url?: string
    price?: string | number
    isCommissionable?: boolean
    category?: string
    description?: string
  } | null>(null)
  const [productReview, setProductReview] = useState("")
  const [category, setCategory] = useState("everything")
  const [language, setLanguage] = useState("english")
  const [categories, setCategories] = useState([])
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    // Check for authentication
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
        return
      }

      // Fetch categories
      fetchCategories()
    }

    checkAuth()
  }, [router, supabase])

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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  }

  const handleExtractInfo = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a product URL",
        variant: "destructive",
      })
      return
    }

    setIsExtracting(true)

    try {
      // Extract product info
      const extractedInfo = await extractProductInfo(url)

      setProductInfo(extractedInfo)
      if (extractedInfo.category) {
        setCategory(extractedInfo.category)
      }

      toast({
        title: "Product info extracted",
        description: "Title and thumbnail have been extracted successfully",
      })
    } catch (error) {
      console.error("Extraction error:", error)
      toast({
        title: "Extraction failed",
        description: "Could not extract product information from the URL",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleGenerateReview = async () => {
    if (!productInfo?.title) {
      toast({
        title: "Product info required",
        description: "Please extract product information first",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingReview(true)

    try {
      // Generate review using AI
      const review = await generateProductReview(productInfo.title)
      setProductReview(review)

      // Update product info with the review as description
      setProductInfo({
        ...productInfo,
        description: review,
      })

      toast({
        title: "Review generated",
        description: "AI-generated review is ready",
      })
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate product review",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingReview(false)
    }
  }

  const handleImageUploaded = (url: string) => {
    if (productInfo) {
      setProductInfo({
        ...productInfo,
        image_url: url,
      })
    }
  }

  const handleSave = async () => {
    if (!productInfo) {
      toast({
        title: "Product info required",
        description: "Please extract product information first",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare product data
      const productData = {
        title: productInfo.title,
        description: productInfo.description || productReview,
        price: typeof productInfo.price === "string" ? Number.parseFloat(productInfo.price) : productInfo.price,
        image_url: productInfo.image_url,
        source: new URL(url).hostname.replace("www.", ""),
        source_url: url,
        categories: [category],
      }

      // Create product
      const result = await createProduct(productData)

      if (!result.success) {
        throw new Error(result.error || "Failed to create product")
      }

      toast({
        title: "Product saved",
        description: "Your product has been added to your shop",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Save failed",
        description: error.message || "Could not save the product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Product Link</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="link">
            <Card>
              <CardHeader>
                <CardTitle>Product Link</CardTitle>
                <CardDescription>Add a link to a product from any marketplace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">Link</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="url"
                        placeholder="https://example.com/product"
                        value={url}
                        onChange={handleUrlChange}
                      />
                    </div>
                    <Button onClick={handleExtractInfo} disabled={isExtracting || !url}>
                      {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract"}
                    </Button>
                  </div>
                  {productInfo?.isCommissionable && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Link is commissionable
                    </p>
                  )}
                </div>

                {productInfo && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={productInfo.title}
                        onChange={(e) => setProductInfo({ ...productInfo, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₱</span>
                        <Input
                          id="price"
                          type="number"
                          value={productInfo.price || ""}
                          onChange={(e) => setProductInfo({ ...productInfo, price: e.target.value })}
                          className="pl-8"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSave}
                  disabled={isLoading || !productInfo}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Upload images for your product</CardDescription>
              </CardHeader>
              <CardContent>
                {!productInfo ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please extract product information first</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab("link")}>
                      Go to Link Tab
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="mb-2 block">Product Image</Label>
                        <ImageUpload
                          initialImage={productInfo.image_url}
                          onImageUploaded={handleImageUploaded}
                          onImageRemoved={() => setProductInfo({ ...productInfo, image_url: undefined })}
                          className="h-64"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSave}
                  disabled={isLoading || !productInfo}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="review">
            <Card>
              <CardHeader>
                <CardTitle>Product Review</CardTitle>
                <CardDescription>What people are saying about this product</CardDescription>
              </CardHeader>
              <CardContent>
                {!productInfo ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Please extract product information first</p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab("link")}>
                      Go to Link Tab
                    </Button>
                  </div>
                ) : !productReview ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-medium text-lg mb-4">What people are saying about this product</h3>

                    <div className="space-y-6">
                      <div className="flex gap-3">
                        <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                          <LinkIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Step 1</h4>
                          <p className="text-gray-600 text-sm">Add your favourite marketplace link.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Step 2</h4>
                          <p className="text-gray-600 text-sm">Our AI will summarise the product review for you.</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                          <svg
                            className="h-4 w-4 text-blue-600"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Step 3</h4>
                          <p className="text-gray-600 text-sm">Generate Product Review and watch the magic happen!</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
                      onClick={handleGenerateReview}
                      disabled={isGeneratingReview}
                    >
                      {isGeneratingReview ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Review...
                        </>
                      ) : (
                        <>
                          <Wand className="h-4 w-4 mr-2" />
                          Generate Product Review
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ProductLinkPreview title={productInfo.title} image={productInfo.image_url} url={url} />

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">AI-Generated Review</h3>
                      <p className="text-sm text-gray-700">{productReview}</p>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleGenerateReview}>
                      <Wand className="h-4 w-4 mr-2" />
                      Regenerate Review
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleSave}
                  disabled={isLoading || !productInfo}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
