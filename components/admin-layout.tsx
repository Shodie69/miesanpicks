"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingBag, LayoutDashboard, Package, Settings, LogOut, Menu, X, Tag, Database } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = createClientSupabaseClient()

  useEffect(() => {
    setIsMounted(true)

    // Check if user is logged in
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  if (!isMounted) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Database", href: "/admin/seed", icon: Database },
  ]

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()

      // Clear client-side auth state
      localStorage.removeItem("isLoggedIn")
      sessionStorage.removeItem("isLoggedIn")

      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      })

      // Redirect to home
      router.push("/login")
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white">
            <div className="flex flex-col h-full p-4">
              <div className="flex items-center gap-2 py-6 px-4">
                <ShoppingBag className="h-6 w-6 text-orange-500" />
                <h1 className="text-xl font-bold">YourShop Admin</h1>
              </div>

              <nav className="space-y-1 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                      pathname?.startsWith(item.href)
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex items-center gap-2 h-16 px-6 border-b">
          <ShoppingBag className="h-6 w-6 text-orange-500" />
          <h1 className="text-xl font-bold">YourShop Admin</h1>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md ${
                  pathname?.startsWith(item.href) ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
