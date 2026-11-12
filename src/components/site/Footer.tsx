import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { servicesQuery } from "@/lib/queries";
import { Wordmark } from "./Header";

export function Footer() {
  const { data: services } = useQuery(servicesQuery());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <footer className="bg-navy-deep text-on-navy-muted">
      <div className="container-law grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Wordmark light />
          <p className="text-sm leading-relaxed">{SITE.tagline}</p>
          <div className="flex gap-4 text-sm">
            {SITE.social.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-gold">{s.label}</a>)}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5">Navigate</p>
          <ul className="space-y-3 text-sm">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-gold">{n.label}</Link></li>)}
            <li><Link to="/book-consultation" className="hover:text-gold">Book a Consultation</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Practice Areas</p>
          <ul className="space-y-3 text-sm">
            {(mounted ? services ?? [] : []).slice(0, 6).map((s) => (
              <li key={s.id}><Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-gold">{s.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5">Contact</p>
          <address className="space-y-3 text-sm not-italic">
            <p>{SITE.address.map((l) => <span key={l} className="block">{l}</span>)}</p>
            <p><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-gold">{SITE.phone}</a></p>
            <p><a href={`mailto:${SITE.email}`} className="hover:text-gold">{SITE.email}</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-on-navy/10">
        <div className="container-law space-y-4 py-8 text-xs">
          <p className="max-w-4xl leading-relaxed">
            Disclaimer: The content of this website is for general information only and does not constitute legal advice.
            Contacting the firm through this website does not create a lawyer-client relationship.
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold">Terms of Use</Link>
              <Link to="/auth" className="hover:text-gold">Staff sign-in</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
