"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  return (
    <header className="w-full border-b border-white/10 bg-ink">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-3 pl-2 pr-4">
        <Link
          href="/"
          aria-label="Student Intake — home"
          className="flex h-9 w-9 items-center justify-center rounded-none bg-accent text-sm font-extrabold text-white transition hover:bg-accent-hover"
        >
          SI
        </Link>

        <div className="flex items-center gap-0.5 rounded-none border border-white/15 bg-white/5 p-0.5">
          <Link
            href="/"
            aria-current={!isAdmin ? "page" : undefined}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
              !isAdmin ? "bg-accent text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Student
          </Link>
          <Link
            href="/admin"
            aria-current={isAdmin ? "page" : undefined}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition ${
              isAdmin ? "bg-accent text-white" : "text-slate-300 hover:text-white"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
