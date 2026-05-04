import Link from "next/link";
import { UploadDashboard } from "@/features/file/components/upload-dashboard";
import { ArrowLeft } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-12 font-sans selection:bg-foreground selection:text-background">
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:48px_48px] pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto space-y-12">
        <header className="space-y-6">
          <Link 
            href="/dashboard" 
            className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Dashboard
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-heading font-black uppercase tracking-tighter leading-none">Ingest Data</h1>
            <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs italic">Secure Gateway / Encryption Protocol Active</p>
          </div>
        </header>

        <UploadDashboard />
      </div>

      <footer className="fixed bottom-8 right-8 text-[8px] font-black uppercase tracking-[0.4em] opacity-20 pointer-events-none">
        Secure Ingestion Protocol v1.0 / CV-SYS-771
      </footer>
    </div>
  );
}
