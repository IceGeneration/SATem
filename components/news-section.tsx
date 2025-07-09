"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Plus, Calendar, User, Trash2, AlertCircle, Newspaper } from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"
import AddNewsModal from "@/components/add-news-modal"

interface NewsItem {
  id: number
  title: string
  content: string
  admin_name: string
  created_at: string
  updated_at: string
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)
  const { isLoggedIn, adminName } = useAdmin()

  const fetchNews = async () => {
    setLoading(true)
    setDatabaseError(null)
    try {
      const response = await fetch("/api/news", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setNews(data)
      } else {
        const errorData = await response.json()
        setDatabaseError(errorData.error || "ไม่สามารถโหลดข่าวสารได้")
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setDatabaseError("ไม่สามารถเชื่อมต่อฐานข้อมูลได้")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  const handleRefresh = () => {
    fetchNews()
  }

  const handleAddNews = async (newsData: any) => {
    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newsData,
          admin_name: adminName,
        }),
      })

      if (response.ok) {
        await fetchNews()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "ไม่สามารถเพิ่มข่าวสารได้")
      }
    } catch (error) {
      console.error("Error adding news:", error)
      throw error
    }
  }

  const handleDeleteNews = async (newsId: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข่าวสารนี้?")) {
      return
    }

    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchNews()
      } else {
        const errorData = await response.json()
        alert("ไม่สามารถลบข่าวสารได้: " + (errorData.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      alert("ไม่สามารถลบข่าวสารได้")
    }
  }

  const formatThaiDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-blue-600">กำลังโหลด...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-blue-800">ข่าวสารและประกาศ</h3>
        <div className="flex gap-2">
          {isLoggedIn && (
            <Button onClick={() => setAddModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              เพิ่มข่าวสาร
            </Button>
          )}
          <Button
            onClick={handleRefresh}
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            รีเฟรช
          </Button>
        </div>
      </div>

      {/* Database Error Alert */}
      {databaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>ข้อผิดพลาดฐานข้อมูล:</strong> {databaseError}
            <br />
            <span className="text-sm mt-1 block">กรุณาตรวจสอบการตั้งค่า Supabase และการสร้างตารางฐานข้อมูล</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {!databaseError && news.length === 0 && (
        <Card className="border-yellow-200">
          <CardContent className="text-center py-12">
            <Newspaper className="mx-auto h-16 w-16 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold text-blue-800 mb-2">ยังไม่มีข่าวสาร</h4>
            <p className="text-blue-600 text-lg mb-2">ยังไม่มีข่าวสารในขณะนี้</p>
            {isLoggedIn ? (
              <p className="text-blue-500 text-sm mb-4">คลิก "เพิ่มข่าวสาร" เพื่อเริ่มโพสต์ข่าวสาร!</p>
            ) : (
              <p className="text-blue-500 text-sm mb-4">กรุณาเข้าสู่ระบบแอดมินเพื่อเพิ่มข่าวสาร</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* News List */}
      {!databaseError && news.length > 0 && (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.id} className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-blue-100 border-b-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-blue-800 text-xl mb-2">{item.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-blue-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatThaiDateTime(item.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        โดย {item.admin_name}
                      </span>
                    </div>
                  </div>
                  {isLoggedIn && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNews(item.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{item.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddNewsModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddNews} />
    </div>
  )
}
