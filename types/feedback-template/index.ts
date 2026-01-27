export interface FeedbackTemplate {
  id: string;
  title: string;
  content: string;
  subject?: string;
  attachmentUrl?: string;
  type: "acceptance" | "rejection" | "interview" | "other";
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sentCount: number;
}
