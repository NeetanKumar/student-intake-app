import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const submissionCount = await prisma.student.count();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Admissions
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage and review incoming student intake submissions.
        </p>
      </div>

      <Link
        href="/admin/enrollments"
        className="group flex items-center justify-between rounded-none border border-slate-200 bg-white p-6 shadow-sm transition hover:border-accent"
      >
        <div>
          <h2 className="text-lg font-bold text-ink">Student Enrollments</h2>
          <p className="mt-1 text-sm text-slate-600">
            {submissionCount} submission{submissionCount === 1 ? "" : "s"} on file — view
            the full list and drill into individual records.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent">
          View list
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Link>
    </main>
  );
}
