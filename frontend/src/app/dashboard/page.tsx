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
  ArrowLeft
} from "lucide-react";
import { FileUpload } from "@/components/modules/files/file-upload";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingFileId, setReplacingFileId] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/files?path=${currentPath}`);
      setFiles(response.data);
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setIsLoading(false);
    }
  }, [currentPath]);

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
      await api.delete(`/files/${id}`);
      toast.success("File deleted");
      fetchFiles();
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  const handleReplaceClick = (id: string) => {
    setReplacingFileId(id);
    fileInputRef.current?.click();
  };

  const handleNavigateFolder = (folderName: string) => {
    const newPath = currentPath === '/' ? `/${folderName}/` : `${currentPath}${folderName}/`;
    setCurrentPath(newPath);
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop(); // remove last folder
    const newPath = parts.length === 0 ? '/' : `/${parts.join('/')}/`;
    setCurrentPath(newPath);
  };

  const handleFileReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingFileId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      toast.loading("Replacing file...", { id: "replace" });
      await api.put(`/files/${replacingFileId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("File replaced", { id: "replace" });
      fetchFiles();
    } catch (error) {
      toast.error("Failed to replace file", { id: "replace" });
    } finally {
      setReplacingFileId(null);
      e.target.value = "";
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
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileReplace} 
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
              disabled={currentPath === '/'}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <HardDrive className="w-4 h-4" />
            <span>Drive</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-foreground truncate max-w-[200px]">{currentPath}</span>
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
          title="Folder Usage"
          value={formatSize(totalSize)}
          description="Total size in this path"
        />
        <StatCard
          icon={<FileIcon className="w-5 h-5 text-green-500" />}
          title="Total Files"
          value={files.length.toString()}
          description="Files in this folder"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-purple-500" />}
          title="Recent Activity"
          value="Live"
          description="Real-time storage status"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Files & Folders</CardTitle>
            <CardDescription>
              Manage your documents and folder structure.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchFiles} disabled={isLoading}>
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Fetching your files...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-xl">
                <Upload className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">No files yet</p>
                <p className="text-sm text-muted-foreground">Upload a file or folder to get started</p>
              </div>
            ) : (
              files.map((file) => (
                <FileRow 
                  key={file.id} 
                  file={file} 
                  onDelete={() => handleDelete(file.id)}
                  onReplace={() => handleReplaceClick(file.id)}
                  onNavigate={() => handleNavigateFolder(file.name)}
                />
              ))
            )}
          </div>
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

function FileRow({
  file,
  onDelete,
  onReplace,
  onNavigate,
}: {
  file: any;
  onDelete: () => void;
  onReplace: () => void;
  onNavigate: () => void;
}) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-all group border border-transparent hover:border-border">
      <div 
        className={`flex items-center gap-3 min-w-0 ${file.isFolder ? 'cursor-pointer hover:underline' : ''}`}
        onClick={() => file.isFolder && onNavigate()}
      >
        <div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
          {file.isFolder ? <Folder className="w-5 h-5 fill-primary/20" /> : <FileIcon className="w-5 h-5" />}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate max-w-[200px] md:max-w-md" title={file.name}>
            {file.name}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {!file.isFolder && <span>{formatSize(file.size)}</span>}
            {!file.isFolder && <span>•</span>}
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {file.isFolder ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-primary" 
            onClick={onNavigate}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary" 
              onClick={() => window.open(file.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={onReplace}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={onDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
