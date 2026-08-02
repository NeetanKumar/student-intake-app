import type { BasicInfoInput } from "@/lib/validation/basicInfo.schema";
import type { AcademicInterestsInput } from "@/lib/validation/academicInterests.schema";
import type { WorkPreferencesInput } from "@/lib/validation/workPreferences.schema";

export interface IntakeFormState {
  basicInfo: Partial<BasicInfoInput>;
  academicInterests: Partial<AcademicInterestsInput>;
  workPreferences: Partial<WorkPreferencesInput>;
}

export const emptyIntakeFormState: IntakeFormState = {
  basicInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    mailingAddressLine1: "",
    mailingAddressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
  academicInterests: {
    degreeLevel: undefined,
    major: "",
    minor: "",
    courses: [],
  },
  workPreferences: {
    workAreas: [],
    employmentType: undefined,
    locationType: undefined,
    notes: "",
  },
};
