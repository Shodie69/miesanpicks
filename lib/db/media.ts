import { createServerSupabaseClient } from "@/lib/supabase"

export type MediaType = "image" | "video" | "thumbnail"

export interface Media {
  id: string
  product_id: string
  url: string
  type: MediaType
  file_name: string
  file_size: number
  width?: number
  height?: number
  duration?: number
  sort_order: number
  created_at: string
  updated_at: string
}

export async function getProductMedia(productId: string): Promise<Media[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("product_media")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Error fetching product media:", error)
    return []
  }

  return data as Media[]
}

export async function addProductMedia(media: Omit<Media, "created_at" | "updated_at">): Promise<Media | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("product_media")
    .insert([
      {
        ...media,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error adding product media:", error)
    return null
  }

  return data as Media
}

export async function updateProductMediaOrder(mediaIds: string[]): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  // Create an array of updates with new sort_order values
  const updates = mediaIds.map((id, index) => ({
    id,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }))

  // Update each media item with its new sort_order
  for (const update of updates) {
    const { error } = await supabase
      .from("product_media")
      .update({ sort_order: update.sort_order, updated_at: update.updated_at })
      .eq("id", update.id)

    if (error) {
      console.error(`Error updating media order for ID ${update.id}:`, error)
      return false
    }
  }

  return true
}

export async function deleteProductMedia(mediaId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  // First get the media item to know what to delete from storage
  const { data: media, error: fetchError } = await supabase.from("product_media").select("*").eq("id", mediaId).single()

  if (fetchError) {
    console.error("Error fetching media for deletion:", fetchError)
    return false
  }

  // Delete from the database
  const { error: deleteError } = await supabase.from("product_media").delete().eq("id", mediaId)

  if (deleteError) {
    console.error("Error deleting product media from database:", deleteError)
    return false
  }

  // Delete from storage
  // Extract the path from the URL
  const urlPath = new URL(media.url).pathname
  const storagePath = urlPath.split("/").slice(2).join("/") // Remove /storage/v1/object/public/

  const { error: storageError } = await supabase.storage.from("product-media").remove([storagePath])

  if (storageError) {
    console.error("Error deleting file from storage:", storageError)
    // We don't return false here because the database record is already deleted
    // and the storage cleanup can be handled separately if needed
  }

  return true
}
