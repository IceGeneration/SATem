// For production/deployed version - update the URL
const BASE_URL = "https://your-actual-vercel-url.vercel.app" // UPDATE THIS!

async function clearProductionDatabase() {
  console.log("🚨 PRODUCTION DATABASE CLEAR")
  console.log("⚠️  WARNING: This will delete ALL data from production!")
  console.log(`🎯 Target: ${BASE_URL}`)
  console.log("")

  // Add extra confirmation for production
  console.log("⏳ Starting in 10 seconds... Press Ctrl+C to cancel!")
  await new Promise((resolve) => setTimeout(resolve, 10000))

  try {
    // Get all items
    const response = await fetch(`${BASE_URL}/api/lost-found`)

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`)
    }

    const items = await response.json()
    console.log(`📊 Found ${items.length} items to delete`)

    if (items.length === 0) {
      console.log("✨ Database is already empty!")
      return
    }

    // Delete all items
    let deleted = 0
    for (const item of items) {
      try {
        const deleteResponse = await fetch(`${BASE_URL}/api/lost-found/${item.id}`, {
          method: "DELETE",
        })

        if (deleteResponse.ok) {
          deleted++
          console.log(`🗑️  ${deleted}/${items.length} - Deleted: ${item.object_name}`)
        }

        // Delay between requests for production
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.log(`❌ Failed to delete item ${item.id}`)
      }
    }

    console.log(`\n🎉 Production cleanup complete! Deleted ${deleted}/${items.length} items`)
  } catch (error) {
    console.error("💥 Production clear failed:", error.message)
  }
}

clearProductionDatabase()
