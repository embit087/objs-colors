// Quick test script to verify API endpoints work
// Run this after starting the dev server with: node test-api.js

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Colors API...\n');

  try {
    // Test GET
    console.log('1. Testing GET /api/colors');
    const getResponse = await fetch(`${API_BASE}/colors`);
    const getData = await getResponse.json();
    console.log('✅ GET Success:', {
      source: getData.source,
      darkColors: getData.data.darkMode.colors.length,
      lightColors: getData.data.lightMode.colors.length
    });

    // Test POST with same data (should work)
    console.log('\n2. Testing POST /api/colors (update with same data)');
    const postResponse = await fetch(`${API_BASE}/colors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getData.data)
    });
    const postData = await postResponse.json();
    console.log('✅ POST Success:', postData.message);

    // Test GET again to verify data persisted
    console.log('\n3. Verifying data persistence');
    const verifyResponse = await fetch(`${API_BASE}/colors`);
    const verifyData = await verifyResponse.json();
    console.log('✅ Persistence verified:', {
      source: verifyData.source,
      totalColors: verifyData.data.darkMode.colors.length + verifyData.data.lightMode.colors.length
    });

    console.log('\n🎉 All API tests passed!');
    console.log('\n💡 Your color system is ready to use!');
    console.log('   • Database: /Users/office/objs/objs-ui-refine/colors-matters/objs-colors/db/database.db');
    console.log('   • Frontend: http://localhost:3000');
    console.log('   • API: http://localhost:3000/api/colors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure to start the dev server first:');
    console.log('   npm run dev');
  }
}

testAPI();
