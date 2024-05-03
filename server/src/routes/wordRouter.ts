import { Router } from "express";
const router = Router();

import {
  getAllWords,
  createWord,
  getWord,
  deleteWord,
  updateWord,
} from "../controllers/wordController";

router.get("/", getAllWords);
router.post("/", createWord);
router.get("/:id", getWord);
router.patch("/:id", updateWord);
router.delete("/:id", deleteWord);

export default router;
