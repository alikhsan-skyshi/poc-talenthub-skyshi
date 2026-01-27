"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { TemplateTable } from "@/components/feedback-template/template-table";
import { dummyTemplates } from "@/lib/data/dummy-templates";
import type { FeedbackTemplate } from "@/types/feedback-template";

export default function FeedbackMessagingPage() {
  const router = useRouter();
  const [templates, setTemplates] =
    useState<FeedbackTemplate[]>(dummyTemplates);

  const handleCreateTemplate = () => {
    router.push("/dashboard/feedback-messaging/create");
  };

  const handleEdit = (templateId: string) => {
    // TODO: Navigate to edit template page or open modal
    alert(`Edit template ID: ${templateId}`);
  };

  const handleDelete = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Feedback Messaging
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage feedback templates for candidates
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateTemplate}>
            Create Template
          </Button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <TemplateTable
            templates={templates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
