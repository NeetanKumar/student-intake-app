import { z } from "zod";

export const employmentTypeEnum = z.enum([
  "FULL_TIME",
  "PART_TIME",
  "INTERNSHIP",
  "CO_OP",
]);

export const locationTypeEnum = z.enum([
  "ON_CAMPUS",
  "REMOTE",
  "HYBRID",
  "OFF_CAMPUS",
]);

export const workPreferencesSchema = z.object({
  workAreas: z
    .array(z.string().trim().min(1).max(150))
    .min(1, "Select at least one preferred work area"),
  employmentType: employmentTypeEnum,
  locationType: locationTypeEnum,
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type WorkPreferencesInput = z.infer<typeof workPreferencesSchema>;
