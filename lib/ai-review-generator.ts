"use server"

// This function simulates generating a product review using AI
// In a real application, you would use an AI API like OpenAI
export async function generateProductReview(productTitle: string): Promise<string> {
  // For demo purposes, we'll simulate a delay and return mock data
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate a mock review based on the product title
  const reviews = [
    `This ${productTitle} exceeded my expectations! The quality is outstanding, and it's exactly what I was looking for. Shipping was fast  The quality is outstanding, and it's exactly what I was looking for. Shipping was fast and the packaging was secure. I've been using it for a few weeks now and it still works perfectly. The design is sleek and modern, and it fits well with my other devices. I would definitely recommend this product to anyone looking for a reliable and high-quality option.`,

    `I've tried several similar products before, but this ${productTitle} is by far the best. The features are intuitive and user-friendly, making it perfect for both beginners and experienced users. The price point is also very reasonable considering the quality and functionality you get. Customer service was excellent when I had a question about setup. Overall, a 5-star product that I'll be purchasing again!`,

    `The ${productTitle} has completely transformed my daily routine. It's efficient, durable, and beautifully designed. I was initially hesitant about the price, but after using it for a month, I can confidently say it's worth every penny. The attention to detail is impressive, and it's clear the manufacturers put a lot of thought into the user experience. Highly recommended!`,
  ]

  // Return a random review from the list
  return reviews[Math.floor(Math.random() * reviews.length)]
}
