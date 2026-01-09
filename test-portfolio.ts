/**
 * Test script to verify portfolio endpoints
 */

const BASE_URL = 'http://localhost:3000/api/v1'

async function testEndpoint(name: string, url: string) {
  console.log(`\n🧪 Testing: ${name}`)
  console.log(`   URL: ${url}`)

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok) {
      console.log(`   ✅ Success (${response.status})`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))
    } else {
      console.log(`   ❌ Failed (${response.status})`)
      console.log(`   Error:`, JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.log(`   ❌ Error:`, error.message)
  }
}

async function main() {
  console.log('🚀 Testing Portfolio API Endpoints\n')
  console.log('='.repeat(60))

  // Test endpoints
  await testEndpoint('Portfolio Summary', `${BASE_URL}/portfolio/summary`)
  await testEndpoint('Portfolio Holdings', `${BASE_URL}/portfolio`)
  await testEndpoint('Portfolio History', `${BASE_URL}/portfolio/history`)

  console.log('\n' + '='.repeat(60))
  console.log('\n✨ Testing complete!')
}

main().catch(console.error)
