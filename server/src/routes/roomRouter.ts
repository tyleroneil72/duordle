import { Router } from "express";
const router = Router();

import {
  getAllRooms,
  createRoom,
  getRoom,
  deleteRoom,
} from "../controllers/roomController";

router.get("/", getAllRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);
router.delete("/:id", deleteRoom);

export default router;
