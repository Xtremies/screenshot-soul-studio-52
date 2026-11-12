import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Mail, MapPin, Phone, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/Blocks";
import { Field, inputCls, selectCls } from "@/components/site/Field";
import { enquirySchema, type FormErrors } from "@/lib/forms";
import { submitEnquiry } from "@/lib/forms.functions";
import { servicesQuery } from "@/lib/queries";
import { pageMeta, SITE } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact Us", `Contact ${SITE.name}. Send an enquiry, call or visit our office.`) }),
  component: Contact,
});

function Contact() {
  const { data: services } = useQuery(servicesQuery());
  const [errors, setErrors] = useState<FormErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = enquirySchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs as FormErrors); return;
    }
    setErrors({}); setState("sending");
    try { await submitEnquiry({ data: parsed.data }); setState("done"); }
    catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Something went wrong."); }
  }

  const info = [
    { icon: MapPin, k: "Office", v: SITE.address.join(", ") },
    { icon: Phone, k: "Telephone", v: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}` },
    { icon: Mail, k: "Email", v: SITE.email, href: `mailto:${SITE.email}` },
    { icon: Clock, k: "Opening hours", v: SITE.hours.join(" · ") },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Speak with our team." intro="Tell us briefly about your matter and a member of our team will respond." />
      <section className="container-law grid gap-16 py-24 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          {info.map((i) => (
            <div key={i.k} className="flex gap-5 border-b border-border pb-8">
              <i.icon className="mt-1 size-5 shrink-0 text-gold" strokeWidth={1.25} />
              <div><p className="eyebrow">{i.k}</p>{i.href ? <a href={i.href} className="mt-2 block text-lg hover:text-gold">{i.v}</a> : <p className="mt-2 text-lg">{i.v}</p>}</div>
            </div>
          ))}
          <iframe title="Office location map" className="aspect-[4/3] w-full border border-border" loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`} />
        </div>
        <div className="bg-card p-8 md:p-12">
          {state === "done" ? (
            <div className="py-16 text-center" role="status">
              <CheckCircle2 className="mx-auto size-12 text-gold" strokeWidth={1.25} />
              <h2 className="mt-6 text-4xl">Thank you. Your enquiry has been received.</h2>
              <p className="mt-4 text-muted-foreground">A member of our team will review it and be in touch.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <h2 className="text-3xl">Send an enquiry</h2>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <div className="grid gap-6 md:grid-cols-2">
                <Field id="full_name" label="Full name" error={errors.full_name}><Input id="full_name" name="full_name" className={inputCls} aria-invalid={!!errors.full_name} /></Field>
                <Field id="email" label="Email address" error={errors.email}><Input id="email" name="email" type="email" className={inputCls} aria-invalid={!!errors.email} /></Field>
                <Field id="phone" label="Phone number" optional error={errors.phone}><Input id="phone" name="phone" type="tel" placeholder="+233 …" className={inputCls} /></Field>
                <Field id="area" label="Area of legal assistance" optional>
                  <select id="area" name="area" className={selectCls} defaultValue="">
                    <option value="">Select…</option>
                    {(services ?? []).map((s) => <option key={s.id}>{s.title}</option>)}
                    <option>Other / not sure</option>
                  </select>
                </Field>
              </div>
              <Field id="subject" label="Subject" error={errors.subject}><Input id="subject" name="subject" className={inputCls} aria-invalid={!!errors.subject} /></Field>
              <Field id="message" label="Message" error={errors.message}><Textarea id="message" name="message" rows={6} className="bg-card" aria-invalid={!!errors.message} /></Field>
              {state === "error" && <p className="text-sm text-destructive" role="alert">{msg}</p>}
              <p className="text-xs leading-relaxed text-muted-foreground">Confidentiality notice: please do not include highly sensitive details. Submitting an enquiry does not automatically establish a lawyer-client relationship. We handle your information in line with our Privacy Policy.</p>
              <Button type="submit" variant="navy" size="xl" disabled={state === "sending"}>
                {state === "sending" && <Loader2 className="animate-spin" />} Send Enquiry
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
