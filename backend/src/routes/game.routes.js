import { Router } from 'express';
import { createGame, getGame, joinGame } from '../controllers/game.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All game routes require auth
router.use(authenticate);

// Create a new game with current user as X
router.post('/', createGame);

// Join existing game as O
router.post('/:id/join', joinGame);

// Get game state
router.get('/:id', getGame);

export default router;


