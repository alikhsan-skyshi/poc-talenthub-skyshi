"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateReviewModal } from "@/components/candidate/candidate-review-modal";
import { SendFeedbackModal } from "@/components/candidate/send-feedback-modal";
import { SwitchJobModal } from "@/components/candidate/switch-job-modal";
import { CandidateFeedbackModal } from "@/components/candidate/candidate-feedback-modal";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import { dummyTemplates } from "@/lib/data/dummy-templates";
import { enrichCandidateData } from "@/lib/data/candidate-details";
import type { Candidate, CandidateStage } from "@/types/candidate";
import type { ApplicationForm } from "@/types/application-form";

const ITEMS_PER_PAGE = 10;

export default function MyCandidatePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(dummyCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number>(-1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSendFeedbackModalOpen, setIsSendFeedbackModalOpen] = useState(false);
  const [isSendToCodaSuccessOpen, setIsSendToCodaSuccessOpen] = useState(false);
  const [codaLink, setCodaLink] = useState("");
  const [sentCandidatesCount, setSentCandidatesCount] = useState(0);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isArchiveSuccessOpen, setIsArchiveSuccessOpen] = useState(false);
  const [isRejectSuccessOpen, setIsRejectSuccessOpen] = useState(false);
  const [isTakeOutConfirmOpen, setIsTakeOutConfirmOpen] = useState(false);
  const [isTakeOutSuccessOpen, setIsTakeOutSuccessOpen] = useState(false);
  const [isSwitchJobModalOpen, setIsSwitchJobModalOpen] = useState(false);
  const [selectedCandidatesForSwitch, setSelectedCandidatesForSwitch] =
    useState<Candidate[]>([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackModalCandidate, setFeedbackModalCandidate] = useState<Candidate | null>(null);
  const [feedbackModalCandidates, setFeedbackModalCandidates] = useState<Candidate[]>([]);
  const [feedbackActionType, setFeedbackActionType] = useState<"approve" | "reject">("approve");
  const [pendingActionCandidates, setPendingActionCandidates] = useState<Set<string>>(new Set());
  const [totalCandidatesToProcess, setTotalCandidatesToProcess] = useState(0);
  const [archivedCount, setArchivedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [takenOutCount, setTakenOutCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<CandidateStage | "all">("all");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(
    new Set()
  );

  // Filter and search candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Filter by stage
    if (stageFilter !== "all") {
      filtered = filtered.filter((c) => c.stage === stageFilter);
    }

    // Search by name or role
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [candidates, searchQuery, stageFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, stageFilter]);

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


  const handleArchive = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to archive");
      return;
    }
    setIsArchiveConfirmOpen(true);
  };

  const handleTakeOut = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to take out");
      return;
    }
    setIsTakeOutConfirmOpen(true);
  };

  // Single candidate actions from modal
  const handleApproveSingle = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    
    // Close review modal and open feedback modal
    setIsReviewModalOpen(false);
    setPendingActionCandidates(new Set([candidateId]));
    setTotalCandidatesToProcess(1);
    setFeedbackModalCandidate(candidate);
    setFeedbackModalCandidates([candidate]);
    setFeedbackActionType("approve");
    setIsFeedbackModalOpen(true);
  };

  const handleRejectSingle = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    
    // Close review modal and open feedback modal
    setIsReviewModalOpen(false);
    setPendingActionCandidates(new Set([candidateId]));
    setTotalCandidatesToProcess(1);
    setFeedbackModalCandidate(candidate);
    setFeedbackModalCandidates([candidate]);
    setFeedbackActionType("reject");
    setIsFeedbackModalOpen(true);
  };

  const handleTransferSingle = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    
    // Close review modal and open switch job modal
    setIsReviewModalOpen(false);
    setSelectedCandidatesForSwitch([candidate]);
    setIsSwitchJobModalOpen(true);
  };

  const handleTakeOutSingle = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    
    if (confirm(`Are you sure you want to take out ${candidate.name}?`)) {
      // TODO: Implement actual API call
      try {
        setCandidates((prev) =>
          prev.map((c) =>
            c.id === candidateId ? { ...c, stage: "applied" as const } : c
          )
        );
        // Close review modal
        setIsReviewModalOpen(false);
        setSelectedCandidate(null);
        setSelectedCandidateIndex(-1);
        alert(`${candidate.name} has been taken out successfully`);
      } catch (error) {
        console.error("Error taking out candidate:", error);
        alert("Failed to take out candidate. Please try again.");
      }
    }
  };

  const handleConfirmTakeOut = async () => {
    setIsTakeOutConfirmOpen(false);
    const count = selectedCandidateIds.size;
    
    // TODO: Implement actual API call to take out candidates
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // await fetch('/api/candidates/take-out', {
      //   method: 'POST',
      //   body: JSON.stringify({ candidateIds: Array.from(selectedCandidateIds) }),
      // });
      
      setTakenOutCount(count);
      setSelectedCandidateIds(new Set());
      setIsTakeOutSuccessOpen(true);
    } catch (error) {
      console.error("Error taking out candidates:", error);
      alert("Failed to take out candidates. Please try again.");
    }
  };

  const handleConfirmArchive = async () => {
    setIsArchiveConfirmOpen(false);
    const count = selectedCandidateIds.size;
    
    // TODO: Implement actual API call to archive candidates
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // await fetch('/api/candidates/archive', {
      //   method: 'POST',
      //   body: JSON.stringify({ candidateIds: Array.from(selectedCandidateIds) }),
      // });
      
      setArchivedCount(count);
      setSelectedCandidateIds(new Set());
      setIsArchiveSuccessOpen(true);
    } catch (error) {
      console.error("Error archiving candidates:", error);
      alert("Failed to archive candidates. Please try again.");
    }
  };

  const handleApprove = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to approve");
      return;
    }
    
    // For bulk approve, process first candidate and queue the rest
    const selectedCandidates = candidates.filter((c) =>
      selectedCandidateIds.has(c.id)
    );
    
    if (selectedCandidates.length > 0) {
      setPendingActionCandidates(selectedCandidateIds);
      setTotalCandidatesToProcess(selectedCandidateIds.size);
      setFeedbackModalCandidate(selectedCandidates[0]);
      setFeedbackModalCandidates(selectedCandidates);
      setFeedbackActionType("approve");
      setIsFeedbackModalOpen(true);
    }
  };

  const handleBulkReject = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to reject");
      return;
    }
    
    // For bulk reject, process first candidate and queue the rest
    const selectedCandidates = candidates.filter((c) =>
      selectedCandidateIds.has(c.id)
    );
    
    if (selectedCandidates.length > 0) {
      setPendingActionCandidates(selectedCandidateIds);
      setTotalCandidatesToProcess(selectedCandidateIds.size);
      setFeedbackModalCandidate(selectedCandidates[0]);
      setFeedbackModalCandidates(selectedCandidates);
      setFeedbackActionType("reject");
      setIsFeedbackModalOpen(true);
    }
  };


  const handleSendCandidateFeedback = async (
    candidateId: string,
    templateId: string,
    content: string,
    subject: string,
    attachment?: File | null
  ) => {
    // TODO: Implement actual API call to send feedback
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
    
    console.log("Sending feedback:", { candidateId, templateId, content, subject, attachment: attachment?.name });
    
    // After sending feedback, perform the action (approve or reject)
    const newPendingCandidates = new Set(pendingActionCandidates);
    newPendingCandidates.delete(candidateId);
    
    if (feedbackActionType === "approve") {
      // Update candidate status to qualified
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, status: "qualified" as const } : c
        )
      );
    } else {
      // Remove candidate (reject)
      setCandidates((prev) =>
        prev.filter((c) => c.id !== candidateId)
      );
    }
    
    // If there are more candidates to process, show next one
    if (newPendingCandidates.size > 0) {
      const remainingCandidates = candidates.filter((c) =>
        newPendingCandidates.has(c.id)
      );
      if (remainingCandidates.length > 0) {
        setFeedbackModalCandidate(remainingCandidates[0]);
        setFeedbackModalCandidates(remainingCandidates);
        setPendingActionCandidates(newPendingCandidates);
        return; // Don't close modal, continue with next candidate
      }
    }
    
    // All candidates processed, close modal and reset
    setIsFeedbackModalOpen(false);
    setFeedbackModalCandidate(null);
    setFeedbackModalCandidates([]);
    setPendingActionCandidates(new Set());
    setSelectedCandidateIds(new Set());
    
    // Show success message
    const totalProcessed = totalCandidatesToProcess;
    if (feedbackActionType === "approve") {
      alert(`${totalProcessed} candidate(s) approved successfully`);
    } else {
      setRejectedCount(totalProcessed);
      setIsRejectSuccessOpen(true);
    }
    setTotalCandidatesToProcess(0);
  };

  const handleSendFeedback = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to send feedback");
      return;
    }
    setIsSendFeedbackModalOpen(true);
  };

  const handleSendFeedbackSubmit = async (
    templateId: string,
    candidateIds: string[]
  ) => {
    // TODO: Implement actual API call to send feedback
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In production, this would be:
    // await fetch('/api/feedback/send', {
    //   method: 'POST',
    //   body: JSON.stringify({ templateId, candidateIds }),
    // });
    
    console.log("Sending feedback:", { templateId, candidateIds });
  };

  const handleSendToCoda = async () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to send to Coda");
      return;
    }

    // TODO: Implement actual API call to send data to Coda
    // Simulate API call
    try {
      // Simulate sending data to Coda
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate Coda link (in production, this would come from the API response)
      // For now, use a dummy Coda document link
      // In production, the API would return the actual Coda document URL
      const link = "https://coda.io/d/Talent-Hub_dQ1vX2abc3";
      setCodaLink(link);
      setSentCandidatesCount(selectedCandidateIds.size);
      
      // Show success modal
      setIsSendToCodaSuccessOpen(true);
    } catch (error) {
      console.error("Error sending to Coda:", error);
      alert("Failed to send data to Coda. Please try again.");
    }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stageOptions = [
    { value: "all", label: "All Stages" },
    { value: "applied", label: "Applied" },
    { value: "cv_review", label: "CV Review" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">In Review</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage all your candidates
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              options={stageOptions}
              value={stageFilter}
              onChange={(e) =>
                setStageFilter(e.target.value as CandidateStage | "all")
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleApprove}
              disabled={selectedCandidateIds.size === 0}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkReject}
              disabled={selectedCandidateIds.size === 0}
            >
              Reject
            </Button>
            <span className="text-gray-300 mx-1">|</span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSwitchJob}
              disabled={selectedCandidateIds.size === 0}
            >
              Transfer
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTakeOut}
              disabled={selectedCandidateIds.size === 0}
            >
              Take Out
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <CandidateTable
            candidates={paginatedCandidates}
            selectedCandidateIds={selectedCandidateIds}
            onReviewCV={handleReviewCV}
            onChatWhatsApp={handleChatWhatsApp}
            onSelectCandidate={handleSelectCandidate}
            onSelectAll={handleSelectAll}
            hideWhatsApp={true}
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
        showStageRadio={true}
        onPrevious={handlePreviousCandidate}
        onNext={handleNextCandidate}
        hasPrevious={selectedCandidateIndex > 0}
        hasNext={selectedCandidateIndex >= 0 && selectedCandidateIndex < filteredCandidates.length - 1}
        showInReviewButtons={true}
        onApprove={selectedCandidate ? () => handleApproveSingle(selectedCandidate.id) : undefined}
        onRejectInReview={selectedCandidate ? () => handleRejectSingle(selectedCandidate.id) : undefined}
        onTransfer={selectedCandidate ? () => handleTransferSingle(selectedCandidate.id) : undefined}
        onTakeOut={selectedCandidate ? () => handleTakeOutSingle(selectedCandidate.id) : undefined}
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

      <CandidateFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setFeedbackModalCandidate(null);
          setFeedbackModalCandidates([]);
          setPendingActionCandidates(new Set());
          setTotalCandidatesToProcess(0);
        }}
        candidate={feedbackModalCandidate}
        candidates={feedbackModalCandidates}
        templates={dummyTemplates}
        actionType={feedbackActionType}
        onSend={handleSendCandidateFeedback}
      />

      <SendFeedbackModal
        isOpen={isSendFeedbackModalOpen}
        onClose={() => setIsSendFeedbackModalOpen(false)}
        templates={dummyTemplates}
        selectedCandidates={candidates.filter((c) =>
          selectedCandidateIds.has(c.id)
        )}
        onSend={handleSendFeedbackSubmit}
      />

      {/* Send to Coda Success Modal */}
      <Modal
        isOpen={isSendToCodaSuccessOpen}
        onClose={() => setIsSendToCodaSuccessOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Data Berhasil Dikirim ke Coda!
            </h3>
            <p className="text-gray-600 mb-2">
              <strong>{sentCandidatesCount}</strong> data kandidat telah berhasil dikirim ke Coda.
            </p>
            <a
              href={codaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline font-medium inline-block mt-2"
            >
              Klik di sini untuk melihat
            </a>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => setIsSendToCodaSuccessOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={isArchiveConfirmOpen}
        onClose={() => setIsArchiveConfirmOpen(false)}
        title="Konfirmasi Archive"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin mengarchive <strong>{selectedCandidateIds.size}</strong> kandidat yang dipilih?
          </p>
          <p className="text-sm text-gray-500">
            Kandidat yang diarchive akan dipindahkan ke halaman Archive.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsArchiveConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirmArchive}>
              Archive
            </Button>
          </div>
        </div>
      </Modal>

      {/* Archive Success Modal */}
      <Modal
        isOpen={isArchiveSuccessOpen}
        onClose={() => setIsArchiveSuccessOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kandidat Berhasil Diarchive!
            </h3>
            <p className="text-gray-600">
              <strong>{archivedCount}</strong> kandidat telah berhasil diarchive dan dipindahkan ke halaman Archive.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => setIsArchiveSuccessOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Success Modal */}
      <Modal
        isOpen={isRejectSuccessOpen}
        onClose={() => setIsRejectSuccessOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kandidat Berhasil Ditolak!
            </h3>
            <p className="text-gray-600">
              <strong>{rejectedCount}</strong> kandidat telah berhasil ditolak dan dipindahkan ke halaman Rejected.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => setIsRejectSuccessOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>

      {/* Take Out Confirmation Modal */}
      <Modal
        isOpen={isTakeOutConfirmOpen}
        onClose={() => setIsTakeOutConfirmOpen(false)}
        title="Konfirmasi Take Out"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin mengambil <strong>{selectedCandidateIds.size}</strong> kandidat yang dipilih?
          </p>
          <p className="text-sm text-gray-500">
            Data kandidat akan dipindahkan dari halaman In Review ke halaman New Candidates.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsTakeOutConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirmTakeOut}>
              Take Out
            </Button>
          </div>
        </div>
      </Modal>

      {/* Take Out Success Modal */}
      <Modal
        isOpen={isTakeOutSuccessOpen}
        onClose={() => setIsTakeOutSuccessOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kandidat Berhasil Diambil!
            </h3>
            <p className="text-gray-600">
              <strong>{takenOutCount}</strong> kandidat telah berhasil diambil dan dikembalikan ke halaman My Candidate.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => setIsTakeOutSuccessOpen(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
