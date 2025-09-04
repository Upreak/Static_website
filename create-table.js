const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTable() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS email_subscriptions (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTable();