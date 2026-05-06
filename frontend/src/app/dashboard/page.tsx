"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  File as FileIcon,
  HardDrive,
  Clock,
  LogOut,
  Trash2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Loader2,
  Upload,
  Folder,
  ArrowLeft,
  Cloud,
  Send,
} from "lucide-react";
import { FileUpload } from "@/components/modules/files/file-upload";
import { FileCard } from "@/components/modules/files/file-card";
import { FileReplace } from "@/components/modules/files/file-replace";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [files, setFiles] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [currentPath, setCurrentPath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const [replacingFile, setReplacingFile] = useState<any | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/api/files/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  }, []);

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/files?path=${currentPath}`);
      setFiles(response.data);
      fetchStats();
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  }, [currentPath, fetchStats]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      fetchFiles();
    }
  }, [isAuthenticated, router, fetchFiles]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/api/files/${id}`);
      toast.success("File deleted");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleReplaceClick = (file: any) => {
    setReplacingFile(file);
  };

  const handleNavigateFolder = (folderName: string) => {
    const newPath =
      currentPath === "/" ? `/${folderName}/` : `${currentPath}${folderName}/`;
    setCurrentPath(newPath);
  };

  const handleGoBack = () => {
    if (currentPath === "/") return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop(); // remove last folder
    const newPath = parts.length === 0 ? "/" : `/${parts.join("/")}/`;
    setCurrentPath(newPath);
  };

  const handleRename = async (fileId: string, newName: string) => {
    try {
      await api.patch(`/api/files/${fileId}/rename`, { name: newName });
      toast.success("File renamed");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to rename file");
      throw error;
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <FileReplace
        isOpen={!!replacingFile}
        onOpenChange={(open) => !open && setReplacingFile(null)}
        file={replacingFile}
        onSuccess={fetchFiles}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 -ml-2 text-muted-foreground hover:text-primary"
              onClick={handleGoBack}
              disabled={currentPath === "/"}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <HardDrive className="w-4 h-4" />
            <span>Drive</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground truncate max-w-[200px]">
              {currentPath}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FileUpload onUploadSuccess={fetchFiles} currentPath={currentPath} />
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<HardDrive className="w-5 h-5 text-blue-500" />}
          title="Global Storage"
          value={formatSize(stats?.totalSize || 0)}
          description={`${stats?.totalFiles || 0} Files across all platforms`}
        />
        <StatCard
          icon={<Folder className="w-5 h-5 text-amber-500" />}
          title="Total Folders"
          value={stats?.totalFolders?.toString() || "0"}
          description="Across all directories"
        />
        <StatCard
          icon={<Send className="w-5 h-5 text-sky-500" />}
          title="Platform Health"
          value="Connected"
          description="3 Storage Providers active"
        />
      </div>

      {stats && (
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="w-5 h-5" /> Storage Breakdown
            </CardTitle>
            <CardDescription>
              Usage distribution across your cloud vault.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["google-drive", "cloudinary", "telegram"].map((provider) => {
                const providerStats = stats.providers.find(
                  (p: any) => p.provider === provider,
                ) || { size: 0, count: 0 };
                const label =
                  provider === "google-drive"
                    ? "Google Drive"
                    : provider === "cloudinary"
                      ? "Cloudinary"
                      : "Telegram";
                const icon =
                  provider === "google-drive" ? (
                    <HardDrive className="w-4 h-4 text-green-500" />
                  ) : provider === "cloudinary" ? (
                    <Cloud className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Send className="w-4 h-4 text-sky-500" />
                  );

                // Mock limits for visual representation
                const limit =
                  provider === "google-drive"
                    ? 15 * 1024 * 1024 * 1024
                    : provider === "cloudinary"
                      ? 25 * 1024 * 1024
                      : 0; // 15GB, 25MB, 0 for unlimited
                const percentage =
                  limit > 0
                    ? Math.min((providerStats.size / limit) * 100, 100)
                    : 0;

                return (
                  <div key={provider} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium">
                        {icon}
                        <span>{label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {providerStats.count} files
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${provider === "telegram" ? "bg-sky-500" : "bg-primary"}`}
                          style={{
                            width:
                              provider === "telegram"
                                ? "100%"
                                : `${percentage}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        <span>{formatSize(providerStats.size)} used</span>
                        <span>
                          {limit > 0 ? formatSize(limit) : "Unlimited"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Files & Folders</CardTitle>
            <CardDescription>
              Manage your documents and folder structure.
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchFiles}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Fetching your files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
              <Upload className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground font-medium">No files yet</p>
              <p className="text-sm text-muted-foreground">
                Upload a file or folder to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={() => handleDelete(file.id)}
                  onReplace={() => handleReplaceClick(file)}
                  onNavigate={() => handleNavigateFolder(file.name)}
                  onRename={(newName) => handleRename(file.id, newName)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
