# WhatsApp Automation Pro 🚀

> **Note**: This repository contains the **Production-Grade** version of the WhatsApp Automation tool in the `whatsapp-automation-pro` directory.

A full-stack, enterprise-ready WhatsApp automation platform designed for bulk messaging, campaign management, and AI-powered interactions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Express](https://img.shields.io/badge/Express-4.18-green)

---

## 📑 Table of Contents

1. [🌟 Features](#-features)
2. [🏗 Architecture](#-architecture)
3. [📋 Prerequisites](#-prerequisites)
4. [🚀 A-Z Installation Guide](#-a-z-installation-guide)
    * [Step 1: Database & Queue Setup](#step-1-database--queue-setup)
    * [Step 2: Backend Setup](#step-2-backend-setup-api)
    * [Step 3: Frontend Setup](#step-3-frontend-setup-web)
5. [💻 Usage Guide](#-usage-guide)
6. [🤖 AI Features](#-ai-features)
7. [📂 Project Structure](#-project-structure)

---

## 🌟 Features

* **Campaign Management**: Create, schedule, and monitor bulk messaging campaigns.
* **Smart Queuing**: Uses **BullMQ** and **Redis** to handle thousands of messages with intelligent delays to prevent bans.
* **AI Integration**: Integrated **Google Gemini** for:
  * generating message content.
  * Smart Replies for incoming messages.
  * Sentiment Analysis of responses.
* **Contact Management**: Organize contacts with tags and categories.
* **Modern Dashboard**: Responsive UI built with **Next.js**, **Tailwind CSS**, and **Shadcn UI**.
* **Secure Auth**: JWT-based authentication for multiple users.

---

## 🏗 Architecture

The project is structured as a **Monorepo** inside `whatsapp-automation-pro/`:

* **`apps/api` (Backend)**:
  * **Runtime**: Node.js + Express
  * **Language**: TypeScript
  * **WhatsApp Engine**: `venom-bot` (runs a headless browser)
  * **Database**: PostgreSQL + Prisma ORM
  * **Queue**: BullMQ + Redis
  * **AI**: Google Generative AI SDK
* **`apps/web` (Frontend)**:
  * **Framework**: Next.js 14 (App Router)
  * **Styling**: Tailwind CSS
  * **Components**: Shadcn UI
  * **State**: React Hooks + Axios

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js** (v18 or higher)
2. **Docker Desktop** (for running PostgreSQL and Redis easily)
3. **Git**
4. **Google Gemini API Key** (Get one [here](https://makersuite.google.com/app/apikey))

---

## 🚀 A-Z Installation Guide

Follow these steps to get the project running from scratch.

### Step 1: Database & Queue Setup

We use Docker to spin up PostgreSQL (Database) and Redis (Message Queue).

1. Navigate to the project directory:

    ```bash
    cd whatsapp-automation-pro
    ```

2. Start the infrastructure:

    ```bash
    docker-compose up -d postgres redis
    ```

    * This starts a Postgres DB on port `5432`.
    * This starts a Redis instance on port `6379`.

### Step 2: Backend Setup (API)

1. **Navigate to the API folder**:

    ```bash
    cd apps/api
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment**:
    * Create a `.env` file in `apps/api`:

    ```env
    PORT=4000
    DATABASE_URL="postgresql://postgres:postgres@localhost:5432/whatsapp_pro?schema=public"
    REDIS_HOST="localhost"
    REDIS_PORT=6379
    JWT_SECRET="super-secret-key-change-this"
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY_HERE"
    ```

    * *Replace `YOUR_GOOGLE_GEMINI_API_KEY_HERE` with your actual key.*

4. **Initialize Database**:
    * Run the database migrations to create tables:

    ```bash
    npx prisma migrate dev --name init
    ```

5. **Start the Server**:

    ```bash
    npm run dev
    ```

    * You should see: `Server running on port 4000` and `Initialized WhatsApp Service`.

### Step 3: Frontend Setup (Web)

1. **Open a new terminal** and navigate to the Web folder:

    ```bash
    cd apps/web
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment**:
    * Create a `.env.local` file in `apps/web`:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:4000/api
    ```

4. **Start the Dashboard**:

    ```bash
    npm run dev
    ```

    * The app will run at [http://localhost:3000](http://localhost:3000).

---

## 💻 Usage Guide

### 1. Registration & Login

* Go to `http://localhost:3000/register`.
* Create an account. You will be redirected to the Dashboard.

### 2. Connect WhatsApp

* On the Dashboard, click **"Connect WhatsApp"**.
* Watch the backend terminal (`apps/api`). `venom-bot` will generate a QR code.
* **Scan the QR code** with your WhatsApp mobile app (Linked Devices).
* Once connected, the status in the dashboard will update (future update will show QR on frontend).

### 3. Managing Contacts

* Navigate to **Contacts**.
* Click **Add Contact** to manually add phone numbers (include country code, e.g., `15551234567`).

### 4. Creating a Campaign

* Navigate to **Campaigns**.
* Click **New Campaign**.
* Select a Template or write a message.
* Select Contacts.
* Click **Launch**.
* The system will queue messages and send them with a safe delay (default 3s) to avoid spam detection.

---

## 🤖 AI Features

Navigate to the **AI Tools** section in the Dashboard:

1. **Message Generator**:
    * Enter a prompt (e.g., *"Write a polite follow-up for a client who hasn't paid invoice #101"*).
    * Gemini will generate a professional message for you to copy.

2. **Sentiment Analysis**:
    * Paste a customer's reply.
    * The AI will categorize it as `Positive`, `Negative`, or `Neutral` to help you prioritize responses.

---

## 📂 Project Structure

```bash
whatsapp-automation-pro/
├── apps/
│   ├── api/                  # Backend Application
│   │   ├── src/
│   │   │   ├── modules/      # Feature modules (Auth, WhatsApp, Campaigns)
│   │   │   ├── jobs/         # BullMQ Workers (campaign.worker.ts)
│   │   │   └── config/       # Database & Environment config
│   │   └── prisma/           # Database Schema
│   │
│   └── web/                  # Frontend Application
│       ├── src/
│       │   ├── app/          # Next.js Pages (Dashboard, Login, etc.)
│       │   ├── components/   # UI Components (Buttons, Inputs, Cards)
│       │   └── lib/          # API Client (Axios)
│
└── docker-compose.yml        # Infrastructure Description
```

---

## ⚠️ Troubleshooting

* **Prisma Client Error**: If you see "PrismaClient is not a constructor", run `npx prisma generate` inside `apps/api`.
* **Venom-Bot Issues**: If WhatsApp fails to connect, delete the `tokens` folder in `apps/api` and restart to re-scan the QR code.
* **Port Conflicts**: Ensure ports `3000`, `4000`, `5432`, and `6379` are free.

---

*Built with ❤️ by [Yuvaraj Dudukuru]*
