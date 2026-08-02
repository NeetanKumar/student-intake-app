import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Student Intake Application
        </h1>
        <p className="text-base text-slate-600">
          Start your admissions intake by completing a short 3-step form covering your
          basic information, academic interests, and work area preferences.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/intake/basic-info"
          className="rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
        >
          Start intake form
        </Link>
        <Link
          href="/admin"
          className="rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          View submissions (admin)
        </Link>
      </div>
    </main>
  );
}
