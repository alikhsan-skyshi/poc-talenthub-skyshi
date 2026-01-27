import type { FeedbackTemplate } from "@/types/feedback-template";

export const dummyTemplates: FeedbackTemplate[] = [
  {
    id: "1",
    title: "Acceptance - Full Stack Developer",
    content:
      "Dear {candidate_name},\n\nCongratulations! We are pleased to inform you that you have been selected for the Full Stack Developer position at our company.\n\nWe were impressed with your skills and experience, and we believe you will be a valuable addition to our team.\n\nPlease let us know your availability for the next steps.\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "John Doe",
    createdAt: new Date("2024-01-15T10:00:00"),
    updatedAt: new Date("2024-01-15T10:00:00"),
    sentCount: 12,
  },
  {
    id: "2",
    title: "Rejection - General",
    content:
      "Dear {candidate_name},\n\nThank you for your interest in the {position} position at our company.\n\nAfter careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe appreciate the time you invested in the application process and wish you the best in your job search.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "John Doe",
    createdAt: new Date("2024-01-20T14:30:00"),
    updatedAt: new Date("2024-01-20T14:30:00"),
    sentCount: 45,
  },
  {
    id: "3",
    title: "Interview Invitation",
    content:
      "Dear {candidate_name},\n\nWe are pleased to invite you for an interview for the {position} position.\n\nInterview Details:\nDate: {interview_date}\nTime: {interview_time}\nLocation: {interview_location}\n\nPlease confirm your availability at your earliest convenience.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-01T09:15:00"),
    updatedAt: new Date("2024-02-01T09:15:00"),
    sentCount: 28,
  },
  {
    id: "4",
    title: "Follow-up - Additional Information",
    content:
      "Dear {candidate_name},\n\nThank you for your application for the {position} position.\n\nWe would like to request some additional information from you:\n- Expected salary range\n- Availability start date\n- References\n\nPlease provide this information at your earliest convenience.\n\nBest regards,\nRecruitment Team",
    type: "other",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-05T11:20:00"),
    updatedAt: new Date("2024-02-05T11:20:00"),
    sentCount: 8,
  },
  {
    id: "5",
    title: "Rejection - Overqualified",
    content:
      "Dear {candidate_name},\n\nThank you for your interest in the {position} position.\n\nWhile we were impressed with your qualifications, we feel that your experience level exceeds the requirements for this role. We believe this position may not provide the level of challenge you are seeking.\n\nWe will keep your resume on file for future opportunities that may be a better fit.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-10T16:45:00"),
    updatedAt: new Date("2024-02-10T16:45:00"),
    sentCount: 15,
  },
];
