"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("ขนาดภาพต้องไม่เกิน 5MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        setSubmitError("กรุณาเลือกไฟล์รูปภาพ")
        return
      }

      setSelectedImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setSubmitError("")
      }
      reader.onerror = () => {
        setSubmitError("ไม่สามารถอ่านไฟล์รูปภาพได้")
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    const fileInput = document.getElementById("news-image-upload") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError("")

    try {
      const submitData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        image_url: imagePreview || null, // Include image data
      }

      const success = await onAdd(submitData)

      if (success) {
        setFormData({
          title: "",
          content: "",
        })
        setSelectedImage(null)
        setImagePreview(null)
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
    setSelectedImage(null)
    setImagePreview(null)
    setErrors({})
    setSubmitError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-blue-800 text-xl">เพิ่มข่าวสารใหม่</DialogTitle>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive" className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 bg-white">
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
              className={cn(
                "border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500",
                errors.title && "border-red-500",
              )}
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
              className={cn(
                "border-gray-300 focus:border-blue-500 bg-white text-gray-900 placeholder:text-gray-500",
                errors.content && "border-red-500",
              )}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
            <p className="text-xs text-gray-500 mt-1">เนื้อหาจะแสดงตามที่พิมพ์ รวมถึงการขึ้นบรรทัดใหม่</p>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-blue-700">รูปภาพประกอบ (ไม่บังคับ)</Label>
            {imagePreview ? (
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="ตัวอย่างรูปภาพข่าวสาร"
                    width={400}
                    height={200}
                    className="mx-auto rounded-lg object-cover max-h-48"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-green-600 text-center mt-2">เลือกรูปภาพเรียบร้อยแล้ว!</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("news-image-upload")?.click()}
                  className="w-full mt-2 bg-white hover:bg-gray-50 border-gray-300 text-gray-900"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  เปลี่ยนรูปภาพ
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 mb-4">อัปโหลดรูปภาพประกอบข่าวสาร</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("news-image-upload")?.click()}
                  className="bg-white hover:bg-gray-50 border-gray-300 text-gray-900"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  เลือกรูปภาพ
                </Button>
                <p className="text-xs text-gray-500 mt-2">รองรับ: JPG, PNG, GIF (ไม่เกิน 5MB)</p>
              </div>
            )}
            <input
              type="file"
              id="news-image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <DialogFooter className="gap-2 bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="bg-white text-gray-900 border-gray-300"
            >
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
