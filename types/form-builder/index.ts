export type FieldType = "text" | "number" | "dropdown" | "checkbox" | "radio" | "date" | "file";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  value?: string | string[]; // For dropdown options or checkbox values
  required?: boolean;
  order: number;
}

export type RuleCategory = "years_of_experience" | "expected_salary";

export interface FormRule {
  id: string;
  category: RuleCategory;
  values: string[];
}

export interface FormBuilderData {
  title: string;
  description: string;
  rules?: FormRule[];
  fields: FormField[];
}
