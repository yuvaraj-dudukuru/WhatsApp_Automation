import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from '../../shared/middleware/auth';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.me);

export default router;
