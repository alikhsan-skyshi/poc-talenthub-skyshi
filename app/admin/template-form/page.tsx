"use client";

import { AdminLayout } from "@/components/layout/admin-layout";
import { useState } from "react";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { Button } from "@/components/ui/button";
import { getDefaultFormFields } from "@/lib/data/default-form-fields";
import type { FormField } from "@/types/form-builder";

export default function TemplateFormPage() {
  const [fields, setFields] = useState<FormField[]>(getDefaultFormFields());

  const handleSave = () => {
    // TODO: Implement save template logic
    alert("Template form saved successfully!");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default form? All changes will be lost.")) {
      setFields(getDefaultFormFields());
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Template Form</h1>
            <p className="text-sm text-gray-600 mt-1">
              Create and manage default form template for application forms
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Form Fields
          </h2>
          <FormBuilder fields={fields} onFieldsChange={setFields} hideAdminLabel={true} />
        </div>
      </div>
    </AdminLayout>
  );
}
