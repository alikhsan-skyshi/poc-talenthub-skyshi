"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { SuccessModal } from "@/components/form-builder/success-modal";
import { getFormDataById } from "@/lib/data/form-data";
import type { FormField } from "@/types/form-builder";

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formLink, setFormLink] = useState("");

  useEffect(() => {
    // Load form data
    const formData = getFormDataById(formId);

    if (!formData) {
      alert("Form not found");
      router.push("/dashboard/application-form");
      return;
    }

    setTitle(formData.title);
    setDescription(formData.description);
    setFields(formData.fields);
    setIsLoading(false);
  }, [formId, router]);

  const handleSave = () => {
    // Validate
    if (!title.trim() || !description.trim()) {
      alert("Please fill in form title and description");
      return;
    }

    if (fields.length === 0) {
      alert("Please add at least one field to the form");
      return;
    }

    // TODO: Update to backend/API
    // For now, generate a dummy form link
    const link = `${window.location.origin}/form/${formId}`;
    setFormLink(link);

    // Show success modal
    setIsSuccessModalOpen(true);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset? All changes will be lost and the form will be restored to its original state."
      )
    ) {
      const formData = getFormDataById(formId);
      if (formData) {
        setTitle(formData.title);
        setDescription(formData.description);
        setFields(formData.fields);
      }
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    router.push("/dashboard/application-form");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading form data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Form</h1>
          <p className="text-sm text-gray-600 mt-1">
            Modify your application form fields and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <Input
                label="Form Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter form title"
                required
              />
              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter form description"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Form Builder */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Form Fields
            </h2>
            <FormBuilder fields={fields} onFieldsChange={setFields} />
          </div>

          {/* Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Reset Changes
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessClose}
        formLink={formLink}
        isEdit={true}
      />
    </DashboardLayout>
  );
}
