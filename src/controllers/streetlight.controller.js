const streetlightService = require('../services/streetlight.service');

class StreetlightController {
  /**
   * GET /api/streetlights
   * List all streetlights with status indicators (Green, Yellow, Red)
   */
  async getStreetlights(req, res, next) {
    try {
      const { area, status } = req.query;
      const streetlights = await streetlightService.getAllStreetlights({ area, status });

      res.status(200).json({
        success: true,
        count: streetlights.length,
        data: streetlights
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/streetlights/areas
   * Get aggregated area-wise streetlight statuses for dashboard/map
   */
  async getAreaSummary(req, res, next) {
    try {
      const summary = await streetlightService.getAreaSummary();

      res.status(200).json({
        success: true,
        count: summary.length,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StreetlightController();
