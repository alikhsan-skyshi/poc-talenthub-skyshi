"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { dummyCandidates } from "@/lib/data/dummy-candidates";
import { dummyForms } from "@/lib/data/dummy-forms";

export default function DashboardPage() {
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

    // Calculate statistics
    const jobPosting = filteredForms.length;
    const inReview = filteredCandidates.filter(
      (c) => c.stage === "cv_review"
    ).length;
    const approved = filteredCandidates.filter(
      (c) => c.status === "qualified"
    ).length;
    const rejected = filteredCandidates.filter(
      (c) => c.status === "not_qualified"
    ).length;
    const totalCandidatesApplication = inReview + approved + rejected;

    return {
      jobPosting,
      inReview,
      approved,
      rejected,
      totalCandidatesApplication,
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user?.name || user?.username}!
          </p>
        </div>

        <div className="space-y-6">
          {/* Achievement Section */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Achievement
            </h2>

            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Job Posting
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.jobPosting}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  In Review
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.inReview}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Approved
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.approved}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.rejected}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Candidates Application
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {achievements.totalCandidatesApplication}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profile
            </h2>
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-semibold">
                  {getUserInitial()}
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.name || user?.username || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.email || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
