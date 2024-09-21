import request from 'supertest';
import app from '../../src/index';
import { mockInvalidApiKey, mockWord } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

describe('API Key Middleware - Valid Operations', () => {
  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should allow access with a valid API key', async () => {
    const response = await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);

    expect(response.status).toBe(201);
    expect(response.body.word).toHaveProperty('word', mockWord.word);
  });
});

describe('API Key Middleware - Invalid Operations', () => {
  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should not allow access with an invalid API key', async () => {
    const response = await request(app).post('/api/word').set('x-api-key', mockInvalidApiKey).send(mockWord);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should not allow access without an API key', async () => {
    const response = await request(app).post('/api/word').send(mockWord);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });
});
