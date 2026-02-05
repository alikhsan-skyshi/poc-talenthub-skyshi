"use client";

import type { ApplicationForm } from "@/types/application-form";
import { IconButton } from "@/components/ui/icon-button";
import {
  EyeIcon,
  PencilIcon,
  CopyIcon,
} from "@/components/ui/icons";

interface FormTableProps {
  forms: ApplicationForm[];
  selectedFormIds?: Set<string>;
  onViewCandidates: (formId: string) => void;
  onEdit: (formId: string) => void;
  onDelete: (formId: string) => void;
  onCopyLink: (formId: string) => void;
  onSelectForm?: (formId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  onRowClick?: (formId: string) => void; // Handler for row click
}

export const FormTable: React.FC<FormTableProps> = ({
  forms,
  selectedFormIds = new Set(),
  onViewCandidates,
  onEdit,
  onDelete,
  onCopyLink,
  onSelectForm,
  onSelectAll,
  onRowClick,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const isOpen = status === "open";
    return (
      <span
        className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${
            isOpen
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }
        `}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Client Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Job Title
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Created At
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Due Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Applicants
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
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
          {forms.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-4 text-center text-gray-500"
              >
                No forms found
              </td>
            </tr>
          ) : (
            forms.map((form) => {
              return (
                <tr
                  key={form.id}
                  className={`hover:bg-light ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(form.id);
                    }
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {form.companyName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{form.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(form.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {form.dueDate ? formatDate(form.dueDate) : "Not set"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {form.applicantCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(form.status)}
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <IconButton
                        icon={<CopyIcon />}
                        variant="secondary"
                        size="sm"
                        onClick={() => onCopyLink(form.id)}
                        tooltip="Copy Link"
                      />
                      <IconButton
                        icon={<EyeIcon />}
                        variant="info"
                        size="sm"
                        onClick={() => onViewCandidates(form.id)}
                        tooltip="View Candidates"
                      />
                      <IconButton
                        icon={<PencilIcon />}
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit(form.id)}
                        tooltip="Edit Form"
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
