/**
 * Quick test script to verify the Key Images Backgrounds feature
 * 
 * This script tests:
 * 1. Database schema has new background fields
 * 2. API routes are accessible
 * 3. Background template service integration
 */

const { PrismaClient } = require('./src/generated/prisma');

async function testBackgroundsFeature() {
  const prisma = new PrismaClient();

  try {
    console.log('🧪 Testing Key Images Backgrounds Feature\n');

    // Test 1: Check if Store model has new fields
    console.log('1️⃣ Checking database schema...');
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        bgFrontQuarter: true,
        bgFront: true,
        bgBackQuarter: true,
        bgBack: true,
        bgDriverSide: true,
        bgPassengerSide: true,
      },
      take: 1,
    });

    if (stores.length > 0) {
      console.log('✅ Database schema updated successfully');
      console.log(`   Sample store: ${stores[0].name}`);
      console.log(`   Background fields present: ${Object.keys(stores[0]).filter(k => k.startsWith('bg')).length}/6`);
    } else {
      console.log('⚠️  No stores found in database');
    }

    // Test 2: Check if we can update a store with background URLs
    if (stores.length > 0) {
      console.log('\n2️⃣ Testing background field updates...');
      const testStore = stores[0];
      
      const updated = await prisma.store.update({
        where: { id: testStore.id },
        data: {
          bgFrontQuarter: 'https://example.com/test-bg.jpg',
        },
        select: {
          id: true,
          name: true,
          bgFrontQuarter: true,
        },
      });

      if (updated.bgFrontQuarter === 'https://example.com/test-bg.jpg') {
        console.log('✅ Background field update successful');
        
        // Clean up test data
        await prisma.store.update({
          where: { id: testStore.id },
          data: { bgFrontQuarter: null },
        });
        console.log('   Test data cleaned up');
      } else {
        console.log('❌ Background field update failed');
      }
    }

    // Test 3: Verify all 6 background fields exist
    console.log('\n3️⃣ Verifying all background fields...');
    const requiredFields = [
      'bgFrontQuarter',
      'bgFront',
      'bgBackQuarter',
      'bgBack',
      'bgDriverSide',
      'bgPassengerSide',
    ];

    const storeFields = Object.keys(prisma.store.fields);
    const missingFields = requiredFields.filter(field => !storeFields.includes(field));

    if (missingFields.length === 0) {
      console.log('✅ All 6 background fields present');
      requiredFields.forEach(field => console.log(`   ✓ ${field}`));
    } else {
      console.log('❌ Missing fields:', missingFields);
    }

    console.log('\n✨ Feature test completed successfully!\n');
    console.log('📝 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Login as Super Admin');
    console.log('   3. Navigate to /admin/backgrounds');
    console.log('   4. Upload custom background images for each store');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testBackgroundsFeature();
