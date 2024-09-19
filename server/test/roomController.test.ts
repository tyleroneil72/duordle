import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/index';
import { mockRoom } from './mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from './mongodb';

describe('Room Controller - Valid Operations', () => {
  let createdRoomId: string;

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should create a room', async () => {
    const response = await request(app).post('/api/room').set('x-api-key', process.env.API_KEY!).send(mockRoom);

    expect(response.status).toBe(201);
    expect(response.body.room).toHaveProperty('roomCode', mockRoom.roomCode);

    createdRoomId = response.body.room._id;
  });

  it('should get a valid room by id', async () => {
    const response = await request(app).get(`/api/room/${createdRoomId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(200);
    expect(response.body.room).toHaveProperty('roomCode', mockRoom.roomCode);
  });

  it('should update a room to a different room', async () => {
    const updatedRoomData = { ...mockRoom, word: 'newword' };

    const response = await request(app)
      .patch(`/api/room/${createdRoomId}`)
      .set('x-api-key', process.env.API_KEY!)
      .send(updatedRoomData);

    expect(response.status).toBe(200);
    expect(response.body.room).toHaveProperty('word', 'newword');
  });

  it('should delete a room', async () => {
    const response = await request(app).delete(`/api/room/${createdRoomId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Room deleted successfully');
  });
});

describe('Room Controller - Invalid Operations', () => {
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should return 404 when getting a room that doesn’t exist', async () => {
    const response = await request(app).get(`/api/room/${nonExistentId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No room with ID ${nonExistentId}`);
  });

  it('should return 404 when updating a room that doesn’t exist', async () => {
    const updatedRoomData = { ...mockRoom, word: 'newword' };

    const response = await request(app)
      .patch(`/api/room/${nonExistentId}`)
      .set('x-api-key', process.env.API_KEY!)
      .send(updatedRoomData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No room with ID ${nonExistentId}`);
  });

  it('should return 404 when deleting a room that doesn’t exist', async () => {
    const response = await request(app).delete(`/api/room/${nonExistentId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No room with ID ${nonExistentId}`);
  });
});
