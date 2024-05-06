import { Router } from "express";
const router = Router();

import {
  getAllRooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateRoom,
  checkRoomCodeExists,
} from "../controllers/roomController";

router.get("/", getAllRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);
router.patch("/:id", updateRoom);
router.delete("/:id", deleteRoom);
router.get("/exists/:roomCode", checkRoomCodeExists);

export default router;
