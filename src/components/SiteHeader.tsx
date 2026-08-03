import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="w-full border-b border-white/10 bg-ink">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-extrabold tracking-tight text-white">
          Student Intake
        </Link>
        <Link
          href="/admin"
          className="text-xs font-semibold uppercase tracking-widest text-blue-300 transition hover:text-white"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
