"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TemplateTable } from "@/components/feedback-template/template-table";
import { dummyTemplates } from "@/lib/data/dummy-templates";
import type { FeedbackTemplate } from "@/types/feedback-template";

export default function FeedbackMessagingPage() {
  const router = useRouter();
  const [templates, setTemplates] =
    useState<FeedbackTemplate[]>(dummyTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<Set<string>>(
    new Set()
  );

  const handleCreateTemplate = () => {
    router.push("/dashboard/feedback-messaging/create");
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
      setSelectedTemplateIds(new Set(filteredTemplates.map((t) => t.id)));
    } else {
      setSelectedTemplateIds(new Set());
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Feedback Messaging
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
          <TemplateTable
            templates={filteredTemplates}
            selectedTemplateIds={selectedTemplateIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectTemplate={handleSelectTemplate}
            onSelectAll={handleSelectAll}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
