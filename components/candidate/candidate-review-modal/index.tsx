"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@/components/ui/modal";
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
} from "@/components/ui/icons";
import type { Candidate, CandidateStage } from "@/types/candidate";

interface CandidateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  onStageChange?: (candidateId: string, newStage: CandidateStage) => void;
}

export const CandidateReviewModal: React.FC<CandidateReviewModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onStageChange,
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Review Candidate - ${candidate.name}`}
      size="xl"
    >
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Stage Selector */}
        <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
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
          </div>
        </div>

        <div className="mt-4">
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
                      className="text-sm text-blue-600 hover:text-blue-700"
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
              {/* Application History Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Application History
                </h3>
                {candidate.applicationHistory &&
                candidate.applicationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {candidate.applicationHistory.map((history) => (
                      <div
                        key={history.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
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
                            className={`
                            px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${
                              history.status === "ready_for_interview"
                                ? "bg-green-100 text-green-800"
                                : history.status === "cv_review"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          `}
                          >
                            {history.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">No application history</p>
                  </div>
                )}
              </div>

              {/* Feedback History Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feedback History
                </h3>
                {candidate.feedbackHistory &&
                candidate.feedbackHistory.length > 0 ? (
                  <div className="space-y-3">
                    {candidate.feedbackHistory.map((feedback) => {
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

                      const getStatusBadge = (status: string) => {
                        const statusConfig = {
                          sent: {
                            label: "Sent",
                            className: "bg-blue-100 text-blue-800",
                          },
                          delivered: {
                            label: "Delivered",
                            className: "bg-yellow-100 text-yellow-800",
                          },
                          read: {
                            label: "Read",
                            className: "bg-green-100 text-green-800",
                          },
                        };

                        const config =
                          statusConfig[
                            status as keyof typeof statusConfig
                          ] || statusConfig.sent;

                        return (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
                          >
                            {config.label}
                          </span>
                        );
                      };

                      return (
                        <div
                          key={feedback.id}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {feedback.templateTitle}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {feedback.subject}
                              </p>
                            </div>
                            {getStatusBadge(feedback.status)}
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              <span className="font-medium">Sent by:</span>{" "}
                              {feedback.sentBy}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDateTime(feedback.sentAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">
                      No feedback history available
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
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
        </div>
      </div>
    </Modal>
  );
};
