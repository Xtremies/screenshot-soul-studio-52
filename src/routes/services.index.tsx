import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { CtaBand, Empty, PageHero, RouteError } from "@/components/site/Blocks";
import { AreaIcon } from "@/components/site/Icon";
import { servicesQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: pageMeta("Legal Services & Practice Areas", "Corporate, litigation, property, family, employment and dispute resolution legal services in Ghana.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery()),
  errorComponent: RouteError,
  component: Services,
});

function Services() {
  const { data } = useSuspenseQuery(servicesQuery());
  return (
    <>
      <PageHero eyebrow="Our Services" title="Practice areas." intro="Focused legal counsel across the areas where our clients need it most." />
      <section className="container-law py-24">
        {data.length === 0 ? <Empty>No practice areas are published yet.</Empty> : (
          <div className="divide-y divide-border border-y border-border">
            {data.map((s, i) => (
              <Link key={s.id} to="/services/$slug" params={{ slug: s.slug }} className="group grid items-start gap-6 py-12 md:grid-cols-[80px_60px_1fr_auto]">
                <span className="font-serif text-xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                <AreaIcon name={s.icon} className="size-9 text-gold" />
                <div>
                  <h2 className="text-3xl group-hover:text-gold md:text-4xl">{s.title}</h2>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{s.summary}</p>
                </div>
                <ArrowRight className="mt-3 size-5 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
