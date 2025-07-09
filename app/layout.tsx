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
  title: "Satri Angthong - ศูนย์รวมของหาย",
  description: "ระบบจัดการของหายโรงเรียนสตรีอ่างทอง",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${inter.className} bg-white`}>
        <AdminProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <div className="min-h-screen">
              <Topbar />
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
