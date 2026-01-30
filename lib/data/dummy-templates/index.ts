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
  {
    id: "6",
    title: "Acceptance - Frontend Developer",
    content:
      "Dear {candidate_name},\n\nCongratulations! We are pleased to offer you the Frontend Developer position.\n\nYour expertise in React and modern web technologies aligns perfectly with our team's needs.\n\nWe look forward to welcoming you to our team.\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-02-12T09:00:00"),
    updatedAt: new Date("2024-02-12T09:00:00"),
    sentCount: 22,
  },
  {
    id: "7",
    title: "Rejection - Not Selected",
    content:
      "Dear {candidate_name},\n\nThank you for applying for the {position} position.\n\nAfter reviewing all applications, we have selected candidates whose qualifications better match our requirements.\n\nWe appreciate your interest and wish you success in your career.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-15T13:20:00"),
    updatedAt: new Date("2024-02-15T13:20:00"),
    sentCount: 38,
  },
  {
    id: "8",
    title: "Interview - Technical Round",
    content:
      "Dear {candidate_name},\n\nWe would like to invite you for a technical interview for the {position} position.\n\nThis interview will focus on your technical skills and problem-solving abilities.\n\nDate: {interview_date}\nTime: {interview_time}\nFormat: Online via Zoom\n\nPlease confirm your attendance.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-02-18T10:30:00"),
    updatedAt: new Date("2024-02-18T10:30:00"),
    sentCount: 31,
  },
  {
    id: "9",
    title: "Acceptance - Backend Developer",
    content:
      "Dear {candidate_name},\n\nWe are delighted to offer you the Backend Developer position.\n\nYour experience with Node.js and database systems makes you an ideal candidate for this role.\n\nPlease let us know when you can start.\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-20T14:15:00"),
    updatedAt: new Date("2024-02-20T14:15:00"),
    sentCount: 18,
  },
  {
    id: "10",
    title: "Rejection - Skills Mismatch",
    content:
      "Dear {candidate_name},\n\nThank you for your application for the {position} position.\n\nWhile we appreciate your interest, we have determined that your skill set does not align with our current requirements.\n\nWe encourage you to apply for other positions that may be a better fit.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-02-22T11:45:00"),
    updatedAt: new Date("2024-02-22T11:45:00"),
    sentCount: 27,
  },
  {
    id: "11",
    title: "Interview - HR Round",
    content:
      "Dear {candidate_name},\n\nWe would like to schedule an HR interview with you for the {position} position.\n\nThis interview will cover your background, career goals, and cultural fit.\n\nDate: {interview_date}\nTime: {interview_time}\n\nLooking forward to speaking with you.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "John Doe",
    createdAt: new Date("2024-02-25T09:30:00"),
    updatedAt: new Date("2024-02-25T09:30:00"),
    sentCount: 42,
  },
  {
    id: "12",
    title: "Acceptance - DevOps Engineer",
    content:
      "Dear {candidate_name},\n\nCongratulations! We are pleased to offer you the DevOps Engineer position.\n\nYour expertise in CI/CD and cloud infrastructure will be valuable to our team.\n\nWelcome aboard!\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-02-28T15:00:00"),
    updatedAt: new Date("2024-02-28T15:00:00"),
    sentCount: 14,
  },
  {
    id: "13",
    title: "Rejection - Position Filled",
    content:
      "Dear {candidate_name},\n\nThank you for your interest in the {position} position.\n\nWe have filled this position with another candidate.\n\nWe will keep your application on file for future opportunities.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "John Doe",
    createdAt: new Date("2024-03-01T10:20:00"),
    updatedAt: new Date("2024-03-01T10:20:00"),
    sentCount: 33,
  },
  {
    id: "14",
    title: "Interview - Final Round",
    content:
      "Dear {candidate_name},\n\nCongratulations on making it to the final round!\n\nWe would like to invite you for a final interview with our team lead.\n\nDate: {interview_date}\nTime: {interview_time}\n\nThis will be the last step in our selection process.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-03-05T13:45:00"),
    updatedAt: new Date("2024-03-05T13:45:00"),
    sentCount: 19,
  },
  {
    id: "15",
    title: "Acceptance - Data Analyst",
    content:
      "Dear {candidate_name},\n\nWe are excited to offer you the Data Analyst position.\n\nYour analytical skills and experience with data visualization tools impressed our team.\n\nWe look forward to working with you.\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "John Doe",
    createdAt: new Date("2024-03-08T11:30:00"),
    updatedAt: new Date("2024-03-08T11:30:00"),
    sentCount: 16,
  },
  {
    id: "16",
    title: "Rejection - Experience Gap",
    content:
      "Dear {candidate_name},\n\nThank you for applying for the {position} position.\n\nWe require candidates with more years of experience for this role.\n\nWe encourage you to gain more experience and reapply in the future.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-03-10T14:00:00"),
    updatedAt: new Date("2024-03-10T14:00:00"),
    sentCount: 24,
  },
  {
    id: "17",
    title: "Interview - Panel Interview",
    content:
      "Dear {candidate_name},\n\nWe would like to invite you for a panel interview.\n\nYou will meet with multiple team members to discuss the {position} role.\n\nDate: {interview_date}\nTime: {interview_time}\nLocation: {interview_location}\n\nPlease prepare to discuss your portfolio and experience.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "John Doe",
    createdAt: new Date("2024-03-12T09:15:00"),
    updatedAt: new Date("2024-03-12T09:15:00"),
    sentCount: 29,
  },
  {
    id: "18",
    title: "Acceptance - UI/UX Designer",
    content:
      "Dear {candidate_name},\n\nCongratulations! We are pleased to offer you the UI/UX Designer position.\n\nYour creative portfolio and design thinking align perfectly with our vision.\n\nWelcome to the team!\n\nBest regards,\nRecruitment Team",
    type: "acceptance",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-03-15T16:20:00"),
    updatedAt: new Date("2024-03-15T16:20:00"),
    sentCount: 21,
  },
  {
    id: "19",
    title: "Rejection - Application Incomplete",
    content:
      "Dear {candidate_name},\n\nThank you for your interest in the {position} position.\n\nUnfortunately, your application was incomplete and we were unable to proceed with the review.\n\nWe encourage you to submit a complete application for future positions.\n\nBest regards,\nRecruitment Team",
    type: "rejection",
    createdBy: "John Doe",
    createdAt: new Date("2024-03-18T10:45:00"),
    updatedAt: new Date("2024-03-18T10:45:00"),
    sentCount: 11,
  },
  {
    id: "20",
    title: "Interview - Phone Screening",
    content:
      "Dear {candidate_name},\n\nWe would like to schedule a phone screening call for the {position} position.\n\nThis will be a brief conversation to discuss your background and interest in the role.\n\nDate: {interview_date}\nTime: {interview_time}\n\nWe will call you at the number provided in your application.\n\nBest regards,\nRecruitment Team",
    type: "interview",
    createdBy: "Jane Smith",
    createdAt: new Date("2024-03-20T13:30:00"),
    updatedAt: new Date("2024-03-20T13:30:00"),
    sentCount: 47,
  },
];
