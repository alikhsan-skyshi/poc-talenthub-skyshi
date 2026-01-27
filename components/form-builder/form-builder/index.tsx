"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormFieldItem } from "@/components/form-builder/form-field-item";
import { PlusIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { FieldEditor } from "@/components/form-builder/field-editor";
import type { FormField, FieldType } from "@/types/form-builder";

interface FormBuilderProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onFieldsChange,
}) => {
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);

  const generateId = () => `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddField = (type: FieldType) => {
    const newField: FormField = {
      id: generateId(),
      type,
      label: `New ${type} field`,
      placeholder:
        type === "text" || type === "number" || type === "date"
          ? "Enter value"
          : undefined,
      value:
        type === "dropdown" || type === "checkbox" || type === "radio"
          ? []
          : type === "file"
          ? undefined
          : undefined,
      required: false,
      order: fields.length,
    };
    onFieldsChange([...fields, newField]);
    setIsAddingField(false);
  };

  const handleUpdateField = (updatedField: FormField) => {
    onFieldsChange(
      fields.map((f) => (f.id === updatedField.id ? updatedField : f))
    );
  };

  const handleDeleteField = (fieldId: string) => {
    const newFields = fields
      .filter((f) => f.id !== fieldId)
      .map((f, index) => ({ ...f, order: index }));
    onFieldsChange(newFields);
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    if (!draggedFieldId || draggedFieldId === targetFieldId) {
      setDraggedFieldId(null);
      return;
    }

    const draggedIndex = fields.findIndex((f) => f.id === draggedFieldId);
    const targetIndex = fields.findIndex((f) => f.id === targetFieldId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedFieldId(null);
      return;
    }

    const newFields = [...fields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);

    // Update order
    const reorderedFields = newFields.map((f, index) => ({
      ...f,
      order: index,
    }));

    onFieldsChange(reorderedFields);
    setDraggedFieldId(null);
  };

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="outline"
          onClick={() => setIsAddingField(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No fields added yet</p>
          <Button
            variant="primary"
            onClick={() => setIsAddingField(true)}
            className="flex items-center gap-2 mx-auto"
          >
            <PlusIcon className="w-4 h-4" />
            Add Your First Field
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <FormFieldItem
                key={field.id}
                field={field}
                onUpdate={handleUpdateField}
                onDelete={handleDeleteField}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragging={draggedFieldId === field.id}
              />
            ))}
        </div>
      )}

      <Modal
        isOpen={isAddingField}
        onClose={() => setIsAddingField(false)}
        title="Add New Field"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            Select the type of field you want to add:
          </p>
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            <Button
              variant="outline"
              onClick={() => handleAddField("text")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📝</span>
              <span>Text Input</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("number")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🔢</span>
              <span>Number Input</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("dropdown")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📋</span>
              <span>Dropdown</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("checkbox")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">☑️</span>
              <span>Checkbox</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("radio")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">🔘</span>
              <span>Radio Button</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("date")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📅</span>
              <span>Date Picker</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAddField("file")}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <span className="text-2xl">📎</span>
              <span>File Upload</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
