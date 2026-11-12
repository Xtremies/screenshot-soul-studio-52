import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/Blocks";
import { Field, inputCls, selectCls } from "@/components/site/Field";
import { consultationSchema, type FormErrors } from "@/lib/forms";
import { submitConsultation } from "@/lib/forms.functions";
import { servicesQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/book-consultation")({
  head: () => ({ meta: pageMeta("Book a Consultation", "Request an in-person, telephone or video consultation with a lawyer at Lawtribe Legal Consult.") }),
  component: Book,
});

const METHODS = ["In-person meeting", "Telephone consultation", "Video consultation"];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

function Book() {
  const { data: services } = useQuery(servicesQuery());
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = consultationSchema.safeParse(raw);
    const errs: Record<string, string> = {};
    if (!parsed.success) parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
    if (raw["preferred_date"] && raw["preferred_date"] < today) errs["preferred_date"] = "Please choose a future date";
    if (!parsed.success || Object.keys(errs).length) { setErrors(errs as FormErrors); return; }
    setErrors({}); setState("sending");
    try { await submitConsultation({ data: parsed.data }); setState("done"); }
    catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Something went wrong."); }
  }

  return (
    <>
      <PageHero eyebrow="Consultation" title="Request a consultation." intro="Share your preferred time and we will confirm availability with you directly. Your appointment is confirmed only once our team contacts you." />
      <section className="container-law max-w-4xl py-24">
        {state === "done" ? (
          <div className="bg-card p-12 text-center" role="status">
            <CheckCircle2 className="mx-auto size-12 text-gold" strokeWidth={1.25} />
            <h2 className="mt-6 text-4xl">Your request has been received.</h2>
            <p className="mt-4 text-muted-foreground">This is not yet a confirmed appointment. We will contact you to confirm a date and time.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-8 bg-card p-8 md:p-12">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="full_name" label="Full name" error={errors.full_name}><Input id="full_name" name="full_name" className={inputCls} /></Field>
              <Field id="email" label="Email address" error={errors.email}><Input id="email" name="email" type="email" className={inputCls} /></Field>
              <Field id="phone" label="Phone number" error={errors.phone}><Input id="phone" name="phone" type="tel" placeholder="+233 …" className={inputCls} /></Field>
              <Field id="area" label="Area of legal assistance" optional>
                <select id="area" name="area" className={selectCls} defaultValue="">
                  <option value="">Select…</option>
                  {(services ?? []).map((s) => <option key={s.id}>{s.title}</option>)}
                  <option>Other / not sure</option>
                </select>
              </Field>
            </div>
            <fieldset>
              <legend className="text-xs uppercase tracking-widest text-primary">Preferred consultation method</legend>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {METHODS.map((m) => (
                  <label key={m} className="flex cursor-pointer items-center gap-3 border border-input p-4 text-sm has-[:checked]:border-gold has-[:checked]:bg-secondary">
                    <input type="radio" name="method" value={m} className="accent-gold" /> {m}
                  </label>
                ))}
              </div>
              {errors.method && <p className="mt-2 text-sm text-destructive" role="alert">{errors.method}</p>}
            </fieldset>
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="preferred_date" label="Preferred date" error={errors.preferred_date}><Input id="preferred_date" name="preferred_date" type="date" min={today} className={inputCls} /></Field>
              <Field id="preferred_time" label="Preferred time" error={errors.preferred_time}>
                <select id="preferred_time" name="preferred_time" className={selectCls} defaultValue="">
                  <option value="">Select…</option>{TIMES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
            </div>
            <Field id="description" label="Brief description of your enquiry" error={errors.description}><Textarea id="description" name="description" rows={5} className="bg-card" /></Field>
            {state === "error" && <p className="text-sm text-destructive" role="alert">{msg}</p>}
            <p className="text-xs leading-relaxed text-muted-foreground">Submitting this request does not create a lawyer-client relationship or guarantee an appointment.</p>
            <Button type="submit" variant="navy" size="xl" disabled={state === "sending"}>{state === "sending" && <Loader2 className="animate-spin" />} Request Consultation</Button>
          </form>
        )}
      </section>
    </>
  );
}
