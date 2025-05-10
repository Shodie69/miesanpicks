"use server"

// This file contains mock data for the shop
// In a real application, you would fetch this data from a database

export async function getShopData() {
  return {
    name: "Mie-san",
    handle: "lmcabilao",
    profileImage: "/placeholder.svg?height=80&width=80",
    socialLinks: {
      facebook: "https://www.facebook.com/youarewelcomeph/",
      twitter: "",
      instagram: "",
      tiktok: "https://www.tiktok.com/@lmcabilao",
      youtube: "",
    },
    analyticsDateRange: "May 09, 2023 - May 10, 2023",
    analytics: {
      views: 36,
      clicks: 17,
      conversions: 0,
      earnings: 0.0,
    },
    categories: [
      { id: "everything", name: "Everything", count: 6 },
      { id: "tablet", name: "Tablet", count: 1 },
      { id: "ipad", name: "Ipad", count: 1 },
      { id: "laptops", name: "Laptops", count: 1 },
      { id: "mousepad", name: "Mousepad", count: 1 },
    ],
  }
}

export async function getProducts() {
  return [
    {
      id: "1",
      title: "Shopple's Starter Guide for You",
      image: "/placeholder.svg?height=160&width=160",
      source: "shopple.ph",
      clicks: 1,
      shares: 0,
      commission: 0,
      category: "guide",
    },
    {
      id: "2",
      title: "NUMVIBE P60 Pro Max New 5G Tablet Android Original Computer WiFi Dual SIM",
      image: "/placeholder.svg?height=160&width=160",
      price: 2699,
      source: "shopple.ph",
      rating: 5,
      reviewCount: 114,
      discount: 10,
      clicks: 1,
      shares: 3,
      commission: 0,
      category: "tablet",
    },
    {
      id: "3",
      title: "(SONTU®) Tablet Mini 1 2 3 4 (Best Quality Guaranteed)",
      image: "/placeholder.svg?height=160&width=160",
      source: "shopple.ph",
      clicks: 1,
      shares: 0,
      commission: 0,
      category: "tablet",
    },
    {
      id: "4",
      title: "K221 Kechi K7 Pro+ Wireless Three-Mode Mechanical Keyboard",
      image: "/placeholder.svg?height=160&width=160",
      price: 2899,
      source: "shopple.ph",
      rating: 5,
      reviewCount: 222,
      discount: 15,
      clicks: 0,
      shares: 6,
      commission: 0,
      category: "keyboard",
    },
    {
      id: "5",
      title: "Lenovo Laptop | Intel i7/i5/i3 & Celeron 4GB 16GB RAM 128GB SSD",
      image: "/placeholder.svg?height=160&width=160",
      price: 2999,
      source: "shopple.ph",
      rating: 5,
      reviewCount: 321,
      discount: 5,
      clicks: 0,
      shares: 0,
      commission: 0,
      category: "laptops",
    },
    {
      id: "6",
      title: "ARTISAN mouse pad NINJA FX Zero ( S / M / L / XL | Soft / Mid / Hard )",
      image: "/placeholder.svg?height=160&width=160",
      price: 2200,
      source: "shopple.ph",
      rating: 5,
      reviewCount: 84,
      clicks: 10,
      shares: 0,
      commission: 0,
      category: "mousepad",
    },
  ]
}

export async function getProductById(id: string) {
  const products = await getProducts()
  return products.find((product) => product.id === id)
}
