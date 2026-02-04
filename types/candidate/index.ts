export type CandidateStage = "applied" | "cv_review" | "ready_for_interview";

export interface Education {
  degree: string;
  institution: string;
  year: string;
  major?: string;
}

export interface ApplicationHistory {
  id: string;
  jobTitle: string;
  companyName: string;
  appliedAt: Date;
  status: CandidateStage;
}

export interface FeedbackHistory {
  id: string;
  templateTitle: string;
  subject: string;
  sentAt: Date;
  sentBy: string;
  status: "sent" | "delivered" | "read";
}

export type ReadyFor = "onsite" | "hybrid" | "remote" | "flexible";
export type CandidateStatus = "qualified" | "not_qualified";
export type EmploymentType = "full_time" | "part_time" | "freelance";

export interface Candidate {
  id: string;
  appliedAt: Date;
  formTitle?: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  experience: string;
  stage: CandidateStage;
  status?: CandidateStatus;
  readyFor?: ReadyFor;
  type?: EmploymentType; // Full Time, Part Time, Freelance
  preferredStartDate?: Date;
  phoneNumber?: string;
  education?: Education[];
  cvUrl?: string;
  applicationHistory?: ApplicationHistory[];
  feedbackHistory?: FeedbackHistory[];
  // Profile fields
  educationLevel?: string; // e.g., "S-1"
  educationInstitution?: string; // e.g., "Universitas Amikom"
  applicationSource?: string; // e.g., "LinkedIn"
  lastSalary?: string; // e.g., "< Rp 7.000.000"
  expectedSalary?: string; // e.g., "Rp 7.100.000 - Rp 8.000.000"
  notes?: string;
}
