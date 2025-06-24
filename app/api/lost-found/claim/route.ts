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

// Check if table exists
const checkTableExists = async (supabase: any) => {
  try {
    const { data, error } = await supabase.from("lost_found_items").select("id").limit(1)

    return !error
  } catch (error) {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const { itemId, claimedBy, notes } = await request.json()
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured. Please set up Supabase integration." },
        { status: 503 },
      )
    }

    // Check if table exists first
    const tableExists = await checkTableExists(supabase)

    if (!tableExists) {
      return NextResponse.json(
        {
          error: "Database table not found. Please run the database setup scripts first.",
        },
        { status: 503 },
      )
    }

    // Server-side status update - ensure status changes to "claimed"
    const updateData = {
      status: "claimed", // Server enforces status change
      claimed_by: claimedBy,
      claimed_date: new Date().toISOString(),
      claim_notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from("lost_found_items")
      .update(updateData)
      .eq("id", itemId)
      .eq("status", "available") // Only update if currently available
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to claim item: " + error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Item not found or already claimed" }, { status: 404 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error claiming item:", error)
    return NextResponse.json({ error: "Failed to claim item" }, { status: 500 })
  }
}
