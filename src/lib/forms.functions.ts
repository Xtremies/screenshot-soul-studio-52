import { createServerFn } from "@tanstack/react-start";
import { consultationSchema, enquirySchema } from "./forms";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }; // bot
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
      full_name: data.full_name, email: data.email, phone: data.phone || null,
      subject: data.subject, area: data.area || null, message: data.message,
    });
    if (error) throw new Error("We could not save your enquiry. Please try again.");
    return { ok: true };
  });

export const submitConsultation = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => consultationSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("consultations").insert({
      full_name: data.full_name, email: data.email, phone: data.phone, method: data.method,
      preferred_date: data.preferred_date, preferred_time: data.preferred_time,
      area: data.area || null, description: data.description,
    });
    if (error) throw new Error("We could not save your request. Please try again.");
    return { ok: true };
  });
