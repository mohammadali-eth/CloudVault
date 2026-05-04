"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="w-full max-w-sm p-10 relative z-10 space-y-12 border-2 border-foreground bg-background">
      <div className="space-y-4">
        <h1 className="text-4xl font-heading font-black uppercase tracking-tighter text-foreground">Sign In</h1>
        {error && (
          <div className="p-3 bg-foreground text-background text-[10px] font-black uppercase tracking-widest">
            {error}
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity / Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="USER@VAULT.COM" 
              className="w-full px-0 py-3 bg-transparent border-b-2 border-foreground/20 focus:border-foreground focus:outline-none transition-all text-foreground font-medium placeholder:opacity-30 uppercase tracking-widest text-xs"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credential / Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full px-0 py-3 bg-transparent border-b-2 border-foreground/20 focus:border-foreground focus:outline-none transition-all text-foreground font-medium placeholder:opacity-30 tracking-widest text-xs"
            />
          </div>
        </div>
        
        <button 
          disabled={isLoading}
          className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? "Authenticating..." : "Authenticate"}
        </button>
      </form>
      
      <div className="pt-8 border-t border-foreground/10 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">System Access</span>
      </div>
    </div>
  );
};
