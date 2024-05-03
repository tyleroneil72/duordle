import { Response } from "express";
import Word from "../models/WordModel";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors";
import { asyncWrapper } from "../utils/asyncWrapper";
import mongoose from "mongoose";

export const getAllWords = asyncWrapper(async (req, res: Response) => {
  const words = await Word.find();
  res.status(StatusCodes.OK).json({ words });
});

export const createWord = asyncWrapper(async (req, res: Response) => {
  const { word, difficulty } = req.body;
  const newWord = await Word.create({ word, difficulty, length: word.length });
  res.status(StatusCodes.CREATED).json({ word: newWord });
});

export const getWord = asyncWrapper(async (req, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid word ID format" });
  }

  const word = await Word.findById(id);
  if (!word) {
    throw new NotFoundError(`No word with ID ${id}`);
  }
  res.status(StatusCodes.OK).json({ word });
});

export const updateWord = asyncWrapper(async (req, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid word ID format" });
  }

  const updateData = req.body;
  if (updateData.word) {
    updateData.length = updateData.word.length; // Update the length if word is changed
  }

  const updatedWord = await Word.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedWord) {
    throw new NotFoundError(`No word with ID ${id}`);
  }

  res.status(StatusCodes.OK).json({ word: updatedWord });
});

export const deleteWord = asyncWrapper(async (req, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Invalid word ID format" });
  }

  const word = await Word.findByIdAndDelete(id);
  if (!word) {
    throw new NotFoundError(`No word with ID ${id}`);
  }
  res.status(StatusCodes.OK).json({ message: "Word deleted successfully" });
});
