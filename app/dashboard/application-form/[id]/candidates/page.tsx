"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { CheckIcon } from "@/components/ui/icons";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { dummyForms } from "@/lib/data/dummy-forms";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import type { ApplicationForm, FormWave } from "@/types/application-form";
import type { Candidate, CandidateStatus } from "@/types/candidate";

interface CandidateGroup {
  wave: FormWave;
  candidates: Candidate[];
}

export default function FormCandidatesPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [form, setForm] = useState<ApplicationForm | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | "all">("all");
  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [isDueDateSet, setIsDueDateSet] = useState(false);
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [currentPagePerWave, setCurrentPagePerWave] = useState<Record<number, number>>({});

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const foundForm = dummyForms.find((f) => f.id === formId);
    if (!foundForm) {
      alert("Form not found");
      router.push("/dashboard/application-form");
      return;
    }
    setForm(foundForm);
  }, [formId, router]);

  // Group candidates by wave
  const candidateGroups = useMemo(() => {
    if (!form) return [];

    // Get candidates that applied to this form
    const formCandidates = dummyCandidates.filter(
      (candidate) => candidate.formTitle === form.title
    );

    // If form has no waves, create default wave from createdAt
    if (!form.waves || form.waves.length === 0) {
      const defaultWave: FormWave = {
        waveNumber: 1,
        openedAt: form.createdAt,
        closedAt: form.status === "closed" ? new Date() : undefined,
      };
      return [
        {
          wave: defaultWave,
          candidates: formCandidates,
        },
      ];
    }

    // Group candidates by wave based on appliedAt date
    const groups: CandidateGroup[] = form.waves.map((wave, index) => {
      const openedAt = wave.openedAt;
      const closedAt = wave.closedAt;
      
      // Determine the end date for this wave
      // If wave is closed, use closedAt
      // If wave is still open, use current date or next wave's openedAt (if exists)
      let waveEndDate: Date;
      if (closedAt) {
        waveEndDate = closedAt;
      } else if (form.waves && index < form.waves.length - 1) {
        // If there's a next wave, this wave ends when next wave starts
        waveEndDate = form.waves[index + 1].openedAt;
      } else {
        // Last wave and still open
        waveEndDate = new Date();
      }

      let candidates = formCandidates.filter((candidate) => {
        const appliedAt = candidate.appliedAt;
        return appliedAt >= openedAt && appliedAt < waveEndDate;
      });

      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        candidates = candidates.filter((candidate) =>
          candidate.name.toLowerCase().includes(query)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        candidates = candidates.filter(
          (candidate) => candidate.status === statusFilter
        );
      }

      return {
        wave,
        candidates,
      };
    });

    return groups;
  }, [form, searchQuery, statusFilter]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleOpenClick = () => {
    setIsOpenModalOpen(true);
  };

  const handleSetDueDate = () => {
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Due date cannot be in the past");
      return;
    }

    setIsDueDateSet(true);
    // TODO: Implement logic to open form with due date
    // This would typically update the form status and create a new wave
    console.log("Due date set:", selectedDate);
  };

  const handleCloseModal = () => {
    setIsOpenModalOpen(false);
    if (isDueDateSet) {
      // Reset form after closing
      setDueDate("");
      setIsDueDateSet(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get current wave to display
  const currentWave = candidateGroups[currentWaveIndex];
  const currentPage = currentPagePerWave[currentWaveIndex] || 1;

  // Calculate pagination for current wave
  const totalPagesForCurrentWave = currentWave
    ? Math.ceil(currentWave.candidates.length / ITEMS_PER_PAGE)
    : 0;

  const paginatedCandidates = useMemo(() => {
    if (!currentWave) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return currentWave.candidates.slice(startIndex, endIndex);
  }, [currentWave, currentPage]);

  const handleWavePageChange = (page: number) => {
    setCurrentPagePerWave((prev) => ({
      ...prev,
      [currentWaveIndex]: page,
    }));
  };

  const handlePreviousWave = () => {
    if (currentWaveIndex > 0) {
      setCurrentWaveIndex(currentWaveIndex - 1);
      // Reset to page 1 when changing wave
      setCurrentPagePerWave((prev) => ({
        ...prev,
        [currentWaveIndex - 1]: 1,
      }));
    }
  };

  const handleNextWave = () => {
    if (currentWaveIndex < candidateGroups.length - 1) {
      setCurrentWaveIndex(currentWaveIndex + 1);
      // Reset to page 1 when changing wave
      setCurrentPagePerWave((prev) => ({
        ...prev,
        [currentWaveIndex + 1]: 1,
      }));
    }
  };

  // Reset wave index when filters change
  useEffect(() => {
    setCurrentWaveIndex(0);
    setCurrentPagePerWave({});
  }, [searchQuery, statusFilter]);

  if (!form) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/dashboard/application-form")}
            className="mb-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Application Forms
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            Candidates - {form.title}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {form.companyName}
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              options={[
                { value: "all", label: "All Status" },
                { value: "qualified", label: "Qualified" },
                { value: "not_qualified", label: "Not Qualified" },
              ]}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as CandidateStatus | "all")
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={handleOpenClick}>
              Open
            </Button>
          </div>
        </div>

        {candidateGroups.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center py-8 text-gray-500">
              No candidates found for this form
            </div>
          </div>
        ) : currentWave ? (
          <div className="space-y-4">
            {/* Wave Header */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Wave {currentWave.wave.waveNumber}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    <span>
                      Opened: {formatDate(currentWave.wave.openedAt)}
                    </span>
                    {currentWave.wave.closedAt && (
                      <span className="ml-4">
                        Closed: {formatDate(currentWave.wave.closedAt)}
                      </span>
                    )}
                    {!currentWave.wave.closedAt && (
                      <span className="ml-4 text-green-600 font-medium">
                        (Still Open)
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {currentWave.candidates.length} kandidat
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            {currentWave.candidates.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8">
                <div className="text-center py-4 text-gray-500 text-sm">
                  Tidak ada kandidat pada gelombang ini
                </div>
              </div>
            ) : (
                  <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Experience
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Applied At
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCandidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {candidate.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {candidate.experience}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-500">
                              {formatDateShort(candidate.appliedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {candidate.status === "qualified" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Qualified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Not Qualified
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination for current wave */}
                {totalPagesForCurrentWave > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesForCurrentWave}
                    onPageChange={handleWavePageChange}
                  />
                )}
              </div>
            )}

            {/* Wave Navigation */}
            {candidateGroups.length > 1 && (
              <div className="flex items-center justify-between bg-white shadow-sm rounded-xl p-4 border border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePreviousWave}
                  disabled={currentWaveIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Previous Wave
                </Button>
                <div className="text-sm text-gray-600">
                  Wave {currentWaveIndex + 1} of {candidateGroups.length}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextWave}
                  disabled={currentWaveIndex === candidateGroups.length - 1}
                  className="flex items-center gap-2"
                >
                  Next Wave
                  <ArrowLeftIcon className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Open Form Modal */}
      <Modal
        isOpen={isOpenModalOpen}
        onClose={handleCloseModal}
        title="Open Form"
        size="md"
      >
        <div className="space-y-4">
          {!isDueDateSet ? (
            <>
              <p className="text-gray-700">
                Set a due date for this form. The form will automatically close when the due date is reached.
              </p>
              <div className="bg-primary-50 border border-primary-200 rounded-xl shadow-sm p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Set Due Date <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  The form will automatically close when the due date is reached.
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={getMinDate()}
                    className="flex-1"
                  />
                  <Button variant="primary" onClick={handleSetDueDate}>
                    Set Due Date
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
                <CheckIcon className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-center text-gray-700">
                Form has been opened successfully!
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(dueDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4">
            <Button variant="primary" onClick={handleCloseModal}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
