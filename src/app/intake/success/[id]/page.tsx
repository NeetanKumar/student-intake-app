import Link from "next/link";

export default async function IntakeSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-8 w-8">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Application submitted</h1>
        <p className="text-sm text-slate-600">
          Thank you! Your intake submission has been received.
        </p>
        <p className="text-xs text-slate-400">Reference ID: {id}</p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-none bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-hover"
        >
          Back to home
        </Link>
        <Link
          href={`/admin/${id}`}
          className="rounded-none border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View submission
        </Link>
      </div>
    </div>
  );
}
