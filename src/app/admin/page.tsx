import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { degreeLevelLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      academicInterest: { select: { degreeLevel: true, major: true } },
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Submitted Intakes</h1>
          <p className="mt-1 text-sm text-slate-600">
            {students.length} submission{students.length === 1 ? "" : "s"} on file.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Back to home
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Degree / Major</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No submissions yet.
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-4 py-3 text-slate-600">{student.email}</td>
                <td className="px-4 py-3 text-slate-600">
                  {student.academicInterest
                    ? `${degreeLevelLabel(student.academicInterest.degreeLevel)} · ${student.academicInterest.major}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {new Date(student.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/${student.id}`}
                    className="font-medium text-slate-700 hover:text-slate-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
