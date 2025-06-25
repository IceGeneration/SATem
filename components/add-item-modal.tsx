"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Upload, AlertCircle, X, Search, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (itemData: any) => Promise<boolean>
}

const commonLocations = ["โรงอาหาร", "ห้องสมุด", "สระว่ายน้ำ", "ห้องเรียน", "สนามกีฬา", "อื่นๆ ( ระบุ )"]

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    object_name: "",
    description: "",
    student_number: "",
    student_nickname: "",
    location_found: "",
    custom_location: "",
    found_date: new Date(),
    item_type: "found" as "lost" | "found",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.object_name.trim()) newErrors.object_name = "กรุณาใส่ชื่อของ"
    if (!formData.description.trim()) newErrors.description = "กรุณาใส่คำอธิบาย"
    if (!formData.student_number.trim()) newErrors.student_number = "กรุณาใส่รหัสนักเรียน"
    if (!formData.student_nickname.trim()) newErrors.student_nickname = "กรุณาใส่ชื่อเล่น"
    if (!formData.location_found) newErrors.location_found = "กรุณาเลือกสถานที่"
    if (formData.location_found === "อื่นๆ ( ระบุ )" && !formData.custom_location.trim()) {
      newErrors.custom_location = "กรุณาระบุสถานที่"
    }

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
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
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
      let imageUrl = "/placeholder.svg?height=300&width=300"

      if (imagePreview) {
        imageUrl = imagePreview
      }

      const submitData = {
        object_name: formData.object_name.trim(),
        description: formData.description.trim(),
        student_number: formData.student_number.trim(),
        student_nickname: formData.student_nickname.trim(),
        location_found:
          formData.location_found === "อื่นๆ ( ระบุ )" ? formData.custom_location.trim() : formData.location_found,
        found_date: formatDate(formData.found_date),
        image_url: imageUrl,
        item_type: formData.item_type,
      }

      const success = await onAdd(submitData)

      if (success) {
        setFormData({
          object_name: "",
          description: "",
          student_number: "",
          student_nickname: "",
          location_found: "",
          custom_location: "",
          found_date: new Date(),
          item_type: "found",
        })
        setSelectedImage(null)
        setImagePreview(null)
        setErrors({})
        onClose()
      }
    } catch (error: any) {
      setSubmitError(error.message || "ไม่สามารถเพิ่มรายการได้")
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
      object_name: "",
      description: "",
      student_number: "",
      student_nickname: "",
      location_found: "",
      custom_location: "",
      found_date: new Date(),
      item_type: "found",
    })
    setSelectedImage(null)
    setImagePreview(null)
    setErrors({})
    setSubmitError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-800 text-xl">เพิ่มรายการใหม่</DialogTitle>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Type Selection */}
          <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
            <Label className="text-blue-700 text-base font-semibold mb-3 block">ประเภทรายการ *</Label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  formData.item_type === "lost"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white hover:border-red-300",
                )}
                onClick={() => handleInputChange("item_type", "lost")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-800">ของหาย</span>
                </div>
                <p className="text-sm text-gray-600">ฉันทำของหาย ต้องการหาเจ้าของ</p>
              </div>
              <div
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  formData.item_type === "found"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-green-300",
                )}
                onClick={() => handleInputChange("item_type", "found")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">ของที่เจอ</span>
                </div>
                <p className="text-sm text-gray-600">ฉันเจอของ ต้องการหาเจ้าของ</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Object Name */}
            <div>
              <Label htmlFor="object_name" className="text-blue-700">
                ชื่อของ *
              </Label>
              <Input
                id="object_name"
                value={formData.object_name}
                onChange={(e) => handleInputChange("object_name", e.target.value)}
                placeholder="เช่น กระติกน้ำ, กระเป๋านักเรียน"
                className={cn("border-yellow-300 focus:border-blue-500", errors.object_name && "border-red-500")}
              />
              {errors.object_name && <p className="text-red-500 text-sm mt-1">{errors.object_name}</p>}
            </div>

            {/* Found Date */}
            <div>
              <Label className="text-blue-700">{formData.item_type === "lost" ? "วันที่หาย" : "วันที่เจอ"} *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-yellow-300",
                      !formData.found_date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.found_date ? formatDisplayDate(formData.found_date) : "เลือกวันที่"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.found_date}
                    onSelect={(date) => date && setFormData((prev) => ({ ...prev, found_date: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-blue-700">
              รายละเอียด *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={
                formData.item_type === "lost"
                  ? "อธิบายของที่หาย เช่น สี ขนาด ลักษณะพิเศษ..."
                  : "อธิบายของที่เจอ เช่น สี ขนาด ลักษณะพิเศษ..."
              }
              rows={4}
              className={cn("border-yellow-300 focus:border-blue-500", errors.description && "border-red-500")}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Location */}
          <div>
            <Label className="text-blue-700">{formData.item_type === "lost" ? "สถานที่ที่หาย" : "สถานที่ที่เจอ"} *</Label>
            <Select
              value={formData.location_found}
              onValueChange={(value) => handleInputChange("location_found", value)}
            >
              <SelectTrigger
                className={cn("border-yellow-300 focus:border-blue-500", errors.location_found && "border-red-500")}
              >
                <SelectValue placeholder="เลือกสถานที่" />
              </SelectTrigger>
              <SelectContent>
                {commonLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.location_found && <p className="text-red-500 text-sm mt-1">{errors.location_found}</p>}
          </div>

          {/* Custom Location */}
          {formData.location_found === "อื่นๆ ( ระบุ )" && (
            <div>
              <Label htmlFor="custom_location" className="text-blue-700">
                ระบุสถานที่ *
              </Label>
              <Input
                id="custom_location"
                value={formData.custom_location}
                onChange={(e) => handleInputChange("custom_location", e.target.value)}
                placeholder="กรุณาระบุสถานที่ที่แน่นอน"
                className={cn("border-yellow-300 focus:border-blue-500", errors.custom_location && "border-red-500")}
              />
              {errors.custom_location && <p className="text-red-500 text-sm mt-1">{errors.custom_location}</p>}
            </div>
          )}

          {/* Student Information */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-blue-700">
              ข้อมูลนักเรียน ({formData.item_type === "lost" ? "เจ้าของ" : "ผู้พบ"})
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_number" className="text-blue-700">
                  รหัสนักเรียน *
                </Label>
                <Input
                  id="student_number"
                  value={formData.student_number}
                  onChange={(e) => handleInputChange("student_number", e.target.value)}
                  placeholder="เช่น 30234"
                  className={cn("border-yellow-300 focus:border-blue-500", errors.student_number && "border-red-500")}
                />
                {errors.student_number && <p className="text-red-500 text-sm mt-1">{errors.student_number}</p>}
              </div>
              <div>
                <Label htmlFor="student_nickname" className="text-blue-700">
                  ชื่อเล่น *
                </Label>
                <Input
                  id="student_nickname"
                  value={formData.student_nickname}
                  onChange={(e) => handleInputChange("student_nickname", e.target.value)}
                  placeholder="เช่น ไอซ์"
                  className={cn("border-yellow-300 focus:border-blue-500", errors.student_nickname && "border-red-500")}
                />
                {errors.student_nickname && <p className="text-red-500 text-sm mt-1">{errors.student_nickname}</p>}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-blue-700">รูปภาพ (Optional)</Label>
            {imagePreview ? (
              <div className="border-2 border-yellow-300 rounded-lg p-4">
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="ตัวอย่างรูปภาพ"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
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
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="w-full mt-2 bg-white hover:bg-yellow-50 border-yellow-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  เปลี่ยนรูปภาพ
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600 mb-4">อัปโหลดรูปภาพของ</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className="bg-white hover:bg-yellow-50 border-yellow-300"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  เลือกรูปภาพ
                </Button>
                <p className="text-xs text-gray-500 mt-2">รองรับ: JPG, PNG, GIF (ไม่เกิน 5MB)</p>
              </div>
            )}
            <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white">
              {loading ? "กำลังเพิ่ม..." : "เพิ่มรายการ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
