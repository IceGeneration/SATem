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
import { CalendarIcon, Upload, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddItemModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (itemData: any) => Promise<boolean>
}

const commonLocations = [
  "Cafeteria",
  "Library - 1st Floor",
  "Library - 2nd Floor",
  "Gymnasium",
  "Computer Lab 1",
  "Computer Lab 2",
  "Computer Lab 3",
  "Art Room",
  "Music Room",
  "Science Lab",
  "Math Classroom 201",
  "Math Classroom 202",
  "English Classroom",
  "Playground",
  "Basketball Court",
  "Football Field",
  "Main Office",
  "Parking Lot",
  "School Gate",
  "Other",
]

export default function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    object_name: "",
    description: "",
    full_description: "",
    student_number: "",
    student_nickname: "",
    location_found: "",
    custom_location: "",
    found_date: new Date(),
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.object_name.trim()) newErrors.object_name = "Object name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.full_description.trim()) newErrors.full_description = "Full description is required"
    if (!formData.student_number.trim()) newErrors.student_number = "Student number is required"
    if (!formData.student_nickname.trim()) newErrors.student_nickname = "Student nickname is required"
    if (!formData.location_found) newErrors.location_found = "Location is required"
    if (formData.location_found === "Other" && !formData.custom_location.trim()) {
      newErrors.custom_location = "Please specify the location"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError("")

    try {
      const submitData = {
        object_name: formData.object_name.trim(),
        description: formData.description.trim(),
        full_description: formData.full_description.trim(),
        student_number: formData.student_number.trim(),
        student_nickname: formData.student_nickname.trim(),
        location_found: formData.location_found === "Other" ? formData.custom_location.trim() : formData.location_found,
        found_date: format(formData.found_date, "yyyy-MM-dd"),
        image_url: "/placeholder.svg?height=300&width=300",
      }

      const success = await onAdd(submitData)

      if (success) {
        // Reset form
        setFormData({
          object_name: "",
          description: "",
          full_description: "",
          student_number: "",
          student_nickname: "",
          location_found: "",
          custom_location: "",
          found_date: new Date(),
        })
        setErrors({})
        onClose()
      }
    } catch (error: any) {
      setSubmitError(error.message || "Failed to add item")
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
      full_description: "",
      student_number: "",
      student_nickname: "",
      location_found: "",
      custom_location: "",
      found_date: new Date(),
    })
    setErrors({})
    setSubmitError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-800 text-xl">Add New Lost Item</DialogTitle>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Object Name */}
            <div>
              <Label htmlFor="object_name" className="text-blue-700">
                Object Name *
              </Label>
              <Input
                id="object_name"
                value={formData.object_name}
                onChange={(e) => handleInputChange("object_name", e.target.value)}
                placeholder="e.g., Water Bottle, School Bag"
                className={cn("border-yellow-300 focus:border-blue-500", errors.object_name && "border-red-500")}
              />
              {errors.object_name && <p className="text-red-500 text-sm mt-1">{errors.object_name}</p>}
            </div>

            {/* Found Date */}
            <div>
              <Label className="text-blue-700">Found Date *</Label>
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
                    {formData.found_date ? format(formData.found_date, "PPP") : "Pick a date"}
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

          {/* Short Description */}
          <div>
            <Label htmlFor="description" className="text-blue-700">
              Short Description * <span className="text-sm text-gray-500">(This will show in the preview)</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description of the item..."
              rows={2}
              className={cn("border-yellow-300 focus:border-blue-500", errors.description && "border-red-500")}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Full Description */}
          <div>
            <Label htmlFor="full_description" className="text-blue-700">
              Full Description *{" "}
              <span className="text-sm text-gray-500">(Detailed description shown when expanded)</span>
            </Label>
            <Textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) => handleInputChange("full_description", e.target.value)}
              placeholder="Detailed description including color, size, condition, any identifying marks..."
              rows={4}
              className={cn("border-yellow-300 focus:border-blue-500", errors.full_description && "border-red-500")}
            />
            {errors.full_description && <p className="text-red-500 text-sm mt-1">{errors.full_description}</p>}
          </div>

          {/* Location */}
          <div>
            <Label className="text-blue-700">Location Found *</Label>
            <Select
              value={formData.location_found}
              onValueChange={(value) => handleInputChange("location_found", value)}
            >
              <SelectTrigger
                className={cn("border-yellow-300 focus:border-blue-500", errors.location_found && "border-red-500")}
              >
                <SelectValue placeholder="Select location where item was found" />
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

          {/* Custom Location (if Other is selected) */}
          {formData.location_found === "Other" && (
            <div>
              <Label htmlFor="custom_location" className="text-blue-700">
                Specify Location *
              </Label>
              <Input
                id="custom_location"
                value={formData.custom_location}
                onChange={(e) => handleInputChange("custom_location", e.target.value)}
                placeholder="Please specify the exact location"
                className={cn("border-yellow-300 focus:border-blue-500", errors.custom_location && "border-red-500")}
              />
              {errors.custom_location && <p className="text-red-500 text-sm mt-1">{errors.custom_location}</p>}
            </div>
          )}

          {/* Student Information */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-blue-700">Student Information (Person who found the item)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_number" className="text-blue-700">
                  Student Number *
                </Label>
                <Input
                  id="student_number"
                  value={formData.student_number}
                  onChange={(e) => handleInputChange("student_number", e.target.value)}
                  placeholder="e.g., 30234"
                  className={cn("border-yellow-300 focus:border-blue-500", errors.student_number && "border-red-500")}
                />
                {errors.student_number && <p className="text-red-500 text-sm mt-1">{errors.student_number}</p>}
              </div>
              <div>
                <Label htmlFor="student_nickname" className="text-blue-700">
                  Student Nickname *
                </Label>
                <Input
                  id="student_nickname"
                  value={formData.student_nickname}
                  onChange={(e) => handleInputChange("student_nickname", e.target.value)}
                  placeholder="e.g., Ice"
                  className={cn("border-yellow-300 focus:border-blue-500", errors.student_nickname && "border-red-500")}
                />
                {errors.student_nickname && <p className="text-red-500 text-sm mt-1">{errors.student_nickname}</p>}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Label className="text-blue-700">Item Photo</Label>
            <div className="border-2 border-dashed border-yellow-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 mb-4">Upload a photo of the lost item</p>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    // TODO: Handle file upload
                    console.log("File selected:", file.name)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="bg-white hover:bg-yellow-50 border-yellow-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white">
              {loading ? "Adding Item..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
