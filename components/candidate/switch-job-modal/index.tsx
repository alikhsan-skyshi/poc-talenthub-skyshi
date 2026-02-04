"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getJobOpeningOptions, getJobOpeningById } from "@/lib/data/job-openings";
import type { Candidate } from "@/types/candidate";
import type { ApplicationForm } from "@/types/application-form";

interface SwitchJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  onConfirm: (targetJobOpening: ApplicationForm) => void | Promise<void>;
}

export const SwitchJobModal: React.FC<SwitchJobModalProps> = ({
  isOpen,
  onClose,
  candidates,
  onConfirm,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [keepPreviousJobData, setKeepPreviousJobData] = useState<boolean>(true);

  // Get unique current job titles from selected candidates
  const currentJobTitles = Array.from(
    new Set(
      candidates
        .map((c) => c.formTitle)
        .filter((title): title is string => Boolean(title))
    )
  );

  // Get job options excluding all current jobs of selected candidates
  const jobOptions = getJobOpeningOptions(currentJobTitles);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedJobId("");
      setError("");
      setKeepPreviousJobData(true); // Reset to default checked
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!selectedJobId) {
      setError("Please select a job opening");
      return;
    }

    const targetJob = getJobOpeningById(selectedJobId);
    if (!targetJob) {
      setError("Selected job opening not found");
      return;
    }

    // Validate: job should be different from current jobs
    const willSwitchToSameJob = candidates.some(
      (c) => c.formTitle === targetJob.title
    );
    if (willSwitchToSameJob) {
      setError("Some candidates are already in the selected job opening");
      return;
    }

    setIsLoading(true);
    try {
      // Call onConfirm - it may or may not be async
      const result = onConfirm(targetJob);
      if (result && typeof result === "object" && "then" in result) {
        await result;
      }
      // Reset state
      setSelectedJobId("");
      setError("");
    } catch (error) {
      setError("Failed to switch job. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (candidates.length === 0) return null;

  const candidateCount = candidates.length;
  const isMultiple = candidateCount > 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer"
      size="md"
    >
      <div className="space-y-4">
        {/* Candidate Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {isMultiple ? "Selected Candidates" : "Candidate Information"}
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium">
                {isMultiple ? "Total Candidates:" : "Name:"}
              </span>{" "}
              {isMultiple ? (
                <span className="font-semibold text-gray-900">
                  {candidateCount} candidate{candidateCount > 1 ? "s" : ""}
                </span>
              ) : (
                candidates[0].name
              )}
            </p>
            {isMultiple ? (
              <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                {candidates.map((candidate, index) => (
                  <div
                    key={candidate.id}
                    className="bg-white rounded p-2 border border-gray-200"
                  >
                    <p className="font-medium text-gray-900">
                      {index + 1}. {candidate.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Current Job: {candidate.formTitle || "Not specified"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                <span className="font-medium">Current Job:</span>{" "}
                {candidates[0].formTitle || "Not specified"}
              </p>
            )}
          </div>
        </div>

        {/* Job Selection */}
        <div>
          <Select
            label="Select Target Job Opening"
            options={[
              { value: "", label: "Select a job opening..." },
              ...jobOptions,
            ]}
            value={selectedJobId}
            onChange={(e) => {
              setSelectedJobId(e.target.value);
              setError("");
            }}
            error={error}
            required
          />
          {jobOptions.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              No other job openings available.
            </p>
          )}
        </div>

        {/* Keep Previous Job Data Checkbox */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="keepPreviousJobData"
            checked={keepPreviousJobData}
            onChange={(e) => setKeepPreviousJobData(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-0.5"
          />
          <label
            htmlFor="keepPreviousJobData"
            className="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Keep candidate data from previous jobs
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!selectedJobId || isLoading || jobOptions.length === 0}
          >
            {isLoading ? "Transferring..." : "Transfer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
