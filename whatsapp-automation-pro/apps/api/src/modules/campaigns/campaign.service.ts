import { prisma } from '../../config/database';
import { Queue } from 'bullmq';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const campaignQueue = new Queue('campaigns', { connection });

class CampaignService {
    async createCampaign(data: any, userId: string) {
        const { name, templateId, contactIds, scheduledAt } = data;

        const campaign = await prisma.campaign.create({
            data: {
                name,
                templateId,
                userId,
                status: scheduledAt ? 'scheduled' : 'pending',
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                contacts: {
                    create: contactIds.map((contactId: string) => ({
                        contactId,
                        status: 'pending'
                    }))
                }
            }
        });

        // If not scheduled, start immediately
        if (!scheduledAt) {
            await this.startCampaign(campaign.id);
        }

        return campaign;
    }

    async startCampaign(campaignId: string) {
        await campaignQueue.add('send-campaign', { campaignId });
        return { message: 'Campaign queued for sending' };
    }

    async getCampaigns(userId: string) {
        return await prisma.campaign.findMany({
            where: { userId },
            include: { template: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getCampaignStats(campaignId: string) {
        return await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                contacts: true
            }
        });
    }
}

export const campaignService = new CampaignService();
