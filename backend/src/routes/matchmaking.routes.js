import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { joinMatchmaking, leaveMatchmaking } from '../controllers/matchmaking.controller.js';

const router = Router();

router.use(authenticate);

router.post('/join', joinMatchmaking);
router.delete('/leave', leaveMatchmaking);

export default router;


