# Cloud Vault 🚀

Cloud Vault is a premium, multi-platform document management system that unifies storage from Google Drive, Cloudinary, and Telegram into a single, sleek dashboard. It allows users to upload, manage, and migrate files across different cloud providers seamlessly.

![Dashboard Preview](https://drive.google.com/file/d/18eEegO5ci3pIPjekwTfHf3cBobNNP-qj/view?usp=drivesdk)

## ✨ Features

- **Unified Dashboard**: View and manage all your files in one place, regardless of where they are stored.
- **Multi-Platform Support**:
  - **Google Drive**: Traditional cloud storage integration.
  - **Cloudinary**: High-performance image and video storage.
  - **Telegram Drive**: Use Telegram's unlimited storage as a personal file vault via bot integration.
- **Folder Navigation**: Native support for nested directories across all platforms.
- **Cross-Platform Migration**: Move files between providers (e.g., from Google Drive to Telegram) with a single click.
- **Smart Management**:
  - Drag-and-drop uploads.
  - Bulk file/folder uploads.
  - Rename, Replace, and Delete functionality.
  - Real-time usage statistics.
- **Secure Authentication**: Robust JWT-based auth system with signup, login, and password recovery.
- **Premium UI**: Modern dark-mode aesthetic with glassmorphism, smooth animations, and responsive design.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Base UI](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **APIs Integrated**:
  - Google Drive API
  - Cloudinary SDK
  - Telegram Bot API (Telegraf)
- **Auth**: Passport.js & JWT

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL database
- Google Cloud Console Project (for Drive access)
- Cloudinary Account
- Telegram Bot (from @BotFather)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mohammadali-eth/CloudVault.git
   cd cloud-vault
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables section below
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env.local file with NEXT_PUBLIC_API_URL=http://localhost:4000/api
   npm run dev
   ```

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/cloudvault"
JWT_SECRET="your-secret-key"

# GOOGLE DRIVE CONFIG
GOOGLE_DRIVE_CLIENT_EMAIL="your-service-account-email"
GOOGLE_DRIVE_PRIVATE_KEY="your-private-key"
GOOGLE_DRIVE_FOLDER_ID="your-base-folder-id"

# CLOUDINARY CONFIG
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# TELEGRAM CONFIG
TELEGRAM_BOT_TOKEN="your-bot-token"
TELEGRAM_CHAT_ID="your-chat-or-channel-id"

# MAIL CONFIG (for password reset)
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email"
MAIL_PASS="your-app-password"
```

## 📂 Project Structure

```
cloud-vault/
├── backend/                # NestJS Backend
│   ├── src/
│   │   ├── modules/        # Auth, Files, Users modules
│   │   ├── database/       # Prisma service
│   │   └── common/         # Guards, Decorators
│   └── prisma/             # Schema & Migrations
├── frontend/               # Next.js Frontend
│   ├── src/
│   │   ├── app/            # Pages & Routes
│   │   ├── components/     # UI & Business components
│   │   ├── store/          # Zustand stores
│   │   └── lib/            # API & Utils
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is [UNLICENSED](LICENSE).

---

Built with ❤️ by [Mohammadali Dhanga](https://github.com/mohammadali-eth)
