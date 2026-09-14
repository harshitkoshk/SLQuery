const express = require('express');
const router = express.Router();
const complaintRoutes = require('./complaint.routes');
const streetlightRoutes = require('./streetlight.routes');

// Healthcheck endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Smart Streetlight Monitoring API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
router.use('/complaints', complaintRoutes);
router.use('/streetlights', streetlightRoutes);

module.exports = router;
