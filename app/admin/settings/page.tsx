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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Loader2, Facebook, Twitter, Instagram, Youtube, Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Mie-san",
    handle: "lmcabilao",
    bio: "",
    profileImage: "/placeholder.svg?height=80&width=80",
    coverImage: "/placeholder.svg?height=200&width=600",
  })
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://www.facebook.com/youarewelcomeph/",
    youtube: "",
    tiktok: "https://www.tiktok.com/@lmcabilao",
    instagram: "",
    twitter: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks({
      ...socialLinks,
      [name]: value,
    })
  }

  const handleProfileImageUpload = () => {
    // This would trigger a file upload dialog in a real implementation
    alert("This would open a file upload dialog to change your profile photo")
  }

  const handleCoverImageUpload = () => {
    // This would trigger a file upload dialog in a real implementation
    alert("This would open a file upload dialog to change your cover photo")
  }

  const handleSave = async () => {
    setIsLoading(true)

    try {
      // Save settings logic would go here
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call

      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  This information will be displayed publicly so be careful what you share.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 bg-black/30 hover:bg-black/40 rounded-full h-8 w-8"
                      onClick={handleProfileImageUpload}
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                  <div className="relative w-full h-24 bg-gray-100 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">Cover Image</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 bg-black/30 hover:bg-black/40 rounded-full"
                      onClick={handleCoverImageUpload}
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Profile Name</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="handle">Website</Label>
                  <div className="flex">
                    <div className="bg-gray-100 px-3 py-2 text-sm border border-r-0 rounded-l-md">shopple.co/</div>
                    <Input
                      id="handle"
                      name="handle"
                      value={profileData.handle}
                      onChange={handleProfileChange}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself"
                    className="resize-none"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">{150 - profileData.bio.length} characters left</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Channels</CardTitle>
                <CardDescription>Please add at least 1 social channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                  </Label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={socialLinks.facebook}
                    onChange={handleSocialChange}
                    placeholder="https://www.facebook.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" /> Youtube
                  </Label>
                  <Input
                    id="youtube"
                    name="youtube"
                    value={socialLinks.youtube}
                    onChange={handleSocialChange}
                    placeholder="https://www.youtube.com/c/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                    </svg>{" "}
                    TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    name="tiktok"
                    value={socialLinks.tiktok}
                    onChange={handleSocialChange}
                    placeholder="https://www.tiktok.com/@yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" /> Instagram
                  </Label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={socialLinks.instagram}
                    onChange={handleSocialChange}
                    placeholder="https://www.instagram.com/yourusername"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" /> Twitter
                  </Label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={socialLinks.twitter}
                    onChange={handleSocialChange}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value="admin@example.com" disabled />
                  <p className="text-xs text-gray-500">Your email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
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
