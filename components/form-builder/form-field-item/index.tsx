"use client";

import React, { useState } from "react";
import type { FormField } from "@/types/form-builder";
import { IconButton } from "@/components/ui/icon-button";
import { PencilIcon, TrashIcon, GripVerticalIcon } from "@/components/ui/icons";
import { FieldEditor } from "@/components/form-builder/field-editor";
import { FileUpload } from "@/components/ui/file-upload";
import { Modal } from "@/components/ui/modal";

interface FormFieldItemProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onDelete: (fieldId: string) => void;
  onDragStart: (e: React.DragEvent, fieldId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, fieldId: string) => void;
  isDragging: boolean;
}

export const FormFieldItem: React.FC<FormFieldItemProps> = ({
  field,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const getFieldPreview = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            placeholder={field.placeholder || "Enter text"}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        );
      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder || "Enter number"}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        );
      case "dropdown":
        return (
          <select
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          >
            <option>Select an option</option>
            {Array.isArray(field.value) &&
              field.value.map((opt, idx) => (
                <option key={idx}>{opt}</option>
              ))}
          </select>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {Array.isArray(field.value) &&
              field.value.map((opt, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{opt}</span>
                </label>
              ))}
          </div>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {Array.isArray(field.value) &&
              field.value.map((opt, idx) => (
                <label key={idx} className="flex items-center">
                  <input
                    type="radio"
                    name={`radio-${field.id}`}
                    disabled
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {opt}
                  </span>
                </label>
              ))}
          </div>
        );
      case "date":
        return (
          <input
            type="date"
            placeholder={field.placeholder || "Select date"}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        );
      case "file":
        return (
          <FileUpload
            accept=".pdf"
            maxSize={10}
            disabled={true}
            label=""
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, field.id)}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, field.id)}
        className={`
          bg-white border-2 rounded-lg p-4 mb-3 transition-all
          ${isDragging ? "border-blue-500 opacity-50" : "border-gray-200"}
          hover:border-gray-300 cursor-move
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-gray-400 cursor-grab active:cursor-grabbing">
              <GripVerticalIcon className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {field.order + 1}
            </span>
          </div>

          <div className="flex-1">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            </div>
            {getFieldPreview()}
            <div className="mt-2 text-xs text-gray-500">
              Type: {field.type}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <IconButton
              icon={<PencilIcon />}
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
              tooltip="Edit Field"
            />
            <IconButton
              icon={<TrashIcon />}
              variant="danger"
              size="sm"
              onClick={() => onDelete(field.id)}
              tooltip="Delete Field"
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Field"
        size="md"
      >
        <FieldEditor
          field={field}
          onUpdate={onUpdate}
          onClose={() => setIsEditing(false)}
        />
      </Modal>
    </>
  );
};
