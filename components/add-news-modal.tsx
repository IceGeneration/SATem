"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AddNewsModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (newsData: any) => Promise<boolean>
}

export default function AddNewsModal({ isOpen, onClose, onAdd }: AddNewsModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = "กรุณาใส่หัวข้อข่าวสาร"
    if (!formData.content.trim()) newErrors.content = "กรุณาใส่เนื้อหาข่าวสาร"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError("")

    try {
      const success = await onAdd({
        title: formData.title.trim(),
        content: formData.content.trim(),
      })

      if (success) {
        setFormData({
          title: "",
          content: "",
        })
        setErrors({})
        onClose()
      }
    } catch (error: any) {
      setSubmitError(error.message || "ไม่สามารถเพิ่มข่าวสารได้")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
    })
    setErrors({})
    setSubmitError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-800 text-xl">เพิ่มข่าวสารใหม่</DialogTitle>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-blue-700">
              หัวข้อข่าวสาร *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="เช่น ประกาศเรื่องการเปิดเทอม, กิจกรรมพิเศษ"
              className={cn("border-yellow-300 focus:border-blue-500", errors.title && "border-red-500")}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-blue-700">
              เนื้อหาข่าวสาร *
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="เขียนเนื้อหาข่าวสารที่ต้องการประกาศ..."
              rows={8}
              className={cn("border-yellow-300 focus:border-blue-500", errors.content && "border-red-500")}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            <p className="text-xs text-gray-500 mt-1">เนื้อหาจะแสดงตามที่พิมพ์ รวมถึงการขึ้นบรรทัดใหม่</p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white">
              {loading ? "กำลังเพิ่ม..." : "เพิ่มข่าวสาร"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
