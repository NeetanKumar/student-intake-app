import Link from "next/link";

export function SiteHeader() {
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

        <Link
          href="/admin"
          aria-label="Admin"
          title="Admin"
          className="flex items-center gap-2 transition hover:opacity-80"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">
            Admin
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth={1.75}
              />
              <path
                d="M4.5 20a7.5 7.5 0 0 1 15 0"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </header>
  );
}
