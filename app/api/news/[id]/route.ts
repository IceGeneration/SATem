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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ message: "News deleted successfully (demo mode)" })
    }

    const { error } = await supabase.from("news").delete().eq("id", params.id)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to delete news" }, { status: 500 })
    }

    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("Error deleting news:", error)
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 })
  }
}
