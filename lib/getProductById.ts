"use server"

import { getProducts } from "./shop-data"

export async function getProductById(id: string) {
  const products = await getProducts()
  return products.find((product) => product.id === id) || null
}
