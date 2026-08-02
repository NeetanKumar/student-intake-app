import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { intakeSubmissionSchema } from "@/lib/validation/intake.schema";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = intakeSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fieldErrors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { basicInfo, academicInterests, workPreferences } = parsed.data;

  const student = await prisma.student.create({
    data: {
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      email: basicInfo.email,
      phoneNumber: basicInfo.phoneNumber,
      dateOfBirth: new Date(basicInfo.dateOfBirth),
      mailingAddressLine1: basicInfo.mailingAddressLine1,
      mailingAddressLine2: basicInfo.mailingAddressLine2 || null,
      city: basicInfo.city,
      state: basicInfo.state,
      postalCode: basicInfo.postalCode,
      country: basicInfo.country,
      academicInterest: {
        create: {
          degreeLevel: academicInterests.degreeLevel,
          major: academicInterests.major,
          minor: academicInterests.minor || null,
          courses: {
            create: academicInterests.courses.map((courseName) => ({ courseName })),
          },
        },
      },
      workPreference: {
        create: {
          employmentType: workPreferences.employmentType,
          locationType: workPreferences.locationType,
          notes: workPreferences.notes || null,
          workAreas: {
            create: workPreferences.workAreas.map((workArea) => ({ workArea })),
          },
        },
      },
    },
    include: {
      academicInterest: { include: { courses: true } },
      workPreference: { include: { workAreas: true } },
    },
  });

  return NextResponse.json(student, { status: 201 });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "20") || 20));

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        academicInterest: { select: { degreeLevel: true, major: true } },
      },
    }),
    prisma.student.count(),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
