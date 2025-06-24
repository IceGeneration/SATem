import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

// Create Supabase client only if configured
const getSupabaseClient = () => {
  if (!isSupabaseConfigured()) {
    return null
  }

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      // Return mock item if Supabase is not configured
      return NextResponse.json({
        id: Number.parseInt(params.id),
        object_name: "Mock Item",
        description: "This is a mock item for demo purposes",
        full_description: "Full description of mock item",
        image_url: "/placeholder.svg?height=300&width=300",
        student_number: "12345",
        student_nickname: "Demo",
        found_date: new Date().toISOString().split("T")[0],
        location_found: "Demo Location",
        status: "available",
      })
    }

    const { data, error } = await supabase.from("lost_found_items").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getSupabaseClient()

    if (!supabase) {
      // Simulate successful update
      return NextResponse.json({
        id: Number.parseInt(params.id),
        ...body,
        updated_at: new Date().toISOString(),
      })
    }

    const { data, error } = await supabase.from("lost_found_items").update(body).eq("id", params.id).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      // Simulate successful deletion
      return NextResponse.json({ message: "Item deleted successfully (demo mode)" })
    }

    const { error } = await supabase.from("lost_found_items").delete().eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
    }

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
