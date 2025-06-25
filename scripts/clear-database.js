// Script to clear all items from the database via API
const BASE_URL = "https://your-website-url.vercel.app" // Replace with your actual URL

async function getAllItems() {
  try {
    console.log("📡 Fetching all items from database...")
    const response = await fetch(`${BASE_URL}/api/lost-found`)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
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
      const result = await response.json()
      console.log(`🗑️  Deleted item ${itemId}: ${result.message || "Success"}`)
      return { success: true }
    } else {
      const error = await response.json()
      console.log(`❌ Failed to delete item ${itemId}: ${error.error || "Unknown error"}`)
      return { success: false, error: error.error }
    }
  } catch (error) {
    console.log(`💥 Network error deleting item ${itemId}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function clearDatabase() {
  console.log("🧹 Starting database cleanup...")
  console.log(`🎯 Target URL: ${BASE_URL}`)
  console.log("─".repeat(50))

  // Get all items
  const items = await getAllItems()

  if (items.length === 0) {
    console.log("✨ Database is already empty!")
    return
  }

  console.log(`🎯 Will delete ${items.length} items...`)
  console.log("⚠️  This action cannot be undone!")

  // Add a 5-second delay to allow cancellation
  console.log("⏳ Starting deletion in 5 seconds... (Press Ctrl+C to cancel)")
  await new Promise((resolve) => setTimeout(resolve, 5000))

  let successCount = 0
  let errorCount = 0
  const startTime = Date.now()

  // Delete items in batches to avoid overwhelming the server
  const batchSize = 10
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchNumber = Math.floor(i / batchSize) + 1

    console.log(`\n📦 Batch ${batchNumber}: Deleting items ${i + 1}-${Math.min(i + batchSize, items.length)}...`)

    // Process batch
    const deletePromises = batch.map((item) => deleteItem(item.id))
    const results = await Promise.all(deletePromises)

    // Count results
    const batchSuccess = results.filter((r) => r.success).length
    const batchErrors = results.filter((r) => !r.success).length

    successCount += batchSuccess
    errorCount += batchErrors

    console.log(`📈 Batch ${batchNumber}: ${batchSuccess} deleted, ${batchErrors} errors`)

    // Small delay between batches
    if (i + batchSize < items.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  const endTime = Date.now()
  const totalTime = (endTime - startTime) / 1000

  console.log("\n" + "=".repeat(50))
  console.log("🏁 DATABASE CLEANUP COMPLETED")
  console.log("=".repeat(50))
  console.log(`📊 Total Items: ${items.length}`)
  console.log(`✅ Successfully Deleted: ${successCount}`)
  console.log(`❌ Failed to Delete: ${errorCount}`)
  console.log(`⏱️  Total Time: ${totalTime.toFixed(2)} seconds`)
  console.log("=".repeat(50))

  if (errorCount === 0) {
    console.log("🎉 Database successfully cleared!")
  } else {
    console.log("⚠️  Some items could not be deleted. You may need to check manually.")
  }
}

// Confirmation function
async function confirmAndClear() {
  console.log("🚨 DATABASE CLEANUP TOOL")
  console.log("⚠️  WARNING: This will delete ALL items from your database!")
  console.log("📍 Target:", BASE_URL)
  console.log("")

  // In a real environment, you might want to add readline for confirmation
  // For now, just run after a delay
  await clearDatabase()
}

// Run the cleanup
confirmAndClear().catch(console.error)
