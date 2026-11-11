import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
export function Field({ id, label, error, children, optional }: { id: string; label: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs uppercase tracking-widest text-primary">{label}{optional && <span className="ml-1 normal-case tracking-normal text-muted-foreground">(optional)</span>}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}
export const inputCls = "h-12 bg-card";
export const selectCls = "h-12 w-full border border-input bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
