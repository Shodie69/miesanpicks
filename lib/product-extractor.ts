"use server"

import { JSDOM } from "jsdom"

// This function extracts product information from a URL
export async function extractProductInfo(url: string) {
  try {
    // Determine which e-commerce site the URL is from
    const domain = new URL(url).hostname.toLowerCase()

    // Fetch the HTML content of the page
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // Extract based on the domain
    if (domain.includes("shopee") || url.includes("shopee.ph")) {
      return extractShopeeProduct(document, url)
    } else if (domain.includes("lazada") || url.includes("lazada.com.ph")) {
      return extractLazadaProduct(document, url)
    } else if (domain.includes("tiktok") || url.includes("tiktokglobalshop")) {
      return extractTiktokProduct(document, url)
    } else if (domain.includes("temu") || url.includes("temu.com")) {
      return extractTemuProduct(document, url)
    } else {
      // Generic extraction for other sites
      return extractGenericProduct(document, url, domain)
    }
  } catch (error) {
    console.error("Error extracting product info:", error)

    // Fallback to basic extraction if scraping fails
    return {
      title: "Product from " + new URL(url).hostname,
      image: "/placeholder.svg?height=160&width=160",
      price: "",
      isCommissionable: false,
      category: "everything",
    }
  }
}

// Shopee product extraction
function extractShopeeProduct(document: Document, url: string) {
  try {
    // Try to extract from meta tags first (more reliable)
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const metaDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Extract price - Shopee often has price in a script tag as JSON
    let price = ""
    const scripts = document.querySelectorAll("script")
    for (const script of Array.from(scripts)) {
      if (script.textContent?.includes('"price"')) {
        const match = script.textContent.match(/"price":\s*(\d+(\.\d+)?)/)
        if (match && match[1]) {
          price = match[1]
          break
        }
      }
    }

    // Determine category based on title and description
    let category = "everything"
    const titleAndDesc = (metaTitle || "") + " " + (metaDescription || "")
    const lowerText = titleAndDesc.toLowerCase()

    if (lowerText.includes("tablet") || lowerText.includes("ipad")) {
      category = "tablet"
    } else if (lowerText.includes("laptop") || lowerText.includes("notebook")) {
      category = "laptops"
    } else if (lowerText.includes("keyboard")) {
      category = "keyboard"
    } else if (lowerText.includes("mouse") || lowerText.includes("pad")) {
      category = "mousepad"
    }

    return {
      title: metaTitle || document.title || "Shopee Product",
      image: metaImage || "/placeholder.svg?height=160&width=160",
      price: price,
      isCommissionable: true,
      category: category,
    }
  } catch (error) {
    console.error("Error extracting Shopee product:", error)
    return fallbackExtraction(url, "Shopee")
  }
}

// Lazada product extraction
function extractLazadaProduct(document: Document, url: string) {
  try {
    // Try to extract from meta tags first
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")
    const metaDescription = document.querySelector('meta[property="og:description"]')?.getAttribute("content")

    // Extract price
    let price = ""
    const priceElement = document.querySelector("[data-price]")
    if (priceElement) {
      price = priceElement.getAttribute("data-price") || ""
    }

    // Try to find price in script tags if not found in DOM
    if (!price) {
      const scripts = document.querySelectorAll("script")
      for (const script of Array.from(scripts)) {
        if (script.textContent?.includes('"price"')) {
          const match = script.textContent.match(/"price":\s*"?(\d+(\.\d+)?)"?/)
          if (match && match[1]) {
            price = match[1]
            break
          }
        }
      }
    }

    // Determine category
    let category = "everything"
    const titleAndDesc = (metaTitle || "") + " " + (metaDescription || "")
    const lowerText = titleAndDesc.toLowerCase()

    if (lowerText.includes("tablet") || lowerText.includes("ipad")) {
      category = "tablet"
    } else if (lowerText.includes("laptop") || lowerText.includes("notebook")) {
      category = "laptops"
    } else if (lowerText.includes("keyboard")) {
      category = "keyboard"
    } else if (lowerText.includes("mouse") || lowerText.includes("pad")) {
      category = "mousepad"
    }

    return {
      title: metaTitle || document.title || "Lazada Product",
      image: metaImage || "/placeholder.svg?height=160&width=160",
      price: price,
      isCommissionable: true,
      category: category,
    }
  } catch (error) {
    console.error("Error extracting Lazada product:", error)
    return fallbackExtraction(url, "Lazada")
  }
}

// TikTok product extraction
function extractTiktokProduct(document: Document, url: string) {
  try {
    // Try to extract from meta tags
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")

    // Extract price
    let price = ""
    const priceElements = document.querySelectorAll('[class*="price"]')
    for (const element of Array.from(priceElements)) {
      const text = element.textContent
      if (text && /\d+(\.\d+)?/.test(text)) {
        const match = text.match(/\d+(\.\d+)?/)
        if (match) {
          price = match[0]
          break
        }
      }
    }

    // Determine category
    let category = "everything"
    const titleText = (metaTitle || document.title || "").toLowerCase()

    if (titleText.includes("tablet") || titleText.includes("ipad")) {
      category = "tablet"
    } else if (titleText.includes("laptop") || titleText.includes("notebook")) {
      category = "laptops"
    } else if (titleText.includes("keyboard")) {
      category = "keyboard"
    } else if (titleText.includes("mouse") || titleText.includes("pad")) {
      category = "mousepad"
    }

    return {
      title: metaTitle || document.title || "TikTok Shop Product",
      image: metaImage || "/placeholder.svg?height=160&width=160",
      price: price,
      isCommissionable: true,
      category: category,
    }
  } catch (error) {
    console.error("Error extracting TikTok product:", error)
    return fallbackExtraction(url, "TikTok Shop")
  }
}

// Temu product extraction
function extractTemuProduct(document: Document, url: string) {
  try {
    // Try to extract from meta tags
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")

    // Extract price
    let price = ""
    const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"]')
    for (const element of Array.from(priceElements)) {
      const text = element.textContent
      if (text && /\d+(\.\d+)?/.test(text)) {
        const match = text.match(/\d+(\.\d+)?/)
        if (match) {
          price = match[0]
          break
        }
      }
    }

    // Determine category
    let category = "everything"
    const titleText = (metaTitle || document.title || "").toLowerCase()

    if (titleText.includes("tablet") || titleText.includes("ipad")) {
      category = "tablet"
    } else if (titleText.includes("laptop") || titleText.includes("notebook")) {
      category = "laptops"
    } else if (titleText.includes("keyboard")) {
      category = "keyboard"
    } else if (titleText.includes("mouse") || titleText.includes("pad")) {
      category = "mousepad"
    }

    return {
      title: metaTitle || document.title || "Temu Product",
      image: metaImage || "/placeholder.svg?height=160&width=160",
      price: price,
      isCommissionable: true,
      category: category,
    }
  } catch (error) {
    console.error("Error extracting Temu product:", error)
    return fallbackExtraction(url, "Temu")
  }
}

// Generic product extraction for other sites
function extractGenericProduct(document: Document, url: string, domain: string) {
  try {
    // Try to extract from meta tags
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content")
    const metaImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content")

    // Extract price - look for elements that might contain price
    let price = ""
    const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"], [id*="price"], [id*="Price"]')
    for (const element of Array.from(priceElements)) {
      const text = element.textContent
      if (text && /\d+(\.\d+)?/.test(text)) {
        const match = text.match(/\d+(\.\d+)?/)
        if (match) {
          price = match[0]
          break
        }
      }
    }

    // Determine category
    let category = "everything"
    const titleText = (metaTitle || document.title || "").toLowerCase()

    if (titleText.includes("tablet") || titleText.includes("ipad")) {
      category = "tablet"
    } else if (titleText.includes("laptop") || titleText.includes("notebook")) {
      category = "laptops"
    } else if (titleText.includes("keyboard")) {
      category = "keyboard"
    } else if (titleText.includes("mouse") || titleText.includes("pad")) {
      category = "mousepad"
    }

    return {
      title: metaTitle || document.title || `Product from ${domain}`,
      image: metaImage || "/placeholder.svg?height=160&width=160",
      price: price,
      isCommissionable: false,
      category: category,
    }
  } catch (error) {
    console.error("Error extracting generic product:", error)
    return fallbackExtraction(url, domain)
  }
}

// Fallback extraction when scraping fails
function fallbackExtraction(url: string, siteName: string) {
  return {
    title: `Product from ${siteName}`,
    image: "/placeholder.svg?height=160&width=160",
    price: "",
    isCommissionable: siteName !== "Generic",
    category: "everything",
  }
}
