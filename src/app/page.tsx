import Link from "next/link";
import { WaveBackground } from "@/components/WaveBackground";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-ink px-4 py-24 text-center">
      <WaveBackground />

      <div className="relative flex flex-col items-center gap-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-blue-300">
          University Admissions
        </span>

        <div className="max-w-2xl space-y-5">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Student Intake Application
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Complete a short 3-step form covering your basic information, academic
            interests, and work area preferences — then review and submit.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/intake/basic-info"
            className="rounded-none bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
          >
            Start intake form
          </Link>
          <Link
            href="/admin"
            className="rounded-none border border-white/20 bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            View submissions (admin)
          </Link>
        </div>
      </div>
    </main>
  );
}
