import { Router } from "express";
const router = Router();

import { createRoom } from "../controllers/roomController";

router.post("/", createRoom);

export default router;
