const express = require('express');
const router = express.Router();
const streetlightController = require('../controllers/streetlight.controller');

/**
 * @route   GET /api/streetlights
 * @desc    Get list of all streetlights with status indicators (green, yellow, red)
 */
router.get('/', streetlightController.getStreetlights);

/**
 * @route   GET /api/streetlights/areas
 * @desc    Get aggregated area statuses for map/overview
 */
router.get('/areas', streetlightController.getAreaSummary);

module.exports = router;
