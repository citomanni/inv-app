"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Loader2, Users, CircleDollarSign } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FundOption {
  id: string;
  name: string;
  slug: string;
  status: string;
  payoutFrequency: string;
  targetAnnualReturnPercent: string;
}

interface PayoutCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  fundOptions: FundOption[];
}

export function PayoutCreateDialog({
  isOpen,
  onClose,
  onCreated,
  fundOptions,
}: PayoutCreateDialogProps) {
  const [fundId, setFundId] = React.useState<string>("");
  const [periodStart, setPeriodStart] = React.useState<string>("");
  const [periodEnd, setPeriodEnd] = React.useState<string>("");
  const [ratePercent, setRatePercent] = React.useState<string>("");
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [preview, setPreview] = React.useState<{
    recipients: number;
    total: number;
  } | null>(null);
  const [previewing, setPreviewing] = React.useState(false);

  const selectedFund = fundOptions.find((f) => f.id === fundId);

  React.useEffect(() => {
    if (!isOpen) {
      setFundId("");
      setPeriodStart("");
      setPeriodEnd("");
      setRatePercent("");
      setNote("");
      setPreview(null);
    }
  }, [isOpen]);

  const suggestedRate = React.useMemo(() => {
    if (!selectedFund) return null;
    const annual = parseFloat(selectedFund.targetAnnualReturnPercent);
    if (isNaN(annual)) return null;
    if (selectedFund.payoutFrequency === "monthly") return annual / 12;
    if (selectedFund.payoutFrequency === "quarterly") return annual / 4;
    return annual;
  }, [selectedFund]);

  const runPreview = React.useCallback(async () => {
    if (!fundId || !ratePercent) {
      setPreview(null);
      return;
    }
    setPreviewing(true);
    try {
      const res = await fetch("/api/admin/payouts/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fundId, ratePercent: Number(ratePercent) }),
      });
      const json = await res.json();
      if (res.ok) setPreview(json);
    } finally {
      setPreviewing(false);
    }
  }, [fundId, ratePercent]);

  React.useEffect(() => {
    const t = setTimeout(runPreview, 250);
    return () => clearTimeout(t);
  }, [runPreview]);

  const handleSubmit = async () => {
    if (!fundId) {
      toast.error("Pick a fund");
      return;
    }
    if (!periodStart || !periodEnd) {
      toast.error("Set the distribution period");
      return;
    }
    if (!ratePercent) {
      toast.error("Set the rate");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fundId,
          periodStart,
          periodEnd,
          ratePercent: Number(ratePercent),
          note,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Distribution failed");
      toast.success(
        `Distributed $${json.total.toLocaleString("en-US")} to ${json.recipients} investor(s)`,
      );
      onCreated();
    } catch (e: any) {
      toast.error(e?.message || "Failed to distribute");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Distribute returns</SheetTitle>
          <SheetDescription>
            Credit a percentage of invested capital to every active position in
            a fund.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="fund">Fund</Label>
            <Select value={fundId} onValueChange={setFundId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fund" />
              </SelectTrigger>
              <SelectContent>
                {fundOptions.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({f.payoutFrequency})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="periodStart">Period start</Label>
              <Input
                id="periodStart"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="periodEnd">Period end</Label>
              <Input
                id="periodEnd"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="ratePercent">
              Rate (% of invested capital paid this period)
            </Label>
            <Input
              id="ratePercent"
              type="number"
              step="0.01"
              placeholder="e.g. 0.71"
              value={ratePercent}
              onChange={(e) => setRatePercent(e.target.value)}
            />
            {suggestedRate != null && (
              <button
                type="button"
                onClick={() => setRatePercent(suggestedRate.toFixed(3))}
                className="self-start text-xs text-primary hover:underline"
              >
                Use suggested {suggestedRate.toFixed(3)}% (annual ÷ frequency)
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="note">
              Internal note{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="note"
              rows={2}
              placeholder="Any context for finance / audit"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Preview
            </div>
            {previewing ? (
              <p className="mt-2 text-sm text-muted-foreground">Calculating…</p>
            ) : preview ? (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Recipients
                    </div>
                    <div className="text-lg font-semibold">
                      {preview.recipients}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total to distribute
                    </div>
                    <div className="text-lg font-semibold">
                      $
                      {preview.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Pick a fund and rate to see a preview.
              </p>
            )}
          </div>
        </div>

        <SheetFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !preview || preview.recipients === 0}
              className="flex-1"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Distribute now
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
