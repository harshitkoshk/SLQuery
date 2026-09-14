const app = require('./app');
const env = require('./config/env');
const prisma = require('./db/client');

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully.');

    const server = app.listen(env.PORT, () => {
      console.log(`
🚀 ========================================================
💡 Smart Streetlight Monitoring Backend API is running!
🌐 Base URL: http://localhost:${env.PORT}
📡 API Endpoints: http://localhost:${env.PORT}/api
🩺 Healthcheck:   http://localhost:${env.PORT}/api/health
🔒 CORS Allowed:  ${env.FRONTEND_URL}
========================================================
      `);
    });

    // Graceful shutdown handling
    const shutdown = async () => {
      console.log('Stopping server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Prisma disconnected. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
