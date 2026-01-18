import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create 9 MMG store locations
  const stores = [
    {
      name: 'Mark Motors Toyota Downtown',
      address: '123 Main Street, Toronto, ON M5V 3A8',
      brandLogos: ['toyota-logo.png']
    },
    {
      name: 'Mark Motors Honda North York',
      address: '456 Yonge Street, North York, ON M2N 5S2',
      brandLogos: ['honda-logo.png']
    },
    {
      name: 'Mark Motors Lexus Markham',
      address: '789 Highway 7, Markham, ON L3R 1A1',
      brandLogos: ['lexus-logo.png']
    },
    {
      name: 'Mark Motors Acura Mississauga',
      address: '321 Dundas Street, Mississauga, ON L5B 1H7',
      brandLogos: ['acura-logo.png']
    },
    {
      name: 'Mark Motors Toyota Scarborough',
      address: '654 Kingston Road, Scarborough, ON M1K 1G4',
      brandLogos: ['toyota-logo.png']
    },
    {
      name: 'Mark Motors Honda Etobicoke',
      address: '987 The Queensway, Etobicoke, ON M8Z 1N4',
      brandLogos: ['honda-logo.png']
    },
    {
      name: 'Mark Motors Lexus Richmond Hill',
      address: '147 Bayview Avenue, Richmond Hill, ON L4C 2Z1',
      brandLogos: ['lexus-logo.png']
    },
    {
      name: 'Mark Motors Acura Vaughan',
      address: '258 Rutherford Road, Vaughan, ON L4K 2N6',
      brandLogos: ['acura-logo.png']
    },
    {
      name: 'Mark Motors Multi-Brand Brampton',
      address: '369 Queen Street, Brampton, ON L6V 1A9',
      brandLogos: ['toyota-logo.png', 'honda-logo.png', 'lexus-logo.png', 'acura-logo.png']
    }
  ]

  console.log('Creating stores...')
  
  // First, check if stores already exist
  const existingStores = await prisma.store.findMany()
  
  if (existingStores.length === 0) {
    for (const store of stores) {
      const createdStore = await prisma.store.create({
        data: store
      })
      console.log(`✅ Created store: ${createdStore.name}`)
    }
  } else {
    console.log('✅ Stores already exist, skipping creation')
  }

  // Create sample users
  console.log('Creating sample users...')
  
  const superAdminPassword = await hash('superadmin123', 12)
  const adminPassword = await hash('admin123', 12)
  const photographerPassword = await hash('photo123', 12)

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@markmotors.com' },
    update: {},
    create: {
      email: 'superadmin@markmotors.com',
      passwordHash: superAdminPassword,
      role: 'SUPER_ADMIN',
      name: 'Super Admin'
    }
  })
  console.log(`✅ Created super admin user: ${superAdmin.email}`)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@markmotors.com' },
    update: {},
    create: {
      email: 'admin@markmotors.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      name: 'Admin User'
    }
  })
  console.log(`✅ Created admin user: ${admin.email}`)

  const photographer = await prisma.user.upsert({
    where: { email: 'photographer@markmotors.com' },
    update: {},
    create: {
      email: 'photographer@markmotors.com',
      passwordHash: photographerPassword,
      role: 'PHOTOGRAPHER',
      name: 'Photographer User'
    }
  })
  console.log(`✅ Created photographer user: ${photographer.email}`)

  // Create sample vehicles for the first store
  const firstStore = await prisma.store.findFirst()
  if (firstStore) {
    console.log('Creating sample vehicles...')
    
    const sampleVehicles = [
      { stockNumber: 'T12345', vin: '1HGBH41JXMN109186', storeId: firstStore.id },
      { stockNumber: 'H67890', vin: '2HGFG12878H542890', storeId: firstStore.id },
      { stockNumber: 'L11111', vin: 'JTHBK1GG8E2123456', storeId: firstStore.id }
    ]

    for (const vehicle of sampleVehicles) {
      const createdVehicle = await prisma.vehicle.upsert({
        where: { 
          stockNumber_storeId: {
            stockNumber: vehicle.stockNumber,
            storeId: vehicle.storeId
          }
        },
        update: {},
        create: vehicle
      })
      console.log(`✅ Created vehicle: ${createdVehicle.stockNumber}`)
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })