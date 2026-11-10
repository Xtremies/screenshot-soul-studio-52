import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/site";

export function Portrait({ url, name, className }: { url: string | null; name: string; className?: string }) {
  if (url) return <img src={url} alt={`Portrait of ${name}`} loading="lazy" className={`object-cover ${className}`} />;
  const initials = name.replace(/\[.*?\]/g, "").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return <div className={`flex items-center justify-center bg-navy-deep font-serif text-3xl text-gold ${className}`} aria-hidden="true">{initials}</div>;
}

type A = { id: string; slug: string; title: string; category: string; excerpt: string; image_url: string | null; published_at: string };
export function ArticleCard({ a }: { a: A }) {
  return (
    <Link to="/insights/$slug" params={{ slug: a.slug }} className="group block">
      <div className="aspect-[3/2] overflow-hidden bg-navy-deep">
        {a.image_url ? <img src={a.image_url} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          : <div className="flex h-full items-end p-6"><span className="font-serif text-2xl text-gold/70">{a.category}</span></div>}
      </div>
      <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground"><span className="text-gold">{a.category}</span> · {formatDate(a.published_at)}</p>
      <h3 className="mt-3 text-2xl leading-snug group-hover:text-gold">{a.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.excerpt}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">Read article <ArrowRight className="size-3" /></span>
    </Link>
  );
}
