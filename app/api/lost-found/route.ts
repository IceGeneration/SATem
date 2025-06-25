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

// Check if table exists and what columns are available
const checkTableSchema = async (supabase: any) => {
  try {
    const { data, error } = await supabase.from("lost_found_items").select("*").limit(1)

    if (error) {
      return { exists: false, hasItemType: false }
    }

    // Check if item_type column exists by trying to select it specifically
    const { data: itemTypeCheck, error: itemTypeError } = await supabase
      .from("lost_found_items")
      .select("item_type")
      .limit(1)

    return {
      exists: true,
      hasItemType: !itemTypeError,
    }
  } catch (error) {
    return { exists: false, hasItemType: false }
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json([])
    }

    const schema = await checkTableSchema(supabase)

    if (!schema.exists) {
      console.log("Table 'lost_found_items' does not exist yet. Please run the database setup scripts.")
      return NextResponse.json([])
    }

    // Select columns based on what's available
    const selectColumns = schema.hasItemType
      ? "*"
      : "id, object_name, description, image_url, student_number, student_nickname, found_date, location_found, status, claimed_by, claimed_date, claim_notes, created_at, updated_at"

    const { data, error } = await supabase
      .from("lost_found_items")
      .select(selectColumns)
      .order("created_at", { ascending: false }) // Changed from found_date to created_at since found_date is now text

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json([])
    }

    // Add default item_type if column doesn't exist
    const processedData = (data || []).map((item: any) => ({
      ...item,
      item_type: item.item_type || "found", // Default to "found" if column doesn't exist
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Error fetching lost and found items:", error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured. Please set up Supabase integration." },
        { status: 503 },
      )
    }

    const schema = await checkTableSchema(supabase)

    if (!schema.exists) {
      return NextResponse.json(
        {
          error: "Database table not found. Please run the database setup scripts first.",
        },
        { status: 503 },
      )
    }

    // Prepare data based on available columns
    const baseItemData = {
      object_name: body.object_name,
      description: body.description,
      image_url: body.image_url || "/placeholder.svg?height=300&width=300",
      student_number: body.student_number,
      student_nickname: body.student_nickname,
      found_date: body.found_date, // Now accepts any text format
      location_found: body.location_found,
      status: "available",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add item_type only if the column exists
    const itemData = schema.hasItemType ? { ...baseItemData, item_type: body.item_type || "found" } : baseItemData

    const { data, error } = await supabase.from("lost_found_items").insert([itemData]).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create item: " + error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}
