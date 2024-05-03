import { Router } from "express";
const router = Router();

import {
  getAllRooms,
  createRoom,
  getRoom,
} from "../controllers/roomController";

router.get("/", getAllRooms);
router.post("/", createRoom);
router.get("/:id", getRoom);

export default router;
