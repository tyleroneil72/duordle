import { Router } from "express";
const router = Router();

import { getAllRooms, createRoom } from "../controllers/roomController";

router.get("/", getAllRooms);
router.post("/", createRoom);

export default router;
