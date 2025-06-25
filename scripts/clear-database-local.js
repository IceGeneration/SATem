// Updated script for local development
const BASE_URL = "http://localhost:3000" // For local development

async function getAllItems() {
  try {
    console.log("📡 Fetching all items from local server...")
    const response = await fetch(`${BASE_URL}/api/lost-found`)

    if (!response.ok) {
      const text = await response.text()
      console.log("Response status:", response.status)
      console.log("Response text:", text.substring(0, 200))
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()
      console.log("Non-JSON response:", text.substring(0, 200))
      throw new Error("Server returned non-JSON response")
    }

    const items = await response.json()
    console.log(`📊 Found ${items.length} items in database`)
    return items
  } catch (error) {
    console.error("❌ Failed to fetch items:", error.message)
    return []
  }
}

async function deleteItem(itemId) {
  try {
    const response = await fetch(`${BASE_URL}/api/lost-found/${itemId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      console.log(`🗑️  Deleted item ${itemId}`)
      return { success: true }
    } else {
      const error = await response.text()
      console.log(`❌ Failed to delete item ${itemId}: ${error}`)
      return { success: false, error }
    }
  } catch (error) {
    console.log(`💥 Network error deleting item ${itemId}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function clearDatabase() {
  console.log("🧹 Starting local database cleanup...")
  console.log(`🎯 Target URL: ${BASE_URL}`)
  console.log("─".repeat(50))

  // Test connection first
  try {
    const testResponse = await fetch(`${BASE_URL}/api/lost-found`)
    console.log(`📡 Connection test: ${testResponse.status} ${testResponse.statusText}`)

    if (!testResponse.ok) {
      console.log("❌ Cannot connect to local server. Make sure your Next.js app is running on port 3000")
      return
    }
  } catch (error) {
    console.log("❌ Cannot connect to local server:", error.message)
    console.log("💡 Make sure to run 'npm run dev' first!")
    return
  }

  // Get all items
  const items = await getAllItems()

  if (items.length === 0) {
    console.log("✨ Database is already empty!")
    return
  }

  console.log(`🎯 Will delete ${items.length} items...`)

  let successCount = 0
  let errorCount = 0

  // Delete items one by one
  for (const item of items) {
    const result = await deleteItem(item.id)
    if (result.success) {
      successCount++
    } else {
      errorCount++
    }

    // Small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log("\n" + "=".repeat(50))
  console.log("🏁 DATABASE CLEANUP COMPLETED")
  console.log("=".repeat(50))
  console.log(`📊 Total Items: ${items.length}`)
  console.log(`✅ Successfully Deleted: ${successCount}`)
  console.log(`❌ Failed to Delete: ${errorCount}`)
  console.log("=".repeat(50))

  if (errorCount === 0) {
    console.log("🎉 Database successfully cleared!")
  } else {
    console.log("⚠️  Some items could not be deleted.")
  }
}

// Run the cleanup
clearDatabase().catch(console.error)
