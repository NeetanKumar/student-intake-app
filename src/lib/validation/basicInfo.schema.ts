import { z } from "zod";

export const basicInfoSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+()\-.\s]+$/, "Enter a valid phone number"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine((val) => new Date(val) < new Date(), "Date of birth must be in the past"),
  mailingAddressLine1: z.string().trim().min(1, "Address is required").max(200),
  mailingAddressLine2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State/Province is required").max(100),
  postalCode: z.string().trim().min(1, "Postal code is required").max(20),
  country: z.string().trim().min(1, "Country is required").max(100),
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
