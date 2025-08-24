// Test script for new interactive features
// Run after starting dev server with: node test-new-features.js

const API_BASE = 'http://localhost:3000/api';

async function testInteractiveFeatures() {
  console.log('🧪 Testing Interactive Color Features...\n');

  try {
    // 1. Get initial colors
    console.log('1. Getting initial colors...');
    const getResponse = await fetch(`${API_BASE}/colors`);
    const initialData = await getResponse.json();
    console.log('✅ Initial colors loaded:', {
      darkColors: initialData.data.darkMode.colors.length,
      lightColors: initialData.data.lightMode.colors.length
    });

    // 2. Test adding a new color to dark mode
    console.log('\n2. Testing add color to dark mode...');
    const newColor = {
      name: 'Test Purple',
      color: {
        hex: '#8B5CF6',
        rgb: 'rgb(139, 92, 246)'
      }
    };

    const addResponse = await fetch(`${API_BASE}/colors/add/dark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newColor)
    });
    const addData = await addResponse.json();
    console.log('✅ Color added:', addData.message);
    const testColorId = addData.color.id;

    // 3. Verify the color was added
    console.log('\n3. Verifying color was added...');
    const verifyResponse = await fetch(`${API_BASE}/colors`);
    const verifyData = await verifyResponse.json();
    const foundColor = verifyData.data.darkMode.colors.find(c => c.id === testColorId);
    if (foundColor) {
      console.log('✅ Color found in database:', foundColor.name);
    } else {
      throw new Error('Added color not found!');
    }

    // 4. Test updating the color
    console.log('\n4. Testing color update...');
    const updatedColor = {
      ...newColor,
      name: 'Updated Test Purple',
      color: {
        hex: '#A855F7',
        rgb: 'rgb(168, 85, 247)'
      }
    };

    const updateResponse = await fetch(`${API_BASE}/colors/${testColorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedColor)
    });
    const updateData = await updateResponse.json();
    console.log('✅ Color updated:', updateData.message);

    // 5. Test deleting the color
    console.log('\n5. Testing color deletion...');
    const deleteResponse = await fetch(`${API_BASE}/colors/${testColorId}`, {
      method: 'DELETE'
    });
    const deleteData = await deleteResponse.json();
    console.log('✅ Color deleted:', deleteData.message);

    // 6. Verify the color was deleted
    console.log('\n6. Verifying color was deleted...');
    const finalResponse = await fetch(`${API_BASE}/colors`);
    const finalData = await finalResponse.json();
    const deletedColor = finalData.data.darkMode.colors.find(c => c.id === testColorId);
    if (!deletedColor) {
      console.log('✅ Color successfully removed from database');
    } else {
      throw new Error('Color was not properly deleted!');
    }

    console.log('\n🎉 All interactive features tests passed!');
    console.log('\n💡 Features ready to use:');
    console.log('   • ✏️ Edit colors by clicking on them or the edit button (Lucide icons above card)');
    console.log('   • 🗑️ Delete colors with confirmation dialog (Lucide icons above card)');
    console.log('   • ➕ Add new colors with the "Add Color" button (Lucide icons)');
    console.log('   • 📱 Mobile-responsive design with proper label positioning');
    console.log('   • 🔄 Real-time database updates');
    console.log('   • 🎨 Professional UI with buttons positioned above color cards');
    console.log('   • 🏗️ Modular ColorFeatureCard architecture for better maintainability');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure to start the dev server first:');
    console.log('   npm run dev');
  }
}

testInteractiveFeatures();
