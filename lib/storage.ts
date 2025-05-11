"use server"

import { createServerSupabaseClient } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Define allowed file types
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

export type MediaType = "image" | "video"

export interface MediaItem {
  id: string
  url: string
  type: MediaType
  thumbnail_url?: string
  file_name: string
  file_size: number
  width?: number
  height?: number
  duration?: number
  created_at: string
  product_id?: string
  display_order: number
}

// Create a bucket if it doesn't exist
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  const supabase = createServerSupabaseClient()

  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      // Create the bucket with public access
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: MAX_VIDEO_SIZE, // Use the larger size limit
      })

      if (error) {
        console.error("Error creating bucket:", error)
        return false
      }

      // Set public bucket policy
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl("test.txt", 60)
      if (policyError && !policyError.message.includes("does not exist")) {
        console.error("Error setting bucket policy:", policyError)
      }
    }

    return true
  } catch (error) {
    console.error("Error ensuring bucket exists:", error)
    return false
  }
}

// Validate file type and size
function validateFile(file: File, type: MediaType): { valid: boolean; error?: string } {
  // Validate file type
  if (type === "image" && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid image type. Allowed types: JPEG, PNG, WebP, GIF",
    }
  }

  if (type === "video" && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid video type. Allowed types: MP4, WebM, QuickTime, AVI",
    }
  }

  // Validate file size
  const maxSize = type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the ${type === "image" ? "5MB" : "100MB"} limit`,
    }
  }

  return { valid: true }
}

// Upload a media file to Supabase Storage
async function uploadMedia(
  file: File,
  userId: string,
  type: MediaType,
  productId?: string,
): Promise<{ success: boolean; media?: MediaItem; error?: string }> {
  const supabase = createServerSupabaseClient()
  const bucketName = "product-media"

  try {
    // Validate file
    const validation = validateFile(file, type)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    // Ensure bucket exists
    const bucketExists = await ensureBucketExists(bucketName)
    if (!bucketExists) {
      return {
        success: false,
        error: "Failed to create storage bucket",
      }
    }

    // Generate a unique file name
    const fileExt = file.name.split(".").pop()
    const mediaId = uuidv4()
    const fileName = `${userId}/${mediaId}.${fileExt}`

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return {
        success: false,
        error: uploadError.message,
      }
    }

    // Get the public URL
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName)

    // Create media item
    const mediaItem: MediaItem = {
      id: mediaId,
      url: data.publicUrl,
      type,
      file_name: file.name,
      file_size: file.size,
      created_at: new Date().toISOString(),
      product_id: productId,
      display_order: 0, // Will be updated when saving to database
    }

    // If it's a video, generate a thumbnail (in a real implementation, this would be done server-side)
    if (type === "video") {
      // For now, we'll use a placeholder thumbnail
      mediaItem.thumbnail_url = `/placeholder.svg?height=160&width=160&text=Video`
    }

    return {
      success: true,
      media: mediaItem,
    }
  } catch (error) {
    console.error("Error uploading media:", error)
    return {
      success: false,
      error: "An unexpected error occurred during upload",
    }
  }
}

// Delete a media file from Supabase Storage
async function deleteMedia(mediaUrl: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()
  const bucketName = "product-media"

  try {
    // Extract the file path from the URL
    const url = new URL(mediaUrl)
    const pathParts = url.pathname.split("/")
    const filePath = pathParts.slice(pathParts.indexOf(bucketName) + 1).join("/")

    if (!filePath) {
      return {
        success: false,
        error: "Invalid media URL",
      }
    }

    // Delete the file
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting media:", error)
    return {
      success: false,
      error: "An unexpected error occurred during deletion",
    }
  }
}

export async function uploadProductImage(file: File, userId: string) {
  return uploadMedia(file, userId, "image")
}
