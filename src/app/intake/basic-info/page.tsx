"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useIntakeForm } from "@/context/IntakeFormContext";
import { basicInfoSchema, type BasicInfoInput } from "@/lib/validation/basicInfo.schema";
import { StepperNav } from "@/components/intake/StepperNav";
import { FormField, inputClassName } from "@/components/intake/FormField";
import { Button } from "@/components/ui/Button";
import { COUNTRIES } from "@/lib/constants";

export default function BasicInfoPage() {
  const router = useRouter();
  const { formState, updateBasicInfo } = useIntakeForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfoInput>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: formState.basicInfo,
    values: formState.basicInfo as BasicInfoInput,
  });

  function onSubmit(data: BasicInfoInput) {
    updateBasicInfo(data);
    router.push("/intake/academic-interests");
  }

  return (
    <div className="flex flex-col gap-8">
      <StepperNav currentPath="/intake/basic-info" />

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Step 1 of 4
        </span>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">
          Basic Information
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Tell us a bit about yourself so we can get in touch.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <input id="firstName" className={inputClassName} {...register("firstName")} />
          </FormField>
          <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <input id="lastName" className={inputClassName} {...register("lastName")} />
          </FormField>
        </div>

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={inputClassName} {...register("email")} />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            label="Phone number"
            htmlFor="phoneNumber"
            error={errors.phoneNumber?.message}
          >
            <input
              id="phoneNumber"
              type="tel"
              className={inputClassName}
              {...register("phoneNumber")}
            />
          </FormField>
          <FormField
            label="Date of birth"
            htmlFor="dateOfBirth"
            error={errors.dateOfBirth?.message}
          >
            <input
              id="dateOfBirth"
              type="date"
              className={inputClassName}
              {...register("dateOfBirth")}
            />
          </FormField>
        </div>

        <FormField
          label="Mailing address line 1"
          htmlFor="mailingAddressLine1"
          error={errors.mailingAddressLine1?.message}
        >
          <input
            id="mailingAddressLine1"
            className={inputClassName}
            {...register("mailingAddressLine1")}
          />
        </FormField>

        <FormField
          label="Mailing address line 2"
          htmlFor="mailingAddressLine2"
          optional
          error={errors.mailingAddressLine2?.message}
        >
          <input
            id="mailingAddressLine2"
            className={inputClassName}
            {...register("mailingAddressLine2")}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <FormField label="City" htmlFor="city" error={errors.city?.message}>
            <input id="city" className={inputClassName} {...register("city")} />
          </FormField>
          <FormField label="State / Province" htmlFor="state" error={errors.state?.message}>
            <input id="state" className={inputClassName} {...register("state")} />
          </FormField>
          <FormField
            label="Postal code"
            htmlFor="postalCode"
            error={errors.postalCode?.message}
          >
            <input id="postalCode" className={inputClassName} {...register("postalCode")} />
          </FormField>
        </div>

        <FormField label="Country" htmlFor="country" error={errors.country?.message}>
          <select id="country" className={inputClassName} {...register("country")}>
            <option value="">Select a country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </FormField>

        <div className="mt-4 flex justify-end">
          <Button type="submit">Next: Academic Interests</Button>
        </div>
      </form>
    </div>
  );
}
