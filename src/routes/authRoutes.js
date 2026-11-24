import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import { validateBody } from '../middleware/validate.js';
import { login, loginSchema, me } from '../controllers/authController.js';

const router = Router();
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/me', authenticate, me);
export default router;
