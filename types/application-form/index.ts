export type FormStatus = "open" | "closed";

export interface ApplicationForm {
  id: string;
  companyName: string;
  title: string;
  questionCount: number;
  applicantCount: number;
  status: FormStatus;
  createdAt: Date;
}
