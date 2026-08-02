import { z } from "zod";

export const degreeLevelEnum = z.enum([
  "ASSOCIATE",
  "BACHELORS",
  "MASTERS",
  "DOCTORATE",
  "CERTIFICATE",
]);

export const academicInterestsSchema = z.object({
  degreeLevel: degreeLevelEnum,
  major: z.string().trim().min(1, "Major is required").max(150),
  minor: z.string().trim().max(150).optional().or(z.literal("")),
  courses: z
    .array(z.string().trim().min(1).max(150))
    .min(1, "Add at least one course of interest"),
});

export type AcademicInterestsInput = z.infer<typeof academicInterestsSchema>;
