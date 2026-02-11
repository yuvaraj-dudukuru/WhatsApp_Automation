import { Request, Response } from 'express';
import { whatsappService } from './whatsapp.service';

class WhatsappController {
    async initialize(req: Request, res: Response) {
        try {
            await whatsappService.initialize();
            res.json({ message: 'WhatsApp client initialization started' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize WhatsApp client' });
        }
    }

    async getStatus(req: Request, res: Response) {
        try {
            const status = await whatsappService.getStatus();
            res.json(status);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get status' });
        }
    }

    async sendMessage(req: Request, res: Response) {
        try {
            const { phone, message } = req.body;
            if (!phone || !message) {
                return res.status(400).json({ error: 'Phone and message are required' });
            }

            const result = await whatsappService.sendMessage(phone, message);
            res.json({ success: true, result });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send message' });
        }
    }

    async sendBulk(req: Request, res: Response) {
        try {
            const { contacts, delay } = req.body;
            if (!Array.isArray(contacts)) {
                return res.status(400).json({ error: 'Contacts must be an array' });
            }

            // Offload to background worker in production (BullMQ)
            // For now, simple implementation
            const results = await whatsappService.sendBulkMessages(contacts, delay);
            res.json({ success: true, results });
        } catch (error) {
            res.status(500).json({ error: 'Failed to send bulk messages' });
        }
    }
}

export const whatsappController = new WhatsappController();
