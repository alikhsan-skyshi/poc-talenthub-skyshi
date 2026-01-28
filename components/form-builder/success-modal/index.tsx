"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyIcon, CheckIcon } from "@/components/ui/icons";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  formLink: string;
  isEdit?: boolean;
  onDueDateSet?: (dueDate: Date) => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  formLink,
  isEdit = false,
  onDueDateSet,
}) => {
  const [copied, setCopied] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [isDueDateSet, setIsDueDateSet] = useState(false);

  const handleSetDueDate = () => {
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }

    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Due date cannot be in the past");
      return;
    }

    setIsDueDateSet(true);
    if (onDueDateSet) {
      onDueDateSet(selectedDate);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Form Updated Successfully!" : "Form Created Successfully!"}
      size="md"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <CheckIcon className="w-10 h-10 text-green-600" />
        </div>
        <p className="text-center text-gray-700">
          {isEdit
            ? "Your application form has been updated successfully!"
            : "Your application form has been created successfully!"}
        </p>

        {/* Due Date Section */}
        {!isDueDateSet ? (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Set Due Date <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              The form will automatically close when the due date is reached.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getMinDate()}
                className="flex-1"
              />
              <Button variant="primary" onClick={handleSetDueDate}>
                Set Due Date
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <p className="text-sm text-gray-600">
                {new Date(dueDate).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Link (Share this link with candidates):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
              />
              <Button
                variant={copied ? "secondary" : "primary"}
                onClick={handleCopy}
                className="flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
