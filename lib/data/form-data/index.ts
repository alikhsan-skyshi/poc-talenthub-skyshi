import { dummyForms } from "@/lib/data/dummy-forms";
import { getFormFieldsByFormId } from "@/lib/data/form-fields";
import type { ApplicationForm } from "@/types/application-form";
import type { FormField, FormBuilderData } from "@/types/form-builder";

export const getFormDataById = (
  formId: string
): (FormBuilderData & { formId: string }) | null => {
  const form = dummyForms.find((f) => f.id === formId);

  if (!form) {
    return null;
  }

  const fields = getFormFieldsByFormId(formId);

  return {
    formId: form.id,
    title: form.title,
    description: `Application form for ${form.title} position at ${form.companyName}`,
    fields: fields,
  };
};
