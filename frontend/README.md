# Cloud Vault Frontend

A modern, high-performance web application built with Next.js 15, Tailwind CSS, and Shadcn UI. This project serves as the user interface for the Cloud Vault platform, providing a seamless experience for file management and cloud storage.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (Recommended)

## 📂 Project Structure

The project follows a modular and scalable directory structure, designed for large-scale enterprise applications:

```text
src/
├── app/                # Next.js App Router (pages, layouts, loading, errors)
├── assets/             # Static assets (images, icons, fonts)
├── components/         # React components
│   ├── ui/             # Base UI components (Shadcn)
│   ├── common/         # Shared generic components
│   ├── layout/         # Layout components (Navbar, Footer, Sidebar)
│   └── modules/        # Feature-specific components (e.g., auth, dashboard)
├── constants/          # Application constants and configuration
├── hooks/              # Custom React hooks
├── lib/                # Third-party library configurations and shared utilities
├── services/           # API services and external integrations
├── store/              # Global state management (e.g., Zustand/Redux)
├── types/              # TypeScript interfaces and types
└── styles/             # Global CSS and Tailwind configuration
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design Principles

- **Responsive**: Mobile-first design approach.
- **Accessible**: Adheres to WCAG guidelines using Radix UI primitives.
- **Type-Safe**: Strict TypeScript configuration for robust development.
- **Modular**: Atomic design principles for reusable components.

## 📄 License

This project is licensed under the MIT License.
