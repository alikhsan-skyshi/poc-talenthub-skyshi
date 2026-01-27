"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormField, FieldType } from "@/types/form-builder";

interface FieldEditorProps {
  field: FormField;
  onUpdate: (field: FormField) => void;
  onClose: () => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  onUpdate,
  onClose,
}) => {
  const [editedField, setEditedField] = useState<FormField>({ ...field });

  const handleSave = () => {
    onUpdate(editedField);
    onClose();
  };

  const handleValueChange = (value: string) => {
    if (
      editedField.type === "dropdown" ||
      editedField.type === "checkbox" ||
      editedField.type === "radio"
    ) {
      // Split by comma or newline for options
      const options = value
        .split(/[,\n]/)
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0);
      setEditedField({ ...editedField, value: options });
    } else {
      setEditedField({ ...editedField, value });
    }
  };

  const getValueDisplay = () => {
    if (Array.isArray(editedField.value)) {
      return editedField.value.join(", ");
    }
    return editedField.value || "";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field Type
        </label>
        <select
          value={editedField.type}
          onChange={(e) =>
            setEditedField({
              ...editedField,
              type: e.target.value as FieldType,
              value: undefined,
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="text">Text Input</option>
          <option value="number">Number Input</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio Button</option>
          <option value="date">Date Picker</option>
          <option value="file">File Upload</option>
        </select>
      </div>

      <Input
        label="Label"
        value={editedField.label}
        onChange={(e) =>
          setEditedField({ ...editedField, label: e.target.value })
        }
        placeholder="Enter field label"
        required
      />

      {(editedField.type === "text" ||
        editedField.type === "number" ||
        editedField.type === "date" ||
        editedField.type === "file") && (
        <Input
          label="Placeholder"
          value={editedField.placeholder || ""}
          onChange={(e) =>
            setEditedField({ ...editedField, placeholder: e.target.value })
          }
          placeholder="Enter placeholder text"
        />
      )}

      {(editedField.type === "dropdown" ||
        editedField.type === "checkbox" ||
        editedField.type === "radio") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options (separated by comma or newline)
          </label>
          <textarea
            value={getValueDisplay()}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="Option 1, Option 2, Option 3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
      )}

      <div className="flex items-center">
        <input
          type="checkbox"
          id="required"
          checked={editedField.required || false}
          onChange={(e) =>
            setEditedField({ ...editedField, required: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="ml-2 text-sm text-gray-700">
          Required field
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};
