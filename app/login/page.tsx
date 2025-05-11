"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { createClientSupabaseClient } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Set client-side indicators of login
      localStorage.setItem("isLoggedIn", "true")
      sessionStorage.setItem("isLoggedIn", "true")

      toast({
        title: "Login successful",
        description: "Welcome back to your admin dashboard",
      })

      // Short delay to allow toast to show
      setTimeout(() => {
        router.push("/admin/dashboard")
        router.refresh()
      }, 500)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail("admin@example.com")
    setPassword("password123")
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          {/* Fixed: Using div instead of p (from CardDescription) to avoid nesting issues */}
          <div className="text-sm text-muted-foreground">
            Login to manage your shop and products
            <div className="mt-2 text-sm p-2 bg-gray-50 rounded-md">
              <strong>Demo credentials:</strong>{" "}
              <button onClick={handleDemoLogin} className="text-orange-500 hover:underline focus:outline-none">
                Click to fill
              </button>
              <br />
              Email: <code>admin@example.com</code>
              <br />
              Password: <code>password123</code>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-center">
              Don't have an account?{" "}
              <Link href="/signup" className="text-orange-500 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
