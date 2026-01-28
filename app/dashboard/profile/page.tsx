"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { dummyForms } from "@/lib/data/dummy-forms";
import { dummyCandidates } from "@/lib/data/dummy-candidates";

export default function ProfilePage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Calculate achievements based on date range
  const achievements = useMemo(() => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Filter forms by date range
    let filteredForms = dummyForms;
    if (start) {
      filteredForms = filteredForms.filter(
        (form) => form.createdAt >= start
      );
    }
    if (end) {
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      filteredForms = filteredForms.filter(
        (form) => form.createdAt <= endDateWithTime
      );
    }

    // Filter candidates by date range
    let filteredCandidates = dummyCandidates;
    if (start) {
      filteredCandidates = filteredCandidates.filter(
        (candidate) => candidate.appliedAt >= start
      );
    }
    if (end) {
      const endDateWithTime = new Date(end);
      endDateWithTime.setHours(23, 59, 59, 999);
      filteredCandidates = filteredCandidates.filter(
        (candidate) => candidate.appliedAt <= endDateWithTime
      );
    }

    // Count candidates by stage
    const pickedCount = filteredCandidates.filter(
      (c) => c.status === "qualified"
    ).length;
    const cvReviewCount = filteredCandidates.filter(
      (c) => c.stage === "cv_review"
    ).length;
    const readyForInterviewCount = filteredCandidates.filter(
      (c) => c.stage === "ready_for_interview"
    ).length;

    return {
      formsCreated: filteredForms.length,
      candidatesPicked: pickedCount,
      candidatesScreened: cvReviewCount,
      candidatesReadyForInterview: readyForInterviewCount,
    };
  }, [startDate, endDate]);

  // Get user initial for avatar
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Your account information
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white shadow-sm rounded-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-semibold">
                {getUserInitial()}
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <p className="text-sm text-gray-900">
                  {user?.name || user?.username || "Not set"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p className="text-sm text-gray-900">
                  {user?.email || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Achievement
          </h2>

          {/* Date Range Filter */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filter by Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Forms Created */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Forms Created</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {achievements.formsCreated}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Candidates Picked */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidates Picked</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {achievements.candidatesPicked}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Candidates Screened (CV Review) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Candidates Screened</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {achievements.candidatesScreened}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Candidates Ready for Interview */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Ready for Interview
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {achievements.candidatesReadyForInterview}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
