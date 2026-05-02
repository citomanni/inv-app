"use client";

import * as React from "react";
import { Upload, Loader2, CheckCircle2, X, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  description?: string;
  className?: string;
  /** When true, render as a small square thumbnail instead of a wide row. */
  compact?: boolean;
}

export function FileUpload({
  value,
  onChange,
  folder,
  accept = "image/*,application/pdf",
  label = "Upload file",
  description,
  className,
  compact = false,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder });
      onChange(result.url);
      toast.success("Uploaded");
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isImage = value && /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(value);
  const isPdf = value && /\.pdf(\?|$)/i.test(value);

  if (compact) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {label && (
          <span className="text-sm font-medium text-foreground">{label}</span>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "relative flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/50 hover:bg-muted/60",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {value && isImage ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="180px"
            />
          ) : value ? (
            <div className="flex flex-col items-center gap-1 p-3 text-center">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-xs text-muted-foreground">Uploaded</span>
            </div>
          ) : uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-3 text-center">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {description || "Click to upload"}
              </span>
            </div>
          )}
          {value && !uploading && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-xs hover:text-destructive cursor-pointer"
              aria-label="Remove file"
            >
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <div
        onClick={() => !uploading && !value && inputRef.current?.click()}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 transition-colors",
          !value && !uploading && "cursor-pointer hover:border-primary/50",
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-background border">
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : value ? (
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          {value ? (
            <>
              <span className="truncate text-sm font-medium">
                {isPdf ? "Document uploaded" : "Image uploaded"}
              </span>
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-xs text-muted-foreground underline-offset-2 hover:underline"
              >
                View file
              </a>
            </>
          ) : (
            <>
              <span className="text-sm font-medium">{label}</span>
              {description && (
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              )}
            </>
          )}
        </div>
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
