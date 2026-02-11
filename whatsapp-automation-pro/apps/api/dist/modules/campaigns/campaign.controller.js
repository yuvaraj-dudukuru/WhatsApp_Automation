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
exports.campaignController = void 0;
const campaign_service_1 = require("./campaign.service");
class CampaignController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield campaign_service_1.campaignService.createCampaign(req.body, user.userId);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = yield campaign_service_1.campaignService.getCampaigns(user.userId);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    stats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield campaign_service_1.campaignService.getCampaignStats(id);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.campaignController = new CampaignController();
