import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .refine((val) => val.trim().length > 0, {
        message: "Name cannot be empty or only spaces",
      }),
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters")
      .refine((val) => val.trim().length > 0, {
        message: "Password cannot be empty or only spaces",
      }),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().trim().email("Invalid email address"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters")
      .refine((val) => val.trim().length > 0, {
        message: "Password cannot be empty or only spaces",
      }),
  })
  .strict();
