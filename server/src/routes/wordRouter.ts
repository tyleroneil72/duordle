import { Router } from "express";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware";
const router = Router();

import {
  getAllWords,
  createWord,
  getWord,
  deleteWord,
  updateWord,
} from "../controllers/wordController";

router.get("/", apiKeyMiddleware, getAllWords);
router.post("/", apiKeyMiddleware, createWord);
router.get("/:id", getWord);
router.patch("/:id", apiKeyMiddleware, updateWord);
router.delete("/:id", apiKeyMiddleware, deleteWord);

export default router;
