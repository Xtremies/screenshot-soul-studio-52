import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudTable, type FieldDef } from "@/components/admin/CrudTable";
import { Inbox } from "@/components/admin/Inbox";
import { ICON_NAMES } from "@/components/site/Icon";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES } from "@/lib/site";

const TABS = ["dashboard", "enquiries", "consultations", "lawyers", "services", "articles"] as const;
type Tab = (typeof TABS)[number];

export const Route = createFileRoute("/_authenticated/admin")({
  validateSearch: z.object({ tab: z.enum(TABS).optional() }),
  head: () => ({ meta: [{ title: "Admin | Lawtribe Legal Consult" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const SERVICE_FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text" }, { key: "slug", label: "Web address", type: "text", hint: "leave blank to generate" },
  { key: "icon", label: "Icon", type: "select", options: ICON_NAMES }, { key: "summary", label: "Short summary", type: "textarea" },
  { key: "intro", label: "Introduction", type: "textarea" }, { key: "matters", label: "Matters covered", type: "list" },
  { key: "situations", label: "Common situations", type: "list" }, { key: "approach", label: "Our approach", type: "textarea" },
  { key: "sort_order", label: "Display order", type: "number" }, { key: "published", label: "Published", type: "bool" },
];
const LAWYER_FIELDS: FieldDef[] = [
  { key: "name", label: "Full name", type: "text" }, { key: "slug", label: "Web address", type: "text", hint: "leave blank to generate" },
  { key: "title", label: "Professional title", type: "text" }, { key: "photo_url", label: "Photo link", type: "text", hint: "https:// image address" },
  { key: "qualifications", label: "Qualifications", type: "list" }, { key: "practice_areas", label: "Practice areas", type: "list" },
  { key: "short_bio", label: "Short biography", type: "textarea" }, { key: "bio", label: "Full biography", type: "textarea" },
  { key: "experience", label: "Experience", type: "textarea" }, { key: "languages", label: "Languages", type: "list" },
  { key: "email", label: "Email", type: "text" }, { key: "sort_order", label: "Display order", type: "number" },
  { key: "published", label: "Published", type: "bool" },
];
const ARTICLE_FIELDS: FieldDef[] = [
  { key: "title", label: "Headline", type: "text" }, { key: "slug", label: "Web address", type: "text", hint: "leave blank to generate" },
  { key: "category", label: "Category", type: "select", options: CATEGORIES }, { key: "author", label: "Author", type: "text" },
  { key: "image_url", label: "Featured image link", type: "text", hint: "https:// image address" },
  { key: "excerpt", label: "Short introduction", type: "textarea" }, { key: "body", label: "Article text (blank line between paragraphs)", type: "textarea" },
  { key: "published_at", label: "Publication date", type: "datetime" }, { key: "featured", label: "Featured", type: "bool" },
  { key: "published", label: "Published (off = draft)", type: "bool" },
];

function Admin() {
  const { tab = "dashboard" } = Route.useSearch();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user!.id).eq("role", "admin");
      return !!data?.length;
    },
  });
  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }
  if (isLoading) return <p className="p-10 text-muted-foreground">Loading…</p>;
  if (!isAdmin) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl">Access pending</h1>
      <p className="max-w-md text-muted-foreground">Your account is signed in but does not have administrator access. Ask an existing administrator to grant it.</p>
      <Button variant="navy" onClick={signOut}>Sign out</Button>
    </div>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-sidebar p-6 text-sidebar-foreground">
        <Link to="/" className="font-serif text-2xl">Lawtribe</Link>
        <p className="eyebrow mt-1">Admin</p>
        <nav className="mt-10 flex flex-wrap gap-1 lg:flex-col">
          {TABS.map((t) => (
            <Link key={t} to="/admin" search={{ tab: t }} className={`px-3 py-2 text-sm capitalize ${tab === t ? "bg-sidebar-accent text-gold" : "text-on-navy-muted hover:text-on-navy"}`}>{t}</Link>
          ))}
        </nav>
        <button onClick={signOut} className="mt-10 flex items-center gap-2 text-sm text-on-navy-muted hover:text-gold"><LogOut className="size-4" /> Sign out</button>
      </aside>
      <section className="p-6 md:p-10">
        {tab === "dashboard" && <Dashboard />}
        {tab === "enquiries" && <Inbox kind="enquiries" />}
        {tab === "consultations" && <Inbox kind="consultations" />}
        {tab === "lawyers" && <CrudTable table="lawyers" title="Lawyers" fields={LAWYER_FIELDS} order="sort_order" titleKey="name" />}
        {tab === "services" && <CrudTable table="practice_areas" title="Practice areas" fields={SERVICE_FIELDS} order="sort_order" titleKey="title" />}
        {tab === "articles" && <CrudTable table="articles" title="Articles" fields={ARTICLE_FIELDS} order="published_at" titleKey="title" />}
      </section>
    </div>
  );
}

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const c = (t: "enquiries" | "consultations" | "lawyers" | "practice_areas" | "articles", f?: [string, string]) => {
        let q = supabase.from(t).select("id", { count: "exact", head: true });
        if (f) q = q.eq(f[0], f[1]);
        return q.then((r) => r.count ?? 0);
      };
      const [ne, pc, l, s, a, recent] = await Promise.all([
        c("enquiries", ["status", "new"]), c("consultations", ["status", "pending"]), c("lawyers"), c("practice_areas"), c("articles"),
        supabase.from("articles").select("id,title,published").order("created_at", { ascending: false }).limit(5).then((r) => r.data ?? []),
      ]);
      return { ne, pc, l, s, a, recent };
    },
  });
  const stats = [
    { k: "New enquiries", v: data?.ne, tab: "enquiries" }, { k: "Pending consultations", v: data?.pc, tab: "consultations" },
    { k: "Lawyers", v: data?.l, tab: "lawyers" }, { k: "Practice areas", v: data?.s, tab: "services" }, { k: "Articles", v: data?.a, tab: "articles" },
  ] as const;
  return (
    <div>
      <h1 className="text-4xl">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.k} to="/admin" search={{ tab: s.tab as Tab }} className="border bg-card p-6 hover:border-gold">
            <p className="font-serif text-5xl text-primary">{s.v ?? "–"}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.k}</p>
          </Link>
        ))}
      </div>
      <h2 className="mt-12 text-2xl">Recent articles</h2>
      <ul className="mt-4 divide-y border bg-card">
        {data?.recent.map((r) => <li key={r.id} className="flex justify-between p-4 text-sm"><span>{r.title}</span><span className="text-muted-foreground">{r.published ? "Published" : "Draft"}</span></li>)}
      </ul>
    </div>
  );
}
