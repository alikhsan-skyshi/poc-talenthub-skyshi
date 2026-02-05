"use client";

import React from "react";
import type { Candidate, CandidateStage, CandidateStatus } from "@/types/candidate";
import { IconButton } from "@/components/ui/icon-button";
import { DocumentIcon, ChatBubbleIcon } from "@/components/ui/icons";

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidateIds?: Set<string>;
  onReviewCV: (candidateId: string) => void;
  onChatWhatsApp: (candidate: Candidate) => void;
  onSelectCandidate?: (candidateId: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  showStatus?: boolean; // If true, show "Status" column instead of "Stage"
  hideActions?: boolean; // If true, hide "Actions" column
  onRowClick?: (candidateId: string) => void; // Handler for row click
  useLocationType?: boolean; // If true, show "Location" and "Type" instead of "Experience" and "Ready For"
  hideNotSpecified?: boolean; // If true, hide "Not specified" values
  hideWhatsApp?: boolean; // If true, hide WhatsApp icon in Actions column
  hideStage?: boolean; // If true, hide "Stage" or "Status" column
  hideJobPost?: boolean; // If true, hide "Job Post" column
  hideLocation?: boolean; // If true, hide "Location" column (when useLocationType is true)
  showEmail?: boolean; // If true, show "Email" column after "Name"
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  selectedCandidateIds = new Set(),
  onReviewCV,
  onChatWhatsApp,
  onSelectCandidate,
  onSelectAll,
  showStatus = false,
  hideActions = false,
  onRowClick,
  useLocationType = false,
  hideNotSpecified = false,
  hideWhatsApp = false,
  hideStage = false,
  hideJobPost = false,
  hideLocation = false,
  showEmail = false,
}) => {
  const allSelected =
    candidates.length > 0 &&
    candidates.every((c) => selectedCandidateIds.has(c.id));
  const someSelected = candidates.some((c) => selectedCandidateIds.has(c.id));
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getReadyForLabel = (readyFor?: string) => {
    const readyForMap: Record<string, string> = {
      onsite: "Onsite",
      hybrid: "Hybrid",
      remote: "Remote",
      flexible: "Flexible",
    };
    return readyFor ? readyForMap[readyFor] || readyFor : "Not specified";
  };

  const getLocationLabel = (readyFor?: string) => {
    const locationMap: Record<string, string> = {
      onsite: "Onsite",
      hybrid: "Hybrid",
      remote: "Remote",
      flexible: "Flexible",
    };
    if (!readyFor) {
      return hideNotSpecified ? "" : "Not specified";
    }
    return locationMap[readyFor] || readyFor;
  };

  const getTypeLabel = (type?: string) => {
    const typeMap: Record<string, string> = {
      full_time: "Full Time",
      part_time: "Part Time",
      freelance: "Freelance",
    };
    if (!type) {
      if (hideNotSpecified) {
        // Default to "Full Time" if hideNotSpecified is true and no type
        return "Full Time";
      }
      return "Not specified";
    }
    return typeMap[type] || type;
  };

  const getStageBadge = (stage: CandidateStage) => {
    const stageConfig = {
      applied: {
        label: "Applied",
        className: "bg-blue-100 text-blue-800",
      },
      cv_review: {
        label: "CV Review",
        className: "bg-yellow-100 text-yellow-800",
      },
      ready_for_interview: {
        label: "Ready for Interview",
        className: "bg-green-100 text-green-800",
      },
    };

    const config = stageConfig[stage];

    // Fallback if stage is not in config
    if (!config) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {stage}
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status?: CandidateStatus) => {
    if (!status) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Not specified
        </span>
      );
    }

    const statusConfig = {
      qualified: {
        label: "Qualified",
        className: "bg-green-100 text-green-800",
      },
      not_qualified: {
        label: "Not Qualified",
        className: "bg-red-100 text-red-800",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
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
              Applied At
            </th>
            {!hideJobPost && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Job Post
              </th>
            )}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            {showEmail && (
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
            )}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            {!(useLocationType && hideLocation) && (
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {useLocationType ? "Location" : "Experience"}
              </th>
            )}
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {useLocationType ? "Type" : "Ready For"}
            </th>
            {!hideStage && (
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {showStatus ? "Status" : "Stage"}
              </th>
            )}
            {!hideActions && (
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {candidates.length === 0 ? (
            <tr>
              <td
                colSpan={
                  4 + // Applied At, Name, Role, Type/Ready For
                  (hideJobPost ? 0 : 1) + // Job Post
                  (showEmail ? 1 : 0) + // Email
                  (useLocationType && hideLocation ? 0 : 1) + // Location/Experience
                  (onSelectAll ? 1 : 0) + 
                  (hideStage ? 0 : 1) + 
                  (hideActions ? 0 : 1)
                }
                className="px-6 py-4 text-center text-gray-500"
              >
                No candidates found
              </td>
            </tr>
          ) : (
            candidates.map((candidate) => {
              const isSelected = selectedCandidateIds.has(candidate.id);
              return (
                <tr
                  key={candidate.id}
                  className={`hover:bg-light ${isSelected ? "bg-primary-50" : ""} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(candidate.id);
                    }
                  }}
                >
                  {onSelectCandidate && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          onSelectCandidate(candidate.id, e.target.checked)
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(candidate.appliedAt)}
                    </div>
                  </td>
                  {!hideJobPost && (
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {candidate.formTitle || (hideNotSpecified ? "" : "Not specified")}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.name}
                    </div>
                  </td>
                  {showEmail && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.email}</div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{candidate.role}</div>
                  </td>
                  {!(useLocationType && hideLocation) && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {useLocationType
                          ? getLocationLabel(candidate.readyFor)
                          : candidate.experience}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm text-gray-900">
                      {useLocationType
                        ? getTypeLabel(candidate.type)
                        : getReadyForLabel(candidate.readyFor)}
                    </div>
                  </td>
                  {!hideStage && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {showStatus
                        ? getStatusBadge(candidate.status)
                        : getStageBadge(candidate.stage)}
                    </td>
                  )}
                  {!hideActions && (
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <IconButton
                          icon={<DocumentIcon />}
                          variant="info"
                          size="sm"
                          onClick={() => onReviewCV(candidate.id)}
                          tooltip="Review CV"
                        />
                        {!hideWhatsApp && (
                          <IconButton
                            icon={<ChatBubbleIcon />}
                            variant="primary"
                            size="sm"
                            onClick={() => onChatWhatsApp(candidate)}
                            tooltip="Chat WhatsApp"
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
