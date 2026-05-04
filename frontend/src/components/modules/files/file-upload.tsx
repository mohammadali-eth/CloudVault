"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "../../ui/progress";
import { Upload, File, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export function FileUpload({
  onUploadSuccess,
  currentPath = '/',
}: {
  onUploadSuccess?: () => void;
  currentPath?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    useFsAccessApi: false 
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    // Append paths first for Multer compatibility
    files.forEach((file: any) => {
      const path = file.webkitRelativePath || file.path || file.name;
      // Strip leading slash if any
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      formData.append("relativePaths", cleanPath);
    });
    
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Mock progress since we are doing a single request for multiple files
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      await api.post(`/files/upload?path=${encodeURIComponent(currentPath || '/')}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(interval);
      setProgress(100);
      toast.success("Files uploaded successfully!");
      setFiles([]);
      setIsOpen(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error(error.response?.data?.message || "Failed to upload files");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Upload className="w-4 h-4" /> Upload File
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Drag and drop your files here or click to browse.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div 
            {...getRootProps()} 
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <File className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs font-medium">Upload Files</p>
            </div>
          </div>

          <div 
            onClick={() => document.getElementById("folder-upload")?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-primary/50"
          >
            <input 
              type="file" 
              id="folder-upload" 
              className="hidden" 
              // @ts-ignore
              webkitdirectory="" 
              directory="" 
              onChange={(e) => {
                if (e.target.files) {
                  onDrop(Array.from(e.target.files));
                }
              }}
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-muted-foreground" />
              <p className="text-xs font-medium">Upload Folder</p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file: any, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md text-sm border"
              >
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <File className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate" title={file.webkitRelativePath || file.path || file.name}>
                    {file.webkitRelativePath || file.path || file.name}
                  </span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                {!isUploading && (
                  <button
                    onClick={() => removeFile(index)}
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {isUploading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
