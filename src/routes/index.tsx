import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, ShieldCheck, Target, Compass, Search, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, Empty, RouteError, SectionHead } from "@/components/site/Blocks";
import { AreaIcon } from "@/components/site/Icon";
import { articlesQuery, lawyersQuery, servicesQuery } from "@/lib/queries";
import { pageMeta, SITE } from "@/lib/site";
import { ArticleCard, Portrait } from "@/components/site/Cards";
import hero from "@/assets/hero-library.jpg";
import office from "@/assets/firm-office.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta("Law Firm in Ghana — Trusted Legal Counsel", "Lawtribe Legal Consult provides strategic legal counsel, trusted representation and practical solutions for individuals, businesses and institutions across Ghana."),
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "LegalService", name: SITE.name, address: { "@type": "PostalAddress", streetAddress: "5th Floor, 20 Old Bailey", addressLocality: "London", postalCode: "EC4M 7AN", addressCountry: "GB" }, areaServed: "Ghana" }) }],
  }),
  loader: ({ context: { queryClient: q } }) =>
    Promise.all([q.ensureQueryData(servicesQuery()), q.ensureQueryData(lawyersQuery()), q.ensureQueryData(articlesQuery())]),
  errorComponent: RouteError,
  component: Home,
});

const QUALITIES = [
  { icon: UserCheck, title: "Client-focused representation", text: "Your objectives shape every strategy we recommend." },
  { icon: ShieldCheck, title: "Integrity and confidentiality", text: "Every matter is handled with discretion and the highest professional standards." },
  { icon: Compass, title: "Strategic legal thinking", text: "We look beyond the immediate issue to protect your long-term position." },
  { icon: Search, title: "Attention to detail", text: "Careful research and precise drafting underpin our work." },
  { icon: Target, title: "Practical solutions", text: "Clear, workable advice you can act on with confidence." },
  { icon: Sparkles, title: "Commitment to excellence", text: "We hold ourselves to the standards our clients deserve." },
];

function Home() {
  const { data: services } = useSuspenseQuery(servicesQuery());
  const { data: lawyers } = useSuspenseQuery(lawyersQuery());
  const { data: articles } = useSuspenseQuery(articlesQuery());
  return (
    <>
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <img src={hero} alt="A traditional law library with brass reading lamps" width={1920} height={1088} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="hero-overlay absolute inset-0 -z-10" />
        <div className="container-law flex min-h-[88vh] flex-col justify-center py-24">
          <p className="eyebrow">{SITE.name}</p>
          <h1 className="mt-8 max-w-4xl text-5xl leading-[1.04] !text-on-navy md:text-7xl lg:text-[5.25rem]">
            Committed to Protecting Your Interests. <em className="text-gold">Dedicated to Delivering Legal Excellence.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-on-navy-muted">
            Providing strategic legal counsel, trusted representation, and practical solutions for individuals, businesses, and institutions across Ghana.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Button asChild variant="gold" size="xl"><Link to="/services">Explore Our Services</Link></Button>
            <Button asChild variant="ghostLight" size="xl"><Link to="/contact">Speak With a Lawyer</Link></Button>
          </div>
        </div>
      </section>

      <section className="container-law grid items-center gap-16 py-28 lg:grid-cols-2">
        <img src={office} alt="Two lawyers reviewing documents together" width={1200} height={1408} loading="lazy" className="aspect-[4/5] w-full object-cover" />
        <div>
          <SectionHead eyebrow="The Firm" title="Legal Expertise. Personal Commitment. Trusted Counsel.">
            <p>{SITE.name} advises individuals, businesses and institutions on matters governed by Ghanaian law. We believe effective legal counsel begins with listening carefully and understanding what matters most to each client.</p>
            <p className="mt-4">Our approach is measured and thorough: we explain the law clearly, assess options candidly and pursue outcomes that are both principled and practical.</p>
          </SectionHead>
          <Link to="/about" className="link-gold mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">About the firm <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section className="bg-card py-28">
        <div className="container-law">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Practice Areas" title="Counsel across the matters that shape your life and business." />
            <Button asChild variant="outlineNavy" size="lg"><Link to="/services">All services</Link></Button>
          </div>
          {services.length === 0 ? <div className="mt-14"><Empty>Practice areas will be published soon.</Empty></div> : (
            <div className="mt-16 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="group border-b border-r border-border p-10 transition-colors hover:bg-navy-deep">
                  <AreaIcon name={s.icon} className="size-9 text-gold" />
                  <h3 className="mt-8 text-2xl group-hover:text-on-navy">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground group-hover:text-on-navy-muted">{s.summary}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">Learn more <ArrowRight className="size-3" /></span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-navy-deep py-28">
        <div className="container-law">
          <p className="eyebrow">Why Choose Us</p>
          <h2 className="mt-4 max-w-3xl text-4xl !text-on-navy md:text-5xl">The qualities that define how we serve our clients.</h2>
          <div className="mt-16 grid gap-px bg-on-navy/10 sm:grid-cols-2 lg:grid-cols-3">
            {QUALITIES.map((q, i) => (
              <div key={q.title} className="bg-navy-deep p-10">
                <span className="font-serif text-lg text-gold">0{i + 1}</span>
                <q.icon className="mt-6 size-6 text-gold" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="mt-5 text-2xl !text-on-navy">{q.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-navy-muted">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-law py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Our People" title="Meet our legal team." />
          <Button asChild variant="outlineNavy" size="lg"><Link to="/team">Full team</Link></Button>
        </div>
        <div className="mt-16 divide-y divide-border border-y border-border">
          {lawyers.slice(0, 3).map((l) => (
            <Link key={l.id} to="/team/$slug" params={{ slug: l.slug }} className="group grid items-center gap-8 py-10 md:grid-cols-[140px_1fr_auto]">
              <Portrait url={l.photo_url} name={l.name} className="size-32" />
              <div>
                <p className="eyebrow">{l.title}</p>
                <h3 className="mt-2 text-3xl group-hover:text-gold">{l.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.qualifications.join(" · ")}</p>
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{l.practice_areas.join(", ")}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">View profile <ArrowRight className="size-3" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-card py-28">
        <div className="container-law">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow="Insights" title="Legal insights and publications." />
            <Button asChild variant="outlineNavy" size="lg"><Link to="/insights">All insights</Link></Button>
          </div>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {articles.slice(0, 3).map((a) => <ArticleCard key={a.id} a={a} />)}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}

