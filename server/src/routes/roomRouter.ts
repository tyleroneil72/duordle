import { Router } from 'express';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';
const router = Router();

import {
  getAllRooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateRoom,
  checkRoomCodeExists
} from '../controllers/roomController';

router.get('/', apiKeyMiddleware, getAllRooms);
router.post('/', apiKeyMiddleware, createRoom);
router.get('/:id', apiKeyMiddleware, getRoom);
router.patch('/:id', apiKeyMiddleware, updateRoom);
router.delete('/:id', apiKeyMiddleware, deleteRoom);
router.get('/exists/:roomCode', checkRoomCodeExists);

export default router;
