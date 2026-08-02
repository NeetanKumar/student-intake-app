const STEPS = [
  { path: "/intake/basic-info", label: "Basic Info" },
  { path: "/intake/academic-interests", label: "Academic Interests" },
  { path: "/intake/work-preferences", label: "Work Preferences" },
  { path: "/intake/review", label: "Review & Submit" },
];

export function StepperNav({ currentPath }: { currentPath: string }) {
  const currentIndex = STEPS.findIndex((step) => step.path === currentPath);

  return (
    <ol className="flex w-full items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <li key={step.path} className="flex flex-1 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : isComplete
                      ? "bg-slate-700 text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`hidden text-sm font-medium sm:inline ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 ${isComplete ? "bg-slate-700" : "bg-slate-200"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
