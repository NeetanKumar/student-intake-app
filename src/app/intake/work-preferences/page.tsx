"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntakeForm } from "@/context/IntakeFormContext";
import {
  workPreferencesSchema,
  type WorkPreferencesInput,
} from "@/lib/validation/workPreferences.schema";
import { StepperNav } from "@/components/intake/StepperNav";
import { FormField, inputClassName } from "@/components/intake/FormField";
import { MultiSelectChecklist } from "@/components/intake/MultiSelectChecklist";
import { Button } from "@/components/ui/Button";
import { EMPLOYMENT_TYPES, LOCATION_TYPES, WORK_AREAS } from "@/lib/constants";

export default function WorkPreferencesPage() {
  const router = useRouter();
  const { formState, updateWorkPreferences } = useIntakeForm();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkPreferencesInput>({
    resolver: zodResolver(workPreferencesSchema),
    defaultValues: { workAreas: [], ...formState.workPreferences },
    values: { workAreas: [], ...formState.workPreferences } as WorkPreferencesInput,
  });

  function onSubmit(data: WorkPreferencesInput) {
    updateWorkPreferences(data);
    router.push("/intake/review");
  }

  function onBack() {
    router.push("/intake/academic-interests");
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperNav currentPath="/intake/work-preferences" />

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Step 3 of 4
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Work Area Preferences
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tell us about the kind of work experience you&apos;re looking for.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField label="Preferred work areas" error={errors.workAreas?.message as string}>
          <Controller
            name="workAreas"
            control={control}
            render={({ field }) => (
              <MultiSelectChecklist
                suggestions={WORK_AREAS}
                value={field.value ?? []}
                onChange={field.onChange}
                customPlaceholder="Add another work area..."
              />
            )}
          />
        </FormField>

        <FormField label="Preferred employment type" error={errors.employmentType?.message}>
          <div className="flex flex-wrap gap-4">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  value={type.value}
                  {...register("employmentType")}
                  className="h-4 w-4 border-slate-300 text-accent focus:ring-accent"
                />
                {type.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Preferred location type" error={errors.locationType?.message}>
          <div className="flex flex-wrap gap-4">
            {LOCATION_TYPES.map((type) => (
              <label key={type.value} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  value={type.value}
                  {...register("locationType")}
                  className="h-4 w-4 border-slate-300 text-accent focus:ring-accent"
                />
                {type.label}
              </label>
            ))}
          </div>
        </FormField>

        <FormField label="Additional notes" htmlFor="notes" optional error={errors.notes?.message}>
          <textarea
            id="notes"
            rows={4}
            className={inputClassName}
            {...register("notes")}
          />
        </FormField>

        <div className="mt-4 flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next: Review</Button>
        </div>
      </form>
    </div>
  );
}
