// Quick version - just clears everything immediately
const BASE_URL = "https://your-website-url.vercel.app" // Replace with your actual URL

async function quickClear() {
  console.log("🧹 Quick database clear...")

  try {
    // Get all items
    const response = await fetch(`${BASE_URL}/api/lost-found`)
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
      } catch (error) {
        console.log(`❌ Failed to delete item ${item.id}`)
      }
    }

    console.log(`\n🎉 Cleanup complete! Deleted ${deleted}/${items.length} items`)
  } catch (error) {
    console.error("💥 Error:", error.message)
  }
}

quickClear()
