"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, File, Loader2, Cloud, HardDrive } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileReplaceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  file: any;
  onSuccess: () => void;
}

export function FileReplace({
  isOpen,
  onOpenChange,
  file,
  onSuccess,
}: FileReplaceProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [provider, setProvider] = useState("google-drive");

  // Sync provider when file changes
  useEffect(() => {
    if (file?.provider) {
      setProvider(file.provider);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleReplace = async () => {
    if (!selectedFile || !file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("provider", provider); // Provider BEFORE file for Multer compatibility
    formData.append("file", selectedFile);

    try {
      toast.loading("Replacing file...", { id: "replace" });
      await api.put(`/files/${file.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File replaced successfully!", { id: "replace" });
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Replace Error:", error);
      toast.error(error.response?.data?.message || "Failed to replace file", {
        id: "replace",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleMigrate = async () => {
    if (!file || provider === file.provider) return;

    setIsUploading(true);
    try {
      toast.loading("Migrating platform...", { id: "migrate" });
      await api.patch(`/files/${file.id}/migrate`, { provider });
      toast.success("Platform migrated successfully!", { id: "migrate" });
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Migration Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to migrate platform",
        {
          id: "migrate",
        },
      );
    } finally {
      setIsUploading(false);
    }
  };

  const isMigrateMode = !selectedFile && file && provider !== file.provider;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isMigrateMode ? "Migrate Platform" : "Replace File"}
          </DialogTitle>
          <DialogDescription>
            {isMigrateMode
              ? `Move this ${file.isFolder ? "folder" : "file"} from ${file.provider === "cloudinary" ? "Cloudinary" : "Google Drive"} to ${provider === "cloudinary" ? "Cloudinary" : "Google Drive"}.`
              : "Choose a new platform or keep the current one, and select the new file."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Select Platform
            </label>
            <Tabs
              value={provider}
              onValueChange={setProvider}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 h-10">
                <TabsTrigger value="google-drive" className="gap-2">
                  <HardDrive className="w-4 h-4" /> Google Drive
                </TabsTrigger>
                <TabsTrigger value="cloudinary" className="gap-2">
                  <Cloud className="w-4 h-4" /> Cloudinary
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div
            onClick={() => document.getElementById("replace-input")?.click()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${selectedFile ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            `}
          >
            <input
              type="file"
              id="replace-input"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-3">
              {selectedFile ? (
                <>
                  <CheckCircleIcon className="w-10 h-10 text-primary" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to change file
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium text-foreground">
                      Select new file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or drag and drop here
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={isMigrateMode ? handleMigrate : handleReplace}
            disabled={(!selectedFile && !isMigrateMode) || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isMigrateMode ? "Migrating..." : "Replacing..."}
              </>
            ) : isMigrateMode ? (
              "Migrate Platform"
            ) : (
              "Replace Now"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
