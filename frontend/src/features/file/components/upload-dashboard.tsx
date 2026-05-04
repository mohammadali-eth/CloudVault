"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFilesApi } from "../api/file-api";
import { Upload, X, Folder, File as FileIcon, Loader2 } from "lucide-react";

export const UploadDashboard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [folderPath, setFolderPath] = useState("");
  const [activeTab, setActiveTab] = useState<"files" | "folder">("files");
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setStatus(null);
    try {
      await uploadFilesApi(files, folderPath);
      setStatus({ type: "success", message: `Successfully uploaded ${files.length} file(s).` });
      setFiles([]);
      setFolderPath("");
    } catch (error) {
      setStatus({ type: "error", message: "Upload failed. Please check your connection and try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex border-2 border-foreground bg-background overflow-hidden">
        <button
          onClick={() => setActiveTab("files")}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            activeTab === "files" ? "bg-foreground text-background" : "hover:bg-foreground/5"
          }`}
        >
          Upload Files
        </button>
        <button
          onClick={() => setActiveTab("folder")}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-l-2 border-foreground ${
            activeTab === "folder" ? "bg-foreground text-background" : "hover:bg-foreground/5"
          }`}
        >
          Upload Folder
        </button>
      </div>

      <div className="border-2 border-foreground p-8 bg-background space-y-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Directory</label>
          <div className="flex items-center gap-3 border-b-2 border-foreground/20 focus-within:border-foreground transition-all">
            <Folder className="w-4 h-4 opacity-30" />
            <input
              type="text"
              placeholder="E.G. PROJECTS/DESIGN/2026"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full py-3 bg-transparent focus:outline-none text-foreground font-medium placeholder:opacity-20 uppercase tracking-widest text-xs"
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-12 flex flex-col items-center justify-center space-y-4 transition-all cursor-pointer ${
            isDragActive ? "border-foreground bg-foreground/5" : "border-foreground/20 hover:border-foreground/40"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className={`w-8 h-8 ${isDragActive ? "animate-bounce" : "opacity-20"}`} />
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Drag & drop files here</p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">or click to browse local storage</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-foreground/10 bg-foreground/[0.02]">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[10px] font-bold truncate uppercase tracking-wider">{file.name}</span>
                  <span className="text-[8px] font-medium opacity-30">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button onClick={() => removeFile(i)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {status && (
          <div className={`p-4 text-[10px] font-black uppercase tracking-widest border-2 ${
            status.type === "success" ? "border-foreground bg-foreground text-background" : "border-red-500 text-red-500"
          }`}>
            {status.message}
          </div>
        )}

        <button
          disabled={files.length === 0 || isUploading}
          onClick={handleUpload}
          className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.3em] hover:opacity-80 transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Initializing Protocol...
            </>
          ) : (
            `Upload ${files.length} Object${files.length === 1 ? "" : "s"}`
          )}
        </button>
      </div>
    </div>
  );
};
