import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s().-]*$/, "Please enter a valid phone number.")
    .optional()
    .default(""),
  program: z.string().trim().max(120).optional().default(""),
  branch: z.string().trim().max(120).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail.")
    .max(3000),
  consent: z.literal(true, {
    message: "Please agree to be contacted about your inquiry.",
  }),
  website: z.string().max(200).optional().default(""),
  turnstileToken: z.string().max(2048).optional().default(""),
});

export type Inquiry = z.infer<typeof inquirySchema>;
