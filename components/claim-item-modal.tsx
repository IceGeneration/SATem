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
      setError(error.message || "Failed to claim item")
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-800">Claim Item: {item?.object_name}</DialogTitle>
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
              Claimed by (Student Number & Name) *
            </Label>
            <Input
              id="claimedBy"
              value={claimedBy}
              onChange={(e) => setClaimedBy(e.target.value)}
              placeholder="e.g., 30234 Ice"
              required
              className="border-yellow-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-blue-700">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information..."
              className="border-yellow-300 focus:border-blue-500"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !claimedBy.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            >
              {loading ? "Claiming..." : "Claim Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
