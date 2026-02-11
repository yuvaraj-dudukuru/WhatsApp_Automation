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
exports.campaignService = exports.campaignQueue = void 0;
const database_1 = require("../../config/database");
const bullmq_1 = require("bullmq");
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
};
exports.campaignQueue = new bullmq_1.Queue('campaigns', { connection });
class CampaignService {
    createCampaign(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, templateId, contactIds, scheduledAt } = data;
            const campaign = yield database_1.prisma.campaign.create({
                data: {
                    name,
                    templateId,
                    userId,
                    status: scheduledAt ? 'scheduled' : 'pending',
                    scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                    contacts: {
                        create: contactIds.map((contactId) => ({
                            contactId,
                            status: 'pending'
                        }))
                    }
                }
            });
            // If not scheduled, start immediately
            if (!scheduledAt) {
                yield this.startCampaign(campaign.id);
            }
            return campaign;
        });
    }
    startCampaign(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.campaignQueue.add('send-campaign', { campaignId });
            return { message: 'Campaign queued for sending' };
        });
    }
    getCampaigns(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.prisma.campaign.findMany({
                where: { userId },
                include: { template: true },
                orderBy: { createdAt: 'desc' }
            });
        });
    }
    getCampaignStats(campaignId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield database_1.prisma.campaign.findUnique({
                where: { id: campaignId },
                include: {
                    contacts: true
                }
            });
        });
    }
}
exports.campaignService = new CampaignService();
