// Test script to check if your API is working
const BASE_URL = "http://localhost:3000"

async function testAPI() {
  console.log("🔍 Testing API endpoints...")
  console.log(`🎯 Base URL: ${BASE_URL}`)
  console.log("─".repeat(50))

  // Test 1: GET /api/lost-found
  try {
    console.log("1️⃣ Testing GET /api/lost-found...")
    const response = await fetch(`${BASE_URL}/api/lost-found`)

    console.log(`   Status: ${response.status} ${response.statusText}`)
    console.log(`   Content-Type: ${response.headers.get("content-type")}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Success! Found ${data.length} items`)

      // Show first item if exists
      if (data.length > 0) {
        console.log(`   📋 First item: ${data[0].object_name} (ID: ${data[0].id})`)
      }
    } else {
      const text = await response.text()
      console.log(`   ❌ Error response: ${text.substring(0, 100)}...`)
    }
  } catch (error) {
    console.log(`   💥 Network error: ${error.message}`)
  }

  console.log()

  // Test 2: POST /api/lost-found (create test item)
  try {
    console.log("2️⃣ Testing POST /api/lost-found...")
    const testItem = {
      object_name: "Test Item",
      description: "This is a test item for API testing",
      student_number: "99999",
      student_nickname: "Test",
      location_found: "Test Location",
      found_date: "01/01/2024",
      item_type: "found",
    }

    const response = await fetch(`${BASE_URL}/api/lost-found`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testItem),
    })

    console.log(`   Status: ${response.status} ${response.statusText}`)

    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Success! Created item with ID: ${data.id}`)

      // Test 3: DELETE the test item
      console.log("3️⃣ Testing DELETE /api/lost-found/[id]...")
      const deleteResponse = await fetch(`${BASE_URL}/api/lost-found/${data.id}`, {
        method: "DELETE",
      })

      if (deleteResponse.ok) {
        console.log(`   ✅ Success! Deleted test item`)
      } else {
        console.log(`   ❌ Failed to delete test item`)
      }
    } else {
      const text = await response.text()
      console.log(`   ❌ Error creating item: ${text.substring(0, 100)}...`)
    }
  } catch (error) {
    console.log(`   💥 Network error: ${error.message}`)
  }

  console.log("\n" + "=".repeat(50))
  console.log("🏁 API TEST COMPLETED")
  console.log("=".repeat(50))
}

testAPI().catch(console.error)
