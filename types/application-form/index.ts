export type FormStatus = "open" | "closed";

export interface FormWave {
  waveNumber: number;
  openedAt: Date;
  closedAt?: Date;
}

export interface ApplicationForm {
  id: string;
  companyName: string;
  title: string;
  questionCount: number;
  applicantCount: number;
  status: FormStatus;
  createdAt: Date;
  dueDate?: Date; // Due date for the job opening
  waves?: FormWave[]; // History of form opening/closing for wave tracking
}
