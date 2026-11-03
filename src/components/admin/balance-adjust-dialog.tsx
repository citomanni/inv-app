"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Loader2, RefreshCw, ArrowRight } from "lucide-react";

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

export interface AdjustInvestor {
  id: string;
  name: string;
  email: string;
  currentReturns: number;
}

interface Plan {
  current: number;
  target: number;
  gap: number;
  installments: number[];
  recipientInvestments: number;
}

interface BalanceAdjustDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: () => void;
  investors: AdjustInvestor[];
}

const usd = (n: number) =>
  `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function BalanceAdjustDialog({
  isOpen,
  onClose,
  onDone,
  investors,
}: BalanceAdjustDialogProps) {
  const [userId, setUserId] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [installments, setInstallments] = React.useState("");
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const selected = investors.find((i) => i.id === userId);

  React.useEffect(() => {
    if (!isOpen) {
      setUserId("");
      setTarget("");
      setInstallments("");
      setPlan(null);
    }
  }, [isOpen]);

  // Any change to the inputs invalidates a previously generated plan.
  React.useEffect(() => {
    setPlan(null);
  }, [userId, target, installments]);

  const generate = async () => {
    if (!userId) {
      toast.error("Pick an investor");
      return;
    }
    if (target === "" || isNaN(Number(target))) {
      toast.error("Enter a target balance");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/payouts/adjust/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          targetReturns: Number(target),
          installments: installments ? Number(installments) : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to build plan");
      setPlan(json);
    } catch (e: any) {
      toast.error(e?.message || "Failed to build plan");
    } finally {
      setGenerating(false);
    }
  };

  const commit = async () => {
    if (!plan) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/payouts/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          targetReturns: plan.target,
          amounts: plan.installments,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to apply");
      toast.success(
        `Balance set to ${usd(json.newTotal)} across ${json.events} event(s)`,
      );
      onDone();
    } catch (e: any) {
      toast.error(e?.message || "Failed to apply adjustment");
    } finally {
      setSubmitting(false);
    }
  };

  const isNoop = plan != null && Math.abs(plan.gap) < 0.01;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Adjust investor balance</SheetTitle>
          <SheetDescription>
            Set a single investor&apos;s total returns to an exact target. The
            system generates a plan of payout events to reach it. No other
            investor is affected.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="investor">Investor</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an investor" />
              </SelectTrigger>
              <SelectContent>
                {investors.length === 0 && (
                  <div className="p-2 text-xs text-muted-foreground">
                    No investors with active investments yet.
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
            {selected && (
              <p className="text-xs text-muted-foreground">
                Current total returns:{" "}
                <span className="font-medium text-foreground">
                  {usd(selected.currentReturns)}
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="target">Target balance ($)</Label>
              <Input
                id="target"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 20000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="installments">
                Installments{" "}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="installments"
                type="number"
                min="1"
                max="12"
                placeholder="auto"
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={generate}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {plan ? "Regenerate plan" : "Generate plan"}
          </Button>

          <div className="rounded-lg border bg-muted/40 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Plan preview
            </div>
            {plan ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{usd(plan.current)}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{usd(plan.target)}</span>
                  <span
                    className={`ml-auto rounded px-2 py-0.5 text-xs font-medium ${
                      plan.gap >= 0
                        ? "bg-green-50 text-green-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {plan.gap >= 0 ? "+" : ""}
                    {usd(plan.gap)}
                  </span>
                </div>

                {isNoop ? (
                  <p className="text-sm text-muted-foreground">
                    This investor is already at the target balance. Nothing to
                    do.
                  </p>
                ) : (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {plan.installments.length} event(s), across{" "}
                      {plan.recipientInvestments} active investment(s):
                    </div>
                    <ul className="divide-y rounded-md border bg-background">
                      {plan.installments.map((a, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <span
                            className={`font-medium ${a < 0 ? "text-amber-700" : ""}`}
                          >
                            {a >= 0 ? "+" : ""}
                            {usd(a)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Pick an investor and target, then generate a plan.
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
              onClick={commit}
              disabled={submitting || !plan || isNoop}
              className="flex-1"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Commit
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
