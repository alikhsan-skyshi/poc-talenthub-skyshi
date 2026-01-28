"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormTable } from "@/components/application-form/form-table";
import { Pagination } from "@/components/ui/pagination";
import { dummyForms } from "@/lib/data/dummy-forms";
import type { ApplicationForm } from "@/types/application-form";

const ITEMS_PER_PAGE = 5;

export default function ApplicationFormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [forms, setForms] = useState<ApplicationForm[]>(dummyForms);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [selectedFormIds, setSelectedFormIds] = useState<Set<string>>(new Set());

  // Filter and search forms
  const filteredForms = useMemo(() => {
    let filtered = forms;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((form) => form.status === statusFilter);
    }

    // Search by company name or form title
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (form) =>
          form.companyName.toLowerCase().includes(query) ||
          form.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [forms, searchQuery, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);
  const paginatedForms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredForms.slice(startIndex, endIndex);
  }, [filteredForms, currentPage]);

  const handleCreateForm = () => {
    router.push("/dashboard/application-form/create");
  };

  const handleViewCandidates = (formId: string) => {
    router.push(`/dashboard/application-form/${formId}/candidates`);
  };

  const handleEdit = (formId: string) => {
    router.push(`/dashboard/application-form/edit/${formId}`);
  };

  const handleDelete = (formId: string) => {
    // TODO: Implement delete functionality with confirmation
    if (confirm("Are you sure you want to delete this form?")) {
      setForms((prevForms) => prevForms.filter((form) => form.id !== formId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedFormIds.size === 0) {
      alert("Please select at least one form to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedFormIds.size} form(s)?`
      )
    ) {
      setForms((prevForms) =>
        prevForms.filter((form) => !selectedFormIds.has(form.id))
      );
      setSelectedFormIds(new Set());
    }
  };

  const handleSelectForm = (formId: string, isSelected: boolean) => {
    setSelectedFormIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(formId);
      } else {
        newSet.delete(formId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedFormIds(new Set(paginatedForms.map((form) => form.id)));
    } else {
      setSelectedFormIds(new Set());
    }
  };

  const handleCopyLink = async (formId: string) => {
    try {
      // Generate the application form URL
      const baseUrl = window.location.origin;
      const formUrl = `${baseUrl}/application/${formId}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(formUrl);
      
      // Show success feedback (you can replace this with a toast notification)
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Failed to copy link. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Form
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage application forms for candidates
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              type="text"
              placeholder="Search by company name or form title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "open" | "closed")
              }
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={handleCreateForm}>
              Create Form
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedFormIds.size === 0}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <FormTable
            forms={paginatedForms}
            selectedFormIds={selectedFormIds}
            onViewCandidates={handleViewCandidates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopyLink={handleCopyLink}
            onSelectForm={handleSelectForm}
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
    </DashboardLayout>
  );
}
