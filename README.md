# MemoirVault

A privacy-first web application for recording personal autobiographies in a secure digital space.

## Features

- **2GB Free Storage**: All users get 2GB of free storage
- **Storage Usage Tracking**: Visual progress bar showing storage usage
- **Privacy-First Design**: End-to-end encryption and complete data control
- **Multi-Media Support**: Upload text, photos, audio, and video
- **Timeline View**: Chronological display of entries

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Storage System

- All users receive 2GB of free storage
- Storage usage is tracked and displayed in the dashboard
- Users receive warnings when approaching storage limits
- Premium plans with additional storage will be available in the future

## Tech Stack

- **Next.js 15** with App Router
- **React 18**
- **TypeScript**
- **Clerk** for authentication
- **NeonDB** (PostgreSQL)
- **Drizzle ORM**
- **Cloudflare R2** for storage
- **Tailwind CSS**