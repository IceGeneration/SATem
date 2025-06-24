"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface ImageModalProps {
  imageUrl: string | null
  onClose: () => void
}

export default function ImageModal({ imageUrl, onClose }: ImageModalProps) {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-blue-800">Item Image</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <div className="relative w-full h-96">
            <Image
              src={imageUrl.startsWith("data:") ? imageUrl : imageUrl || "/placeholder.svg"}
              alt="Lost item"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
