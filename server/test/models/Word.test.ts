import mongoose from 'mongoose';
import Word from '../../src/models/WordModel';
import { mockInvalidWord, mockWord } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

describe('Word Model - Valid Operations', () => {
  let createdWordId: string;

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should create a word', async () => {
    const word = new Word(mockWord);
    const savedWord = await word.save();

    expect(savedWord._id).toBeDefined();
    expect(savedWord.word).toBe(mockWord.word);
    expect(savedWord.difficulty).toBe(mockWord.difficulty);
    expect(savedWord.length).toBe(mockWord.length);

    createdWordId = savedWord._id.toString();
  });

  it('should retrieve the created word by ID', async () => {
    const word = await Word.findById(createdWordId);

    expect(word).toBeDefined();
    expect(word!.word).toBe(mockWord.word);
  });

  it('should update the word word field', async () => {
    const updatedWordData = { ...mockWord, word: 'newword' };

    const word = await Word.findByIdAndUpdate(createdWordId, updatedWordData, { new: true });
    expect(word).toBeDefined();
    expect(word!.word).toBe('newword');
  });

  it('should delete the word', async () => {
    await Word.findByIdAndDelete(createdWordId);
    const word = await Word.findById(createdWordId);
    expect(word).toBeNull();
  });
});

describe('Word Model - Invalid Operations', () => {
  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should not create a word with missing required fields', async () => {
    const word = new Word(mockInvalidWord);

    try {
      await word.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        expect(error).toBeDefined();
        expect(error.errors.difficulty).toBeDefined();
        expect(error.errors.difficulty.kind).toBe('required');
        expect(error.errors.difficulty.message).toBe('Path `difficulty` is required.');
      } else {
        throw error;
      }
    }
  });
});
