import mongoose from 'mongoose';
import Room from '../../src/models/RoomModel';
import { mockInvalidRoom, mockRoom } from '../data/mockData';
import { connectInMemoryDb, disconnectInMemoryDb } from '../data/mongodb';

describe('Room Model - Valid Operations', () => {
  let createdRoomId: string;

  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should create a room', async () => {
    const room = new Room(mockRoom);
    const savedRoom = await room.save();

    expect(savedRoom._id).toBeDefined();
    expect(savedRoom.members).toHaveLength(2);
    expect(savedRoom.roomCode).toBe(mockRoom.roomCode);
    expect(savedRoom.word).toBe(mockRoom.word);
    expect(savedRoom.board).toHaveLength(6);
    expect(savedRoom.currentRow).toBe(mockRoom.currentRow);
    expect(savedRoom.currentPlayer).toBe(mockRoom.currentPlayer);

    createdRoomId = savedRoom._id.toString();
  });

  it('should retrieve the created room by ID', async () => {
    const room = await Room.findById(createdRoomId);

    expect(room).toBeDefined();
    expect(room!.roomCode).toBe(mockRoom.roomCode);
  });

  it('should update the room word field', async () => {
    const updatedRoomData = { ...mockRoom, word: 'newword' };

    const room = await Room.findByIdAndUpdate(createdRoomId, updatedRoomData, { new: true });
    expect(room).toBeDefined();
    expect(room!.word).toBe('newword');
  });

  it('should delete the room', async () => {
    await Room.findByIdAndDelete(createdRoomId);
    const room = await Room.findById(createdRoomId);
    expect(room).toBeNull();
  });
});

describe('Room Model - Invalid Operations', () => {
  beforeAll(async () => {
    await connectInMemoryDb();
  });

  afterAll(async () => {
    await disconnectInMemoryDb();
  });

  it('should fail to create a room without required fields', async () => {
    const room = new Room(mockInvalidRoom);
    try {
      await room.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        expect(error).toBeDefined();
        expect(error.errors.word).toBeDefined();
        expect(error.errors.word.kind).toBe('required');
        expect(error.errors.word.message).toBe('Path `word` is required.');
      } else {
        throw error;
      }
    }
  });

  it('should handle the custom method checkAndDeleteIfEmpty', async () => {
    const roomData = { ...mockRoom, members: [] };

    const room = new Room(roomData);
    await room.save();
    const roomBeforeDeletion = await Room.findById(room._id);
    expect(roomBeforeDeletion).toBeDefined();

    await room.checkAndDeleteIfEmpty();
    const deletedRoom = await Room.findById(room._id);
    expect(deletedRoom).toBeNull();
  });
});
