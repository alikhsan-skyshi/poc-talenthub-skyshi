"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { TemplateTable } from "@/components/feedback-template/template-table";
import { dummyTemplates } from "@/lib/data/dummy-templates";
import type { FeedbackTemplate } from "@/types/feedback-template";

const ITEMS_PER_PAGE = 10;

export default function FeedbackTemplatePage() {
  const router = useRouter();
  const [templates, setTemplates] =
    useState<FeedbackTemplate[]>(dummyTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(
    new Set()
  );

  const handleCreateTemplate = () => {
    router.push("/admin/feedback-template/create");
  };

  const handleEdit = (templateId: string) => {
    // TODO: Navigate to edit template page or open modal
    alert(`Edit template ID: ${templateId}`);
  };

  // Filter templates by search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      return templates;
    }
    const query = searchQuery.toLowerCase();
    return templates.filter((template) =>
      template.title.toLowerCase().includes(query)
    );
  }, [templates, searchQuery]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTemplates.slice(startIndex, endIndex);
  }, [filteredTemplates, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTemplateIds.size === 0) {
      alert("Please select at least one template to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedTemplateIds.size} template(s)?`
      )
    ) {
      setTemplates((prev) =>
        prev.filter((t) => !selectedTemplateIds.has(t.id))
      );
      setSelectedTemplateIds(new Set());
    }
  };

  const handleSelectTemplate = (templateId: string, isSelected: boolean) => {
    setSelectedTemplateIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(templateId);
      } else {
        newSet.delete(templateId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedTemplateIds(new Set(paginatedTemplates.map((t) => t.id)));
    } else {
      setSelectedTemplateIds(new Set());
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback Template
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage feedback templates for candidates
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={handleCreateTemplate}>
              Create Template
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedTemplateIds.size === 0}
            >
              Delete
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <TemplateTable
              templates={paginatedTemplates}
              selectedTemplateIds={selectedTemplateIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSelectTemplate={handleSelectTemplate}
              onSelectAll={handleSelectAll}
            />
          </div>
          {totalPages > 0 && (
            <div className="border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
