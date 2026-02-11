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
exports.whatsappService = void 0;
const venom_bot_1 = require("venom-bot");
const database_1 = require("../../config/database");
const events_1 = __importDefault(require("events"));
class WhatsAppService extends events_1.default {
    constructor() {
        super(...arguments);
        this.client = null;
        this.sessionName = 'whatsapp-session';
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Initializing WhatsApp Service...');
            try {
                this.client = yield (0, venom_bot_1.create)({
                    session: this.sessionName,
                    // multidevice: true, // Deprecated/Default in newer versions
                    headless: 'new', // Use 'new' or true
                    logQR: false,
                    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
                        console.log('QR Code received');
                        this.emit('qr', base64Qr);
                    },
                    statusFind: (statusSession, session) => {
                        console.log('Status Session: ', statusSession);
                        this.emit('status', { status: statusSession, session });
                    },
                });
                // Save session - In a real scenario, venom-bot manages session tokens file-system/db
                // We can track readiness here
                // Set up message listener
                this.client.onMessage((message) => {
                    this.handleIncomingMessage(message);
                });
                this.emit('ready', this.client);
                console.log('WhatsApp Client Ready');
                return this.client;
            }
            catch (error) {
                console.error('Error initializing WhatsApp:', error);
                this.emit('error', error);
                throw error;
            }
        });
    }
    sendMessage(phone, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('WhatsApp not initialized');
            // Ensure number format is correct (1234567890@c.us)
            const formattedPhone = phone.includes('@c.us') ? phone : `${phone}@c.us`;
            return yield this.client.sendText(formattedPhone, message);
        });
    }
    sendBulkMessages(contacts_1) {
        return __awaiter(this, arguments, void 0, function* (contacts, delayMs = 3000) {
            const results = [];
            for (const { phone, message } of contacts) {
                try {
                    yield this.sendMessage(phone, message);
                    results.push({ phone, status: 'sent' });
                    yield this.delay(delayMs);
                }
                catch (error) {
                    results.push({ phone, status: 'failed', error: error.message });
                }
            }
            return results;
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                isConnected: !!this.client,
                sessionName: this.sessionName
            };
        });
    }
    handleIncomingMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Only handle meaningful messages
            if (message.body && message.from !== 'status@broadcast') {
                try {
                    // Check if contact exists
                    let contact = yield database_1.prisma.contact.findUnique({
                        where: { phone: message.from }
                    });
                    if (!contact) {
                        contact = yield database_1.prisma.contact.create({
                            data: {
                                phone: message.from,
                                name: message.sender.pushname || message.notifyName || 'Unknown'
                            }
                        });
                    }
                    yield database_1.prisma.message.create({
                        data: {
                            contactId: contact.id,
                            content: message.body,
                            type: message.type,
                            direction: 'incoming',
                            status: 'delivered'
                        }
                    });
                    this.emit('message', message);
                }
                catch (error) {
                    console.error('Error handling incoming message:', error);
                }
            }
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.whatsappService = new WhatsAppService();
