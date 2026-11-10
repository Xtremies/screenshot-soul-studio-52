import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { NotFoundBlock, RouteError } from "@/components/site/Blocks";
import { Portrait } from "@/components/site/Cards";
import { lawyerQuery } from "@/lib/queries";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/team/$slug")({
  loader: async ({ context, params }) => {
    const l = await context.queryClient.ensureQueryData(lawyerQuery(params.slug));
    if (!l) throw notFound();
    return { name: l.name, title: l.title, bio: l.short_bio };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.name}, ${loaderData.title} | ${SITE.name}` : "Profile unavailable";
    return { meta: [{ title: t }, { name: "description", content: loaderData?.bio ?? "" }, { property: "og:title", content: t }, { property: "og:description", content: loaderData?.bio ?? "" }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary" }] };
  },
  errorComponent: RouteError,
  notFoundComponent: () => <NotFoundBlock what="profile" />,
  component: Profile,
});

function Row({ k, v }: { k: string; v: string[] | string }) {
  const items = Array.isArray(v) ? v : v ? [v] : [];
  if (!items.length) return null;
  return <div className="border-t border-border py-6"><p className="eyebrow">{k}</p><ul className="mt-3 space-y-1">{items.map((i) => <li key={i}>{i}</li>)}</ul></div>;
}

function Profile() {
  const { slug } = Route.useParams();
  const { data: l } = useSuspenseQuery(lawyerQuery(slug));
  if (!l) return <NotFoundBlock what="profile" />;
  return (
    <section className="container-law grid gap-16 py-24 lg:grid-cols-[380px_1fr]">
      <div className="lg:sticky lg:top-28 lg:self-start">
        <Portrait url={l.photo_url} name={l.name} className="aspect-[4/5] w-full" />
        <Button asChild variant="navy" size="xl" className="mt-6 w-full"><Link to="/book-consultation">Book a Consultation</Link></Button>
        {l.email && <a href={`mailto:${l.email}`} className="link-gold mt-4 inline-block text-sm">{l.email}</a>}
      </div>
      <div>
        <p className="eyebrow">{l.title}</p>
        <h1 className="mt-4 text-5xl md:text-6xl">{l.name}</h1>
        <div className="prose-law mt-10 text-muted-foreground">{l.bio.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="mt-10">
          <Row k="Qualifications" v={l.qualifications} />
          <Row k="Areas of practice" v={l.practice_areas} />
          <Row k="Experience" v={l.experience} />
          <Row k="Languages" v={l.languages} />
        </div>
      </div>
    </section>
  );
}
