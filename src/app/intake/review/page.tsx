"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useIntakeForm } from "@/context/IntakeFormContext";
import { intakeSubmissionSchema } from "@/lib/validation/intake.schema";
import { StepperNav } from "@/components/intake/StepperNav";
import { ReviewSection, ReviewItem } from "@/components/intake/ReviewSection";
import { Button } from "@/components/ui/Button";
import { degreeLevelLabel, employmentTypeLabel, locationTypeLabel } from "@/lib/constants";

export default function ReviewPage() {
  const router = useRouter();
  const { formState, resetForm } = useIntakeForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { basicInfo, academicInterests, workPreferences } = formState;

  async function handleSubmit() {
    setError(null);

    const parsed = intakeSubmissionSchema.safeParse({
      basicInfo,
      academicInterests,
      workPreferences,
    });

    if (!parsed.success) {
      setError(
        "Some information is missing or invalid. Please go back and check each step.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/intakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong while submitting. Please try again.");
      }

      const created = await res.json();
      resetForm();
      router.push(`/intake/success/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperNav currentPath="/intake/review" />

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Step 4 of 4
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Review &amp; Submit
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Please confirm everything below is correct before submitting.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <ReviewSection title="Basic Information" editHref="/intake/basic-info">
          <ReviewItem
            label="Name"
            value={`${basicInfo.firstName ?? ""} ${basicInfo.lastName ?? ""}`.trim()}
          />
          <ReviewItem label="Email" value={basicInfo.email} />
          <ReviewItem label="Phone" value={basicInfo.phoneNumber} />
          <ReviewItem label="Date of birth" value={basicInfo.dateOfBirth} />
          <ReviewItem
            label="Mailing address"
            value={[
              basicInfo.mailingAddressLine1,
              basicInfo.mailingAddressLine2,
              [basicInfo.city, basicInfo.state, basicInfo.postalCode].filter(Boolean).join(", "),
              basicInfo.country,
            ]
              .filter(Boolean)
              .join(", ")}
          />
        </ReviewSection>

        <ReviewSection title="Academic Interests" editHref="/intake/academic-interests">
          <ReviewItem label="Degree level" value={degreeLevelLabel(academicInterests.degreeLevel)} />
          <ReviewItem label="Major" value={academicInterests.major} />
          <ReviewItem label="Minor" value={academicInterests.minor} />
          <ReviewItem
            label="Courses of interest"
            value={academicInterests.courses?.join(", ")}
          />
        </ReviewSection>

        <ReviewSection title="Work Area Preferences" editHref="/intake/work-preferences">
          <ReviewItem label="Preferred work areas" value={workPreferences.workAreas?.join(", ")} />
          <ReviewItem
            label="Employment type"
            value={employmentTypeLabel(workPreferences.employmentType)}
          />
          <ReviewItem
            label="Location type"
            value={locationTypeLabel(workPreferences.locationType)}
          />
          <ReviewItem label="Notes" value={workPreferences.notes} />
        </ReviewSection>
      </div>

      {error && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-2 flex justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/intake/work-preferences")}
          disabled={submitting}
        >
          Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
