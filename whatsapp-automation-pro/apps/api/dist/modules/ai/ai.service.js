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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
class AIService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
    generateMessage(prompt, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const fullPrompt = context
                ? `${context}\n\nUser request: ${prompt}`
                : prompt;
            try {
                const result = yield this.model.generateContent(fullPrompt);
                return result.response.text();
            }
            catch (error) {
                console.error('AI Generation Error:', error);
                throw new Error('Failed to generate content');
            }
        });
    }
    generateSmartReply(incomingMessage, conversationHistory) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `
      You are a helpful WhatsApp assistant. Generate a professional, concise reply to this message:
      "${incomingMessage}"
      
      ${conversationHistory ? `Previous conversation:\n${conversationHistory.join('\n')}` : ''}
      
      Reply should be:
      - Professional but friendly
      - Maximum 2-3 sentences
      - Relevant to the context
    `;
            return yield this.generateMessage(prompt);
        });
    }
    analyzeSentiment(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Analyze the sentiment of this message and return only one word: positive, negative, or neutral.\n\nMessage: "${message}"`;
            const result = yield this.generateMessage(prompt);
            return result.trim().toLowerCase();
        });
    }
    translateMessage(message, targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = `Translate this message to ${targetLanguage}. Return only the translation, no explanations:\n\n"${message}"`;
            return yield this.generateMessage(prompt);
        });
    }
}
exports.AIService = AIService;
exports.aiService = new AIService();
