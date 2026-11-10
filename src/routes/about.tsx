import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { pageMeta, SITE } from "@/lib/site";
import office from "@/assets/firm-office.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("About the Firm", `Learn about ${SITE.name}: our story, mission, vision, values and approach to legal practice in Ghana.`) }),
  component: About,
});

const SECTIONS = [
  { k: "Our Story", t: "[To be supplied by the firm] The history and establishment of the firm will appear here once verified details are provided." },
  { k: "Our Mission", t: "To provide clear, principled and practical legal counsel that protects our clients' interests and helps them move forward with confidence." },
  { k: "Our Vision", t: "To be a trusted name in Ghanaian legal practice, recognised for integrity, insight and genuine commitment to the people we serve." },
  { k: "Our Approach", t: "We listen first. We then explain the law plainly, assess every option candidly and agree a clear plan, keeping you informed at each stage." },
  { k: "Our Commitment", t: "We are dedicated to practical legal solutions — advice that is not only correct in law, but workable in the real circumstances of each client." },
];
const VALUES = ["Integrity", "Professionalism", "Excellence", "Confidentiality", "Client commitment"];

function About() {
  return (
    <>
      <PageHero eyebrow="About the Firm" title="A practice built on trust, clarity and care." intro={`${SITE.name} advises individuals, businesses and institutions on matters governed by Ghanaian law.`} />
      <section className="container-law grid gap-16 py-28 lg:grid-cols-[1fr_1.2fr]">
        <img src={office} alt="Lawyers at work in the firm's office" width={1200} height={1408} loading="lazy" className="aspect-[4/5] w-full object-cover lg:sticky lg:top-28" />
        <div className="space-y-16">
          {SECTIONS.map((s) => (
            <div key={s.k}>
              <span className="gold-rule" />
              <h2 className="mt-6 text-4xl">{s.k}</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{s.t}</p>
            </div>
          ))}
          <div>
            <span className="gold-rule" />
            <h2 className="mt-6 text-4xl">Our Values</h2>
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {VALUES.map((v, i) => <li key={v} className="flex items-baseline gap-6 py-5"><span className="font-serif text-gold">0{i + 1}</span><span className="font-serif text-2xl text-primary">{v}</span></li>)}
            </ul>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
