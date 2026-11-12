import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (i, init) => { const h = new Headers(init?.headers); h.delete("Authorization"); h.set("apikey", process.env["SUPABASE_PUBLISHABLE_KEY"]!); return fetch(i, { ...init, headers: h }); } } });
        const [s, l, a] = await Promise.all([
          sb.from("practice_areas").select("slug").eq("published", true),
          sb.from("lawyers").select("slug").eq("published", true),
          sb.from("articles").select("slug").eq("published", true),
        ]);
        const paths = ["/", "/about", "/services", "/team", "/insights", "/contact", "/book-consultation", "/privacy", "/terms",
          ...(s.data ?? []).map((x) => `/services/${x.slug}`), ...(l.data ?? []).map((x) => `/team/${x.slug}`), ...(a.data ?? []).map((x) => `/insights/${x.slug}`)];
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((p) => `<url><loc>${origin}${p}</loc></url>`).join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
