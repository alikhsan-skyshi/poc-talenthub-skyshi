"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateReviewModal } from "@/components/candidate/candidate-review-modal";
import { SwitchJobModal } from "@/components/candidate/switch-job-modal";
import { RejectWithFeedbackModal } from "@/components/candidate/reject-with-feedback-modal";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import { dummyTemplates } from "@/lib/data/dummy-templates";
import { enrichCandidateData } from "@/lib/data/candidate-details";
import type {
  Candidate,
  CandidateStage,
  CandidateStatus,
} from "@/types/candidate";
import type { ApplicationForm } from "@/types/application-form";

const ITEMS_PER_PAGE = 10;

export default function NewCandidatesPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(dummyCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(-1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSwitchJobModalOpen, setIsSwitchJobModalOpen] = useState(false);
  const [isRejectFeedbackModalOpen, setIsRejectFeedbackModalOpen] = useState(false);
  const [selectedCandidatesForSwitch, setSelectedCandidatesForSwitch] =
    useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">(
    "all"
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(
    new Set()
  );

  // Filter and search candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Search by name, role, or form
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          (c.formTitle && c.formTitle.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [candidates, searchQuery, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage]);

  const handleReviewCV = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      const enrichedCandidate = enrichCandidateData(candidate);
      setSelectedCandidate(enrichedCandidate);
      // Find index in filtered candidates
      const index = filteredCandidates.findIndex((c) => c.id === candidateId);
      setSelectedCandidateIndex(index);
      setIsReviewModalOpen(true);
    }
  };

  const handlePreviousCandidate = () => {
    if (selectedCandidateIndex > 0) {
      const prevIndex = selectedCandidateIndex - 1;
      const prevCandidate = filteredCandidates[prevIndex];
      if (prevCandidate) {
        const enrichedCandidate = enrichCandidateData(prevCandidate);
        setSelectedCandidate(enrichedCandidate);
        setSelectedCandidateIndex(prevIndex);
      }
    }
  };

  const handleNextCandidate = () => {
    if (selectedCandidateIndex < filteredCandidates.length - 1) {
      const nextIndex = selectedCandidateIndex + 1;
      const nextCandidate = filteredCandidates[nextIndex];
      if (nextCandidate) {
        const enrichedCandidate = enrichCandidateData(nextCandidate);
        setSelectedCandidate(enrichedCandidate);
        setSelectedCandidateIndex(nextIndex);
      }
    }
  };

  const handleStageChange = (candidateId: string, newStage: CandidateStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    // Update selected candidate if it's the one being changed
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, stage: newStage });
    }
  };

  const handleChatWhatsApp = (candidate: Candidate) => {
    // Open WhatsApp chat
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

  const handlePickSingle = (candidateId: string) => {
    // TODO: Implement pick functionality
    alert(`Pick candidate - Feature coming soon`);
  };

  const handleRejectSingle = (candidateId: string) => {
    // Close review modal and open reject feedback modal
    setIsReviewModalOpen(false);
    setIsRejectFeedbackModalOpen(true);
  };

  const handleSendRejectFeedback = async (
    candidateId: string,
    templateId: string,
    content: string,
    subject: string,
    attachment?: File | null
  ) => {
    // TODO: Implement actual API call to send feedback
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In production, this would be:
    // const formData = new FormData();
    // formData.append('candidateId', candidateId);
    // formData.append('templateId', templateId);
    // formData.append('content', content);
    // formData.append('subject', subject);
    // if (attachment) {
    //   formData.append('attachment', attachment);
    // }
    // await fetch('/api/feedback/send', {
    //   method: 'POST',
    //   body: formData,
    // });
    
    console.log("Sending reject feedback:", { candidateId, templateId, content, subject, attachment: attachment?.name });
    
    // After sending feedback, remove candidate and handle navigation
    const currentIndex = selectedCandidateIndex;
    const remainingCandidates = filteredCandidates.filter((c) => c.id !== candidateId);
    
    setCandidates((prev) =>
      prev.filter((c) => c.id !== candidateId)
    );
    
    // After removing candidate, navigate to next or previous if available
    if (remainingCandidates.length > 0) {
      // If there's a next candidate, show it
      if (currentIndex < remainingCandidates.length) {
        const nextCandidate = remainingCandidates[currentIndex];
        if (nextCandidate) {
          const enrichedCandidate = enrichCandidateData(nextCandidate);
          setSelectedCandidate(enrichedCandidate);
          setSelectedCandidateIndex(currentIndex);
        } else {
          setIsReviewModalOpen(false);
          setSelectedCandidate(null);
          setSelectedCandidateIndex(-1);
        }
      } 
      // If there's a previous candidate, show it
      else if (currentIndex > 0) {
        const prevCandidate = remainingCandidates[currentIndex - 1];
        if (prevCandidate) {
          const enrichedCandidate = enrichCandidateData(prevCandidate);
          setSelectedCandidate(enrichedCandidate);
          setSelectedCandidateIndex(currentIndex - 1);
        } else {
          setIsReviewModalOpen(false);
          setSelectedCandidate(null);
          setSelectedCandidateIndex(-1);
        }
      } else {
        setIsReviewModalOpen(false);
        setSelectedCandidate(null);
        setSelectedCandidateIndex(-1);
      }
    } else {
      setIsReviewModalOpen(false);
      setSelectedCandidate(null);
      setSelectedCandidateIndex(-1);
    }
  };

  const handleSwitchJob = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to switch job");
      return;
    }

    // Get all selected candidates
    const selectedCandidates = candidates.filter((c) =>
      selectedCandidateIds.has(c.id)
    );

    if (selectedCandidates.length > 0) {
      setSelectedCandidatesForSwitch(selectedCandidates);
      setIsSwitchJobModalOpen(true);
    }
  };

  const handleConfirmSwitchJob = (targetJobOpening: ApplicationForm) => {
    if (selectedCandidatesForSwitch.length === 0) return;

    const candidateIdsToUpdate = new Set(
      selectedCandidatesForSwitch.map((c) => c.id)
    );

    // Update all selected candidates' formTitle
    setCandidates((prev) =>
      prev.map((c) =>
        candidateIdsToUpdate.has(c.id)
          ? { ...c, formTitle: targetJobOpening.title }
          : c
      )
    );

    // Update selected candidate if it's one of the changed candidates
    if (
      selectedCandidate &&
      candidateIdsToUpdate.has(selectedCandidate.id)
    ) {
      setSelectedCandidate({
        ...selectedCandidate,
        formTitle: targetJobOpening.title,
      });
    }

    // Close modal and reset
    setIsSwitchJobModalOpen(false);
    setSelectedCandidatesForSwitch([]);
    setSelectedCandidateIds(new Set());
  };

  const handleSelectCandidate = (candidateId: string, isSelected: boolean) => {
    setSelectedCandidateIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(candidateId);
      } else {
        newSet.delete(candidateId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedCandidateIds(new Set(paginatedCandidates.map((c) => c.id)));
    } else {
      setSelectedCandidateIds(new Set());
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "qualified", label: "Qualified" },
    { value: "not_qualified", label: "Not Qualified" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">New Candidates</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by name, role, or form..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CandidateStatus | "all")
              }
            />
          </div>

        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <CandidateTable
            candidates={paginatedCandidates}
            selectedCandidateIds={selectedCandidateIds}
            onReviewCV={handleReviewCV}
            onChatWhatsApp={handleChatWhatsApp}
            showStatus={true}
            hideActions={true}
            onRowClick={handleReviewCV}
            useLocationType={true}
            hideNotSpecified={true}
          />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <CandidateReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedCandidate(null);
          setSelectedCandidateIndex(-1);
        }}
        candidate={selectedCandidate}
        onStageChange={handleStageChange}
        showPickReject={true}
        showStatusLabel={true}
        onPick={selectedCandidate ? () => handlePickSingle(selectedCandidate.id) : undefined}
        onReject={selectedCandidate ? () => handleRejectSingle(selectedCandidate.id) : undefined}
        onPrevious={handlePreviousCandidate}
        onNext={handleNextCandidate}
        hasPrevious={selectedCandidateIndex > 0}
        hasNext={selectedCandidateIndex >= 0 && selectedCandidateIndex < filteredCandidates.length - 1}
      />

      <SwitchJobModal
        isOpen={isSwitchJobModalOpen}
        onClose={() => {
          setIsSwitchJobModalOpen(false);
          setSelectedCandidatesForSwitch([]);
        }}
        candidates={selectedCandidatesForSwitch}
        onConfirm={handleConfirmSwitchJob}
      />

      <RejectWithFeedbackModal
        isOpen={isRejectFeedbackModalOpen}
        onClose={() => {
          setIsRejectFeedbackModalOpen(false);
        }}
        candidate={selectedCandidate}
        templates={dummyTemplates}
        onSend={handleSendRejectFeedback}
      />
    </DashboardLayout>
  );
}
