import type { FormField } from "@/types/form-builder";

export const getDefaultFormFields = (): FormField[] => {
  return [
    {
      id: "default-field-1",
      type: "text",
      label: "Nama",
      placeholder: "Masukkan nama lengkap",
      required: true,
      order: 0,
      createdBy: "admin",
    },
    {
      id: "default-field-2",
      type: "text",
      label: "No HP",
      placeholder: "Masukkan nomor handphone",
      required: true,
      order: 1,
      createdBy: "admin",
    },
    {
      id: "default-field-3",
      type: "text",
      label: "Email",
      placeholder: "Masukkan alamat email",
      required: true,
      order: 2,
      createdBy: "admin",
    },
    {
      id: "default-field-4",
      type: "dropdown",
      label: "Application Sources",
      value: ["LinkedIn", "Glints", "Jobstreet"],
      required: true,
      order: 3,
      createdBy: "admin",
    },
    {
      id: "default-field-5",
      type: "radio",
      label: "Ready For",
      value: ["onsite", "hybrid", "remote", "flexible"],
      required: true,
      order: 4,
      createdBy: "admin",
    },
    {
      id: "default-field-6",
      type: "date",
      label: "Preferred Start Date",
      placeholder: "Pilih tanggal",
      required: false,
      order: 5,
      createdBy: "admin",
    },
  ];
};
