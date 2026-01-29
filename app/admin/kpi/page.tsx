"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { dummyForms } from "@/lib/data/dummy-forms";
import { dummyCandidates } from "@/lib/data/dummy-candidates";

interface TalentAcquisition {
  id: string;
  name: string;
  email: string;
  stats: {
    totalForms: number;
    totalApplicants: number;
    cvReview: number;
    readyForInterview: number;
    feedbackSent: number;
    rejected: number;
    archived: number;
  };
}

export default function AdminKPIPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate Talent Acquisition stats based on date range
  const talentAcquisitions = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Dummy mapping of forms/candidates to TA
    // In production, this would come from database
    const taMapping: Record<string, string> = {
      "1": "1", // Form 1 -> TA 1
      "2": "1", // Form 2 -> TA 1
      "3": "2", // Form 3 -> TA 2
      "4": "2", // Form 4 -> TA 2
      "5": "3", // Form 5 -> TA 3
      "6": "4",
      "7": "5",
      "8": "6",
      "9": "7",
      "10": "8",
    };

    const taList: TalentAcquisition[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "4",
        name: "Sarah Lee",
        email: "sarah.lee@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "5",
        name: "Michael Tan",
        email: "michael.tan@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "6",
        name: "Dewi Putri",
        email: "dewi.putri@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "7",
        name: "Andi Pratama",
        email: "andi.pratama@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
      {
        id: "8",
        name: "Nabila Rahma",
        email: "nabila.rahma@talenthub.com",
        stats: {
          totalForms: 0,
          totalApplicants: 0,
          cvReview: 0,
          readyForInterview: 0,
          feedbackSent: 0,
          rejected: 0,
          archived: 0,
        },
      },
    ];

    // Filter and calculate stats per TA
    const filteredForms = dummyForms.filter((form) => {
      if (!start && !end) return true;
      const formDate = new Date(form.createdAt);
      if (start && formDate < start) return false;
      if (end && formDate > end) return false;
      return true;
    });

    const filteredCandidates = dummyCandidates.filter((candidate) => {
      if (!start && !end) return true;
      const candidateDate = new Date(candidate.appliedAt);
      if (start && candidateDate < start) return false;
      if (end && candidateDate > end) return false;
      return true;
    });

    // Calculate stats per TA
    filteredForms.forEach((form) => {
      const taId = taMapping[form.id] || "1";
      const ta = taList.find((t) => t.id === taId);
      if (ta) {
        ta.stats.totalForms++;
      }
    });

    filteredCandidates.forEach((candidate) => {
      // Assign candidate to TA based on form title -> form id -> TA mapping
      const matchedForm = dummyForms.find((f) => f.title === candidate.formTitle);
      const formId = matchedForm?.id;
      const taId = (formId && taMapping[formId]) || "1";
      const ta = taList.find((t) => t.id === taId);
      if (ta) {
        ta.stats.totalApplicants++;
        if (candidate.stage === "cv_review") ta.stats.cvReview++;
        if (candidate.stage === "ready_for_interview")
          ta.stats.readyForInterview++;
        if (candidate.status === "not_qualified") ta.stats.rejected++;
      }
    });

    // Calculate feedback and archived (dummy percentages)
    taList.forEach((ta) => {
      ta.stats.feedbackSent = Math.floor(ta.stats.totalApplicants * 0.6);
      ta.stats.archived = Math.floor(ta.stats.totalApplicants * 0.1);
    });

    return taList;
  }, [startDate, endDate]);

  // Filter TA by search query
  const filteredTAs = useMemo(() => {
    if (!searchQuery.trim()) {
      return talentAcquisitions;
    }
    const query = searchQuery.toLowerCase();
    return talentAcquisitions.filter(
      (ta) =>
        ta.name.toLowerCase().includes(query) ||
        ta.email.toLowerCase().includes(query)
    );
  }, [talentAcquisitions, searchQuery]);

  // Pagination for TA list
  const totalPages = Math.ceil(filteredTAs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTAs = filteredTAs.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, searchQuery]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Filter forms by date range
    const filteredForms = dummyForms.filter((form) => {
      if (!start && !end) return true;
      const formDate = new Date(form.createdAt);
      if (start && formDate < start) return false;
      if (end && formDate > end) return false;
      return true;
    });

    // Filter candidates by date range
    const filteredCandidates = dummyCandidates.filter((candidate) => {
      if (!start && !end) return true;
      const candidateDate = new Date(candidate.appliedAt);
      if (start && candidateDate < start) return false;
      if (end && candidateDate > end) return false;
      return true;
    });

    return {
      totalForms: filteredForms.length,
      totalApplicants: filteredCandidates.length,
      cvReview: filteredCandidates.filter(
        (c) => c.stage === "cv_review"
      ).length,
      readyForInterview: filteredCandidates.filter(
        (c) => c.stage === "ready_for_interview"
      ).length,
      feedbackSent: Math.floor(filteredCandidates.length * 0.6), // Dummy: 60% received feedback
      rejected: filteredCandidates.filter(
        (c) => c.status === "not_qualified"
      ).length,
      archived: Math.floor(filteredCandidates.length * 0.1), // Dummy: 10% archived
    };
  }, [startDate, endDate]);

  const handleResetFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const summaryCards = [
    {
      label: "Total Forms Created",
      value: summaryStats.totalForms,
      color: "bg-primary",
    },
    {
      label: "Total Applicants",
      value: summaryStats.totalApplicants,
      color: "bg-blue-500",
    },
    {
      label: "CV Review",
      value: summaryStats.cvReview,
      color: "bg-yellow-500",
    },
    {
      label: "Ready for Interview",
      value: summaryStats.readyForInterview,
      color: "bg-green-500",
    },
    {
      label: "Feedback Sent",
      value: summaryStats.feedbackSent,
      color: "bg-purple-500",
    },
    {
      label: "Rejected Candidates",
      value: summaryStats.rejected,
      color: "bg-red-500",
    },
    {
      label: "Archived Candidates",
      value: summaryStats.archived,
      color: "bg-gray-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900">KPI Dashboard</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Key Performance Indicators and Statistics
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="bg-white shadow-sm rounded-xl p-3 mb-4 border border-gray-100">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Filter Period
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-sm"
                />
                <Input
                  type="date"
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleResetFilter}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Summary Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
            {summaryCards.map((card) => (
              <div
                key={card.label}
                className="bg-white shadow-sm rounded-xl p-4 border border-gray-100"
              >
                <p className="text-xs font-medium text-gray-600 mb-1">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Talent Acquisition List */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  List Talent Acquisition
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Statistics per Talent Acquisition based on selected period
                </p>
              </div>
            </div>
            <div className="max-w-xs">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talent Acquisition
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Form
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Applicant
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV Review
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ready for Interview
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback Sent
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Archived
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTAs.map((ta) => (
                  <tr key={ta.id} className="hover:bg-light transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {ta.name}
                        </div>
                        <div className="text-xs text-gray-500">{ta.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.totalForms}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.totalApplicants}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.cvReview}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.readyForInterview}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.feedbackSent}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.rejected}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {ta.stats.archived}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
