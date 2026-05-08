"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud,
  Image,
  Send,
  Settings,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

// --- Types ---
type Platform = "google" | "cloudinary" | "telegram";

interface ConfigField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  description: string;
}

const PLATFORM_CONFIGS: Record<
  Platform,
  {
    title: string;
    fields: ConfigField[];
    icon: React.ReactElement;
    color: string;
    guide: string;
  }
> = {
  google: {
    title: "Google Drive",
    icon: <Cloud className="w-5 h-5" />,
    color: "from-zinc-200 to-zinc-400",
    guide: "https://console.cloud.google.com/apis/credentials",
    fields: [
      {
        label: "Client Email",
        name: "googleEmail",
        type: "email",
        placeholder: "service-account@project.iam.gserviceaccount.com",
        description: "Your Google Service Account email.",
      },
      {
        label: "Private Key",
        name: "googleKey",
        type: "password",
        placeholder: "-----BEGIN PRIVATE KEY-----...",
        description: "The private key from your service account JSON.",
      },
      {
        label: "Folder ID",
        name: "googleFolderId",
        type: "text",
        placeholder: "1abc123...",
        description: "The ID of the folder you want to use as root.",
      },
    ],
  },
  cloudinary: {
    title: "Cloudinary",
    icon: <Image className="w-5 h-5" />,
    color: "from-zinc-300 to-zinc-500",
    guide: "https://cloudinary.com/console/settings/api",
    fields: [
      {
        label: "Cloud Name",
        name: "cloudinaryName",
        type: "text",
        placeholder: "your-cloud-name",
        description: "Your Cloudinary cloud identifier.",
      },
      {
        label: "API Key",
        name: "cloudinaryKey",
        type: "text",
        placeholder: "123456789...",
        description: "Your Cloudinary API key.",
      },
      {
        label: "API Secret",
        name: "cloudinarySecret",
        type: "password",
        placeholder: "********",
        description: "Your Cloudinary API secret.",
      },
    ],
  },
  telegram: {
    title: "Telegram",
    icon: <Send className="w-5 h-5" />,
    color: "from-zinc-400 to-zinc-600",
    guide: "https://t.me/BotFather",
    fields: [
      {
        label: "Bot Token",
        name: "telegramToken",
        type: "password",
        placeholder: "123456789:ABC-DEF...",
        description: "Token from @BotFather.",
      },
      {
        label: "Chat ID",
        name: "telegramChatId",
        type: "text",
        placeholder: "-100123456789",
        description:
          "The ID of the channel or chat where files will be stored.",
      },
    ],
  },
};

export default function SetupPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Platform>("google");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [completedPlatforms, setCompletedPlatforms] = useState<Platform[]>([]);
  
  const [formData, setFormData] = useState<Record<string, string>>({
    googleEmail: "",
    googleKey: "",
    googleFolderId: "",
    cloudinaryName: "",
    cloudinaryKey: "",
    cloudinarySecret: "",
    telegramToken: "",
    telegramChatId: "",
  });

  // Fetch existing config on load
  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get("/api/storage-config");
        if (response.data) {
          setFormData(prev => ({
            ...prev,
            ...response.data
          }));
          
          // Mark platforms as completed if they have data
          const completed: Platform[] = [];
          if (response.data.googleEmail) completed.push("google");
          if (response.data.cloudinaryName) completed.push("cloudinary");
          if (response.data.telegramToken) completed.push("telegram");
          setCompletedPlatforms(completed);
        }
      } catch (error) {
        console.error("Failed to fetch config", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/api/storage-config", formData);
      toast.success("Configuration saved successfully!");
      
      if (!completedPlatforms.includes(activeTab)) {
        setCompletedPlatforms([...completedPlatforms, activeTab]);
      }

      // Optional: Redirect to dashboard if at least one is configured
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Subtle Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-zinc-900/50 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-900/30 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-6 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
          >
            <Settings className="w-8 h-8 text-black" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tighter uppercase">
            Cloud Config
          </h1>
          <p className="text-zinc-500 font-medium tracking-wide">
            AUTHENTICATE STORAGE PROVIDERS
          </p>
        </div>

        <div className="backdrop-blur-3xl bg-zinc-900/40 border border-zinc-800/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex p-1.5 bg-black/40 gap-1 border-b border-zinc-800/50">
            {(Object.keys(PLATFORM_CONFIGS) as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setActiveTab(p)}
                className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl transition-all duration-300 ${
                  activeTab === p
                    ? "text-black"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {activeTab === p && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white rounded-2xl"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                  />
                )}
                <span className="z-10">{PLATFORM_CONFIGS[p].icon}</span>
                <span className="font-bold z-10 hidden sm:inline uppercase text-xs tracking-widest">
                  {PLATFORM_CONFIGS[p].title}
                </span>
                {completedPlatforms.includes(p) && (
                  <CheckCircle2
                    className={`w-4 h-4 z-10 ${activeTab === p ? "text-black" : "text-white"}`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-10">
            <AnimatePresence mode="wait">
              <motion.form
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-2xl bg-white shadow-xl`}>
                    {React.cloneElement(
                      PLATFORM_CONFIGS[activeTab].icon as React.ReactElement<{
                        className?: string;
                      }>,
                      { className: "w-6 h-6 text-black" },
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                      {PLATFORM_CONFIGS[activeTab].title}
                    </h2>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                      <ShieldCheck className="w-3.5 h-3.5" /> End-to-End
                      Encrypted
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {PLATFORM_CONFIGS[activeTab].fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-[10px] font-black text-zinc-400 ml-1 uppercase tracking-[0.2em]">
                        {field.label}
                      </label>
                      <div className="relative group">
                        <input
                          type={field.type}
                          required
                          value={formData[field.name] || ""}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white placeholder:text-zinc-700 outline-none transition-all duration-300 focus:border-white focus:ring-1 focus:ring-white/20"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-600 ml-1 font-medium italic">
                        {field.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-white hover:bg-zinc-200 text-black font-black py-4 px-8 rounded-xl transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Settings
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <a
                    href={PLATFORM_CONFIGS[activeTab].guide}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    Guide
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] mt-10"
        >
          Secure Protocol 2.0 //{" "}
          <Link href="/" className="text-zinc-400 hover:text-white underline decoration-zinc-800 underline-offset-4">
            CloudVault Infrastructure
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
