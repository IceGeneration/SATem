"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Eye, Calendar, User, Plus, Database, AlertCircle } from "lucide-react"
import ImageModal from "@/components/image-modal"
import ClaimItemModal from "@/components/claim-item-modal"
import AddItemModal from "@/components/add-item-modal"

interface LostFoundItem {
  id: number
  object_name: string
  description: string
  full_description: string
  image_url: string
  student_number: string
  student_nickname: string
  found_date: string
  location_found: string
  status: "available" | "claimed"
  claimed_by?: string
  claimed_date?: string
  claim_notes?: string
}

export default function LostFoundTable() {
  const [items, setItems] = useState<LostFoundItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [expandedDescription, setExpandedDescription] = useState<number | null>(null)
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [databaseError, setDatabaseError] = useState<string | null>(null)

  const fetchItems = async () => {
    setLoading(true)
    setDatabaseError(null)
    try {
      const response = await fetch("/api/lost-found", {
        cache: "no-store", // Ensure fresh data from server
      })

      if (response.ok) {
        const data = await response.json()
        setItems(data)
      } else {
        const errorData = await response.json()
        setDatabaseError(errorData.error || "Failed to fetch items")
      }
    } catch (error) {
      console.error("Error fetching items:", error)
      setDatabaseError("Failed to connect to database")
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

  const toggleDescription = (id: number) => {
    setExpandedDescription(expandedDescription === id ? null : id)
  }

  const handleClaim = async (itemId: number, claimedBy: string, notes?: string) => {
    try {
      const response = await fetch("/api/lost-found/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, claimedBy, notes }),
      })

      if (response.ok) {
        // Auto-refresh after successful claim
        await fetchItems()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to claim item")
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
        // Auto-refresh after successful creation
        await fetchItems()
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add item")
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2 text-blue-600">Loading items...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-blue-800">Lost & Found Items</h3>
        <div className="flex gap-2">
          <Button onClick={() => setAddModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Item
          </Button>
          <Button
            onClick={handleRefresh}
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Database Error Alert */}
      {databaseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database Error:</strong> {databaseError}
            <br />
            <span className="text-sm mt-1 block">
              Please make sure Supabase is configured and the database tables are created.
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Setup Instructions */}
      {!databaseError && items.length === 0 && (
        <Card className="border-yellow-200">
          <CardContent className="text-center py-12">
            <Database className="mx-auto h-16 w-16 text-blue-400 mb-4" />
            <h4 className="text-xl font-semibold text-blue-800 mb-2">Welcome to Lost & Found!</h4>
            <p className="text-blue-600 text-lg mb-2">No items found at the moment.</p>
            <p className="text-blue-500 text-sm mb-4">Click "New Item" to add the first lost item to get started!</p>

            {/* Setup Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg mt-4 text-left max-w-md mx-auto">
              <h5 className="font-semibold text-blue-700 mb-2">First Time Setup:</h5>
              <ol className="text-sm text-blue-600 space-y-1 list-decimal list-inside">
                <li>Add Supabase integration</li>
                <li>Run the database setup scripts</li>
                <li>Start adding lost items!</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      {!databaseError && items.length > 0 && (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="border-yellow-200 hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-blue-100">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-blue-800 text-xl">{item.object_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={item.status === "available" ? "default" : "secondary"}
                        className={item.status === "available" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {item.status === "available" ? "Available" : "Claimed"}
                      </Badge>
                      <span className="text-sm text-blue-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.found_date).toLocaleDateString()}
                      </span>
                    </div>
                    {item.status === "claimed" && item.claimed_by && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Claimed by:</strong> {item.claimed_by}
                        {item.claimed_date && (
                          <span className="ml-2">on {new Date(item.claimed_date).toLocaleDateString()}</span>
                        )}
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
                      View Image
                    </Button>
                    {/* Only show Claim button if status is available */}
                    {item.status === "available" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => openClaimModal(item)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Claim Item
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-blue-700 mb-2">Description</h4>
                    <p className="text-gray-700 mb-2">
                      {expandedDescription === item.id ? item.full_description : item.description}
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => toggleDescription(item.id)}
                      className="text-yellow-600 hover:text-yellow-700 p-0 h-auto"
                    >
                      {expandedDescription === item.id ? "Show less" : "Click to see more"}
                    </Button>
                    <p className="text-sm text-blue-600 mt-2">
                      <strong>Found at:</strong> {item.location_found}
                    </p>
                    {item.claim_notes && item.status === "claimed" && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Claim notes:</strong> {item.claim_notes}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Found by
                    </h4>
                    <p className="text-blue-800 font-medium">
                      {item.student_number} {item.student_nickname}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
