"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Loader2, X, Upload, LinkIcon, Wand } from "lucide-react"
import ProductLinkPreview from "@/components/product-link-preview"

export default function AddProductPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("link")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isGeneratingReview, setIsGeneratingReview] = useState(false)
  const [productInfo, setProductInfo] = useState<{
    title: string
    image: string
    price?: string
    isCommissionable?: boolean
    category?: string
  } | null>(null)
  const [productReview, setProductReview] = useState("")
  const [category, setCategory] = useState("everything")
  const [language, setLanguage] = useState("english")

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Determine category based on URL
      let detectedCategory = "everything"
      if (url.toLowerCase().includes("tablet")) detectedCategory = "tablet"
      if (url.toLowerCase().includes("laptop")) detectedCategory = "laptops"
      if (url.toLowerCase().includes("keyboard")) detectedCategory = "keyboard"
      if (url.toLowerCase().includes("mouse")) detectedCategory = "mousepad"

      // Mock extracted data
      const mockInfo = {
        title: url.includes("shopee")
          ? "Hamisan Hijo Soap 10pcs | Shopee Philippines"
          : "Product from " + (new URL(url).hostname || "Unknown"),
        image: "/placeholder.svg?height=160&width=160",
        price: "299",
        isCommissionable: true,
        category: detectedCategory,
      }

      setProductInfo(mockInfo)
      setCategory(detectedCategory)

      toast({
        title: "Product info extracted",
        description: "Title and thumbnail have been extracted successfully",
      })
    } catch (error) {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock review
      const review = `This ${productInfo.title.split("|")[0]} exceeded my expectations! The quality is outstanding, and it's exactly what I was looking for. Shipping was fast and the packaging was secure. I've been using it for a few weeks now and it still works perfectly. The design is sleek and modern, and it fits well with my other devices. I would definitely recommend this product to anyone looking for a reliable and high-quality option.`

      setProductReview(review)
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
      // Update product info with selected category
      const updatedProductInfo = {
        ...productInfo,
        category: category,
      }

      // Save product logic would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call

      toast({
        title: "Product saved",
        description: "Your product has been added to your shop",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save the product",
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
                      {url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => setUrl("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
                      <Label>Thumbnail</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                          {productInfo.image ? (
                            <img
                              src={productInfo.image || "/placeholder.svg"}
                              alt="Product thumbnail"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <LinkIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <Button variant="outline" className="h-9">
                          <Upload className="h-4 w-4 mr-2" /> Upload Image/Video
                        </Button>
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
                            <SelectItem value="everything">Everything</SelectItem>
                            <SelectItem value="tablet">Tablet</SelectItem>
                            <SelectItem value="laptops">Laptop</SelectItem>
                            <SelectItem value="keyboard">Keyboard</SelectItem>
                            <SelectItem value="mousepad">Mousepad</SelectItem>
                            <SelectItem value="guide">Guide</SelectItem>
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

                    <Button
                      className="w-full bg-orange-500 hover:bg-orange-600"
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

                    <p className="text-xs text-center text-gray-500">
                      <a href="#" className="text-orange-500 hover:underline">
                        Click here
                      </a>{" "}
                      to read offer information from advertiser
                    </p>
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
                        "Generate Product Review"
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ProductLinkPreview title={productInfo.title} image={productInfo.image} url={url} />

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">AI-Generated Review</h3>
                      <p className="text-sm text-gray-700">{productReview}</p>
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleGenerateReview}>
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
