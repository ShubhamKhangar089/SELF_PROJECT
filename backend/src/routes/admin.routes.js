import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAdminStats, getRecentGames, getUsers } from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate, (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }
  return next();
});

router.get('/stats', getAdminStats);
router.get('/recent-games', getRecentGames);
router.get('/users', getUsers);

export default router;


