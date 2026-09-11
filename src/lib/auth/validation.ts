import { z } from "zod";
import { isPublicRegistrationRole } from "@/lib/auth/roles";

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(10).max(128);

export const loginSchema = z.object({ email, password });

export const registrationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email,
  password: password
    .regex(/[A-Za-z]/, "letter")
    .regex(/[0-9]/, "number"),
  role: z.custom<"STUDENT" | "DEVELOPER">(isPublicRegistrationRole),
});
