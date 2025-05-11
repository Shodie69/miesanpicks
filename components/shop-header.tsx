"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, TwitterIcon as TikTok, Camera, ChevronDown } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface ShopHeaderProps {
  shopData: any
  isLoggedIn: boolean
}

export default function ShopHeader({ shopData, isLoggedIn }: ShopHeaderProps) {
  const router = useRouter()
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const handleSignOut = () => {
    // Clear authentication
    localStorage.removeItem("isLoggedIn")
    sessionStorage.removeItem("isLoggedIn")
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"

    // Redirect to home
    router.push("/")
  }

  const handleProfilePhotoUpload = () => {
    // This would trigger a file upload dialog in a real implementation
    alert("This would open a file upload dialog to change your profile photo")
  }

  const handleCoverPhotoUpload = () => {
    // This would trigger a file upload dialog in a real implementation
    alert("This would open a file upload dialog to change your cover photo")
  }

  return (
    <div className="relative">
      {/* Cover Photo */}
      <div className="relative h-32 bg-amber-100/50">
        {isLoggedIn && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 bottom-4 bg-black/30 hover:bg-black/40 rounded-full"
            onClick={handleCoverPhotoUpload}
          >
            <Camera className="h-5 w-5 text-white" />
          </Button>
        )}

        <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
          <div className="relative">
            <Image
              src={shopData.profileImage || "/placeholder.svg?height=80&width=80"}
              alt="Profile picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-white"
            />
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-0 right-0 bg-black/30 hover:bg-black/40 rounded-full h-6 w-6"
                onClick={handleProfilePhotoUpload}
              >
                <Camera className="h-3 w-3 text-white" />
              </Button>
            ) : (
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                <span className="text-xs font-bold">P</span>
              </div>
            )}
          </div>
        </div>

        {isLoggedIn && (
          <div className="absolute right-4 top-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-blue-500 text-white rounded-md flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={shopData.profileImage || "/placeholder.svg?height=24&width=24"} />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <span>Mie-san</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer flex items-center">
                    View as User
                    <svg
                      className="ml-auto h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 pb-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <h1 className="text-xl font-bold text-yellow-500">{shopData.name}</h1>
        </div>
        {/* Fixed: Changed p to div to avoid nesting div inside p */}
        <div className="text-sm text-gray-500 flex items-center justify-center gap-1">
          @{shopData.handle}
          <Badge variant="outline" className="h-4 ml-1 px-1 rounded-sm">
            <span className="text-[10px]">C</span>
          </Badge>
        </div>
        <div className="flex gap-3 mt-2 justify-center">
          {shopData.socialLinks.facebook && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <Facebook className="h-4 w-4" />
            </Button>
          )}
          {shopData.socialLinks.tiktok && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <TikTok className="h-4 w-4" />
            </Button>
          )}
          {shopData.socialLinks.instagram && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100">
              <Instagram className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
