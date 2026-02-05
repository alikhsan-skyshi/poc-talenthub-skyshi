import type {
  Candidate,
  Education,
  ApplicationHistory,
  FeedbackHistory,
} from "@/types/candidate";

// Dummy education data
const getEducationByCandidateId = (candidateId: string): Education[] => {
  const educationMap: Record<string, Education[]> = {
    "1": [
      {
        degree: "Bachelor of Computer Science",
        institution: "Universitas Indonesia",
        year: "2018-2022",
        major: "Software Engineering",
      },
    ],
    "2": [
      {
        degree: "Master of Business Administration",
        institution: "Institut Teknologi Bandung",
        year: "2015-2017",
      },
      {
        degree: "Bachelor of Engineering",
        institution: "Universitas Gadjah Mada",
        year: "2011-2015",
        major: "Industrial Engineering",
      },
    ],
    "3": [
      {
        degree: "Bachelor of Design",
        institution: "Institut Seni Indonesia",
        year: "2019-2023",
        major: "Visual Communication Design",
      },
    ],
  };

  return educationMap[candidateId] || [
    {
      degree: "Bachelor Degree",
      institution: "University",
      year: "2020-2024",
    },
  ];
};

// Dummy application history
const getApplicationHistoryByCandidateId = (
  candidateId: string
): ApplicationHistory[] => {
  const historyMap: Record<string, ApplicationHistory[]> = {
    "1": [
      {
        id: "hist-1-1",
        jobTitle: "Software Engineer - Full Stack",
        companyName: "Tech Corp Indonesia",
        appliedAt: new Date("2024-02-15T10:30:00"),
        status: "cv_review",
      },
      {
        id: "hist-1-2",
        jobTitle: "Full Stack Developer",
        companyName: "Startup Hub",
        appliedAt: new Date("2024-01-20T14:00:00"),
        status: "applied",
      },
    ],
    "2": [
      {
        id: "hist-2-1",
        jobTitle: "Product Manager",
        companyName: "Digital Solutions",
        appliedAt: new Date("2024-02-14T14:20:00"),
        status: "ready_for_interview",
      },
      {
        id: "hist-2-2",
        jobTitle: "Senior Product Manager",
        companyName: "E-Commerce Platform",
        appliedAt: new Date("2024-01-10T09:00:00"),
        status: "cv_review",
      },
    ],
    "3": [
      {
        id: "hist-3-1",
        jobTitle: "UI/UX Designer",
        companyName: "Innovate Labs",
        appliedAt: new Date("2024-02-13T09:15:00"),
        status: "applied",
      },
    ],
  };

  return historyMap[candidateId] || [];
};

// CV URLs (dummy - in production would be actual file URLs)
const getCvUrlByCandidateId = (candidateId: string): string | undefined => {
  // For demo purposes, using a sample PDF URL
  // In production, this would be the actual uploaded CV URL
  return `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
};

// Get profile data by candidate ID
const getProfileDataByCandidateId = (
  candidateId: string
): {
  educationLevel: string;
  educationInstitution: string;
  applicationSource: string;
  lastSalary: string;
  expectedSalary: string;
  notes: string;
} => {
  const profileMap: Record<
    string,
    {
      educationLevel: string;
      educationInstitution: string;
      applicationSource: string;
      lastSalary: string;
      expectedSalary: string;
      notes: string;
    }
  > = {
    "1": {
      educationLevel: "S-1",
      educationInstitution: "Universitas Amikom",
      applicationSource: "LinkedIn",
      lastSalary: "< Rp 7.000.000",
      expectedSalary: "Rp 7.100.000 - Rp 8.000.000",
      notes: "Kandidat memiliki pengalaman yang baik dalam full stack development. Tertarik dengan teknologi terbaru.",
    },
    "2": {
      educationLevel: "S-2",
      educationInstitution: "Institut Teknologi Bandung",
      applicationSource: "Glints",
      lastSalary: "Rp 10.000.000 - Rp 15.000.000",
      expectedSalary: "Rp 15.000.000 - Rp 20.000.000",
      notes: "Product Manager dengan track record yang solid. Memiliki pengalaman di startup dan perusahaan besar.",
    },
    "3": {
      educationLevel: "S-1",
      educationInstitution: "Institut Seni Indonesia",
      applicationSource: "Jobstreet",
      lastSalary: "< Rp 5.000.000",
      expectedSalary: "Rp 6.000.000 - Rp 8.000.000",
      notes: "UI/UX Designer kreatif dengan portfolio yang menarik. Cocok untuk proyek-proyek inovatif.",
    },
  };

  return (
    profileMap[candidateId] || {
      educationLevel: "S-1",
      educationInstitution: "Universitas",
      applicationSource: "LinkedIn",
      lastSalary: "Not disclosed",
      expectedSalary: "Negotiable",
      notes: "",
    }
  );
};

// Dummy feedback history
const getFeedbackHistoryByCandidateId = (
  candidateId: string
): FeedbackHistory[] => {
  const feedbackMap: Record<string, FeedbackHistory[]> = {
    "1": [
      {
        id: "fb-1-1",
        templateTitle: "Interview Invitation",
        subject: "Interview Invitation - Software Engineer Position",
        sentAt: new Date("2024-02-16T10:00:00"),
        sentBy: "John Doe",
        status: "read",
        jobTitle: "Software Engineer - Full Stack",
      },
      {
        id: "fb-1-2",
        templateTitle: "Follow-up - Additional Information",
        subject: "Additional Information Request",
        sentAt: new Date("2024-02-14T14:30:00"),
        sentBy: "John Doe",
        status: "delivered",
        jobTitle: "Software Engineer - Full Stack",
      },
      {
        id: "fb-1-3",
        templateTitle: "Application Received",
        subject: "Thank you for applying",
        sentAt: new Date("2024-01-21T09:00:00"),
        sentBy: "Jane Smith",
        status: "read",
        jobTitle: "Full Stack Developer",
      },
    ],
    "2": [
      {
        id: "fb-2-1",
        templateTitle: "Acceptance - Full Stack Developer",
        subject: "Congratulations! You've been selected",
        sentAt: new Date("2024-02-15T09:00:00"),
        sentBy: "John Doe",
        status: "read",
        jobTitle: "Product Manager",
      },
      {
        id: "fb-2-2",
        templateTitle: "CV Review Complete",
        subject: "Your CV has been reviewed",
        sentAt: new Date("2024-01-12T10:00:00"),
        sentBy: "Jane Smith",
        status: "read",
        jobTitle: "Senior Product Manager",
      },
    ],
    "3": [
      {
        id: "fb-3-1",
        templateTitle: "Rejection - General",
        subject: "Thank you for your application",
        sentAt: new Date("2024-02-13T16:00:00"),
        sentBy: "John Doe",
        status: "sent",
        jobTitle: "UI/UX Designer",
      },
    ],
  };

  return feedbackMap[candidateId] || [];
};

export const enrichCandidateData = (candidate: Candidate): Candidate => {
  const profileData = getProfileDataByCandidateId(candidate.id);
  return {
    ...candidate,
    education: getEducationByCandidateId(candidate.id),
    applicationHistory: getApplicationHistoryByCandidateId(candidate.id),
    feedbackHistory: getFeedbackHistoryByCandidateId(candidate.id),
    cvUrl: getCvUrlByCandidateId(candidate.id),
    ...profileData,
  };
};
