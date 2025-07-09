import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AdminProvider } from "@/contexts/admin-context"
import Topbar from "@/components/topbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AdminProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Topbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
