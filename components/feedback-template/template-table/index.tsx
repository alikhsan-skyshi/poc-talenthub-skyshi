"use client";

import React from "react";
import type { FeedbackTemplate } from "@/types/feedback-template";
import { IconButton } from "@/components/ui/icon-button";
import { PencilIcon } from "@/components/ui/icons";

interface TemplateTableProps {
  templates: FeedbackTemplate[];
  selectedTemplateIds?: Set<string>;
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  onSelectTemplate?: (templateId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
}

export const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  selectedTemplateIds = new Set(),
  onEdit,
  onDelete,
  onSelectTemplate,
  onSelectAll,
}) => {
  const allSelected =
    templates.length > 0 &&
    templates.every((t) => selectedTemplateIds.has(t.id));
  const someSelected = templates.some((t) => selectedTemplateIds.has(t.id));
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {onSelectAll && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
              </th>
            )}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created By
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Sent Count
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {templates.length === 0 ? (
            <tr>
              <td
                colSpan={onSelectAll ? 6 : 5}
                className="px-6 py-4 text-center text-gray-500"
              >
                No templates found
              </td>
            </tr>
          ) : (
            templates.map((template) => {
              const isSelected = selectedTemplateIds.has(template.id);
              return (
                <tr
                  key={template.id}
                  className={`hover:bg-light ${isSelected ? "bg-primary-50" : ""}`}
                >
                  {onSelectTemplate && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          onSelectTemplate(template.id, e.target.checked)
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </td>
                  )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {template.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {template.createdBy}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(template.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900">
                    {template.sentCount}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <IconButton
                      icon={<PencilIcon />}
                      variant="primary"
                      size="sm"
                      onClick={() => onEdit(template.id)}
                      tooltip="Edit Template"
                    />
                  </div>
                </td>
              </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
