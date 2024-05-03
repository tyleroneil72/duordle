import { Response } from "express";
import Room from "../models/RoomModel";
import { StatusCodes } from "http-status-codes";

export const createRoom = async (req: any, res: Response) => {
  const room = await Room.create(req.body);
  res.status(StatusCodes.CREATED).json({ room });
};

export const getAllRooms = async (req: any, res: Response) => {
  const rooms = await Room.find();
  res.status(StatusCodes.OK).json({ rooms });
};
