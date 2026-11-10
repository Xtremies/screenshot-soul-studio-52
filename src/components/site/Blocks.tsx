import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="bg-navy-deep">
      <div className="container-law py-24 md:py-32">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-5xl leading-[1.05] !text-on-navy md:text-7xl">{title}</h1>
        {intro && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-on-navy-muted">{intro}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, center }: { eyebrow: string; title: string; children?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl leading-tight md:text-5xl">{title}</h2>
      {children && <div className="mt-5 text-muted-foreground leading-relaxed">{children}</div>}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="bg-navy">
      <div className="container-law flex flex-col items-start justify-between gap-10 py-20 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow">Consultation</p>
          <h2 className="mt-4 text-4xl !text-on-navy md:text-5xl">Facing a Legal Challenge? Let's Discuss Your Options.</h2>
          <p className="mt-5 text-on-navy-muted">Our team is available to discuss your legal concerns and help you understand the appropriate next steps.</p>
        </div>
        <Button asChild variant="gold" size="xl"><Link to="/book-consultation">Request a Consultation</Link></Button>
      </div>
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="border border-dashed border-border p-10 text-center text-muted-foreground">{children}</p>;
}

export function RouteError({ error }: { error: unknown }) {
  return (
    <div className="container-law py-32 text-center" role="alert">
      <h1 className="text-4xl">This page could not load</h1>
      <p className="mt-4 text-muted-foreground">{error instanceof Error ? error.message : "Please try again shortly."}</p>
    </div>
  );
}

export function NotFoundBlock({ what }: { what: string }) {
  return (
    <div className="container-law py-32 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="mt-4 text-5xl">This {what} is not available</h1>
      <Button asChild variant="navy" size="xl" className="mt-8"><Link to="/">Return home</Link></Button>
    </div>
  );
}
