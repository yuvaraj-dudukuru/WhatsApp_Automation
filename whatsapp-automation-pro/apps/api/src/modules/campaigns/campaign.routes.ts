import { Router } from 'express';
import { campaignController } from './campaign.controller';
import { authMiddleware } from '../../shared/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', campaignController.create);
router.get('/', campaignController.list);
router.get('/:id/stats', campaignController.stats);

export default router;
