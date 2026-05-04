"use client";

import { useEffect, useState } from "react";
import { getFilesApi, deleteFileApi } from "../api/file-api";
import { File as FileIcon, Trash2, RefreshCcw, ExternalLink, Loader2 } from "lucide-react";

interface FileData {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  folderPath: string | null;
}

export const FileList = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const data = await getFilesApi();
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this object?")) return;
    try {
      await deleteFileApi(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      alert("Failed to delete file");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 opacity-20">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="border-2 border-dashed border-foreground/10 p-20 text-center space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">No objects found in vault</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-1000">
      {files.map((file) => (
        <div key={file.id} className="border-2 border-foreground p-6 bg-background space-y-6 group hover:bg-foreground/5 transition-all">
          <div className="flex justify-between items-start">
            <div className="space-y-1 overflow-hidden">
              <h3 className="font-black text-sm uppercase tracking-widest truncate">{file.name}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {new Date(file.createdAt).toLocaleDateString()}
              </p>
            </div>
            <FileIcon className="w-4 h-4 flex-shrink-0 opacity-20 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="space-y-4 pt-4 border-t border-foreground/10">
            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Path / Address</p>
              <p className="text-[10px] font-bold uppercase tracking-tight truncate max-w-full">
                {file.folderPath ? `${file.folderPath}/${file.name}` : file.name}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Direct URL</p>
              <a 
                href={file.url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] font-bold text-foreground hover:underline truncate block flex items-center gap-2 group/link"
              >
                {file.url}
                <ExternalLink className="w-2 h-2 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button className="flex-1 py-3 border-2 border-foreground text-[8px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center justify-center gap-2">
              <RefreshCcw className="w-2 h-2" />
              Replace
            </button>
            <button 
              onClick={() => handleDelete(file.id)}
              className="flex-1 py-3 bg-foreground text-background text-[8px] font-black uppercase tracking-widest hover:opacity-80 transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-2 h-2" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
