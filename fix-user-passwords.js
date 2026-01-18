#!/usr/bin/env node

/**
 * Fix User Passwords
 * Updates user passwords to match the documented credentials
 */

require('dotenv').config();
const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
  console.log('🔧 Fixing user passwords...\n');

  try {
    // Hash the passwords
    const superAdminPassword = await bcrypt.hash('superadmin123', 12);
    const adminPassword = await bcrypt.hash('admin123', 12);
    const photographerPassword = await bcrypt.hash('photo123', 12);

    // Update super admin
    const superAdmin = await prisma.user.update({
      where: { email: 'superadmin@markmotors.com' },
      data: { passwordHash: superAdminPassword }
    });
    console.log('✅ Updated super admin password: superadmin@markmotors.com / superadmin123');

    // Update admin
    const admin = await prisma.user.update({
      where: { email: 'admin@markmotors.com' },
      data: { passwordHash: adminPassword }
    });
    console.log('✅ Updated admin password: admin@markmotors.com / admin123');

    // Update photographer
    const photographer = await prisma.user.update({
      where: { email: 'photographer@markmotors.com' },
      data: { passwordHash: photographerPassword }
    });
    console.log('✅ Updated photographer password: photographer@markmotors.com / photo123');

    console.log('\n🎉 All passwords updated successfully!');
    console.log('\nYou can now login with:');
    console.log('  Super Admin: superadmin@markmotors.com / superadmin123');
    console.log('  Admin: admin@markmotors.com / admin123');
    console.log('  Photographer: photographer@markmotors.com / photo123');

  } catch (error) {
    console.error('❌ Error updating passwords:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();
