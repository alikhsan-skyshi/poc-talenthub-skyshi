"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { SuccessModal } from "@/components/form-builder/success-modal";
import { getDefaultFormFields } from "@/lib/data/default-form-fields";
import { TrashIcon, PlusIcon, EyeIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { FileUpload } from "@/components/ui/file-upload";
import type { FormField, FormRule, RuleCategory } from "@/types/form-builder";

export default function CreateFormPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>(getDefaultFormFields());
  const [rules, setRules] = useState<FormRule[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | "">("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formLink, setFormLink] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

    // TODO: Save to backend/API
    // For now, generate a dummy form link
    const formId = `form-${Date.now()}`;
    const link = `${window.location.origin}/form/${formId}`;
    setFormLink(link);

    // Show success modal
    setIsSuccessModalOpen(true);
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset? All form data will be lost."
      )
    ) {
      setTitle("");
      setDescription("");
      setFields(getDefaultFormFields());
      setRules([]);
      setSelectedCategory("");
    }
  };

  const handleAddRule = () => {
    if (!selectedCategory) {
      alert("Please select a category first");
      return;
    }

    // Check if rule for this category already exists
    if (rules.some((r) => r.category === selectedCategory)) {
      alert("A rule for this category already exists");
      return;
    }

    const newRule: FormRule = {
      id: `rule-${Date.now()}`,
      category: selectedCategory as RuleCategory,
      values: [],
    };

    setRules([...rules, newRule]);
    setSelectedCategory("");
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  const handleAddRuleValue = (ruleId: string, value: string) => {
    if (!value.trim()) return;

    setRules(
      rules.map((rule) => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            values: [...rule.values, value.trim()],
          };
        }
        return rule;
      })
    );
  };

  const handleRemoveRuleValue = (ruleId: string, valueIndex: number) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            values: rule.values.filter((_, index) => index !== valueIndex),
          };
        }
        return rule;
      })
    );
  };

  const handleUpdateRuleValue = (
    ruleId: string,
    valueIndex: number,
    newValue: string
  ) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === ruleId) {
          const updatedValues = [...rule.values];
          updatedValues[valueIndex] = newValue.trim();
          return {
            ...rule,
            values: updatedValues,
          };
        }
        return rule;
      })
    );
  };

  const getCategoryLabel = (category: RuleCategory) => {
    const labels: Record<RuleCategory, string> = {
      years_of_experience: "Years of Experience",
      expected_salary: "Expected Salary",
    };
    return labels[category];
  };

  const getCategoryPlaceholder = (category: RuleCategory) => {
    const placeholders: Record<RuleCategory, string> = {
      years_of_experience: "e.g., 1 tahun, 2 tahun, 3 tahun",
      expected_salary: "e.g., 3 juta, 5 juta, 7 juta",
    };
    return placeholders[category];
  };

  const categoryOptions = [
    { value: "", label: "Select Category" },
    { value: "years_of_experience", label: "Years of Experience" },
    { value: "expected_salary", label: "Expected Salary" },
  ];

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    router.push("/dashboard/application-form");
  };

  const renderPreviewField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            label={field.label}
            placeholder={field.placeholder || "Enter text"}
            required={field.required}
            disabled={false}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            label={field.label}
            placeholder={field.placeholder || "Enter number"}
            required={field.required}
            disabled={false}
          />
        );
      case "dropdown":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          </div>
        );
      case "checkbox":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
            </div>
          </div>
        );
      case "radio":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={`radio-${field.id}`}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
            </div>
          </div>
        );
      case "date":
        return (
          <Input
            type="date"
            label={field.label}
            required={field.required}
            disabled={false}
          />
        );
      case "file":
        return (
          <FileUpload
            accept=".pdf,.doc,.docx"
            maxSize={10}
            label={field.label}
            required={field.required}
            disabled={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Form</h1>
            <p className="text-sm text-gray-600 mt-1">
              Build your application form by adding fields and customizing them
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2"
          >
            <EyeIcon className="w-4 h-4" />
            Preview Form
          </Button>
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

          {/* Rules Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rules</h2>
            <div className="space-y-4">
              {/* Add Rule */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Select
                    label="Category"
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(e.target.value as RuleCategory | "")
                    }
                  />
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAddRule}
                  disabled={!selectedCategory}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              {/* Rules List */}
              {rules.length > 0 && (
                <div className="space-y-4 mt-6">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {getCategoryLabel(rule.category)}
                        </h3>
                        <IconButton
                          icon={<TrashIcon />}
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRule(rule.id)}
                          tooltip="Delete Rule"
                        />
                      </div>

                      {/* Values List */}
                      <div className="space-y-2 mb-3">
                        {rule.values.map((value, index) => (
                          <div
                            key={index}
                            className="flex gap-2 items-center"
                          >
                            <Input
                              value={value}
                              onChange={(e) =>
                                handleUpdateRuleValue(
                                  rule.id,
                                  index,
                                  e.target.value
                                )
                              }
                              placeholder={getCategoryPlaceholder(rule.category)}
                              className="flex-1"
                            />
                            <IconButton
                              icon={<TrashIcon />}
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveRuleValue(rule.id, index)
                              }
                              tooltip="Remove Value"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Add Value */}
                      <div className="flex gap-2">
                        <Input
                          placeholder={getCategoryPlaceholder(rule.category)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const input = e.currentTarget as HTMLInputElement;
                              handleAddRuleValue(rule.id, input.value);
                              input.value = "";
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = e.currentTarget
                              .previousElementSibling as HTMLInputElement;
                            if (input) {
                              handleAddRuleValue(rule.id, input.value);
                              input.value = "";
                            }
                          }}
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add Value
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {rules.length === 0 && (
                <div className="text-center py-8 border border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-sm">
                    No rules added yet. Select a category and click{' '}
                    <span>&quot;Add Rule&quot;</span> to get started.
                  </p>
                </div>
              )}
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
                  Reset
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Form
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
      />

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Preview Form - Candidate View"
        size="xl"
      >
        <div className="space-y-6">
          {/* Form Title and Description */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title || "Form Title"}
            </h2>
            <p className="text-gray-600">
              {description || "Form description will appear here"}
            </p>
          </div>

          {/* Form Fields Preview */}
          <div className="space-y-4 border-t border-gray-200 pt-6">
            {fields.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No fields added yet. Add fields to see the preview.
              </p>
            ) : (
              fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <div key={field.id}>{renderPreviewField(field)}</div>
                ))
            )}
          </div>

          {/* Preview Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a preview of how the form will
              appear to candidates. Fields are interactive for preview purposes
              only.
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
