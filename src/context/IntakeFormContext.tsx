"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { emptyIntakeFormState, type IntakeFormState } from "@/types/intake";

const STORAGE_KEY = "intake-form-state";

interface IntakeFormContextValue {
  formState: IntakeFormState;
  updateBasicInfo: (data: IntakeFormState["basicInfo"]) => void;
  updateAcademicInterests: (data: IntakeFormState["academicInterests"]) => void;
  updateWorkPreferences: (data: IntakeFormState["workPreferences"]) => void;
  resetForm: () => void;
}

const IntakeFormContext = createContext<IntakeFormContextValue | null>(null);

function loadInitialState(): IntakeFormState {
  if (typeof window === "undefined") return emptyIntakeFormState;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyIntakeFormState;
    return { ...emptyIntakeFormState, ...JSON.parse(raw) };
  } catch {
    return emptyIntakeFormState;
  }
}

export function IntakeFormProvider({ children }: { children: ReactNode }) {
  const [formState, setFormState] = useState<IntakeFormState>(emptyIntakeFormState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading sessionStorage must happen post-mount to avoid an SSR/client markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormState(loadInitialState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
  }, [formState, hydrated]);

  const value = useMemo<IntakeFormContextValue>(
    () => ({
      formState,
      updateBasicInfo: (data) =>
        setFormState((prev) => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } })),
      updateAcademicInterests: (data) =>
        setFormState((prev) => ({
          ...prev,
          academicInterests: { ...prev.academicInterests, ...data },
        })),
      updateWorkPreferences: (data) =>
        setFormState((prev) => ({
          ...prev,
          workPreferences: { ...prev.workPreferences, ...data },
        })),
      resetForm: () => {
        setFormState(emptyIntakeFormState);
        window.sessionStorage.removeItem(STORAGE_KEY);
      },
    }),
    [formState],
  );

  return (
    <IntakeFormContext.Provider value={value}>{children}</IntakeFormContext.Provider>
  );
}

export function useIntakeForm() {
  const ctx = useContext(IntakeFormContext);
  if (!ctx) {
    throw new Error("useIntakeForm must be used within an IntakeFormProvider");
  }
  return ctx;
}
