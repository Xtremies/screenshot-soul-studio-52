import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CtaBand, Empty, PageHero, RouteError } from "@/components/site/Blocks";
import { Portrait } from "@/components/site/Cards";
import { lawyersQuery } from "@/lib/queries";
import { pageMeta } from "@/lib/site";

export const Route = createFileRoute("/team/")({
  head: () => ({ meta: pageMeta("Our Legal Team", "Meet the lawyers of Lawtribe Legal Consult — experienced counsel across corporate, property, litigation and family law in Ghana.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(lawyersQuery()),
  errorComponent: RouteError,
  component: Team,
});

function Team() {
  const { data } = useSuspenseQuery(lawyersQuery());
  return (
    <>
      <PageHero eyebrow="Our Team" title="The people behind our counsel." />
      <section className="container-law py-24">
        {data.length === 0 ? <Empty>Lawyer profiles will be published soon.</Empty> : (
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((l) => (
              <Link key={l.id} to="/team/$slug" params={{ slug: l.slug }} className="group">
                <Portrait url={l.photo_url} name={l.name} className="aspect-[4/5] w-full" />
                <p className="eyebrow mt-6">{l.title}</p>
                <h2 className="mt-2 text-3xl group-hover:text-gold">{l.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{l.qualifications.join(" · ")}</p>
                <p className="mt-3 text-sm text-muted-foreground">{l.short_bio}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
      <CtaBand />
    </>
  );
}
