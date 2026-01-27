"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FormTable } from "@/components/application-form/form-table";
import { Pagination } from "@/components/ui/pagination";
import { dummyForms } from "@/lib/data/dummy-forms";
import type { ApplicationForm } from "@/types/application-form";

const ITEMS_PER_PAGE = 5;

export default function ApplicationFormPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [forms, setForms] = useState<ApplicationForm[]>(dummyForms);

  // Calculate pagination
  const totalPages = Math.ceil(forms.length / ITEMS_PER_PAGE);
  const paginatedForms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return forms.slice(startIndex, endIndex);
  }, [forms, currentPage]);

  const handleCreateForm = () => {
    router.push("/dashboard/application-form/create");
  };

  const handleViewCandidates = (formId: string) => {
    // TODO: Navigate to candidates page or open modal
    alert(`View candidates for form ID: ${formId}`);
  };

  const handleEdit = (formId: string) => {
    router.push(`/dashboard/application-form/edit/${formId}`);
  };

  const handleDelete = (formId: string) => {
    // TODO: Implement delete functionality with confirmation
    if (confirm("Are you sure you want to delete this form?")) {
      alert(`Delete form ID: ${formId}`);
    }
  };

  const handleToggleStatus = (formId: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              status: form.status === "open" ? "closed" : "open",
            }
          : form
      )
    );
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Form
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage application forms for candidates
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateForm}>
            Create Form
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <FormTable
            forms={paginatedForms}
            onViewCandidates={handleViewCandidates}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onCopyLink={handleCopyLink}
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
