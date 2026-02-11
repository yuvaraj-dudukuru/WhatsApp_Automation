"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const whatsapp_service_1 = require("../modules/whatsapp/whatsapp.service");
const database_1 = require("../config/database");
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};
const campaignWorker = new bullmq_1.Worker('campaigns', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId } = job.data;
    console.log(`Processing campaign ${campaignId}`);
    const campaign = yield database_1.prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
            template: true,
            contacts: {
                include: { contact: true },
                where: { status: 'pending' }
            }
        }
    });
    if (!campaign)
        throw new Error('Campaign not found');
    yield database_1.prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'running', startedAt: new Date() }
    });
    for (const cc of campaign.contacts) {
        try {
            const message = campaign.template.content
                .replace('{{name}}', cc.contact.name || 'there');
            yield whatsapp_service_1.whatsappService.sendMessage(cc.contact.phone, message);
            yield database_1.prisma.campaignContact.update({
                where: { id: cc.id },
                data: { status: 'sent', sentAt: new Date() }
            });
            yield database_1.prisma.campaign.update({
                where: { id: campaignId },
                data: { sentCount: { increment: 1 } }
            });
            // Delay between messages to avoid bans
            yield new Promise(resolve => setTimeout(resolve, 3000));
        }
        catch (error) {
            console.error(`Failed to send to ${cc.contact.phone}:`, error);
            yield database_1.prisma.campaignContact.update({
                where: { id: cc.id },
                data: { status: 'failed', error: error.message }
            });
            yield database_1.prisma.campaign.update({
                where: { id: campaignId },
                data: { failedCount: { increment: 1 } }
            });
        }
    }
    yield database_1.prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'completed', completedAt: new Date() }
    });
    console.log(`Campaign ${campaignId} completed`);
}), { connection });
exports.default = campaignWorker;
