const { PrismaClient } = require('./src/generated/prisma')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query successful:', result)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Make sure PostgreSQL is running on localhost:5432')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()