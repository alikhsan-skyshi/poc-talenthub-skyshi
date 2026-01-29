"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { CheckIcon } from "@/components/ui/icons";
import type { FeedbackTemplate } from "@/types/feedback-template";
import type { Candidate } from "@/types/candidate";

interface SendFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: FeedbackTemplate[];
  selectedCandidates: Candidate[];
  onSend: (templateId: string, candidateIds: string[]) => Promise<void>;
}

export const SendFeedbackModal: React.FC<SendFeedbackModalProps> = ({
  isOpen,
  onClose,
  templates,
  selectedCandidates,
  onSend,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
  const candidateCount = selectedCandidates.length;


  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    // Automatically show preview when template is selected
    if (templateId) {
      setShowPreview(true);
    } else {
      setShowPreview(false);
    }
  };

  const handleSend = async () => {
    if (!selectedTemplateId) {
      alert("Please select a template first");
      return;
    }

    setIsSending(true);
    try {
      const candidateIds = selectedCandidates.map((c) => c.id);
      await onSend(selectedTemplateId, candidateIds);
      setSentCount(candidateIds.length);
      setIsSending(false);
      setShowPreview(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error sending feedback:", error);
      alert("Failed to send feedback. Please try again.");
      setIsSending(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessModalOpen(false);
    setSelectedTemplateId("");
    setShowPreview(false);
    onClose();
  };

  const renderPreviewContent = () => {
    if (!selectedTemplate) return null;

    // Replace template variables with sample data
    let previewContent = selectedTemplate.content;
    const sampleCandidate = selectedCandidates[0] || {
      name: "John Doe",
      role: "Software Engineer",
    };

    previewContent = previewContent.replace(/{candidate_name}/g, sampleCandidate.name);
    previewContent = previewContent.replace(/{position}/g, sampleCandidate.role || "the position");
    previewContent = previewContent.replace(/{interview_date}/g, "Monday, March 15, 2024");
    previewContent = previewContent.replace(/{interview_time}/g, "10:00 AM");
    previewContent = previewContent.replace(/{interview_location}/g, "Office Building, Jakarta");

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Preview:</h4>
        <div className="text-sm text-gray-600 whitespace-pre-line">
          {previewContent}
        </div>
        <p className="text-xs text-gray-500 mt-3 italic">
          Note: This preview shows how the message will appear to candidates. Variables like {"{candidate_name}"} will be replaced with each candidate&apos;s actual information.
        </p>
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !isSuccessModalOpen}
        onClose={onClose}
        title="Send Feedback"
        size="lg"
      >
        <div className="space-y-6">
          {/* Candidate Count Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{candidateCount}</strong> kandidat{candidateCount !== 1 ? "" : ""} terpilih
              {candidateCount > 0 && candidateCount <= 5 && (
                <span className="ml-2">
                  ({selectedCandidates.map((c) => c.name).join(", ")})
                </span>
              )}
              {candidateCount > 5 && (
                <span className="ml-2">
                  ({selectedCandidates.slice(0, 3).map((c) => c.name).join(", ")} dan {candidateCount - 3} lainnya)
                </span>
              )}
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Template
            </label>
            <Select
              options={[
                { value: "", label: "Pilih Template" },
                ...templates.map((template) => ({
                  value: template.id,
                  label: template.title,
                })),
              ]}
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
            />
          </div>

          {/* Preview Section */}
          {selectedTemplate && showPreview && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-gray-700">Preview Template</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Sembunyikan Preview
                </Button>
              </div>
              {renderPreviewContent()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={onClose} disabled={isSending}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!selectedTemplateId || isSending}
              isLoading={isSending}
            >
              {isSending ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccess}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Feedback Berhasil Dikirim!
            </h3>
            <p className="text-gray-600">
              Feedback telah berhasil dikirim ke <strong>{sentCount}</strong> kandidat.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="primary" onClick={handleCloseSuccess}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
