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
import { UserWithDetails } from "@/utils/users";

interface FundLite {
  id: string;
  name: string;
  minimumInvestment: string;
  status: string;
}

interface UserStartInvestmentDialogProps {
  user: UserWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export function UserStartInvestmentDialog({
  user,
  isOpen,
  onClose,
}: UserStartInvestmentDialogProps) {
  const [funds, setFunds] = React.useState<FundLite[]>([]);
  const [loadingFunds, setLoadingFunds] = React.useState(false);
  const [fundId, setFundId] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [proofUrl, setProofUrl] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const selectedFund = funds.find((f) => f.id === fundId);

  React.useEffect(() => {
    if (!isOpen) {
      setFundId("");
      setAmount("");
      setProofUrl("");
      setReference("");
      return;
    }
    // Load open funds whenever the dialog opens.
    setLoadingFunds(true);
    fetch("/api/admin/funds?status=open&limit=100")
      .then((r) => r.json())
      .then((data) => {
        const list: FundLite[] = data?.funds ?? [];
        setFunds(list);
      })
      .catch(() => toast.error("Failed to load funds"))
      .finally(() => setLoadingFunds(false));
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!fundId) {
      toast.error("Pick a fund");
      return;
    }
    if (amount === "" || !(Number(amount) > 0)) {
      toast.error("Enter an amount greater than zero");
      return;
    }
    if (!proofUrl) {
      toast.error("Upload a payment proof");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fundId,
          amount: Number(amount),
          paymentProofUrl: proofUrl,
          paymentReference: reference,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create investment");
      toast.success(
        `Started a $${Number(amount).toLocaleString("en-US")} active investment for ${user.name || user.email}`,
      );
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Failed to create investment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Start investment on behalf</SheetTitle>
          <SheetDescription>
            Create an investment for{" "}
            <span className="font-medium text-foreground">
              {user.name || user.email}
            </span>
            . It is activated immediately — same result as a user commitment that
            you approved.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fund">Fund</Label>
            <Select value={fundId} onValueChange={setFundId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loadingFunds ? "Loading funds…" : "Select a fund"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {funds.length === 0 && !loadingFunds && (
                  <div className="p-2 text-xs text-muted-foreground">
                    No open funds available.
                  </div>
                )}
                {funds.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFund && (
              <p className="text-xs text-muted-foreground">
                Minimum investment: $
                {parseFloat(selectedFund.minimumInvestment).toLocaleString(
                  "en-US",
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Payment proof</Label>
            <FileUpload
              value={proofUrl}
              onChange={setProofUrl}
              folder="investments/proofs"
              label="Payment proof"
              description="JPEG / PNG / PDF — max 10MB"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reference">
              Bank reference{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="reference"
              placeholder="Transfer reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>
        </div>

        <SheetFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !fundId || !proofUrl}
              className="flex-1"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create active investment
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
