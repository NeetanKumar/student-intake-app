import { z } from "zod";
import { basicInfoSchema } from "./basicInfo.schema";
import { academicInterestsSchema } from "./academicInterests.schema";
import { workPreferencesSchema } from "./workPreferences.schema";

export const intakeSubmissionSchema = z.object({
  basicInfo: basicInfoSchema,
  academicInterests: academicInterestsSchema,
  workPreferences: workPreferencesSchema,
});

export type IntakeSubmissionInput = z.infer<typeof intakeSubmissionSchema>;
