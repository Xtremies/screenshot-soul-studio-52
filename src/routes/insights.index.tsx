import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Empty, PageHero, RouteError } from "@/components/site/Blocks";
import { ArticleCard } from "@/components/site/Cards";
import { articlesQuery } from "@/lib/queries";
import { CATEGORIES, pageMeta } from "@/lib/site";

const search = z.object({ q: z.string().optional(), c: z.string().optional() });

export const Route = createFileRoute("/insights/")({
  validateSearch: search,
  head: () => ({ meta: pageMeta("Legal Insights & Publications", "Articles and updates on Ghanaian law: corporate, property, employment, litigation and legislation.") }),
  loader: ({ context }) => context.queryClient.ensureQueryData(articlesQuery()),
  errorComponent: RouteError,
  component: Insights,
});

function Insights() {
  const { q = "", c } = Route.useSearch();
  const nav = useNavigate({ from: "/insights/" });
  const { data } = useSuspenseQuery(articlesQuery());
  const term = q.toLowerCase();
  const list = data.filter((a) => (!c || a.category === c) && (!term || (a.title + a.excerpt + a.body).toLowerCase().includes(term)));
  const featured = !q && !c ? data.find((a) => a.featured) : undefined;
  const rest = featured ? list.filter((a) => a.id !== featured.id) : list;
  return (
    <>
      <PageHero eyebrow="Insights" title="Legal insights & publications." intro="Commentary on legal developments affecting individuals and businesses in Ghana." />
      <section className="container-law py-20">
        <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[undefined, ...CATEGORIES].map((cat) => (
              <button key={cat ?? "all"} onClick={() => nav({ search: (p) => ({ ...p, c: cat }) })}
                className={`border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${c === cat ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-gold"}`}>
                {cat ?? "All"}
              </button>
            ))}
          </div>
          <Input aria-label="Search articles" placeholder="Search articles…" defaultValue={q} className="h-11 lg:w-72"
            onChange={(e) => nav({ search: (p) => ({ ...p, q: e.target.value || undefined }), replace: true })} />
        </div>
        {featured && (
          <div className="mt-16 grid gap-10 border-b border-border pb-16 lg:grid-cols-2">
            <ArticleCard a={featured} />
            <p className="eyebrow self-start">Featured</p>
          </div>
        )}
        <div className="mt-16">
          {rest.length === 0 ? <Empty>No articles match your search.</Empty> : (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">{rest.map((a) => <ArticleCard key={a.id} a={a} />)}</div>
          )}
        </div>
        <p className="mt-20 border-t border-border pt-8 text-xs leading-relaxed text-muted-foreground">
          Published materials are for general informational purposes only and do not constitute legal advice. Please seek advice on your specific circumstances.
        </p>
      </section>
    </>
  );
}
