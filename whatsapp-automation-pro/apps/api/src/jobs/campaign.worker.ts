import { Worker, Job } from 'bullmq';
import { whatsappService } from '../modules/whatsapp/whatsapp.service';
import { prisma } from '../config/database';

const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};

const campaignWorker = new Worker('campaigns', async (job: Job) => {
    const { campaignId } = job.data;
    console.log(`Processing campaign ${campaignId}`);

    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
            template: true,
            contacts: {
                include: { contact: true },
                where: { status: 'pending' }
            }
        }
    });

    if (!campaign) throw new Error('Campaign not found');

    await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'running', startedAt: new Date() }
    });

    for (const cc of campaign.contacts) {
        try {
            const message = campaign.template.content
                .replace('{{name}}', cc.contact.name || 'there');

            await whatsappService.sendMessage(cc.contact.phone, message);

            await prisma.campaignContact.update({
                where: { id: cc.id },
                data: { status: 'sent', sentAt: new Date() }
            });

            await prisma.campaign.update({
                where: { id: campaignId },
                data: { sentCount: { increment: 1 } }
            });

            // Delay between messages to avoid bans
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`Failed to send to ${cc.contact.phone}:`, error);
            await prisma.campaignContact.update({
                where: { id: cc.id },
                data: { status: 'failed', error: (error as Error).message }
            });

            await prisma.campaign.update({
                where: { id: campaignId },
                data: { failedCount: { increment: 1 } }
            });
        }
    }

    await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'completed', completedAt: new Date() }
    });
    console.log(`Campaign ${campaignId} completed`);
}, { connection });

export default campaignWorker;
