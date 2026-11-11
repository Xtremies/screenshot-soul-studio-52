import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";
import { pageMeta, SITE } from "@/lib/site";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms of Use", `Terms governing use of the ${SITE.name} website.`) }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Terms of Use" />
      <section className="container-law prose-law max-w-3xl py-20 text-muted-foreground">
        <p>[Draft — to be reviewed by the firm.] The content on this website is provided for general information only and does not constitute legal advice.</p>
        <p>Use of this website, or communication with the firm through it, does not create a lawyer-client relationship. Such a relationship is established only by written engagement.</p>
        <p>While we aim to keep content accurate and current, the law changes and we make no warranty as to completeness. You should obtain specific advice before acting on any information.</p>
        <p>All content is the property of {SITE.name} unless otherwise stated.</p>
      </section>
    </>
  ),
});
