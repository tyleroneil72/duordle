import { Router } from "express";
const router = Router();

import {
  getAllRooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateRoom,
} from "../controllers/roomController";

router.get("/", getAllRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);
router.patch("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
