const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding sample streetlights...');

  await prisma.complaint.deleteMany();
  await prisma.streetlight.deleteMany();

  const streetlights = [
    {
      code: 'SL-SEC1-001',
      area: 'North Sector 1',
      latitude: 28.6139,
      longitude: 77.2090,
      status: 'WORKING' // Green
    },
    {
      code: 'SL-SEC1-002',
      area: 'North Sector 1',
      latitude: 28.6145,
      longitude: 77.2098,
      status: 'FAULTY' // Red
    },
    {
      code: 'SL-SEC2-010',
      area: 'South Commercial Hub',
      latitude: 28.5355,
      longitude: 77.3910,
      status: 'UNDER_REVIEW' // Yellow
    },
    {
      code: 'SL-SEC2-011',
      area: 'South Commercial Hub',
      latitude: 28.5360,
      longitude: 77.3920,
      status: 'WORKING' // Green
    },
    {
      code: 'SL-SEC3-025',
      area: 'West Residential Ring',
      latitude: 28.7041,
      longitude: 77.1025,
      status: 'WORKING' // Green
    },
    {
      code: 'SL-SEC3-026',
      area: 'West Residential Ring',
      latitude: 28.7048,
      longitude: 77.1032,
      status: 'FAULTY' // Red
    }
  ];

  for (const sl of streetlights) {
    await prisma.streetlight.create({ data: sl });
  }

  console.log(`✅ Seeded ${streetlights.length} streetlights across multiple areas.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
