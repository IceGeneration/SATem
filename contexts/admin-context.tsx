"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AdminContextType {
  isLoggedIn: boolean
  adminName: string
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const ADMIN_USERNAME = "TTJY"
const ADMIN_PASSWORD = "MadeByTTJYTeam"

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    // Check if admin is already logged in from localStorage
    const savedAuth = localStorage.getItem("admin_auth")
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      if (authData.isLoggedIn && authData.adminName) {
        setIsLoggedIn(true)
        setAdminName(authData.adminName)
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
      setAdminName(username)

      // Save to localStorage
      localStorage.setItem(
        "admin_auth",
        JSON.stringify({
          isLoggedIn: true,
          adminName: username,
        }),
      )

      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setAdminName("")
    localStorage.removeItem("admin_auth")
  }

  return <AdminContext.Provider value={{ isLoggedIn, adminName, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
