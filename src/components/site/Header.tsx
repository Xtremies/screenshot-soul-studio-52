import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV, SITE } from "@/lib/site";

export function Wordmark({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-baseline gap-2" aria-label={`${SITE.name} home`}>
      <span className={`font-serif text-2xl tracking-wide ${light ? "text-on-navy" : "text-primary"}`}>Lawtribe</span>
      <span className="eyebrow !text-[0.6rem]">Legal Consult</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-on-navy/10 bg-navy-deep/95 backdrop-blur">
      <div className="container-law flex h-20 items-center justify-between">
        <Wordmark light />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-on-navy-muted transition-colors hover:text-gold data-[status=active]:text-gold">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button asChild variant="gold" size="lg"><Link to="/book-consultation">Book a Consultation</Link></Button>
        </div>
        <button className="text-on-navy lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-on-navy/10 bg-navy-deep lg:hidden" aria-label="Mobile">
          <div className="container-law flex flex-col gap-1 py-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-3 font-serif text-xl text-on-navy">{n.label}</Link>
            ))}
            <Button asChild variant="gold" size="xl" className="mt-4"><Link to="/book-consultation" onClick={() => setOpen(false)}>Book a Consultation</Link></Button>
          </div>
        </nav>
      )}
    </header>
  );
}
