import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground overflow-hidden relative selection:bg-foreground selection:text-background">
      {/* Structural Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-20 max-w-7xl mx-auto">
        <div className="text-xl font-heading font-bold tracking-tighter">CLOUD VAULT</div>
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/login" className="hover:opacity-60 transition-opacity">Login</Link>
          <button className="hover:opacity-60 transition-opacity">Docs</button>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-4xl">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-foreground/10 bg-foreground/5 text-xs font-bold uppercase tracking-widest">
          Version 1.0.0
        </div>
        
        <h1 className="text-7xl md:text-9xl font-heading font-black tracking-tight leading-[0.8] mb-4">
          SECURE<br />STORAGE
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed font-medium">
          Enterprise-grade encryption. Zero-knowledge architecture. <br className="hidden md:block" />
          The future of secure collaboration is monochrome.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full sm:w-auto">
          <Link 
            href="/login" 
            className="px-12 py-5 bg-foreground text-background font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            Create Vault
          </Link>
          <button className="px-12 py-5 border-2 border-foreground font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all">
            Inquire
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-32 w-full pt-16 border-t border-foreground/10">
          {[
            { title: "ENCRYPTION", desc: "AES-256-GCM hardware-backed security." },
            { title: "NODES", desc: "Decentralized storage across global zones." },
            { title: "AUDIT", desc: "Real-time tamper-proof access logging." }
          ].map((feature, i) => (
            <div key={i} className="text-left space-y-4">
              <h3 className="font-black text-sm tracking-widest uppercase">{feature.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full p-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 text-center">
        © 2026 Cloud Vault Systems Inc. / All Rights Reserved
      </footer>
    </main>
  );
}
