import { Router } from 'express';
import { aiController } from './ai.controller';
import { authMiddleware } from '../../shared/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/generate', aiController.generate);
router.post('/smart-reply', aiController.smartReply);
router.post('/sentiment', aiController.sentiment);

export default router;
