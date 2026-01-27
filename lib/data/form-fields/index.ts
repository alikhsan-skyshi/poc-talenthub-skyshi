import type { FormField } from "@/types/form-builder";

// Dummy form fields data for each form
// In production, this would come from the database
export const getFormFieldsByFormId = (formId: string): FormField[] => {
  // Generate dummy fields based on form ID
  // In production, this would be an API call
  const fieldsMap: Record<string, FormField[]> = {
    "1": [
      {
        id: "field-1-1",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        required: true,
        order: 0,
      },
      {
        id: "field-1-2",
        type: "text",
        label: "Email Address",
        placeholder: "Enter your email",
        required: true,
        order: 1,
      },
      {
        id: "field-1-3",
        type: "number",
        label: "Years of Experience",
        placeholder: "Enter years of experience",
        required: true,
        order: 2,
      },
      {
        id: "field-1-4",
        type: "dropdown",
        label: "Preferred Work Location",
        value: ["Remote", "On-site", "Hybrid"],
        required: true,
        order: 3,
      },
      {
        id: "field-1-5",
        type: "checkbox",
        label: "Skills",
        value: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
        required: false,
        order: 4,
      },
    ],
    "2": [
      {
        id: "field-2-1",
        type: "text",
        label: "Name",
        placeholder: "Enter your name",
        required: true,
        order: 0,
      },
      {
        id: "field-2-2",
        type: "text",
        label: "Email",
        placeholder: "Enter your email",
        required: true,
        order: 1,
      },
      {
        id: "field-2-3",
        type: "dropdown",
        label: "Product Management Experience",
        value: ["0-2 years", "2-5 years", "5+ years"],
        required: true,
        order: 2,
      },
    ],
  };

  // Return fields if exists, otherwise return empty array
  return fieldsMap[formId] || [
    {
      id: `field-${formId}-1`,
      type: "text",
      label: "Sample Field",
      placeholder: "Enter value",
      required: false,
      order: 0,
    },
  ];
};
