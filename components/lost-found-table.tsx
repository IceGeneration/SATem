"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Eye, Calendar, User, Plus, Database, AlertCircle, Search, Package } from "lucide-react"
import ImageModal from "@/components/image-modal"
import ClaimItemModal from "@/components/claim-item-modal"
import AddItemModal from "@/components/add-item-modal"

interface LostFoundItem {
  id: number
  object_name: string
  description: string
  image_url: string
  student_number: string
  student_nickname: string
  found_date: string
  location_found: string
  status: "available" | "claimed"
  item_type?: "lost" | "found"
  claimed_by?: string
  claimed_date?: string
  claim_notes?: string
}

export default function LostFoundTable() {
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    setDatabaseError(null)
    try {
      const response = await fetch("/api/lost-found", {
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data)
      } else {
        const errorData = await response.json()
        setDatabaseError(errorData.error || "ไม่สามารถโหลดข้อมูลได้")
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      setDatabaseError("ไม่สามารถเชื่อมต่อฐานข้อมูลได้")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleRefresh = () => {
    fetchItems()
  }

  const handleClaim = async (itemId: number, claimedBy: string, notes?: string) => {
    try {
      const response = await fetch("/api/lost-found/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, claimedBy, notes }),
      })

      if (response.ok) {
        await fetchItems()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "ไม่สามารถรับของได้")
      }
    } catch (error) {
      console.error("Error claiming item:", error)
      throw error
    }
  }

  const handleAddItem = async (itemData: any) => {
    try {
      const response = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        await fetchItems()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "ไม่สามารถเพิ่มรายการได้")
      }
    } catch (error) {
      console.error("Error adding item:", error)
      throw error
    }
  }

  const openClaimModal = (item: LostFoundItem) => {
    setSelectedItem(item)
    setClaimModalOpen(true)
  }

  const getItemTypeDisplay = (item: LostFoundItem) => {
    if (item.item_type === "lost") {
      return {
        label: "ของหาย",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        badgeColor: "bg-red-500",
        icon: <Search className="h-3 w-3" />,
      }
    } else {
      return {
        label: "ของที่เจอ",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        badgeColor: "bg-green-500",
        icon: <Package className="h-3 w-3" />,
      }
    }
  }

  const formatThaiDate = (dateString: string) => {
    // If it's already a readable text format, just return it
    if (!dateString) return "ไม่ระบุวันที่"

    // Try to parse as a date, but if it fails, just return the original string
    try {
      // Only try to format if it looks like a standard date format
      if (dateString.includes("-") && dateString.length >= 8) {
        const date = new Date(dateString)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }
      }

      // For any other format (like "12/04/2669"), just return as-is
      return dateString
    } catch (error) {
      // If anything goes wrong, just return the original string
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
        <h3 className="text-2xl font-bold text-blue-800">รายการของหายและของที่เจอ</h3>
        <div className="flex gap-2">
          <Button onClick={() => setAddModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            เพิ่มรายการ
          </Button>
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

      {/* Setup Instructions */}
      {!databaseError && items.length === 0 && (
        <Card className="border-gray-200 bg-white">
          <CardContent className="text-center py-12 bg-white">
            <Database className="mx-auto h-16 w-16 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold text-blue-800 mb-2">ยินดีต้อนรับสู่ศูนย์รวมของหาย!</h4>
            <p className="text-blue-600 text-lg mb-2">ยังไม่มีรายการในขณะนี้</p>
            <p className="text-blue-500 text-sm mb-4">คลิก "เพิ่มรายการ" เพื่อเริ่มต้นใช้งาน!</p>

            <div className="bg-blue-50 p-4 rounded-lg mt-4 text-left max-w-md mx-auto">
              <h5 className="font-semibold text-blue-700 mb-2">การตั้งค่าครั้งแรก:</h5>
              <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
                <li>เพิ่ม Supabase integration</li>
                <li>รันสคริปต์ตั้งค่าฐานข้อมูล</li>
                <li>เริ่มเพิ่มรายการของหาย!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      {!databaseError && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => {
            const typeDisplay = getItemTypeDisplay(item)
            return (
              <Card key={item.id} className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="bg-gray-50 border-b-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${typeDisplay.badgeColor} text-white flex items-center gap-1`}>
                          {typeDisplay.icon}
                          {typeDisplay.label}
                        </Badge>
                        <CardTitle className="text-blue-800 text-xl">{item.object_name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={item.status === "available" ? "default" : "secondary"}
                          className={item.status === "available" ? "bg-green-500" : "bg-gray-500"}
                        >
                          {item.status === "available" ? "ยังไม่ได้รับคืน" : "รับคืนแล้ว"}
                        </Badge>
                        <span className="text-sm text-blue-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatThaiDate(item.found_date)}
                        </span>
                      </div>
                      {item.status === "claimed" && item.claimed_by && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>รับคืนโดย:</strong> {item.claimed_by}
                          {item.claimed_date && <span className="ml-2">เมื่อ {formatThaiDate(item.claimed_date)}</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedImage(item.image_url)}
                        className="bg-white hover:bg-yellow-50 border-yellow-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        ดูรูป
                      </Button>
                      {item.status === "available" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openClaimModal(item)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {item.item_type === "lost" ? "ได้คืนแล้ว" : "คืนแล้ว"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-blue-700 mb-2">รายละเอียด</h4>
                      <p className="text-gray-700 mb-2">{item.description}</p>
                      <p className="text-sm text-blue-600 mt-2">
                        <strong>{item.item_type === "lost" ? "หายที่:" : "เจอที่:"}</strong> {item.location_found}
                      </p>
                      {item.claim_notes && item.status === "claimed" && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>หมายเหตุ:</strong> {item.claim_notes}
                        </p>
                      )}
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.item_type === "lost" ? "เจ้าของ" : "ผู้พบ"}
                      </h4>
                      <p className="text-blue-800 font-medium">
                        {item.student_number} {item.student_nickname}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ImageModal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      <ClaimItemModal
        item={selectedItem}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaim={handleClaim}
      />
      <AddItemModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddItem} />
    </div>
  )
}
