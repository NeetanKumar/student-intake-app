export const DEGREE_LEVELS = [
  { value: "ASSOCIATE", label: "Associate" },
  { value: "BACHELORS", label: "Bachelor's" },
  { value: "MASTERS", label: "Master's" },
  { value: "DOCTORATE", label: "Doctorate" },
  { value: "CERTIFICATE", label: "Certificate" },
] as const;

export const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "CO_OP", label: "Co-op" },
] as const;

export const LOCATION_TYPES = [
  { value: "ON_CAMPUS", label: "On-campus" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "OFF_CAMPUS", label: "Off-campus" },
] as const;

export const WORK_AREAS = [
  "Software Engineering",
  "Data Science & Analytics",
  "Research",
  "Admissions & Student Services",
  "Marketing & Communications",
  "Finance & Accounting",
  "Human Resources",
  "Design & UX",
  "Facilities & Operations",
  "Library Services",
] as const;

export const SUGGESTED_COURSES = [
  "Introduction to Computer Science",
  "Data Structures & Algorithms",
  "Calculus I",
  "Linear Algebra",
  "Statistics",
  "Introduction to Psychology",
  "Microeconomics",
  "Organic Chemistry",
  "Creative Writing",
  "World History",
] as const;

export const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "India",
  "Germany",
  "France",
  "Other",
] as const;

export type DegreeLevelValue = (typeof DEGREE_LEVELS)[number]["value"];
export type EmploymentTypeValue = (typeof EMPLOYMENT_TYPES)[number]["value"];
export type LocationTypeValue = (typeof LOCATION_TYPES)[number]["value"];

export function degreeLevelLabel(value?: string | null) {
  return DEGREE_LEVELS.find((d) => d.value === value)?.label ?? value ?? "";
}

export function employmentTypeLabel(value?: string | null) {
  return EMPLOYMENT_TYPES.find((e) => e.value === value)?.label ?? value ?? "";
}

export function locationTypeLabel(value?: string | null) {
  return LOCATION_TYPES.find((l) => l.value === value)?.label ?? value ?? "";
}
