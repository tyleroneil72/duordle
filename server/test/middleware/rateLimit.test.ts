import request from 'supertest';
import app from '../../src/index';
import { mockWord } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

describe('Rate Limiting Middleware', () => {
  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should block requests after exceeding the rate limit', async () => {
    if (process.env.RATE_LIMIT === 'OFF') {
      return;
    }
    const maxRequests = 50;

    // Simulate hitting the endpoint multiple times to exceed the rate limit
    for (let i = 0; i < maxRequests; i++) {
      await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord).expect(201);
    }

    const response = await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);

    expect(response.status).toBe(429);
    expect(response.body.message).toBe('Too Many Requests');
  });
});
