import Link from "next/link";
import type { ReactNode } from "react";

interface ReviewSectionProps {
  title: string;
  editHref: string;
  children: ReactNode;
}

export function ReviewSection({ title, editHref, children }: ReviewSectionProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        <Link href={editHref} className="text-sm font-medium text-slate-600 hover:text-slate-900">
          Edit
        </Link>
      </div>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

export function ReviewItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}
