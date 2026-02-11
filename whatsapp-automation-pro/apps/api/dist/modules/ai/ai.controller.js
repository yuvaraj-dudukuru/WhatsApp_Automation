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
exports.aiController = void 0;
const ai_service_1 = require("./ai.service");
class AIController {
    generate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { prompt, context } = req.body;
                const result = yield ai_service_1.aiService.generateMessage(prompt, context);
                res.json({ result });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    smartReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, history } = req.body;
                const result = yield ai_service_1.aiService.generateSmartReply(message, history);
                res.json({ result });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    sentiment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message } = req.body;
                const result = yield ai_service_1.aiService.analyzeSentiment(message);
                res.json({ result });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
}
exports.aiController = new AIController();
