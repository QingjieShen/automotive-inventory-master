const { PrismaClient } = require('./src/generated/prisma')

async function checkDatabaseStatus() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking database status...\n')
    
    // Check connection
    await prisma.$connect()
    console.log('✅ Database connection: OK')
    
    // Check users
    const userCount = await prisma.user.count()
    console.log(`👥 Users in database: ${userCount}`)
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        select: { email: true, role: true, name: true }
      })
      console.log('📋 User accounts:')
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`)
      })
    }
    
    // Check stores
    const storeCount = await prisma.store.count()
    console.log(`🏪 Stores in database: ${storeCount}`)
    
    // Check vehicles
    const vehicleCount = await prisma.vehicle.count()
    console.log(`🚗 Vehicles in database: ${vehicleCount}`)
    
    console.log('\n📝 Test Login Credentials:')
    console.log('   Admin: admin@markmotors.com / admin123')
    console.log('   Photographer: photographer@markmotors.com / photo123')
    
    if (userCount === 0) {
      console.log('\n💡 Database appears empty. Run: npm run db:seed')
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message)
    
    if (error.message.includes("Can't reach database")) {
      console.log('\n💡 Solutions:')
      console.log('   1. Start Docker: docker-compose up -d')
      console.log('   2. Or install PostgreSQL locally')
      console.log('   3. Or let me help you switch to SQLite')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseStatus()