import { dummyForms } from "./dummy-forms";
import type { ApplicationForm } from "@/types/application-form";

/**
 * Get all available job openings (only open status)
 * @returns Array of open job openings
 */
export const getOpenJobOpenings = (): ApplicationForm[] => {
  return dummyForms.filter((form) => form.status === "open");
};

/**
 * Get job opening options for dropdown
 * @param excludeFormTitles Optional: array of job titles to exclude
 * @returns Array of options for Select component
 */
export const getJobOpeningOptions = (
  excludeFormTitles?: string | string[]
): { value: string; label: string }[] => {
  const openJobs = getOpenJobOpenings();
  
  // Convert to array if single string provided
  const excludeTitles = excludeFormTitles
    ? Array.isArray(excludeFormTitles)
      ? excludeFormTitles
      : [excludeFormTitles]
    : [];
  
  return openJobs
    .filter((form) => !excludeTitles.includes(form.title))
    .map((form) => ({
      value: form.id,
      label: `${form.companyName} - ${form.title}`,
    }));
};

/**
 * Get job opening by ID
 * @param id Job opening ID
 * @returns Job opening or undefined
 */
export const getJobOpeningById = (
  id: string
): ApplicationForm | undefined => {
  return dummyForms.find((form) => form.id === id);
};
