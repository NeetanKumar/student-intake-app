import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const submissions = [
  {
    basicInfo: {
      firstName: "Ava",
      lastName: "Thompson",
      email: "ava.thompson@example.com",
      phoneNumber: "555-201-3344",
      dateOfBirth: new Date("2005-03-14"),
      mailingAddressLine1: "142 Birchwood Ave",
      mailingAddressLine2: null,
      city: "Austin",
      state: "TX",
      postalCode: "78701",
      country: "United States",
    },
    academicInterest: {
      degreeLevel: "BACHELORS" as const,
      major: "Computer Science",
      minor: "Mathematics",
      courses: ["Data Structures & Algorithms", "Linear Algebra", "Introduction to Computer Science"],
    },
    workPreference: {
      employmentType: "INTERNSHIP" as const,
      locationType: "HYBRID" as const,
      notes: "Interested in summer internships with a research component.",
      workAreas: ["Software Engineering", "Data Science & Analytics"],
    },
  },
  {
    basicInfo: {
      firstName: "Marcus",
      lastName: "Lee",
      email: "marcus.lee@example.com",
      phoneNumber: "555-772-9081",
      dateOfBirth: new Date("2004-11-02"),
      mailingAddressLine1: "88 Elm Street",
      mailingAddressLine2: "Apt 4B",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "United States",
    },
    academicInterest: {
      degreeLevel: "MASTERS" as const,
      major: "Economics",
      minor: null,
      courses: ["Microeconomics", "Statistics"],
    },
    workPreference: {
      employmentType: "PART_TIME" as const,
      locationType: "REMOTE" as const,
      notes: null,
      workAreas: ["Finance & Accounting", "Marketing & Communications"],
    },
  },
  {
    basicInfo: {
      firstName: "Priya",
      lastName: "Nair",
      email: "priya.nair@example.com",
      phoneNumber: "555-410-6620",
      dateOfBirth: new Date("2006-07-22"),
      mailingAddressLine1: "27 Maple Court",
      mailingAddressLine2: null,
      city: "Boston",
      state: "MA",
      postalCode: "02108",
      country: "United States",
    },
    academicInterest: {
      degreeLevel: "ASSOCIATE" as const,
      major: "Biology",
      minor: "Chemistry",
      courses: ["Organic Chemistry", "Introduction to Psychology"],
    },
    workPreference: {
      employmentType: "CO_OP" as const,
      locationType: "ON_CAMPUS" as const,
      notes: "Prefers roles in a lab or clinical setting.",
      workAreas: ["Research", "Library Services"],
    },
  },
  {
    basicInfo: {
      firstName: "Diego",
      lastName: "Alvarez",
      email: "diego.alvarez@example.com",
      phoneNumber: "555-903-1147",
      dateOfBirth: new Date("2003-01-30"),
      mailingAddressLine1: "501 Highland Drive",
      mailingAddressLine2: null,
      city: "Denver",
      state: "CO",
      postalCode: "80202",
      country: "United States",
    },
    academicInterest: {
      degreeLevel: "DOCTORATE" as const,
      major: "Mechanical Engineering",
      minor: null,
      courses: ["Calculus I", "Linear Algebra", "Statistics"],
    },
    workPreference: {
      employmentType: "FULL_TIME" as const,
      locationType: "OFF_CAMPUS" as const,
      notes: null,
      workAreas: ["Facilities & Operations", "Research"],
    },
  },
];

async function main() {
  for (const submission of submissions) {
    await prisma.student.create({
      data: {
        ...submission.basicInfo,
        academicInterest: {
          create: {
            degreeLevel: submission.academicInterest.degreeLevel,
            major: submission.academicInterest.major,
            minor: submission.academicInterest.minor,
            courses: {
              create: submission.academicInterest.courses.map((courseName) => ({ courseName })),
            },
          },
        },
        workPreference: {
          create: {
            employmentType: submission.workPreference.employmentType,
            locationType: submission.workPreference.locationType,
            notes: submission.workPreference.notes,
            workAreas: {
              create: submission.workPreference.workAreas.map((workArea) => ({ workArea })),
            },
          },
        },
      },
    });
  }

  console.log(`Seeded ${submissions.length} student intake submissions.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
