const { PrismaClient } = require('@prisma/client');

// Initialize a shared singleton Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error']
});

module.exports = prisma;
