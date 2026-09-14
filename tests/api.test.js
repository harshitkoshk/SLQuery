const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/db/client');

beforeAll(async () => {
  await prisma.$connect();
  // Clear any existing test complaints
  await prisma.complaint.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Smart Streetlight Backend API End-to-End Tests', () => {
  let createdComplaintId = null;

  test('GET /api/health should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('POST /api/complaints - create a valid complete complaint', async () => {
    const payload = {
      description: 'The street light pole #42 is broken and dark since 2 days',
      location: 'Block C, Sector 12 Park Road',
      userName: 'Alice Smith',
      userContact: 'alice@example.com'
    };

    const res = await request(app)
      .post('/api/complaints')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.status).toBe('READY_TO_SEND');
    expect(res.body.data.ai_result.valid).toBe(true);
    expect(res.body.data.ai_result.ready_to_send).toBe(true);
    expect(res.body.data.ai_result.missing_information).toEqual([]);

    createdComplaintId = res.body.data.id;
  });

  test('POST /api/complaints - reject validation when description is missing/empty', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .send({ location: 'Sector 5' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  test('POST /api/complaints - incomplete complaint with missing location receives NEEDS_MORE_INFORMATION', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .send({
        description: 'Street light near my house is not turning on at night',
        location: ''
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('NEEDS_MORE_INFORMATION');
    expect(res.body.data.ai_result.valid).toBe(true);
    expect(res.body.data.ai_result.ready_to_send).toBe(false);
    expect(res.body.data.ai_result.missing_information).toContain('location');
  });

  test('POST /api/complaints - unrelated municipal complaint is flagged as REJECTED', async () => {
    const res = await request(app)
      .post('/api/complaints')
      .send({
        description: 'Large garbage heap dumping on the sidewalk and bad smell',
        location: 'Sector 15 Market'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('REJECTED');
    expect(res.body.data.ai_result.valid).toBe(false);
    expect(res.body.data.ai_result.ready_to_send).toBe(false);
  });

  test('GET /api/complaints - fetch all complaints', async () => {
    const res = await request(app).get('/api/complaints');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.complaints.length).toBeGreaterThanOrEqual(3);
    expect(res.body.data.total).toBeGreaterThanOrEqual(3);
  });

  test('GET /api/complaints/:id - fetch specific complaint', async () => {
    const res = await request(app).get(`/api/complaints/${createdComplaintId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdComplaintId);
    expect(res.body.data.ai_result).toBeDefined();
  });

  test('GET /api/complaints/:id - return 404 for non-existent complaint', async () => {
    const res = await request(app).get('/api/complaints/non-existent-uuid-1234');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/complaints/:id/verify - re-run AI verification', async () => {
    const res = await request(app).post(`/api/complaints/${createdComplaintId}/verify`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.ai_result.valid).toBe(true);
  });

  test('GET /api/streetlights & /api/streetlights/areas - helper endpoints for Frontend UI', async () => {
    const listRes = await request(app).get('/api/streetlights');
    expect(listRes.statusCode).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);

    const areasRes = await request(app).get('/api/streetlights/areas');
    expect(areasRes.statusCode).toBe(200);
    expect(Array.isArray(areasRes.body.data)).toBe(true);
  });
});
