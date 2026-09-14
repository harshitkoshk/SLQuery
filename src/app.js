const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const apiRoutes = require('./routes/index');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Configure CORS for Person 1's frontend
const corsOptions = {
  origin: env.FRONTEND_URL === '*' ? '*' : env.FRONTEND_URL.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsers with generous limits for high-resolution camera uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const fs = require('fs');

// Serve uploaded complaint images statically
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Mount Main API Routes
app.use('/api', apiRoutes);

// Serve production Vite frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Root welcome route for API only
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to SLQuery Smart Streetlight Monitoring & AI Verification API',
      version: '1.0.0',
      documentation: '/api/health'
    });
  });
}

// 404 handler for unrecognized routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
