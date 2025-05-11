"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"

interface ImageUploadProps {
  initialImage?: string
  onImageUploaded: (url: string) => void
  onImageRemoved?: () => void
  className?: string
}

export default function ImageUpload({
  initialImage,
  onImageUploaded,
  onImageRemoved,
  className = "",
}: ImageUploadProps) {
  const [image, setImage] = useState<string | undefined>(initialImage)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!result.success) {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        })
        return
      }

      setImage(result.url)
      onImageUploaded(result.url)

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload error",
        description: "An error occurred while uploading the image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    setImage(undefined)
    if (onImageRemoved) {
      onImageRemoved()
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />

      {image ? (
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt="Product image"
            className="w-full h-full object-cover rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">Click to upload an image</p>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF (max 5MB)</p>
        </div>
      )}

      <Button variant="outline" onClick={handleUploadClick} disabled={isUploading} className="mt-2 w-full">
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {image ? "Change Image" : "Upload Image"}
          </>
        )}
      </Button>
    </div>
  )
}
