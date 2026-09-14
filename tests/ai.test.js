const aiService = require('../src/services/ai.service');

describe('AI Verification Service Tests', () => {
  test('should accurately verify a complete streetlight complaint and mark it ready to send', async () => {
    const result = await aiService.verifyComplaint({
      description: 'The street light pole near junction 4 is not working and completely dark since yesterday night',
      location: 'Sector 4, Main Market Junction'
    });

    expect(result.valid).toBe(true);
    expect(result.ready_to_send).toBe(true);
    expect(result.confidence).toBeGreaterThan(0.5);
    expect(result.missing_information).toEqual([]);
    expect(typeof result.reason).toBe('string');
  });

  test('should detect missing location and mark ready_to_send as false', async () => {
    const result = await aiService.verifyComplaint({
      description: 'Street light is flickering dangerously and making buzzing sound',
      location: ''
    });

    expect(result.valid).toBe(true);
    expect(result.ready_to_send).toBe(false);
    expect(result.missing_information).toContain('location');
    expect(result.reason.toLowerCase()).toContain('location');
  });

  test('should reject unrelated complaints (e.g. pothole or garbage)', async () => {
    const result = await aiService.verifyComplaint({
      description: 'Huge pothole and broken road damaging car tires',
      location: 'Highway 21, North Exit'
    });

    expect(result.valid).toBe(false);
    expect(result.ready_to_send).toBe(false);
    expect(result.reason).toContain('not related to a streetlight');
  });

  test('should reject too short or vague descriptions', async () => {
    const result = await aiService.verifyComplaint({
      description: 'help',
      location: 'Sector 5'
    });

    expect(result.valid).toBe(false);
    expect(result.ready_to_send).toBe(false);
  });
});
