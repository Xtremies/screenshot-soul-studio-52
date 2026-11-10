import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CtaBand, NotFoundBlock, PageHero, RouteError } from "@/components/site/Blocks";
import { serviceQuery, servicesQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ context, params }) => {
    const s = await context.queryClient.ensureQueryData(serviceQuery(params.slug));
    if (!s) throw notFound();
    await context.queryClient.ensureQueryData(servicesQuery());
    return { title: s.title, summary: s.summary };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} in Ghana | ${SITE.name}` : "Practice area unavailable";
    const d = loaderData?.summary ?? "";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  errorComponent: RouteError,
  notFoundComponent: () => <NotFoundBlock what="practice area" />,
  component: Service,
});

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-3xl">{title}</h2>
      <ul className="mt-6 space-y-4">
        {items.map((m) => <li key={m} className="flex gap-4"><Check className="mt-1 size-4 shrink-0 text-gold" /><span>{m}</span></li>)}
      </ul>
    </div>
  );
}

function Service() {
  const { slug } = Route.useParams();
  const { data: s } = useSuspenseQuery(serviceQuery(slug));
  const { data: all } = useSuspenseQuery(servicesQuery());
  if (!s) return <NotFoundBlock what="practice area" />;
  const related = all.filter((x) => x.id !== s.id).slice(0, 3);
  return (
    <>
      <PageHero eyebrow="Practice Area" title={s.title} intro={s.intro || s.summary} />
      <section className="container-law grid gap-16 py-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-16">
          <List title="Matters we handle" items={s.matters} />
          <List title="When clients come to us" items={s.situations} />
          {s.approach && <div><h2 className="text-3xl">Our approach</h2><p className="mt-6 text-lg leading-relaxed text-muted-foreground">{s.approach}</p></div>}
        </div>
        <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          <div className="bg-navy-deep p-8">
            <p className="eyebrow">Speak with us</p>
            <p className="mt-4 font-serif text-2xl text-on-navy">Discuss your {s.title.toLowerCase()} matter.</p>
            <Button asChild variant="gold" size="xl" className="mt-6 w-full"><Link to="/book-consultation">Request a Consultation</Link></Button>
          </div>
          {related.length > 0 && (
            <div>
              <p className="eyebrow">Related services</p>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {related.map((r) => <li key={r.id}><Link to="/services/$slug" params={{ slug: r.slug }} className="block py-4 font-serif text-xl text-primary hover:text-gold">{r.title}</Link></li>)}
              </ul>
            </div>
          )}
        </aside>
      </section>
      <CtaBand />
    </>
  );
}
