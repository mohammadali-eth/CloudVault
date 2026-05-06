"use client";

import {
  File as FileIcon,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Folder,
  Cloud,
  HardDrive,
  Pencil,
  Check as CheckIcon,
  X as XIcon,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import noPreviewImage from "@/assets/images/NoPreview.png";

interface FileCardProps {
  file: any;
  onDelete: () => void;
  onReplace: () => void;
  onNavigate: () => void;
  onRename?: (newName: string) => Promise<void>;
}

export function FileCard({
  file,
  onDelete,
  onReplace,
  onNavigate,
  onRename,
}: FileCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);
  const [isUpdating, setIsUpdating] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(file.url);
    setIsCopied(true);
    toast.success("URL copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRename = async () => {
    if (!newName || newName === file.name) {
      setIsEditing(false);
      return;
    }

    if (onRename) {
      setIsUpdating(true);
      try {
        await onRename(newName);
        setIsEditing(false);
      } catch (error) {
        setNewName(file.name);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const isImage = file.type?.startsWith("image/");

  const getImageUrl = () => {
    if (!isImage) return null;
    if (file.provider === "google-drive") {
      const match = file.url.match(/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return file.url;
  };

  const imageUrl = getImageUrl();

  return (
    <Card className="overflow-hidden group border-muted/20">
      {/* Preview Section */}
      <div className="relative aspect-video bg-muted/30 flex items-center justify-center overflow-hidden border-b border-muted/10">
        {file.isFolder ? (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center hover:bg-muted/10 transition-colors"
            onClick={onNavigate}
          >
            <Folder className="w-16 h-16 text-primary/40 fill-primary/10" />
          </div>
        ) : isImage ? (
          <img
            src={imageUrl || ""}
            alt={file.name}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => window.open(file.url, "_blank")}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = typeof noPreviewImage === 'string' ? noPreviewImage : noPreviewImage.src;
            }}
          />
        ) : (
          <div
            className="flex flex-col items-center gap-2 cursor-pointer w-full h-full justify-center hover:bg-muted/10 transition-colors"
            onClick={() => window.open(file.url, "_blank")}
          >
            <FileIcon className="w-16 h-16 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground uppercase">
              {file.type?.split("/")[1] || "File"}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4 space-y-4 bg-card">
        <div className="group/title">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setIsEditing(false);
                    setNewName(file.name);
                  }
                }}
                className="bg-muted border border-primary rounded px-2 py-1 text-sm font-bold w-full focus:outline-none"
                autoFocus
                disabled={isUpdating}
              />
              <button
                onClick={handleRename}
                className="p-1 hover:text-green-500 transition-colors"
                disabled={isUpdating}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <h3
                className="font-bold text-base truncate flex-1"
                title={file.name}
              >
                {file.name}
              </h3>
              <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover/title:opacity-100 p-1 hover:text-primary transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-1 space-y-1">
            <p>{new Date(file.createdAt).toLocaleDateString()}</p>
            <div className="flex items-center gap-1.5 py-0.5">
              {file.provider === "cloudinary" ? (
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
              ) : file.provider === "telegram" ? (
                <Send className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <HardDrive className="w-3.5 h-3.5 text-green-400" />
              )}
              <span className="font-medium">
                {file.provider === "cloudinary"
                  ? "Cloudinary"
                  : file.provider === "telegram"
                    ? "Telegram"
                    : "Google Drive"}
              </span>
            </div>
            <p className="truncate opacity-70">
              Path: {file.path}
              {file.name}
            </p>
          </div>
        </div>

        {/* URL Box */}
        {!file.isFolder && (
          <div className="flex items-center gap-2 bg-muted/30 border border-muted/20 rounded-md p-2">
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-muted-foreground truncate">
                {file.url}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Actions Section */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2 bg-transparent border-muted/30 hover:bg-muted/10"
            onClick={onReplace}
          >
            <RefreshCw className="w-4 h-4" />
            Replace
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-2 bg-red-900/80 hover:bg-red-800 text-white"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
