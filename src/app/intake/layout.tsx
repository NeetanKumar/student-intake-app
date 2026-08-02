import { IntakeFormProvider } from "@/context/IntakeFormContext";

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return (
    <IntakeFormProvider>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
        {children}
      </main>
    </IntakeFormProvider>
  );
}
