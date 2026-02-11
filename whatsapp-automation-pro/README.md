# WhatsApp Automation Pro 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![NestJS](https://img.shields.io/badge/Express-4.18-green)

A production-grade, full-stack WhatsApp automation platform built for enterprise use. Features bulk messaging, campaign management, AI-powered smart replies, and detailed analytics.

## 🌟 Key Features

- **Multi-Device Support**: Connect seamlessly using Venom-bot.
- **Bulk Campaigns**: Schedule and send thousands of messages with BullMQ & Redis.
- **AI Integration**: Google Gemini-powered smart replies and sentiment analysis.
- **Visual Dashboard**: Real-time analytics, contact management, and campaign tracking.
- **RESTful API**: Fully documented API for external integrations.
- **Role-Based Auth**: Secure JWT authentication.

## 🏗 Architecture

The project follows a Monorepo structure:

```
whatsapp-automation-pro/
├── apps/
│   ├── api/          # Express.js + TypeScript Backend
│   │   ├── modules/  # Modular architecture (Auth, WhatsApp, Campaigns)
│   │   ├── jobs/     # Background workers (BullMQ)
│   │   └── prisma/   # Database ORM
│   └── web/          # Next.js 14 Frontend
│       ├── app/      # App Router
│       └── components/# Shadcn UI Components
├── docker-compose.yml
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/whatsapp-automation-pro.git
   cd whatsapp-automation-pro
   ```

2. **Start Infrastructure (DB & Redis)**

   ```bash
   docker-compose up -d postgres redis
   ```

3. **Install Dependencies**

   ```bash
   # Backend
   cd apps/api
   npm install
   cp .env.example .env
   npx prisma migrate dev --name init

   # Frontend
   cd ../../apps/web
   npm install
   ```

4. **Start Development Servers**

   Backend:

   ```bash
   cd apps/api
   npm run dev
   ```

   Frontend:

   ```bash
   cd apps/web
   npm run dev
   ```

5. **Access the App**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:4000`

## 🛠 Tech Stack

- **Backend**: Express.js, TypeScript, Venom-bot, BullMQ, Prisma, PostgreSQL
- **Frontend**: Next.js, TailwindCSS, Shadcn UI, Axios, Recharts
- **AI**: Google Gemini API
- **DevOps**: Docker, Docker Compose

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
