"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { IconButton } from "@/components/ui/icon-button";
import {
  ChatBubbleIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@/components/ui/icons";
import type { Candidate, CandidateStage } from "@/types/candidate";

interface CandidateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onStageChange?: (candidateId: string, newStage: CandidateStage) => void;
  showPickReject?: boolean; // If true, show Pick and Reject buttons instead of Send Feedback
  onPick?: () => void;
  onReject?: () => void;
  showStatusLabel?: boolean; // If true, show Status label instead of Stage dropdown
  showStageRadio?: boolean; // If true, show Stage as radio buttons instead of dropdown
  onPrevious?: () => void; // Navigate to previous candidate
  onNext?: () => void; // Navigate to next candidate
  hasPrevious?: boolean; // Whether there is a previous candidate
  hasNext?: boolean; // Whether there is a next candidate
  showInReviewButtons?: boolean; // If true, show Approve, Reject, Transfer, Take Out buttons
  onApprove?: () => void;
  onRejectInReview?: () => void;
  onTransfer?: () => void;
  onTakeOut?: () => void;
  hideStageSelector?: boolean; // If true, hide Stage/Status selector completely
  showApprovedButtons?: boolean; // If true, show Transfer and WhatsApp buttons
  onTransferApproved?: () => void;
  transferButtonLabel?: string; // Custom label for transfer button (default: "Transfer")
}

export const CandidateReviewModal: React.FC<CandidateReviewModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onStageChange,
  showPickReject = false,
  onPick,
  onReject,
  showStatusLabel = false,
  showStageRadio = false,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  showInReviewButtons = false,
  onApprove,
  onRejectInReview,
  onTransfer,
  onTakeOut,
  hideStageSelector = false,
  showApprovedButtons = false,
  onTransferApproved,
  transferButtonLabel = "Transfer",
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [notes, setNotes] = useState("");
  const [currentStage, setCurrentStage] = useState<CandidateStage>("applied");
  const notesEditorRef = useRef<HTMLDivElement>(null);

  // Update notes and stage when candidate changes
  useEffect(() => {
    if (candidate) {
      setNotes(candidate.notes || "");
      setCurrentStage(candidate.stage);
      // Update contentEditable div content
      if (notesEditorRef.current) {
        notesEditorRef.current.innerHTML = candidate.notes || "";
      }
    }
  }, [candidate]);

  // Handle formatting commands
  const handleFormat = (command: string, value?: string) => {
    if (notesEditorRef.current) {
      notesEditorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  // Handle content change in contentEditable div
  const handleNotesChange = () => {
    if (notesEditorRef.current) {
      setNotes(notesEditorRef.current.innerHTML);
    }
  };

  if (!candidate) return null;

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "cv", label: "CV" },
    { id: "history", label: "History" },
  ];

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleChatWhatsApp = () => {
    if (candidate.phoneNumber) {
      const phoneNumber = candidate.phoneNumber.replace(/[^0-9]/g, "");
      const message = encodeURIComponent(
        `Hello ${candidate.name}, I'm contacting you regarding your application.`
      );
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleSendFeedback = () => {
    // TODO: Implement send feedback functionality
    // This could open a feedback modal or navigate to feedback page
    alert("Send feedback functionality will be implemented here");
  };

  const handleStageChange = (newStage: CandidateStage) => {
    setCurrentStage(newStage);
    if (candidate && onStageChange) {
      onStageChange(candidate.id, newStage);
    }
  };

  const stageOptions = [
    { value: "applied", label: "Applied" },
    { value: "cv_review", label: "CV Review" },
    { value: "ready_for_interview", label: "Ready for Interview" },
  ];

  // Filter stage options for radio button (only Applied and CV Review)
  const stageRadioOptions = stageOptions.filter(
    (option) => option.value === "applied" || option.value === "cv_review"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-[90vw] max-h-[90vh] flex flex-col">
          {/* Previous Button - Left Side */}
          {(onPrevious || onNext) && (
            <>
              <button
                onClick={onPrevious}
                disabled={!hasPrevious}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                  !hasPrevious ? "opacity-30" : ""
                }`}
                aria-label="Previous candidate"
              >
                <ArrowLeftIcon className="w-6 h-6 text-gray-700" />
              </button>
              {/* Next Button - Right Side */}
              <button
                onClick={onNext}
                disabled={!hasNext}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                  !hasNext ? "opacity-30" : ""
                }`}
                aria-label="Next candidate"
              >
                <ArrowRightIcon className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate.formTitle || candidate.role || "Review Candidate"}
            </h3>
            <IconButton
              icon={<XMarkIcon />}
              variant="secondary"
              size="sm"
              onClick={onClose}
              tooltip="Close"
            />
          </div>
          
          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-4">
              <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Stage Selector / Status Label */}
              {!hideStageSelector && (
              <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {showStatusLabel ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Status:
                      </label>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          candidate.status === "qualified"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {candidate.status === "qualified" ? "Qualified" : "Not Qualified"}
                      </span>
                    </>
                  ) : showStageRadio ? (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Stage:
                      </label>
                      <div className="flex items-center gap-4">
                        {stageRadioOptions.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="stage"
                              value={option.value}
                              checked={currentStage === option.value}
                              onChange={(e) =>
                                handleStageChange(e.target.value as CandidateStage)
                              }
                              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="text-sm text-gray-700">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="text-sm font-medium text-gray-700">
                        Stage:
                      </label>
                      <Select
                        options={stageOptions}
                        value={currentStage}
                        onChange={(e) =>
                          handleStageChange(e.target.value as CandidateStage)
                        }
                        className="w-48"
                      />
                    </>
                  )}
                </div>
              </div>
              )}

              <div className={hideStageSelector ? "mt-0" : "mt-4"}>
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    {/* Personal Information Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nama
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{candidate.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.phoneNumber || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{candidate.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Jenjang Pendidikan
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.educationLevel || "Not provided"}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Asal Pendidikan
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.educationInstitution || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applications Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Applications
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Tanggal Apply
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(candidate.appliedAt)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Application Sources
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.applicationSource || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Posisi Dilamar
                          </label>
                          <p className="mt-1 text-sm text-gray-900">{candidate.role}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Pengalaman
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.experience}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Skill
                          </label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {candidate.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Salary
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.lastSalary || "Not disclosed"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Expected Salary
                          </label>
                          <p className="mt-1 text-sm text-gray-900">
                            {candidate.expectedSalary || "Negotiable"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Notes
                      </h3>
                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-1 p-2 border border-gray-300 rounded-t-md bg-gray-50">
                        <IconButton
                          icon={<BoldIcon className="w-4 h-4" />}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFormat("bold")}
                          tooltip="Bold"
                        />
                        <IconButton
                          icon={<ItalicIcon className="w-4 h-4" />}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFormat("italic")}
                          tooltip="Italic"
                        />
                        <IconButton
                          icon={<UnderlineIcon className="w-4 h-4" />}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFormat("underline")}
                          tooltip="Underline"
                        />
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <IconButton
                          icon={<ListBulletIcon className="w-4 h-4" />}
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFormat("insertUnorderedList")}
                          tooltip="Bullet Point"
                        />
                      </div>
                      {/* Rich Text Editor */}
                      <div
                        ref={notesEditorRef}
                        contentEditable
                        onInput={handleNotesChange}
                        className="w-full min-h-[150px] px-3 py-2 border border-t-0 border-gray-300 rounded-b-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y overflow-y-auto"
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                        }}
                        data-placeholder="Tambahkan catatan tentang kandidat ini..."
                      />
                    </div>
                  </div>
                )}

              {activeTab === "cv" && (
                <div className="space-y-4">
                  {candidate.cvUrl ? (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <iframe
                        src={candidate.cvUrl}
                        className="w-full h-[600px] border-0 rounded"
                        title="Candidate CV"
                      />
                      <div className="mt-4 flex justify-end">
                        <a
                          href={candidate.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary-700"
                        >
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-gray-200 rounded-lg">
                      <p className="text-gray-500">CV not available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-6">
                  {/* Application History Section with Feedback History */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Application History
                    </h3>
                    {candidate.applicationHistory &&
                    candidate.applicationHistory.length > 0 ? (
                      <div className="space-y-4">
                        {candidate.applicationHistory.map((history) => {
                          // Map status to page labels
                          const getStatusLabel = (status: string) => {
                            switch (status) {
                              case "applied":
                                return "New Candidates";
                              case "cv_review":
                                return "In Review";
                              case "ready_for_interview":
                                return "Approved";
                              default:
                                return "Rejected";
                            }
                          };

                          // Map status to badge colors
                          const getStatusBadgeClass = (status: string) => {
                            switch (status) {
                              case "applied":
                                return "bg-primary-100 text-primary-800";
                              case "cv_review":
                                return "bg-yellow-100 text-yellow-800";
                              case "ready_for_interview":
                                return "bg-green-100 text-green-800";
                              default:
                                return "bg-red-100 text-red-800";
                            }
                          };

                          // Get feedback history for this job opening
                          const relatedFeedback = candidate.feedbackHistory?.filter(
                            (feedback) => feedback.jobTitle === history.jobTitle
                          ) || [];

                          // Get action log for this job opening
                          const relatedActionLog = candidate.actionLog?.filter(
                            (log) => log.jobTitle === history.jobTitle
                          ) || [];

                          const formatDateTime = (date: Date) => {
                            const day = date.getDate().toString().padStart(2, "0");
                            const month = (date.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = date.getFullYear();
                            const hours = date.getHours().toString().padStart(2, "0");
                            const minutes = date
                              .getMinutes()
                              .toString()
                              .padStart(2, "0");
                            return `${day}/${month}/${year} ${hours}.${minutes}`;
                          };

                          const getActionLabel = (action: string) => {
                            switch (action) {
                              case "reviewed":
                                return "Reviewed by";
                              case "approved":
                                return "Approved by";
                              case "rejected":
                                return "Rejected by";
                              case "transfer":
                                return "Transfer by";
                              default:
                                return action;
                            }
                          };
                          
                          return (
                            <div
                              key={history.id}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              {/* Application History Header */}
                              <div className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                      {history.jobTitle}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {history.companyName}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Applied on {formatDate(history.appliedAt)}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(history.status)}`}
                                  >
                                    {getStatusLabel(history.status)}
                                  </span>
                                </div>
                              </div>

                              {/* Feedback History for this Job Opening */}
                              {relatedFeedback.length > 0 && (
                                <div className="border-t border-gray-200 bg-gray-50">
                                  <div className="px-4 py-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                      Feedback History
                                    </h4>
                                    <div className="space-y-2">
                                      {relatedFeedback.map((feedback) => (
                                        <div
                                          key={feedback.id}
                                          className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                        >
                                          <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                              <p className="text-sm font-medium text-gray-900">
                                                {feedback.templateTitle}
                                              </p>
                                              <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-gray-500">
                                                  <span className="font-medium">Sent by:</span>{" "}
                                                  {feedback.sentBy}
                                                </p>
                                              </div>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              {formatDateTime(feedback.sentAt)}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Action Log for this Job Opening */}
                              {relatedActionLog.length > 0 && (
                                <div className={`border-t border-gray-200 ${relatedFeedback.length > 0 ? 'bg-gray-50' : 'bg-gray-50'}`}>
                                  <div className="px-4 py-3">
                                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                                      Action Log
                                    </h4>
                                    <div className="space-y-2">
                                      {relatedActionLog.map((log) => (
                                        <div
                                          key={log.id}
                                          className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                        >
                                          <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-700">
                                              <span className="font-medium">
                                                {getActionLabel(log.action)}
                                              </span>{" "}
                                              {log.performedBy}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {formatDateTime(log.performedAt)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 border border-gray-200 rounded-lg">
                        <p className="text-gray-500">No application history</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
          
          {/* Footer with Action Buttons */}
          <div className="flex justify-end items-center gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            {showApprovedButtons ? (
              <>
                {onTransferApproved && (
                  <Button
                    variant="primary"
                    onClick={onTransferApproved}
                    className="flex items-center gap-2"
                  >
                    {transferButtonLabel}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleChatWhatsApp}
                  disabled={!candidate.phoneNumber}
                  className="flex items-center gap-2"
                >
                  <ChatBubbleIcon className="w-4 h-4" />
                  WhatsApp
                </Button>
              </>
            ) : showInReviewButtons ? (
              <>
                <Button
                  variant="primary"
                  onClick={onApprove}
                  className="flex items-center gap-2"
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={onRejectInReview}
                  className="flex items-center gap-2"
                >
                  Reject
                </Button>
                <span className="text-gray-300 self-center">|</span>
                <Button
                  variant="primary"
                  onClick={onTransfer}
                  className="flex items-center gap-2"
                >
                  Add to Job
                </Button>
                <Button
                  variant="primary"
                  onClick={onTakeOut}
                  className="flex items-center gap-2"
                >
                  Take Out
                </Button>
                <Button
                  variant="outline"
                  onClick={handleChatWhatsApp}
                  disabled={!candidate.phoneNumber}
                  className="flex items-center gap-2"
                >
                  <ChatBubbleIcon className="w-4 h-4" />
                  WhatsApp
                </Button>
              </>
            ) : showPickReject ? (
              <>
                <Button
                  variant="primary"
                  onClick={onPick}
                  className="flex items-center gap-2"
                >
                  Pick
                </Button>
                <Button
                  variant="danger"
                  onClick={onReject}
                  className="flex items-center gap-2"
                >
                  Reject
                </Button>
                <span className="text-gray-300 self-center">|</span>
                <Button
                  variant="outline"
                  onClick={handleChatWhatsApp}
                  disabled={!candidate.phoneNumber}
                  className="flex items-center gap-2"
                >
                  <ChatBubbleIcon className="w-4 h-4" />
                  WhatsApp
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleChatWhatsApp}
                  disabled={!candidate.phoneNumber}
                  className="flex items-center gap-2"
                >
                  <ChatBubbleIcon className="w-4 h-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSendFeedback}
                  className="flex items-center gap-2"
                >
                  Send Feedback
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
