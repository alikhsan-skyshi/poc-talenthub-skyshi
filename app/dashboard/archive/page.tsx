"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ArchivePage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Archive</h1>
          <p className="text-sm text-gray-600 mt-1">
            View archived forms and candidates
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Archive content will be displayed here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
