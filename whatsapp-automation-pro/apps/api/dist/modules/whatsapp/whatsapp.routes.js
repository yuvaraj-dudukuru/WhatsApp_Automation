"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const whatsapp_controller_1 = require("./whatsapp.controller");
const router = (0, express_1.Router)();
// Add authMiddleware later
router.post('/initialize', whatsapp_controller_1.whatsappController.initialize);
router.get('/status', whatsapp_controller_1.whatsappController.getStatus);
router.post('/send', whatsapp_controller_1.whatsappController.sendMessage);
router.post('/send-bulk', whatsapp_controller_1.whatsappController.sendBulk);
exports.default = router;
