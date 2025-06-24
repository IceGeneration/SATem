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

    // If no error, table exists
    return !error
  } catch (error) {
    return false
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      // Return empty array with message if Supabase is not configured
      return NextResponse.json([])
    }

    // Check if table exists first
    const tableExists = await checkTableExists(supabase)

    if (!tableExists) {
      console.log("Table 'lost_found_items' does not exist yet. Please run the database setup scripts.")
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from("lost_found_items")
      .select("*")
      .order("found_date", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
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

    // Server-side data preparation
    const itemData = {
      object_name: body.object_name,
      description: body.description,
      full_description: body.full_description,
      image_url: body.image_url || "/placeholder.svg?height=300&width=300",
      student_number: body.student_number,
      student_nickname: body.student_nickname,
      found_date: body.found_date,
      location_found: body.location_found,
      status: "available", // Always set to available on server
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

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
