"use client";

import * as React from "react";
import toast from "react-hot-toast";
import { Loader2, RefreshCw, Copy, Check, Eye, EyeOff } from "lucide-react";

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
import { setUserPassword } from "@/utils/auth";
import { UserWithDetails } from "@/utils/users";

interface UserSetPasswordDialogProps {
  user: UserWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

function generatePassword(length = 14): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

export function UserSetPasswordDialog({
  user,
  isOpen,
  onClose,
}: UserSetPasswordDialogProps) {
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setCopied(false);
      setShow(true);
    }
  }, [isOpen]);

  const copy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const handleSubmit = async () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await setUserPassword(user.id, password);
      toast.success(`Password set for ${user.name || user.email}`);
      onClose();
    } catch (e: any) {
      toast.error(e?.message || "Failed to set password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Set password</SheetTitle>
          <SheetDescription>
            Set a new password for{" "}
            <span className="font-medium text-foreground">
              {user.name || user.email}
            </span>
            . Copy it before saving — the stored value is hashed and cannot be
            shown again.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 px-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">New password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="new-password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type or generate a password"
                  className="pr-9 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copy}
                disabled={!password}
                aria-label="Copy password"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start text-xs"
              onClick={() => setPassword(generatePassword())}
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Generate strong password
            </Button>
          </div>

          <p className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            Setting this does not notify the user. Share the password with them
            through a secure channel if they need to sign in.
          </p>
        </div>

        <SheetFooter className="border-t">
          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || password.length < 8}
              className="flex-1"
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Set password
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
