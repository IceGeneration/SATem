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
    const { data, error } = await supabase.from("news").select("id").limit(1)
    return !error
  } catch (error) {
    return false
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json([])
    }

    const tableExists = await checkTableExists(supabase)

    if (!tableExists) {
      console.log("Table 'news' does not exist yet. Please run the database setup scripts.")
      return NextResponse.json([])
    }

    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error("Error fetching news:", error)
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

    const tableExists = await checkTableExists(supabase)

    if (!tableExists) {
      return NextResponse.json(
        { error: "Database table not found. Please run the database setup scripts first." },
        { status: 503 },
      )
    }

    const newsData = {
      title: body.title,
      content: body.content,
      admin_name: body.admin_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("news").insert([newsData]).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create news: " + error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating news:", error)
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 })
  }
}
