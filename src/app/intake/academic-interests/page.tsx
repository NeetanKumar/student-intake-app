"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntakeForm } from "@/context/IntakeFormContext";
import {
  academicInterestsSchema,
  type AcademicInterestsInput,
} from "@/lib/validation/academicInterests.schema";
import { StepperNav } from "@/components/intake/StepperNav";
import { FormField, inputClassName } from "@/components/intake/FormField";
import { MultiSelectChecklist } from "@/components/intake/MultiSelectChecklist";
import { Button } from "@/components/ui/Button";
import { DEGREE_LEVELS, SUGGESTED_COURSES } from "@/lib/constants";

export default function AcademicInterestsPage() {
  const router = useRouter();
  const { formState, updateAcademicInterests } = useIntakeForm();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicInterestsInput>({
    resolver: zodResolver(academicInterestsSchema),
    defaultValues: { courses: [], ...formState.academicInterests },
    values: { courses: [], ...formState.academicInterests } as AcademicInterestsInput,
  });

  function onSubmit(data: AcademicInterestsInput) {
    updateAcademicInterests(data);
    router.push("/intake/work-preferences");
  }

  function onBack() {
    router.push("/intake/basic-info");
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperNav currentPath="/intake/academic-interests" />

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Academic Interests</h1>
        <p className="mt-1 text-sm text-slate-600">
          Let us know what you&apos;d like to study.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          label="Intended degree level"
          htmlFor="degreeLevel"
          error={errors.degreeLevel?.message}
        >
          <select id="degreeLevel" className={inputClassName} {...register("degreeLevel")}>
            <option value="">Select a degree level</option>
            {DEGREE_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Major" htmlFor="major" error={errors.major?.message}>
            <input id="major" className={inputClassName} {...register("major")} />
          </FormField>
          <FormField label="Minor" htmlFor="minor" optional error={errors.minor?.message}>
            <input id="minor" className={inputClassName} {...register("minor")} />
          </FormField>
        </div>

        <FormField label="Courses of interest" error={errors.courses?.message as string}>
          <Controller
            name="courses"
            control={control}
            render={({ field }) => (
              <MultiSelectChecklist
                suggestions={SUGGESTED_COURSES}
                value={field.value ?? []}
                onChange={field.onChange}
                customPlaceholder="Add another course..."
              />
            )}
          />
        </FormField>

        <div className="mt-4 flex justify-between">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next: Work Preferences</Button>
        </div>
      </form>
    </div>
  );
}
