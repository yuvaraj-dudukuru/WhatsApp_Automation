import app from './app';
// import { whatsappService } from './modules/whatsapp/whatsapp.service';
import './jobs/campaign.worker'; // Start worker

const PORT = process.env.PORT || 4000;

async function startServer() {
    try {
        // Initialize services
        // await whatsappService.initialize();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
