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
exports.whatsappController = void 0;
const whatsapp_service_1 = require("./whatsapp.service");
class WhatsappController {
    initialize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield whatsapp_service_1.whatsappService.initialize();
                res.json({ message: 'WhatsApp client initialization started' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to initialize WhatsApp client' });
            }
        });
    }
    getStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield whatsapp_service_1.whatsappService.getStatus();
                res.json(status);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to get status' });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phone, message } = req.body;
                if (!phone || !message) {
                    return res.status(400).json({ error: 'Phone and message are required' });
                }
                const result = yield whatsapp_service_1.whatsappService.sendMessage(phone, message);
                res.json({ success: true, result });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to send message' });
            }
        });
    }
    sendBulk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { contacts, delay } = req.body;
                if (!Array.isArray(contacts)) {
                    return res.status(400).json({ error: 'Contacts must be an array' });
                }
                // Offload to background worker in production (BullMQ)
                // For now, simple implementation
                const results = yield whatsapp_service_1.whatsappService.sendBulkMessages(contacts, delay);
                res.json({ success: true, results });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to send bulk messages' });
            }
        });
    }
}
exports.whatsappController = new WhatsappController();
