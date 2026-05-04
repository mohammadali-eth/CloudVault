"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, removeTokens } from "@/lib/auth";
import { getMeApi } from "@/features/auth/api/auth-api";
import { User } from "@/features/auth/types";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await getMeApi();
        setUser(userData);
      } catch (err) {
        removeTokens();
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    removeTokens();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-black uppercase tracking-[0.5em] text-xs">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-12 font-sans selection:bg-foreground selection:text-background">
      <nav className="flex justify-between items-center border-b-2 border-foreground pb-8 mb-16">
        <div className="text-2xl font-heading font-black tracking-tighter uppercase">Vault Dashboard</div>
        <div className="flex items-center gap-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="text-[10px] font-black uppercase tracking-widest border-2 border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl space-y-12">
        <div className="space-y-4">
          <h2 className="text-6xl font-heading font-black uppercase tracking-tighter">System Access Granted</h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm italic">Status: Secure / Zero Knowledge Protocol Active</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
          <div className="border-2 border-foreground p-8 space-y-4">
            <h3 className="font-black text-sm uppercase tracking-widest">Account Metadata</h3>
            <div className="space-y-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <p>ID: {user.id}</p>
              <p>Member Since: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="border-2 border-foreground p-8 flex items-center justify-center opacity-20 italic font-black uppercase tracking-widest text-xs">
            Module restricted
          </div>
        </div>
      </main>
    </div>
  );
}
