import { Router } from 'express';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';
const router = Router();

import { createWord, deleteWord, getAllWords, getRandomWord, getWord, updateWord } from '../controllers/wordController';

router.get('/', apiKeyMiddleware, getAllWords);
router.post('/', apiKeyMiddleware, createWord);
router.get('/random', getRandomWord);
router.get('/:id', apiKeyMiddleware, getWord);
router.patch('/:id', apiKeyMiddleware, updateWord);
router.delete('/:id', apiKeyMiddleware, deleteWord);

export default router;
