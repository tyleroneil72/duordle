import { Response } from "express";
import Room from "../models/RoomModel";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors";
import { asyncWrapper } from "../utils/asyncWrapper";
import mongoose from "mongoose";

export const getAllRooms = asyncWrapper(async (req, res: Response) => {
  const rooms = await Room.find();
  res.status(StatusCodes.OK).json({ rooms });
});

export const createRoom = asyncWrapper(async (req, res: Response) => {
  const room = await Room.create(req.body);
  res.status(StatusCodes.CREATED).json({ room });
});

export const getRoom = asyncWrapper(async (req, res: Response, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid room ID format" });
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
    return res.status(400).json({ message: "Invalid room ID format" });
  }
  const room = await Room.findByIdAndDelete(id);
  if (!room) {
    throw new NotFoundError(`No room with ID ${id}`);
  }
  res.status(StatusCodes.OK).json({ message: "Room deleted successfully" });
});
