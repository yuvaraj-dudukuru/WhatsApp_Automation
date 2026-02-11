import { create, Whatsapp } from 'venom-bot';
import { prisma } from '../../config/database';
import EventEmitter from 'events';

class WhatsAppService extends EventEmitter {
    private client: Whatsapp | null = null;
    private sessionName = 'whatsapp-session';

    async initialize() {
        console.log('Initializing WhatsApp Service...');
        try {
            this.client = await create({
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
        } catch (error) {
            console.error('Error initializing WhatsApp:', error);
            this.emit('error', error);
            throw error;
        }
    }

    async sendMessage(phone: string, message: string) {
        if (!this.client) throw new Error('WhatsApp not initialized');

        // Ensure number format is correct (1234567890@c.us)
        const formattedPhone = phone.includes('@c.us') ? phone : `${phone}@c.us`;
        return await this.client.sendText(formattedPhone, message);
    }

    async sendBulkMessages(contacts: Array<{ phone: string, message: string }>, delayMs = 3000) {
        const results = [];
        for (const { phone, message } of contacts) {
            try {
                await this.sendMessage(phone, message);
                results.push({ phone, status: 'sent' });
                await this.delay(delayMs);
            } catch (error) {
                results.push({ phone, status: 'failed', error: (error as Error).message });
            }
        }
        return results;
    }

    async getStatus() {
        return {
            isConnected: !!this.client,
            sessionName: this.sessionName
        };
    }

    private async handleIncomingMessage(message: any) {
        // Only handle meaningful messages
        if (message.body && message.from !== 'status@broadcast') {
            try {
                // Check if contact exists
                let contact = await prisma.contact.findUnique({
                    where: { phone: message.from }
                });

                if (!contact) {
                    contact = await prisma.contact.create({
                        data: {
                            phone: message.from,
                            name: message.sender.pushname || message.notifyName || 'Unknown'
                        }
                    });
                }

                await prisma.message.create({
                    data: {
                        contactId: contact.id,
                        content: message.body,
                        type: message.type,
                        direction: 'incoming',
                        status: 'delivered'
                    }
                });

                this.emit('message', message);
            } catch (error) {
                console.error('Error handling incoming message:', error);
            }
        }
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export const whatsappService = new WhatsAppService();
