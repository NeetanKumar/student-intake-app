import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { degreeLevelLabel, employmentTypeLabel, locationTypeLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EnrollmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      academicInterest: { include: { courses: true } },
      workPreference: { include: { workAreas: true } },
    },
  });

  if (!student) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {student.firstName} {student.lastName}
        </h1>
        <Link
          href="/admin/enrollments"
          className="rounded-none border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Back to list
        </Link>
      </div>

      <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-ink">Basic Information</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item label="Email" value={student.email} />
          <Item label="Phone" value={student.phoneNumber} />
          <Item label="Date of birth" value={new Date(student.dateOfBirth).toLocaleDateString()} />
          <Item
            label="Mailing address"
            value={[
              student.mailingAddressLine1,
              student.mailingAddressLine2,
              [student.city, student.state, student.postalCode].filter(Boolean).join(", "),
              student.country,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </dl>
      </section>

      <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-ink">Academic Interests</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item label="Degree level" value={degreeLevelLabel(student.academicInterest?.degreeLevel)} />
          <Item label="Major" value={student.academicInterest?.major} />
          <Item label="Minor" value={student.academicInterest?.minor} />
          <Item
            label="Courses of interest"
            value={student.academicInterest?.courses.map((c) => c.courseName).join(", ")}
          />
        </dl>
      </section>

      <section className="rounded-none border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-semibold text-ink">Work Area Preferences</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <Item
            label="Preferred work areas"
            value={student.workPreference?.workAreas.map((w) => w.workArea).join(", ")}
          />
          <Item
            label="Employment type"
            value={employmentTypeLabel(student.workPreference?.employmentType)}
          />
          <Item
            label="Location type"
            value={locationTypeLabel(student.workPreference?.locationType)}
          />
          <Item label="Notes" value={student.workPreference?.notes} />
        </dl>
      </section>

      <p className="text-xs text-slate-400">
        Submitted {new Date(student.createdAt).toLocaleString()} · ID: {student.id}
      </p>
    </main>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}
