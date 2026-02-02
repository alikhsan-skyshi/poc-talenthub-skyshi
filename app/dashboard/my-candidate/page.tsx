"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateReviewModal } from "@/components/candidate/candidate-review-modal";
import { SendFeedbackModal } from "@/components/candidate/send-feedback-modal";
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

const ITEMS_PER_PAGE = 10;

export default function MyCandidatePage() {
  const [candidates, setCandidates] = useState<Candidate[]>(dummyCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSendFeedbackModalOpen, setIsSendFeedbackModalOpen] = useState(false);
  const [isSendToCodaSuccessOpen, setIsSendToCodaSuccessOpen] = useState(false);
  const [codaLink, setCodaLink] = useState("");
  const [sentCandidatesCount, setSentCandidatesCount] = useState(0);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [isArchiveSuccessOpen, setIsArchiveSuccessOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isTakeOutConfirmOpen, setIsTakeOutConfirmOpen] = useState(false);
  const [isTakeOutSuccessOpen, setIsTakeOutSuccessOpen] = useState(false);
  const [archivedCount, setArchivedCount] = useState(0);
  const [deletedCount, setDeletedCount] = useState(0);
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
      setIsReviewModalOpen(true);
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

  const handleBulkDelete = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to delete");
      return;
    }
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    const count = selectedCandidateIds.size;
    
    // TODO: Implement actual API call to delete candidates
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In production, this would be:
      // await fetch('/api/candidates/delete', {
      //   method: 'DELETE',
      //   body: JSON.stringify({ candidateIds: Array.from(selectedCandidateIds) }),
      // });
      
      setCandidates((prev) =>
        prev.filter((c) => !selectedCandidateIds.has(c.id))
      );
      setDeletedCount(count);
      setSelectedCandidateIds(new Set());
      setIsDeleteSuccessOpen(true);
    } catch (error) {
      console.error("Error deleting candidates:", error);
      alert("Failed to delete candidates. Please try again.");
    }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stageOptions = [
    { value: "all", label: "All Stages" },
    { value: "applied", label: "Applied" },
    { value: "cv_review", label: "CV Review" },
    { value: "ready_for_interview", label: "Ready for Interview" },
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
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendFeedback}
              disabled={selectedCandidateIds.size === 0}
            >
              Send Feedback
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendToCoda}
              disabled={selectedCandidateIds.size === 0}
            >
              Send to Coda
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleArchive}
              disabled={selectedCandidateIds.size === 0}
            >
              Archive
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleTakeOut}
              disabled={selectedCandidateIds.size === 0}
            >
              Take Out
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedCandidateIds.size === 0}
            >
              Delete
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
        }}
        candidate={selectedCandidate}
        onStageChange={handleStageChange}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Konfirmasi Hapus"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus <strong>{selectedCandidateIds.size}</strong> kandidat yang dipilih?
          </p>
          <p className="text-sm text-red-600 font-medium">
            Tindakan ini tidak dapat dibatalkan. Data kandidat akan dihapus secara permanen.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Batal
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        isOpen={isDeleteSuccessOpen}
        onClose={() => setIsDeleteSuccessOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Kandidat Berhasil Dihapus!
            </h3>
            <p className="text-gray-600">
              <strong>{deletedCount}</strong> kandidat telah berhasil dihapus.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button
              variant="primary"
              onClick={() => setIsDeleteSuccessOpen(false)}
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
            Kandidat yang diambil akan dikembalikan dari archive ke halaman My Candidate.
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
