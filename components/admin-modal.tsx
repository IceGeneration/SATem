"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAdmin } from "@/contexts/admin-context"
import { Shield, LogOut, LogIn, X, AlertCircle } from "lucide-react"

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminModal({ isOpen, onClose }: AdminModalProps) {
  const { isLoggedIn, adminName, login, logout } = useAdmin()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = login(username, password)
    if (success) {
      setUsername("")
      setPassword("")
      onClose()
    } else {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
    }
  }

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="bg-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-blue-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              แอดมินของหาย
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 bg-white">
          {isLoggedIn ? (
            // Logged in state
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-semibold">เข้าสู่ระบบแล้ว</span>
                </div>
                <p className="text-green-700">
                  ยินดีต้อนรับ <strong>{adminName}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">คุณสามารถจัดการข่าวสารและระบบของหายได้แล้ว</p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 bg-white"
                >
                  <LogOut className="h-4 w-4" />
                  ออกจากระบบ
                </Button>
              </div>
            </div>
          ) : (
            // Login form
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="username" className="text-blue-700">
                  ชื่อผู้ใช้
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรุณาใส่ชื่อผู้ใช้"
                  required
                  className="border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-blue-700">
                  รหัสผ่าน
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรุณาใส่รหัสผ่าน"
                  required
                  className="border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 bg-white text-gray-900 border-gray-300"
                >
                  ปิด
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  เข้าสู่ระบบ
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
