"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateReviewModal } from "@/components/candidate/candidate-review-modal";
import { SwitchJobModal } from "@/components/candidate/switch-job-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import { dummyForms } from "@/lib/data/dummy-forms";
import { enrichCandidateData } from "@/lib/data/candidate-details";
import type { Candidate, CandidateStage } from "@/types/candidate";
import type { ApplicationForm } from "@/types/application-form";
import { getJobOpeningOptions, getJobOpeningById } from "@/lib/data/job-openings";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [candidates] = useState<Candidate[]>(dummyCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSwitchJobModalOpen, setIsSwitchJobModalOpen] = useState(false);
  const [selectedCandidatesForSwitch, setSelectedCandidatesForSwitch] = useState<Candidate[]>([]);

  // Calculate achievements based on date range
  const achievements = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Filter forms by date range
    let filteredForms = dummyForms;
    if (start) {
      filteredForms = filteredForms.filter(
        (form) => form.createdAt >= start
      );
    }
    if (end) {
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      filteredForms = filteredForms.filter(
        (form) => form.createdAt <= endDateWithTime
      );
    }

    // Filter candidates by date range
    let filteredCandidates = dummyCandidates;
    if (start) {
      filteredCandidates = filteredCandidates.filter(
        (candidate) => candidate.appliedAt >= start
      );
    }
    if (end) {
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      filteredCandidates = filteredCandidates.filter(
        (candidate) => candidate.appliedAt <= endDateWithTime
      );
    }

    // Calculate statistics
    const jobPosting = filteredForms.length;
    const inReview = filteredCandidates.filter(
      (c) => c.stage === "cv_review"
    ).length;
    const approved = filteredCandidates.filter(
      (c) => c.status === "qualified"
    ).length;
    const rejected = filteredCandidates.filter(
      (c) => c.status === "not_qualified"
    ).length;
    const totalCandidatesApplication = inReview + approved + rejected;

    return {
      jobPosting,
      inReview,
      approved,
      rejected,
      totalCandidatesApplication,
    };
  }, [startDate, endDate]);

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get latest 5 candidates (sorted by appliedAt descending)
  const latestCandidates = useMemo(() => {
    return [...candidates]
      .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
      .slice(0, 5);
  }, [candidates]);

  const handleReviewCV = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      const enrichedCandidate = enrichCandidateData(candidate);
      setSelectedCandidate(enrichedCandidate);
      setIsReviewModalOpen(true);
    }
  };

  const handleStageChange = (candidateId: string, newStage: CandidateStage) => {
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, stage: newStage });
    }
  };

  const handleChatWhatsApp = (candidate: Candidate) => {
    if (candidate.phoneNumber) {
      const phoneNumber = candidate.phoneNumber.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Hello ${candidate.name}, I'm contacting you regarding your application for ${candidate.role}.`
      );
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    } else {
      alert(`Phone number not available for ${candidate.name}`);
    }
  };

  const handleTransferSingle = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    
    setIsReviewModalOpen(false);
    setSelectedCandidatesForSwitch([candidate]);
    setIsSwitchJobModalOpen(true);
  };

  const handleConfirmSwitchJob = (targetJobOpening: ApplicationForm) => {
    if (selectedCandidatesForSwitch.length === 0) return;
    setIsSwitchJobModalOpen(false);
    setSelectedCandidatesForSwitch([]);
  };

  const handleViewAll = () => {
    router.push("/dashboard/list-of-candidates");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-4">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-semibold">
                  {getUserInitial()}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Name</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name || user?.username || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Email</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Section */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Achievement
            </h2>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Job Posting
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.jobPosting}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  In Review
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.inReview}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Approved
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.approved}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Rejected
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.rejected}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Candidates Application
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {achievements.totalCandidatesApplication}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Candidates Section */}
          <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">
                Latest Candidates
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={handleViewAll}
              >
                Lihat Semua
              </Button>
            </div>
            <div className="overflow-hidden">
              <CandidateTable
                candidates={latestCandidates}
                onReviewCV={handleReviewCV}
                onChatWhatsApp={handleChatWhatsApp}
                useLocationType={true}
                hideNotSpecified={true}
                hideActions={true}
                hideStage={true}
                hideJobPost={true}
                hideLocation={true}
                showEmail={true}
                onRowClick={handleReviewCV}
              />
            </div>
          </div>
        </div>

        {/* Candidate Review Modal */}
        <CandidateReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
          onStageChange={handleStageChange}
          hideStageSelector={true}
          showApprovedButtons={true}
          onTransferApproved={selectedCandidate ? () => handleTransferSingle(selectedCandidate.id) : undefined}
        />

        {/* Switch Job Modal */}
        <SwitchJobModal
          isOpen={isSwitchJobModalOpen}
          onClose={() => {
            setIsSwitchJobModalOpen(false);
            setSelectedCandidatesForSwitch([]);
          }}
          candidates={selectedCandidatesForSwitch}
          onConfirm={handleConfirmSwitchJob}
        />
      </div>
    </DashboardLayout>
  );
}
