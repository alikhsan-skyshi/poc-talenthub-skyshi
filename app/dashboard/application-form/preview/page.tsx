"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { CheckIcon } from "@/components/ui/icons";
import type { FormField } from "@/types/form-builder";

// Dummy CV data that will be extracted from IT Project Manager Intern position
const dummyCVData: Record<string, string | string[]> = {
  // Personal Information
  "Nama": "Ahmad Rizki Pratama",
  "nama": "Ahmad Rizki Pratama",
  "Name": "Ahmad Rizki Pratama",
  "Email": "ahmad.rizki@university.ac.id",
  "email": "ahmad.rizki@university.ac.id",
  "No HP": "081234567890",
  "no hp": "081234567890",
  "Nomor Telepon": "081234567890",
  "nomor telepon": "081234567890",
  "Phone": "081234567890",
  "Alamat": "Jl. Sudirman No. 45, Jakarta Pusat 10220",
  "alamat": "Jl. Sudirman No. 45, Jakarta Pusat 10220",
  "Address": "Jl. Sudirman No. 45, Jakarta Pusat 10220",
  
  // Education
  "Pendidikan Terakhir": "S1 Teknik Informatika",
  "pendidikan terakhir": "S1 Teknik Informatika",
  "Education": "S1 Teknik Informatika",
  "Universitas": "Universitas Indonesia",
  "universitas": "Universitas Indonesia",
  "University": "Universitas Indonesia",
  "Tahun Lulus": "2025",
  "tahun lulus": "2025",
  "Graduation Year": "2025",
  
  // Experience & Skills
  "Pengalaman Kerja": "IT Project Coordinator Intern",
  "pengalaman kerja": "IT Project Coordinator Intern",
  "Experience": "IT Project Coordinator Intern",
  "Perusahaan": "PT. Digital Solutions Indonesia",
  "perusahaan": "PT. Digital Solutions Indonesia",
  "Company": "PT. Digital Solutions Indonesia",
  "Durasi": "6 bulan",
  "durasi": "6 bulan",
  "Duration": "6 bulan",
  
  // Skills related to job requirements
  "Skills": "Project Management, IT Service Management, Documentation, Stakeholder Communication",
  "skills": "Project Management, IT Service Management, Documentation, Stakeholder Communication",
  "Keahlian": "Project Management, IT Service Management, Documentation, Stakeholder Communication",
  
  // Application Details
  "Application Sources": "LinkedIn",
  "application sources": "LinkedIn",
  "Ready For": "hybrid",
  "ready for": "hybrid",
  "Preferred Start Date": "2024-07-01",
  "preferred start date": "2024-07-01",
  
  // Additional fields that might be in form
  "Position Applied": "IT Project Manager Intern",
  "position applied": "IT Project Manager Intern",
  "Posisi": "IT Project Manager Intern",
  "Motivation": "I am highly motivated to apply for the IT Project Manager Intern position as it aligns perfectly with my career goals in IT project management and service management. I am eager to learn and contribute to your Corporate IT team while gaining valuable experience in project coordination, asset management, and IT operations.",
  "motivation": "I am highly motivated to apply for the IT Project Manager Intern position as it aligns perfectly with my career goals in IT project management and service management. I am eager to learn and contribute to your Corporate IT team while gaining valuable experience in project coordination, asset management, and IT operations.",
};

export default function PreviewFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | "loading">(1);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    fields: FormField[];
  } | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    // Get form data from sessionStorage or URL params
    const storedData = sessionStorage.getItem("previewFormData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        // Use job posting data as default if form title/description is empty
        if (!parsed.title || parsed.title.trim() === "") {
          parsed.title = "IT Project Manager Intern";
        }
        if (!parsed.description || parsed.description.trim() === "") {
          parsed.description = "We are looking for a highly motivated IT Project Manager Intern to support our Corporate IT team in managing internal IT projects, asset tracking, and logistical coordination. This role is designed to alleviate administrative project workloads while offering valuable learning experiences in project coordination, IT operations, and asset lifecycle management.";
        }
        setFormData(parsed);
        // Initialize form values with dummy CV data
        const initialValues: Record<string, string | string[]> = {};
        parsed.fields.forEach((field: FormField) => {
          // Try to match field label with dummy data (case-insensitive)
          const fieldLabelLower = field.label.toLowerCase();
          let matchedValue: string | string[] = "";
          
          // Direct match
          if (dummyCVData[field.label]) {
            matchedValue = dummyCVData[field.label];
          } else {
            // Case-insensitive match
            const matchedKey = Object.keys(dummyCVData).find(
              (key) => key.toLowerCase() === fieldLabelLower
            );
            if (matchedKey) {
              matchedValue = dummyCVData[matchedKey];
            } else {
              // For dropdown/radio, use first option if available
              if (field.type === "dropdown" || field.type === "radio") {
                matchedValue = Array.isArray(field.value) && field.value.length > 0 
                  ? field.value[0] 
                  : "";
              } else if (field.type === "date") {
                matchedValue = "2024-07-01";
              } else if (field.type === "text" || field.type === "number") {
                // For text/number fields, provide a default value if required
                matchedValue = field.required ? "Sample data" : "";
              }
            }
          }
          
          initialValues[field.id] = matchedValue;
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error("Error parsing form data:", error);
        router.push("/dashboard/application-form/create");
      }
    } else {
      router.push("/dashboard/application-form/create");
    }
  }, [router]);

  const handleNext = () => {
    // For preview, allow proceeding without CV upload
    // In production, you might want to keep the validation
    if (!cvFile) {
      // Create a dummy file for preview purposes
      const dummyFile = new File([""], "dummy-cv.pdf", { type: "application/pdf" });
      setCvFile(dummyFile);
    }

    // Show loading
    setStep("loading");

    // Simulate CV analysis
    setTimeout(() => {
      setStep(2);
    }, 2000);
  };

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate required fields (exclude file type as it's already uploaded in step 1)
    const requiredFields = formData?.fields.filter(
      (field) => field.required && field.type !== "file"
    ) || [];
    const missingFields = requiredFields.filter(
      (field) => {
        const value = formValues[field.id];
        if (!value) return true;
        if (typeof value === "string" && value.trim() === "") return true;
        if (Array.isArray(value) && value.length === 0) return true;
        return false;
      }
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(", ")}`);
      return;
    }

    // TODO: Submit form data to backend/API
    // Show success modal
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // Optionally redirect to dashboard or home
    // router.push("/dashboard");
  };

  const renderField = (field: FormField) => {
    const fieldValue = formValues[field.id] || "";

    switch (field.type) {
      case "text":
        return (
          <Input
            key={field.id}
            label={field.label}
            value={fieldValue as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Enter text"}
            required={field.required}
          />
        );
      case "number":
        return (
          <Input
            key={field.id}
            type="number"
            label={field.label}
            value={fieldValue as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder || "Enter number"}
            required={field.required}
          />
        );
      case "dropdown":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={Array.isArray(fieldValue) ? fieldValue[0] : (fieldValue as string) || ""}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => (
                  <option key={idx} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => {
                  const checkedValues = Array.isArray(fieldValue) ? fieldValue : [];
                  const isChecked = checkedValues.includes(opt);
                  return (
                    <label key={idx} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const currentValues = Array.isArray(fieldValue) ? [...fieldValue] : [];
                          if (e.target.checked) {
                            handleFieldChange(field.id, [...currentValues, opt]);
                          } else {
                            handleFieldChange(
                              field.id,
                              currentValues.filter((v) => v !== opt)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                  );
                })}
            </div>
          </div>
        );
      case "radio":
        return (
          <div key={field.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {Array.isArray(field.value) &&
                field.value.map((opt, idx) => (
                  <label key={idx} className="flex items-center">
                    <input
                      type="radio"
                      name={`radio-${field.id}`}
                      value={opt}
                      checked={(fieldValue as string) === opt}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
            </div>
          </div>
        );
      case "date":
        return (
          <Input
            key={field.id}
            type="date"
            label={field.label}
            value={fieldValue as string}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            required={field.required}
          />
        );
      default:
        return null;
    }
  };

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Loading form data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {formData.title || "Application Form"}
              </h1>
              <div className="text-gray-600 whitespace-pre-line">
                {formData.description || "Form description"}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Upload CV
              </h2>
              <FileUpload
                accept=".pdf,.doc,.docx"
                maxSize={10}
                label="CV/Resume"
                required
                onFileSelect={setCvFile}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-900">Analisis CV</p>
            <p className="text-sm text-gray-500 mt-2">
              Sedang menganalisis CV Anda...
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {formData.title || "Application Form"}
              </h1>
              <div className="text-gray-600 whitespace-pre-line">
                {formData.description || "Form description"}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Form Data
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Data berikut telah diisi berdasarkan CV Anda. Silakan periksa dan edit jika diperlukan.
              </p>
              <div className="space-y-4">
                {formData.fields
                  .filter((field) => field.type !== "file") // Exclude file upload field as it's already done in step 1
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div key={field.id}>{renderField(field)}</div>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep(1)} type="button">
                Back
              </Button>
              <Button variant="primary" onClick={handleSubmit} type="button">
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title=""
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
            <CheckIcon className="w-10 h-10 text-green-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Form Berhasil Dikirim!
            </h3>
            <p className="text-gray-600 mb-1">
              Terima kasih telah mengirimkan lamaran Anda.
            </p>
            <p className="text-gray-600">
              Anda akan mendapatkan feedback terkait proses lamaran melalui email yang telah Anda daftarkan.
            </p>
          </div>
          <div className="flex justify-center pt-4">
            <Button variant="primary" onClick={handleCloseSuccessModal}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
