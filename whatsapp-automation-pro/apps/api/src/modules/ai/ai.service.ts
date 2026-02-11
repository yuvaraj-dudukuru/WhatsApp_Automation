import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export class AIService {
    private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    async generateMessage(prompt: string, context?: string) {
        const fullPrompt = context
            ? `${context}\n\nUser request: ${prompt}`
            : prompt;

        try {
            const result = await this.model.generateContent(fullPrompt);
            return result.response.text();
        } catch (error) {
            console.error('AI Generation Error:', error);
            throw new Error('Failed to generate content');
        }
    }

    async generateSmartReply(incomingMessage: string, conversationHistory?: string[]) {
        const prompt = `
      You are a helpful WhatsApp assistant. Generate a professional, concise reply to this message:
      "${incomingMessage}"
      
      ${conversationHistory ? `Previous conversation:\n${conversationHistory.join('\n')}` : ''}
      
      Reply should be:
      - Professional but friendly
      - Maximum 2-3 sentences
      - Relevant to the context
    `;

        return await this.generateMessage(prompt);
    }

    async analyzeSentiment(message: string) {
        const prompt = `Analyze the sentiment of this message and return only one word: positive, negative, or neutral.\n\nMessage: "${message}"`;
        const result = await this.generateMessage(prompt);
        return result.trim().toLowerCase();
    }

    async translateMessage(message: string, targetLanguage: string) {
        const prompt = `Translate this message to ${targetLanguage}. Return only the translation, no explanations:\n\n"${message}"`;
        return await this.generateMessage(prompt);
    }
}

export const aiService = new AIService();
