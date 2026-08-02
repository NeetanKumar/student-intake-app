import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const studentCreate = vi.fn();
const studentFindMany = vi.fn();
const studentCount = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    student: {
      create: (...args: unknown[]) => studentCreate(...args),
      findMany: (...args: unknown[]) => studentFindMany(...args),
      count: (...args: unknown[]) => studentCount(...args),
    },
  },
}));

import { GET, POST } from "../route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/intakes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validSubmission = {
  basicInfo: {
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
  },
  academicInterests: {
    degreeLevel: "BACHELORS",
    major: "Computer Science",
    courses: ["Linear Algebra"],
  },
  workPreferences: {
    workAreas: ["Software Engineering"],
    employmentType: "FULL_TIME",
    locationType: "REMOTE",
  },
};

beforeEach(() => {
  studentCreate.mockReset();
  studentFindMany.mockReset();
  studentCount.mockReset();
});

describe("POST /api/intakes", () => {
  it("creates a student record and returns 201 for a valid submission", async () => {
    studentCreate.mockResolvedValue({ id: "abc-123", ...validSubmission.basicInfo });

    const res = await POST(makeRequest(validSubmission));

    expect(res.status).toBe(201);
    expect(studentCreate).toHaveBeenCalledTimes(1);
    const createArgs = studentCreate.mock.calls[0][0];
    expect(createArgs.data.email).toBe("jordan.rivera@example.com");
    expect(createArgs.data.academicInterest.create.courses.create).toEqual([
      { courseName: "Linear Algebra" },
    ]);
  });

  it("returns 400 and does not touch the database for an invalid submission", async () => {
    const res = await POST(makeRequest({ basicInfo: {}, academicInterests: {}, workPreferences: {} }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Validation failed");
    expect(studentCreate).not.toHaveBeenCalled();
  });
});

describe("GET /api/intakes", () => {
  it("returns a paginated list", async () => {
    studentFindMany.mockResolvedValue([{ id: "1" }, { id: "2" }]);
    studentCount.mockResolvedValue(2);

    const res = await GET(new NextRequest("http://localhost/api/intakes"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.total).toBe(2);
    expect(body.items).toHaveLength(2);
    expect(body.page).toBe(1);
    expect(body.pageSize).toBe(20);
  });
});
