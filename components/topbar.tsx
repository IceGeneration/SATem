"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/contexts/admin-context"
import AdminModal from "@/components/admin-modal"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Newspaper, Shield } from "lucide-react"

export default function Topbar() {
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const { isLoggedIn } = useAdmin()
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <>
      <div className="bg-white shadow-md border-b-2 border-yellow-300 relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-800">Satri Angthong</h1>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    isActive("/") ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  ของหาย
                </Button>
              </Link>

              <Link href="/news">
                <Button
                  variant={isActive("/news") ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    isActive("/news") ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Newspaper className="h-4 w-4" />
                  ข่าวสาร
                </Button>
              </Link>

              <Button
                variant="ghost"
                onClick={() => setAdminModalOpen(true)}
                className="flex items-center gap-2 text-blue-700 hover:bg-blue-50"
              >
                <Shield className="h-4 w-4" />
                แอดมิน
                {isLoggedIn && <span className="ml-1 px-2 py-1 bg-green-500 text-white text-xs rounded-full">●</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdminModal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} />
    </>
  )
}
