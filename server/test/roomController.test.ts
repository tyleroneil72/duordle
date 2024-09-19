import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/index';
import { mockRoom } from './mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from './mongodb';

describe('Room Controller Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDb(); // Use in-memory MongoDB for tests
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should create a room', async () => {
    const response = await request(app).post('/api/room').set('x-api-key', process.env.API_KEY).send(mockRoom);

    expect(response.status).toBe(201);
    expect(response.body.room).toHaveProperty('roomCode', mockRoom.roomCode);
  });

  it('should get a room by id', async () => {
    const newRoom = await request(app).post('/api/room').set('x-api-key', process.env.API_KEY!).send(mockRoom);

    const response = await request(app).get(`/api/room/${newRoom.body.room._id}`).set('x-api-key', process.env.API_KEY);

    expect(response.status).toBe(200);
    expect(response.body.room).toHaveProperty('roomCode', mockRoom.roomCode);
  });

  it('should return 404 if room not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/room/${fakeId}`).set('x-api-key', process.env.API_KEY);

    expect(response.status).toBe(404);
  });
});
