import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CtaBand, NotFoundBlock, RouteError } from "@/components/site/Blocks";
import { ArticleCard } from "@/components/site/Cards";
import { articleQuery, articlesQuery } from "@/lib/queries";
import { formatDate, SITE } from "@/lib/site";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ context, params }) => {
    const a = await context.queryClient.ensureQueryData(articleQuery(params.slug));
    if (!a) throw notFound();
    await context.queryClient.ensureQueryData(articlesQuery());
    return { title: a.title, excerpt: a.excerpt, image: a.image_url };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} | ${SITE.name}` : "Article unavailable";
    const meta = [{ title: t }, { name: "description", content: loaderData?.excerpt ?? "" }, { property: "og:title", content: t }, { property: "og:description", content: loaderData?.excerpt ?? "" }, { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" }];
    if (loaderData?.image?.startsWith("https://")) meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    return { meta };
  },
  errorComponent: RouteError,
  notFoundComponent: () => <NotFoundBlock what="article" />,
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { data: a } = useSuspenseQuery(articleQuery(slug));
  const { data: all } = useSuspenseQuery(articlesQuery());
  if (!a) return <NotFoundBlock what="article" />;
  const related = all.filter((x) => x.id !== a.id && x.category === a.category).concat(all.filter((x) => x.id !== a.id && x.category !== a.category)).slice(0, 3);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const share = [
    { l: "LinkedIn", h: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { l: "X", h: `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.title)}` },
    { l: "WhatsApp", h: `https://wa.me/?text=${encodeURIComponent(a.title + " " + url)}` },
  ];
  return (
    <>
      <article className="container-law max-w-3xl py-24">
        <p className="eyebrow">{a.category}</p>
        <h1 className="mt-6 text-5xl leading-tight md:text-6xl">{a.title}</h1>
        <p className="mt-6 text-sm text-muted-foreground">By {a.author} · {formatDate(a.published_at)}</p>
        {a.image_url && <img src={a.image_url} alt="" className="mt-12 aspect-[16/9] w-full object-cover" />}
        <p className="mt-12 font-serif text-2xl leading-relaxed text-primary">{a.excerpt}</p>
        <div className="prose-law mt-8">{a.body.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-border pt-8 text-sm">
          <span className="eyebrow">Share</span>
          {share.map((s) => <a key={s.l} href={s.h} target="_blank" rel="noopener noreferrer" className="link-gold">{s.l}</a>)}
        </div>
        <p className="mt-10 bg-secondary p-6 text-xs leading-relaxed text-muted-foreground">
          This article is for general information only and does not constitute legal advice. It reflects the law at the date of publication.
        </p>
      </article>
      {related.length > 0 && (
        <section className="bg-card py-24"><div className="container-law">
          <p className="eyebrow">Related articles</p>
          <div className="mt-10 grid gap-12 md:grid-cols-3">{related.map((r) => <ArticleCard key={r.id} a={r} />)}</div>
        </div></section>
      )}
      <CtaBand />
    </>
  );
}
