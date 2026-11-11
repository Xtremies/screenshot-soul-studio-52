import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, selectCls } from "@/components/site/Field";
import { supabase } from "@/integrations/supabase/client";

export type FieldDef = { key: string; label: string; type: "text" | "textarea" | "list" | "bool" | "number" | "select" | "datetime"; options?: string[]; hint?: string };
type Table = "practice_areas" | "lawyers" | "articles";
type Row = Record<string, unknown> & { id: string };

const slugify = (s: string) => s.toLowerCase().replace(/\[|\]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function CrudTable({ table, fields, title, order, titleKey }: { table: Table; fields: FieldDef[]; title: string; order: string; titleKey: string }) {
  const qc = useQueryClient();
  const key = ["admin", table];
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order(order, { ascending: order === "sort_order" });
      if (error) throw error;
      return data as unknown as Row[];
    },
  });
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!editing) return;
    const row: Record<string, unknown> = { ...editing };
    if (!row[titleKey]) return toast.error(`${fields.find((f) => f.key === titleKey)?.label} is required`);
    if (!row.slug) row.slug = slugify(String(row[titleKey]));
    setSaving(true);
    const { id, created_at: _c, ...rest } = row as Row & { created_at?: string };
    const res = id ? await supabase.from(table).update(rest as never).eq("id", id) : await supabase.from(table).insert(rest as never);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null);
    qc.invalidateQueries();
  }
  async function remove(r: Row) {
    if (!confirm(`Delete "${String(r[titleKey])}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); qc.invalidateQueries();
  }
  async function togglePublished(r: Row) {
    const { error } = await supabase.from(table).update({ published: !r.published } as never).eq("id", r.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries();
  }

  const set = (k: string, v: unknown) => setEditing((e) => ({ ...e, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">{title}</h2>
        <Button variant="navy" onClick={() => setEditing({ published: table !== "articles" })}><Plus /> Add</Button>
      </div>
      {isLoading ? <p className="mt-8 text-muted-foreground">Loading…</p> : error ? <p className="mt-8 text-destructive">{(error as Error).message}</p> : !data?.length ? (
        <p className="mt-8 border border-dashed p-10 text-center text-muted-foreground">Nothing here yet.</p>
      ) : (
        <div className="mt-8 divide-y divide-border border bg-card">
          {data.map((r) => (
            <div key={r.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-primary">{String(r[titleKey])}</p>
                <p className="text-xs text-muted-foreground">/{String(r.slug)}</p>
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">{r.published ? "Published" : "Draft"}<Switch checked={!!r.published} onCheckedChange={() => togglePublished(r)} /></label>
              <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => setEditing(r)}><Pencil /></Button>
              <Button size="icon" variant="ghost" aria-label="Delete" onClick={() => remove(r)}><Trash2 /></Button>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle className="font-serif text-2xl">{editing?.id ? "Edit" : "Add"} {title.toLowerCase()}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-5">
              {fields.map((f) => {
                const v = editing[f.key];
                const label = f.hint ? `${f.label} — ${f.hint}` : f.label;
                if (f.type === "bool") return <label key={f.key} className="flex items-center justify-between text-sm">{f.label}<Switch checked={!!v} onCheckedChange={(c) => set(f.key, c)} /></label>;
                if (f.type === "textarea") return <Field key={f.key} id={f.key} label={label}><Textarea id={f.key} rows={6} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} /></Field>;
                if (f.type === "list") return <Field key={f.key} id={f.key} label={`${label} (one per line)`}><Textarea id={f.key} rows={4} value={((v as string[]) ?? []).join("\n")} onChange={(e) => set(f.key, e.target.value.split("\n"))} onBlur={(e) => set(f.key, e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} /></Field>;
                if (f.type === "select") return <Field key={f.key} id={f.key} label={label}><select id={f.key} className={selectCls} value={String(v ?? f.options?.[0] ?? "")} onChange={(e) => set(f.key, e.target.value)}>{f.options?.map((o) => <option key={o}>{o}</option>)}</select></Field>;
                if (f.type === "number") return <Field key={f.key} id={f.key} label={label}><Input id={f.key} type="number" value={String(v ?? 0)} onChange={(e) => set(f.key, Number(e.target.value))} /></Field>;
                if (f.type === "datetime") return <Field key={f.key} id={f.key} label={label}><Input id={f.key} type="date" value={v ? String(v).slice(0, 10) : ""} onChange={(e) => set(f.key, e.target.value ? new Date(e.target.value).toISOString() : null)} /></Field>;
                return <Field key={f.key} id={f.key} label={label}><Input id={f.key} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} /></Field>;
              })}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="navy" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
