import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, inputCls } from "@/components/site/Field";
import { Wordmark } from "@/components/site/Header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Staff sign-in | Lawtribe Legal Consult" }, { name: "robots", content: "noindex" }, { name: "description", content: "Staff sign-in." }, { property: "og:title", content: "Staff sign-in" }, { property: "og:description", content: "Staff sign-in." }] }),
  component: Auth,
});

function Auth() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: "err" | "ok"; m: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")), password = String(f.get("password"));
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return void setMsg({ t: "err", m: error.message });
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setBusy(false);
      if (error) return void setMsg({ t: "err", m: error.message });
      setMsg({ t: "ok", m: "Check your email to confirm your account, then sign in." });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-deep px-4">
      <div className="w-full max-w-md bg-card p-10">
        <div className="[&_span:first-child]:!text-primary"><Wordmark /></div>
        <h1 className="mt-8 text-4xl">{mode === "in" ? "Staff sign-in" : "Create staff account"}</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field id="email" label="Email"><Input id="email" name="email" type="email" required className={inputCls} /></Field>
          <Field id="password" label="Password"><Input id="password" name="password" type="password" minLength={8} required className={inputCls} /></Field>
          {msg && <p className={`text-sm ${msg.t === "err" ? "text-destructive" : "text-primary"}`} role="alert">{msg.m}</p>}
          <Button type="submit" variant="navy" size="xl" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}{mode === "in" ? "Sign in" : "Create account"}</Button>
        </form>
        <button className="mt-6 text-sm text-muted-foreground hover:text-primary" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "No account yet? Create one" : "Already have an account? Sign in"}
        </button>
        <p className="mt-6 text-xs text-muted-foreground">The first account created becomes the administrator. Other accounts need an administrator to grant access.</p>
        <Link to="/" className="mt-6 block text-sm link-gold w-fit">← Back to website</Link>
      </div>
    </div>
  );
}
