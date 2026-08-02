import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      academicInterest: { include: { courses: true } },
      workPreference: { include: { workAreas: true } },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}
