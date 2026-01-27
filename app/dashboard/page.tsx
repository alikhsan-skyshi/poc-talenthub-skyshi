"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { CandidateTable } from "@/components/candidate/candidate-table";
import { CandidateReviewModal } from "@/components/candidate/candidate-review-modal";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import { enrichCandidateData } from "@/lib/data/candidate-details";
import type {
  Candidate,
  CandidateStage,
  ReadyFor,
  CandidateStatus,
} from "@/types/candidate";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(dummyCandidates);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [readyForFilter, setReadyForFilter] = useState<ReadyFor | "all">("all");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">(
    "all"
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(
    new Set()
  );

  // Filter and search candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidates;

    // Filter by ready for
    if (readyForFilter !== "all") {
      filtered = filtered.filter((c) => c.readyFor === readyForFilter);
    }

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
  }, [candidates, searchQuery, readyForFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, readyForFilter, statusFilter]);

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

  const handlePick = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to pick");
      return;
    }
    // TODO: Implement pick functionality
    alert(
      `Pick ${selectedCandidateIds.size} candidate(s) - Feature coming soon`
    );
  };

  const handleDelete = () => {
    if (selectedCandidateIds.size === 0) {
      alert("Please select at least one candidate to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedCandidateIds.size} candidate(s)?`
      )
    ) {
      setCandidates((prev) =>
        prev.filter((c) => !selectedCandidateIds.has(c.id))
      );
      setSelectedCandidateIds(new Set());
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

  const readyForOptions = [
    { value: "all", label: "All Ready For" },
    { value: "onsite", label: "Onsite" },
    { value: "hybrid", label: "Hybrid" },
    { value: "remote", label: "Remote" },
    { value: "flexible", label: "Flexible" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "qualified", label: "Qualified" },
    { value: "not_qualified", label: "Not Qualified" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by name, role, or form..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              options={readyForOptions}
              value={readyForFilter}
              onChange={(e) =>
                setReadyForFilter(e.target.value as ReadyFor | "all")
              }
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CandidateStatus | "all")
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePick}
              disabled={selectedCandidateIds.size === 0}
            >
              Pick
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              disabled={selectedCandidateIds.size === 0}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
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
    </DashboardLayout>
  );
}
