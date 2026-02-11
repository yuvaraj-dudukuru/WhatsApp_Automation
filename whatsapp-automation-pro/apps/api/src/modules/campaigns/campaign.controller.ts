import { Request, Response } from 'express';
import { campaignService } from './campaign.service';

class CampaignController {
    async create(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const result = await campaignService.createCampaign(req.body, user.userId);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const result = await campaignService.getCampaigns(user.userId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }

    async stats(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const result = await campaignService.getCampaignStats(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    }
}

export const campaignController = new CampaignController();
