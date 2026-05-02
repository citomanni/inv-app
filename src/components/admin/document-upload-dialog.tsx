"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { DOCUMENT_TYPES } from "@/lib/schemas";

interface Investor {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
  investors: Investor[];
}

const TYPE_LABELS: Record<string, string> = {
  investment_agreement: "Investment Agreement",
  payment_receipt: "Payment Receipt",
  summary_statement: "Summary Statement",
  tax_form: "Tax Form",
  other: "Other",
};

export function DocumentUploadDialog({
  isOpen,
  onClose,
  onUploaded,
  investors,
}: Props) {
  const [userId, setUserId] = React.useState("");
  const [type, setType] = React.useState<string>("investment_agreement");
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setUserId("");
      setType("investment_agreement");
      setTitle("");
      setUrl("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!userId) return toast.error("Pick an investor");
    if (!title.trim()) return toast.error("Add a title");
    if (!url) return toast.error("Upload the file first");

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type, title, url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      toast.success("Document delivered to investor");
      onUploaded();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Upload document</SheetTitle>
          <SheetDescription>
            The investor receives a notification with a link to view the file.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="investor">Investor</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an investor" />
              </SelectTrigger>
              <SelectContent>
                {investors.length === 0 && (
                  <div className="p-2 text-xs text-muted-foreground">
                    No KYC-approved investors yet.
                  </div>
                )}
                {investors.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {i.email}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Document type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. 10X Integra Shores Agreement (signed)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <FileUpload
            value={url}
            onChange={setUrl}
            folder="documents"
            label="File"
            description="PDF / image — uploaded securely to Cloudinary"
          />
        </div>

        <SheetFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !userId || !title || !url}
              className="flex-1"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Deliver to investor
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
