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

interface ClaimItemModalProps {
  item: any
  isOpen: boolean
  onClose: () => void
  onClaim: (itemId: number, claimedBy: string, notes?: string) => Promise<boolean>
}

export default function ClaimItemModal({ item, isOpen, onClose, onClaim }: ClaimItemModalProps) {
  const [claimedBy, setClaimedBy] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!claimedBy.trim()) return

    setLoading(true)
    setError("")

    try {
      const success = await onClaim(item.id, claimedBy, notes)
      if (success) {
        setClaimedBy("")
        setNotes("")
        onClose()
      }
    } catch (error: any) {
      setError(error.message || "ไม่สามารถรับของได้")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setClaimedBy("")
    setNotes("")
    setError("")
    onClose()
  }

  const getModalTitle = () => {
    if (item?.item_type === "lost") {
      return `ยืนยันเป็นเจ้าของ: ${item?.object_name}`
    } else {
      return `รับของ: ${item?.object_name}`
    }
  }

  const getButtonText = () => {
    if (item?.item_type === "lost") {
      return loading ? "กำลังยืนยัน..." : "ยืนยันเป็นเจ้าของ"
    } else {
      return loading ? "กำลังรับของ..." : "รับของ"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-800">{getModalTitle()}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="claimedBy" className="text-blue-700">
              {item?.item_type === "lost" ? "ข้อมูลผู้รับคืน" : "ข้อมูลผู้รับ"} (รหัสนักเรียน และ ชื่อเล่น) *
            </Label>
            <Input
              id="claimedBy"
              value={claimedBy}
              onChange={(e) => setClaimedBy(e.target.value)}
              placeholder="เช่น 30234 ไอซ์"
              required
              className="border-yellow-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-blue-700">
              หมายเหตุเพิ่มเติม (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ข้อมูลเพิ่มเติม..."
              className="border-yellow-300 focus:border-blue-500"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              disabled={loading || !claimedBy.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            >
              {getButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
