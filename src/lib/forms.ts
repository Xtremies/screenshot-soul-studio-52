import { z } from "zod";

const phone = z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Enter a valid phone number");

export const enquirySchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Please add a subject").max(150),
  area: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(3000),
  website: z.string().max(0).optional(), // honeypot
});

export const consultationSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: phone.min(7, "Enter a phone number"),
  method: z.enum(["In-person meeting", "Telephone consultation", "Video consultation"], { errorMap: () => ({ message: "Choose a consultation method" }) }),
  preferred_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date"),
  preferred_time: z.string().trim().min(1, "Choose a preferred time").max(20),
  area: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().min(10, "Please describe your enquiry (at least 10 characters)").max(3000),
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
