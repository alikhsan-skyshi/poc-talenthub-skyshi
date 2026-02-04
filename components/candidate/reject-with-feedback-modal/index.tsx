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

interface RejectWithFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  templates: FeedbackTemplate[];
  onSend: (
    candidateId: string,
    templateId: string,
    content: string,
    subject: string,
    attachment?: File | null
  ) => Promise<void>;
}

export const RejectWithFeedbackModal: React.FC<RejectWithFeedbackModalProps> = ({
  isOpen,
  onClose,
  candidate,
  templates,
  onSend,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [emailSubject, setEmailSubject] = useState<string>("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Filter only rejection templates and take first 3
  const rejectionTemplates = templates
    .filter((t) => t.type === "rejection")
    .slice(0, 3);

  // Update feedback content and subject when template is selected
  useEffect(() => {
    if (selectedTemplateId && candidate) {
      const template = rejectionTemplates.find((t) => t.id === selectedTemplateId);
      if (template) {
        // Replace placeholders with actual candidate data
        let content = template.content;
        content = content.replace(/{candidate_name}/g, candidate.name);
        content = content.replace(/{position}/g, candidate.role || candidate.formTitle || "");
        setFeedbackContent(content);
        
        // Set default subject if template has one, otherwise generate from template title
        if (template.subject) {
          let subject = template.subject;
          subject = subject.replace(/{candidate_name}/g, candidate.name);
          subject = subject.replace(/{position}/g, candidate.role || candidate.formTitle || "");
          setEmailSubject(subject);
        } else {
          // Generate default subject from template title
          setEmailSubject(`Re: Application for ${candidate.role || candidate.formTitle || "Position"}`);
        }
      }
    } else {
      setFeedbackContent("");
      setEmailSubject("");
    }
  }, [selectedTemplateId, candidate, rejectionTemplates]);

  const handleSend = async () => {
    if (!candidate || !selectedTemplateId || !feedbackContent.trim() || !emailSubject.trim()) {
      alert("Please select a template, fill in subject, and ensure feedback content is not empty");
      return;
    }

    setIsSending(true);
    try {
      await onSend(candidate.id, selectedTemplateId, feedbackContent, emailSubject, attachmentFile);
      // Reset form
      setSelectedTemplateId("");
      setFeedbackContent("");
      setEmailSubject("");
      setAttachmentFile(null);
      onClose();
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

  if (!candidate || !isOpen) return null;

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
              Reject Candidate with Feedback
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
            Candidate Information
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Job Post:</span>
              <p className="font-medium text-gray-900">
                {candidate.formTitle || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium text-gray-900">{candidate.name}</p>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium text-gray-900">{candidate.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Role:</span>
              <p className="font-medium text-gray-900">{candidate.role}</p>
            </div>
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Select Template
          </h3>
          <div className="space-y-2">
            {rejectionTemplates.length === 0 ? (
              <p className="text-sm text-gray-500">
                No rejection templates available
              </p>
            ) : (
              rejectionTemplates.map((template) => (
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
              variant="danger"
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
