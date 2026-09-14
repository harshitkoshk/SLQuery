const prisma = require('../db/client');

class StreetlightService {
  /**
   * Get all streetlights with optional area or status filtering
   */
  async getAllStreetlights({ area, status } = {}) {
    const where = {};
    if (area) {
      where.area = { contains: area };
    }
    if (status) {
      where.status = status;
    }

    const streetlights = await prisma.streetlight.findMany({
      where,
      orderBy: { code: 'asc' },
      include: {
        _count: {
          select: { complaints: true }
        }
      }
    });

    return streetlights.map(sl => ({
      id: sl.id,
      code: sl.code,
      area: sl.area,
      latitude: sl.latitude,
      longitude: sl.longitude,
      status: sl.status, // WORKING (Green), UNDER_REVIEW (Yellow), FAULTY (Red)
      indicator: sl.status === 'WORKING' ? 'green' : sl.status === 'UNDER_REVIEW' ? 'yellow' : 'red',
      complaintCount: sl._count.complaints,
      lastChecked: sl.lastChecked,
      createdAt: sl.createdAt,
      updatedAt: sl.updatedAt
    }));
  }

  /**
   * Get area-wise aggregation for map / dashboard overview
   */
  async getAreaSummary() {
    const streetlights = await prisma.streetlight.findMany();

    const areaMap = {};

    streetlights.forEach(sl => {
      if (!areaMap[sl.area]) {
        areaMap[sl.area] = {
          area: sl.area,
          total: 0,
          working: 0,
          underReview: 0,
          faulty: 0,
          statusIndicator: 'green'
        };
      }

      areaMap[sl.area].total += 1;
      if (sl.status === 'WORKING') areaMap[sl.area].working += 1;
      else if (sl.status === 'UNDER_REVIEW') areaMap[sl.area].underReview += 1;
      else if (sl.status === 'FAULTY') areaMap[sl.area].faulty += 1;
    });

    const summary = Object.values(areaMap).map(area => {
      if (area.faulty > 0) {
        area.statusIndicator = 'red';
      } else if (area.underReview > 0) {
        area.statusIndicator = 'yellow';
      } else {
        area.statusIndicator = 'green';
      }
      return area;
    });

    return summary;
  }
}

module.exports = new StreetlightService();
