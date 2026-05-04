import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 selection:bg-foreground selection:text-background font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      <div className="relative z-20 flex flex-col items-center gap-4">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 mb-4 self-start">
          ← Back to Home
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
