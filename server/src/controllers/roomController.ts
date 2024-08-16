import { Response } from 'express';
import Room from '../models/RoomModel';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors';
import { asyncWrapper } from '../utils/asyncWrapper';
import mongoose from 'mongoose';

export const getAllRooms = asyncWrapper(async (req, res: Response) => {
  const rooms = await Room.find();
  res.status(StatusCodes.OK).json({ rooms });
});

export const createRoom = asyncWrapper(async (req, res: Response) => {
  const { members, roomCode, word } = req.body;

  // Validate input
  if (!members || !Array.isArray(members) || members.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid members' });
  }
  if (!roomCode || typeof roomCode !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid roomCode' });
  }
  if (!word || typeof word !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid word' });
  }

  const room = await Room.create(req.body);
  res.status(StatusCodes.CREATED).json({ room });
});

export const getRoom = asyncWrapper(async (req, res: Response, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid room ID format' });
  }

  const room = await Room.findById(id);
  if (!room) {
    throw new NotFoundError(`No room with ID ${id}`);
  }
  res.status(StatusCodes.OK).json({ room });
});

export const deleteRoom = asyncWrapper(async (req, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid room ID format' });
  }
  const room = await Room.findByIdAndDelete(id);
  if (!room) {
    throw new NotFoundError(`No room with ID ${id}`);
  }
  res.status(StatusCodes.OK).json({ message: 'Room deleted successfully' });
});

export const updateRoom = asyncWrapper(async (req, res: Response) => {
  const { id } = req.params;
  const { members, roomCode, word } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid room ID format' });
  }

  // Validate input
  if (!members || !Array.isArray(members) || members.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid members' });
  }
  if (!roomCode || typeof roomCode !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid roomCode' });
  }
  if (!word || typeof word !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid word' });
  }

  const updateData = {
    members: req.body.members,
    roomCode: req.body.roomCode,
    word: req.body.word
  };

  const updatedRoom = await Room.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });

  if (!updatedRoom) {
    throw new NotFoundError(`No room with ID ${id}`);
  }

  res.status(StatusCodes.OK).json({ room: updatedRoom });
});

export const checkRoomCodeExists = asyncWrapper(async (req, res) => {
  const { roomCode } = req.params;
  const roomExists = await Room.findOne({ roomCode });

  res.status(StatusCodes.OK).json({ exists: !!roomExists });
});
