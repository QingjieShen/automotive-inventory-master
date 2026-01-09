const { PrismaClient } = require('./src/generated/prisma')

async function checkUsers() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking database for users...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true
      }
    })
    
    if (users.length === 0) {
      console.log('❌ No users found in database')
      console.log('💡 Run "npm run db:seed" to create test users')
    } else {
      console.log('✅ Found users in database:')
      console.table(users)
      
      console.log('\n📝 Test Account Credentials:')
      users.forEach(user => {
        if (user.email === 'admin@markmotors.com') {
          console.log(`👤 Admin: ${user.email} / admin123`)
        } else if (user.email === 'photographer@markmotors.com') {
          console.log(`📸 Photographer: ${user.email} / photo123`)
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message)
    console.log('💡 Make sure your database is running and seeded')
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()