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
import { Upload, File, X, CheckCircle2, Loader2,  Cloud,
  HardDrive,
  Pencil,
  Check as CheckIcon,
  X as XIcon,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [provider, setProvider] = useState("google-drive");
  const [customNames, setCustomNames] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setCustomNames((prev) => [...prev, ...acceptedFiles.map(f => f.name)]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    useFsAccessApi: false 
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCustomNames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file: any, index) => {
      const name = customNames[index] || file.name;
      // If it has a path (from folder upload), preserve the path but use the custom name for the file part
      let finalPath = file.webkitRelativePath || file.path || file.name;
      const pathParts = finalPath.split('/');
      pathParts[pathParts.length - 1] = name;
      finalPath = pathParts.join('/');

      const cleanPath = finalPath.replace(/^\.\//, '').replace(/^\//, '');
      formData.append("relativePaths", cleanPath);
      formData.append("files", file, name); // Use custom name in Multer
    });

    formData.append("provider", provider);

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
            Choose your platform and upload your files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Select Platform</label>
            <Tabs value={provider} onValueChange={setProvider} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-10">
                <TabsTrigger value="google-drive" className="gap-2">
                  <HardDrive className="w-4 h-4" /> Drive
                </TabsTrigger>
                <TabsTrigger value="cloudinary" className="gap-2">
                  <Cloud className="w-4 h-4" /> Cloud
                </TabsTrigger>
                <TabsTrigger value="telegram" className="gap-2">
                  <Send className="w-4 h-4" /> Telegram
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

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
      </div>

        {files.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file: any, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md text-sm border"
              >
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <File className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                  <input
                    type="text"
                    value={customNames[index] || ""}
                    onChange={(e) => {
                      const newNames = [...customNames];
                      newNames[index] = e.target.value;
                      setCustomNames(newNames);
                    }}
                    className="bg-transparent border-b border-transparent hover:border-muted-foreground/30 focus:border-primary focus:outline-none transition-colors w-full h-7 px-1"
                    placeholder="File name"
                    disabled={isUploading}
                  />
                  <span className="text-[10px] text-muted-foreground flex-shrink-0 opacity-60">
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
