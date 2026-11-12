import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { selectCls } from "@/components/site/Field";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/site";

type Kind = "enquiries" | "consultations";
type R = { id: string; full_name: string; email: string; phone: string | null; area: string | null; status: string; notes: string; created_at: string; subject?: string; message?: string; method?: string; preferred_date?: string; preferred_time?: string; description?: string };
const STATUSES: Record<Kind, string[]> = {
  enquiries: ["new", "in progress", "responded", "closed"],
  consultations: ["pending", "confirmed", "rescheduled", "declined", "completed"],
};

export function Inbox({ kind }: { kind: Kind }) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", kind],
    queryFn: async () => {
      const { data, error } = await supabase.from(kind).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as R[];
    },
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  async function update(id: string, patch: { status?: string; notes?: string }) {
    const { error } = await supabase.from(kind).update(patch).eq("id", id);
    if (error) return void toast.error(error.message);
    toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin"] });
  }
  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;
  return (
    <div>
      <h2 className="text-3xl">{kind === "enquiries" ? "Contact enquiries" : "Consultation requests"}</h2>
      {!data?.length ? <p className="mt-8 border border-dashed p-10 text-center text-muted-foreground">No submissions yet.</p> : (
        <div className="mt-8 space-y-4">
          {data.map((r) => (
            <details key={r.id} className="border bg-card">
              <summary className="flex cursor-pointer flex-wrap items-center gap-4 p-5">
                <span className="flex-1 font-medium text-primary">{r.full_name} — {kind === "enquiries" ? r.subject : `${r.method}, ${r.preferred_date} ${r.preferred_time}`}</span>
                <span className="bg-secondary px-2 py-1 text-xs uppercase tracking-wider">{r.status}</span>
                <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
              </summary>
              <div className="space-y-4 border-t p-5 text-sm">
                <p><a className="link-gold" href={`mailto:${r.email}`}>{r.email}</a>{r.phone && <> · <a className="link-gold" href={`tel:${r.phone}`}>{r.phone}</a></>}{r.area && <> · {r.area}</>}</p>
                <p className="whitespace-pre-wrap">{r.message ?? r.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs uppercase tracking-widest">Status</label>
                  <select className={`${selectCls} !h-9 !w-48`} value={r.status ?? ""} onChange={(e) => update(r.id, { status: e.target.value })}>
                    {STATUSES[kind].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <Textarea placeholder="Follow-up notes…" defaultValue={r.notes ?? ""} onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
                <Button size="sm" variant="navy" onClick={() => update(r.id, { notes: notes[r.id] ?? r.notes ?? "" })}>Save notes</Button>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
