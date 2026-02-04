"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { IconButton } from "@/components/ui/icon-button";
import { XMarkIcon } from "@/components/ui/icons";
import type { Candidate } from "@/types/candidate";
import type { FeedbackTemplate } from "@/types/feedback-template";

interface CandidateFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  candidates?: Candidate[]; // For multiple candidates support
  templates: FeedbackTemplate[];
  actionType: "approve" | "reject";
  onSend: (
    candidateId: string,
    templateId: string,
    content: string,
    subject: string,
    attachment?: File | null
  ) => Promise<void>;
}

export const CandidateFeedbackModal: React.FC<CandidateFeedbackModalProps> = ({
  isOpen,
  onClose,
  candidate,
  candidates: candidatesProp,
  templates,
  actionType,
  onSend,
}) => {
  // Use candidates array if provided, otherwise use single candidate
  const candidates = candidatesProp || (candidate ? [candidate] : []);
  const currentCandidate = candidate || candidates[0] || null;
  const candidateCount = candidates.length;
  const isMultiple = candidateCount > 1;
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Filter templates based on action type
  const filteredTemplates = templates
    .filter((t) => {
      if (actionType === "approve") {
        return t.type === "acceptance";
      } else {
        return t.type === "rejection";
      }
    })
    .slice(0, 3);

  // Update feedback content and subject when template is selected
  useEffect(() => {
    if (selectedTemplateId && currentCandidate) {
      const template = filteredTemplates.find((t) => t.id === selectedTemplateId);
      if (template) {
        // Replace placeholders with actual candidate data
        let content = template.content;
        content = content.replace(/{candidate_name}/g, currentCandidate.name);
        content = content.replace(/{position}/g, currentCandidate.role || currentCandidate.formTitle || "");
        setFeedbackContent(content);
        
        // Set default subject if template has one, otherwise generate from template title
        if (template.subject) {
          let subject = template.subject;
          subject = subject.replace(/{candidate_name}/g, currentCandidate.name);
          subject = subject.replace(/{position}/g, currentCandidate.role || currentCandidate.formTitle || "");
          setEmailSubject(subject);
        } else {
          // Generate default subject from template title
          if (actionType === "approve") {
            setEmailSubject(`Congratulations! Application for ${currentCandidate.role || currentCandidate.formTitle || "Position"}`);
          } else {
            setEmailSubject(`Re: Application for ${currentCandidate.role || currentCandidate.formTitle || "Position"}`);
          }
        }
      }
    } else {
      setFeedbackContent("");
      setEmailSubject("");
    }
  }, [selectedTemplateId, currentCandidate, filteredTemplates, actionType]);

  const handleSend = async () => {
    if (!currentCandidate || !selectedTemplateId || !feedbackContent.trim() || !emailSubject.trim()) {
      alert("Please select a template, fill in subject, and ensure feedback content is not empty");
      return;
    }

    setIsSending(true);
    try {
      await onSend(currentCandidate.id, selectedTemplateId, feedbackContent, emailSubject, attachmentFile);
      // Reset form
      setSelectedTemplateId("");
      setFeedbackContent("");
      setEmailSubject("");
      setAttachmentFile(null);
      // Note: onClose will be handled by parent component after all candidates are processed
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to send feedback. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Reset form when modal is closed
  const handleClose = () => {
    setSelectedTemplateId("");
    setFeedbackContent("");
    setEmailSubject("");
    setAttachmentFile(null);
    onClose();
  };

  if (!currentCandidate || !isOpen || candidates.length === 0) return null;

  const modalTitle = actionType === "approve" 
    ? (isMultiple ? `Approve ${candidateCount} Candidates with Feedback` : "Approve Candidate with Feedback")
    : (isMultiple ? `Reject ${candidateCount} Candidates with Feedback` : "Reject Candidate with Feedback");

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        ></div>
        <div className="relative bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-[90vw] max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-900">
              {modalTitle}
            </h3>
            <IconButton
              icon={<XMarkIcon />}
              variant="secondary"
              size="sm"
              onClick={handleClose}
              tooltip="Close"
            />
          </div>
          
          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Candidate Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {isMultiple ? "Selected Candidates" : "Candidate Information"}
                </h3>
                {isMultiple ? (
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Total Candidates:</span>{" "}
                      <span className="font-semibold text-gray-900">
                        {candidateCount} candidate{candidateCount > 1 ? "s" : ""}
                      </span>
                    </p>
                    <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                      {candidates.map((c, index) => (
                        <div
                          key={c.id}
                          className="bg-white rounded p-2 border border-gray-200"
                        >
                          <p className="font-medium text-gray-900">
                            {index + 1}. {c.name}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-500">
                            <div>
                              <span className="text-gray-600">Job Post:</span>{" "}
                              {c.formTitle || "Not specified"}
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span> {c.email}
                            </div>
                            <div>
                              <span className="text-gray-600">Role:</span> {c.role}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Currently processing: <span className="font-medium text-gray-700">{currentCandidate.name}</span>
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Job Post:</span>
                      <p className="font-medium text-gray-900">
                        {currentCandidate.formTitle || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium text-gray-900">{currentCandidate.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium text-gray-900">{currentCandidate.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Role:</span>
                      <p className="font-medium text-gray-900">{currentCandidate.role}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Template Selection */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Select Template
                </h3>
                <div className="space-y-2">
                  {filteredTemplates.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No {actionType === "approve" ? "acceptance" : "rejection"} templates available
                    </p>
                  ) : (
                    filteredTemplates.map((template) => (
                      <label
                        key={template.id}
                        className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="template"
                          value={template.id}
                          checked={selectedTemplateId === template.id}
                          onChange={(e) => setSelectedTemplateId(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{template.title}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Feedback Preview/Editor */}
              {selectedTemplateId && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Feedback Preview (Editable)
                  </h3>
                  
                  {/* Email Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Subject
                    </label>
                    <Input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                      className="w-full"
                    />
                  </div>

                  {/* Feedback Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <Textarea
                      value={feedbackContent}
                      onChange={(e) => setFeedbackContent(e.target.value)}
                      placeholder="Feedback content will appear here after selecting a template..."
                      className="min-h-[200px]"
                    />
                  </div>

                  {/* Attachment */}
                  <div>
                    <FileUpload
                      accept=".pdf"
                      maxSize={10}
                      onFileSelect={setAttachmentFile}
                      label="Attachment (PDF)"
                      helperText="Optional: Attach a PDF file (max 10MB)"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with Action Buttons */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant={actionType === "approve" ? "primary" : "danger"}
              onClick={handleSend}
              disabled={!selectedTemplateId || !feedbackContent.trim() || !emailSubject.trim() || isSending}
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
