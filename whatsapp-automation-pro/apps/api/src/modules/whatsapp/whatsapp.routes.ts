import { Router } from 'express';
import { whatsappController } from './whatsapp.controller';

const router = Router();

// Add authMiddleware later
router.post('/initialize', whatsappController.initialize);
router.get('/status', whatsappController.getStatus);
router.post('/send', whatsappController.sendMessage);
router.post('/send-bulk', whatsappController.sendBulk);

export default router;
