import { Request, Response } from 'express';
import { aiService } from './ai.service';

class AIController {
    async generate(req: Request, res: Response) {
        try {
            const { prompt, context } = req.body;
            const result = await aiService.generateMessage(prompt, context);
            res.json({ result });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async smartReply(req: Request, res: Response) {
        try {
            const { message, history } = req.body;
            const result = await aiService.generateSmartReply(message, history);
            res.json({ result });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async sentiment(req: Request, res: Response) {
        try {
            const { message } = req.body;
            const result = await aiService.analyzeSentiment(message);
            res.json({ result });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

export const aiController = new AIController();
