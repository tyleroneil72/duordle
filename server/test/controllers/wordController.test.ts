import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../src/index';
import { mockWord } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

describe('Word Controller - Valid Operations', () => {
  let createdWordId: string;

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should create a word', async () => {
    const response = await request(app).post('/api/word').set('x-api-key', process.env.API_KEY!).send(mockWord);

    expect(response.status).toBe(201);
    expect(response.body.word).toHaveProperty('word', mockWord.word);

    createdWordId = response.body.word._id;
  });

  it('should get a valid word by id', async () => {
    const response = await request(app).get(`/api/word/${createdWordId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(200);
    expect(response.body.word).toHaveProperty('word', mockWord.word);
  });

  it('should get a random word', async () => {
    const response = await request(app).get('/api/word/random');

    expect(response.status).toBe(200);
    expect(response.body.word.word).toBe('hello');
  });

  it('should update a word to a different word', async () => {
    const updatedWordData = { ...mockWord, word: 'newword' };

    const response = await request(app)
      .patch(`/api/word/${createdWordId}`)
      .set('x-api-key', process.env.API_KEY!)
      .send(updatedWordData);

    expect(response.status).toBe(200);
    expect(response.body.word).toHaveProperty('word', 'newword');
  });

  it('should delete a word', async () => {
    const response = await request(app).delete(`/api/word/${createdWordId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Word deleted successfully');
  });
});

describe('Word Controller - Invalid Operations', () => {
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should return 404 when getting a word that doesn’t exist', async () => {
    const response = await request(app).get(`/api/word/${nonExistentId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No word with ID ${nonExistentId}`);
  });

  it('should return 404 when updating a word that doesn’t exist', async () => {
    const updatedWordData = { ...mockWord, word: 'newword' };

    const response = await request(app)
      .patch(`/api/word/${nonExistentId}`)
      .set('x-api-key', process.env.API_KEY!)
      .send(updatedWordData);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No word with ID ${nonExistentId}`);
  });

  it('should return 404 when deleting a word that doesn’t exist', async () => {
    const response = await request(app).delete(`/api/word/${nonExistentId}`).set('x-api-key', process.env.API_KEY!);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`No word with ID ${nonExistentId}`);
  });
});
