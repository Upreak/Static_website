const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmins() {
  try {
    console.log('Checking admin users...');
    const admins = await prisma.admin.findMany();
    console.log('Found admin users:', admins.length);
    
    if (admins.length > 0) {
      console.log('Admin users:');
      admins.forEach(admin => {
        console.log(`- ${admin.email} (${admin.role}) - Active: ${admin.isActive}`);
      });
    } else {
      console.log('No admin users found!');
    }
  } catch (error) {
    console.error('Error checking admins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmins();