"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("[LOGIN FRONTEND] Starting login attempt");
      console.log("[LOGIN FRONTEND] Form data:", formData);
      
      const startTime = Date.now();
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const responseTime = Date.now() - startTime;
      console.log("[LOGIN FRONTEND] Response received in:", responseTime + "ms");
      console.log("[LOGIN FRONTEND] Response status:", response.status);
      console.log("[LOGIN FRONTEND] Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("[LOGIN FRONTEND] Response data:", data);

      if (response.ok) {
        console.log("[LOGIN FRONTEND] Login successful, redirecting...");
        // The token is now stored in HttpOnly cookie by the server
        // Redirect to admin dashboard
        window.location.href = "/admin/dashboard";
      } else {
        console.log("[LOGIN FRONTEND] Login failed:", data.error);
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("[LOGIN FRONTEND] Network/Connection error:", err);
      console.error("[LOGIN FRONTEND] Error type:", err?.constructor?.name);
      setError("Login failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 p-2">
            <img src="/Text logo.png" alt="Upreak Logo" className="h-8 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Upreak Admin</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="admin@upreak.com"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                <strong>Admin Panel Access:</strong>
              </p>
              <p className="mb-2">To access the admin panel:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Go to <code className="bg-gray-100 px-1 rounded">/admin</code> in your browser</li>
                <li>Use your admin credentials to login</li>
                <li>You'll be redirected to the admin dashboard</li>
              </ol>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900 mb-2">Admin Access:</p>
                <div className="space-y-1 text-blue-800">
                  <p><strong>Note:</strong> Please contact your system administrator for login credentials</p>
                  <p><strong>Security:</strong> Never share your credentials with anyone</p>
                </div>
              </div>
              <p className="mt-3">
                <strong>Full Admin URL:</strong> <code className="bg-gray-100 px-1 rounded">http://localhost:3000/admin</code>
              </p>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Back to Site */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Main Site
          </Link>
        </div>
      </div>
    </div>
  );
}