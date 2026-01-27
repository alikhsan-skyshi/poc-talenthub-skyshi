"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CreateTemplatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleSave = () => {
    // Validate
    if (!title.trim() || !subject.trim() || !content.trim()) {
      alert("Please fill in title, subject, and email content");
      return;
    }

    // TODO: Save to backend/API
    // For now, just show success message
    alert("Template created successfully!");
    router.push("/dashboard/feedback-messaging");
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset? All form data will be lost."
      )
    ) {
      setTitle("");
      setSubject("");
      setContent("");
      setAttachment(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create a new feedback template for candidates
          </p>
        </div>

        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Template Information
            </h2>
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title"
              required
            />
          </div>

          {/* Email Template */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Email Template
            </h2>
            <div className="space-y-4">
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
                required
              />
              <Textarea
                label="Email Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter email content. You can use placeholders like {candidate_name}, {position}, etc."
                rows={10}
                required
              />
              <FileUpload
                label="Attachment (Optional)"
                accept=".pdf,.doc,.docx"
                maxSize={10}
                onFileSelect={setAttachment}
                helperText="Upload file attachment for the email (PDF, DOC, DOCX - max 10MB)"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
