-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('ASSOCIATE', 'BACHELORS', 'MASTERS', 'DOCTORATE', 'CERTIFICATE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CO_OP');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('ON_CAMPUS', 'REMOTE', 'HYBRID', 'OFF_CAMPUS');

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "mailingAddressLine1" TEXT NOT NULL,
    "mailingAddressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_interests" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "degreeLevel" "DegreeLevel" NOT NULL,
    "major" TEXT NOT NULL,
    "minor" TEXT,

    CONSTRAINT "academic_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses_of_interest" (
    "id" TEXT NOT NULL,
    "academicInterestId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,

    CONSTRAINT "courses_of_interest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_preferences" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL,
    "locationType" "LocationType" NOT NULL,
    "notes" TEXT,

    CONSTRAINT "work_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_area_preferences" (
    "id" TEXT NOT NULL,
    "workPreferenceId" TEXT NOT NULL,
    "workArea" TEXT NOT NULL,

    CONSTRAINT "work_area_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_interests_studentId_key" ON "academic_interests"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "work_preferences_studentId_key" ON "work_preferences"("studentId");

-- AddForeignKey
ALTER TABLE "academic_interests" ADD CONSTRAINT "academic_interests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_of_interest" ADD CONSTRAINT "courses_of_interest_academicInterestId_fkey" FOREIGN KEY ("academicInterestId") REFERENCES "academic_interests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_preferences" ADD CONSTRAINT "work_preferences_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_area_preferences" ADD CONSTRAINT "work_area_preferences_workPreferenceId_fkey" FOREIGN KEY ("workPreferenceId") REFERENCES "work_preferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
