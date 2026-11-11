import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Blocks";
import { pageMeta, SITE } from "@/lib/site";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: pageMeta("Privacy Policy", `How ${SITE.name} collects and protects personal data.`) }),
  component: () => (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="container-law prose-law max-w-3xl py-20 text-muted-foreground">
        <p>[Draft — to be reviewed by the firm.] {SITE.name} respects your privacy and processes personal data in accordance with applicable law, including the Data Protection Act, 2012 (Act 843) of Ghana.</p>
        <p>We collect the information you provide through our enquiry and consultation forms — your name, contact details and a description of your matter — solely to respond to you and assess whether we can assist.</p>
        <p>Your information is stored securely, accessible only to authorised staff, and is not sold or shared with third parties except where required by law.</p>
        <p>You may request access to, correction of, or deletion of your personal data by contacting us at {SITE.email}.</p>
      </section>
    </>
  ),
});
