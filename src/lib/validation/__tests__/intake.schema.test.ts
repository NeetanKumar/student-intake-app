import { describe, expect, it } from "vitest";
import { basicInfoSchema } from "../basicInfo.schema";
import { academicInterestsSchema } from "../academicInterests.schema";
import { workPreferencesSchema } from "../workPreferences.schema";
import { intakeSubmissionSchema } from "../intake.schema";

const validBasicInfo = {
  firstName: "Jordan",
  lastName: "Rivera",
  email: "jordan.rivera@example.com",
  phoneNumber: "555-123-4567",
  dateOfBirth: "2005-05-15",
  mailingAddressLine1: "123 Main St",
  city: "Springfield",
  state: "IL",
  postalCode: "62704",
  country: "United States",
};

const validAcademicInterests = {
  degreeLevel: "BACHELORS" as const,
  major: "Computer Science",
  courses: ["Linear Algebra"],
};

const validWorkPreferences = {
  workAreas: ["Software Engineering"],
  employmentType: "FULL_TIME" as const,
  locationType: "REMOTE" as const,
};

describe("basicInfoSchema", () => {
  it("accepts a valid submission", () => {
    expect(basicInfoSchema.safeParse(validBasicInfo).success).toBe(true);
  });

  it("rejects a missing first name", () => {
    const result = basicInfoSchema.safeParse({ ...validBasicInfo, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = basicInfoSchema.safeParse({ ...validBasicInfo, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a date of birth in the future", () => {
    const result = basicInfoSchema.safeParse({ ...validBasicInfo, dateOfBirth: "2999-01-01" });
    expect(result.success).toBe(false);
  });
});

describe("academicInterestsSchema", () => {
  it("accepts a valid submission", () => {
    expect(academicInterestsSchema.safeParse(validAcademicInterests).success).toBe(true);
  });

  it("rejects an empty courses array", () => {
    const result = academicInterestsSchema.safeParse({ ...validAcademicInterests, courses: [] });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid degree level", () => {
    const result = academicInterestsSchema.safeParse({
      ...validAcademicInterests,
      degreeLevel: "PHD",
    });
    expect(result.success).toBe(false);
  });
});

describe("workPreferencesSchema", () => {
  it("accepts a valid submission", () => {
    expect(workPreferencesSchema.safeParse(validWorkPreferences).success).toBe(true);
  });

  it("rejects an empty work areas array", () => {
    const result = workPreferencesSchema.safeParse({ ...validWorkPreferences, workAreas: [] });
    expect(result.success).toBe(false);
  });
});

describe("intakeSubmissionSchema", () => {
  it("accepts a full valid submission", () => {
    const result = intakeSubmissionSchema.safeParse({
      basicInfo: validBasicInfo,
      academicInterests: validAcademicInterests,
      workPreferences: validWorkPreferences,
    });
    expect(result.success).toBe(true);
  });

  it("rejects when any section is invalid", () => {
    const result = intakeSubmissionSchema.safeParse({
      basicInfo: validBasicInfo,
      academicInterests: { ...validAcademicInterests, courses: [] },
      workPreferences: validWorkPreferences,
    });
    expect(result.success).toBe(false);
  });
});
