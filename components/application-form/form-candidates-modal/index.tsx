"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import type { ApplicationForm, FormWave } from "@/types/application-form";
import type { Candidate } from "@/types/candidate";
import { dummyCandidates } from "@/lib/data/dummy-candidates";

interface FormCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: ApplicationForm | null;
}

interface CandidateGroup {
  wave: FormWave;
  candidates: Candidate[];
}

export const FormCandidatesModal: React.FC<FormCandidatesModalProps> = ({
  isOpen,
  onClose,
  form,
}) => {
  // Group candidates by wave
  const candidateGroups = useMemo(() => {
    if (!form) return [];

    // Get candidates that applied to this form
    const formCandidates = dummyCandidates.filter(
      (candidate) => candidate.formTitle === form.title
    );

    // If form has no waves, create default wave from createdAt
    if (!form.waves || form.waves.length === 0) {
      const defaultWave: FormWave = {
        waveNumber: 1,
        openedAt: form.createdAt,
        closedAt: form.status === "closed" ? new Date() : undefined,
      };
      return [
        {
          wave: defaultWave,
          candidates: formCandidates,
        },
      ];
    }

    // Group candidates by wave based on appliedAt date
    const groups: CandidateGroup[] = form.waves.map((wave, index) => {
      const openedAt = wave.openedAt;
      const closedAt = wave.closedAt;
      
      // Determine the end date for this wave
      // If wave is closed, use closedAt
      // If wave is still open, use current date or next wave's openedAt (if exists)
      let waveEndDate: Date;
      if (closedAt) {
        waveEndDate = closedAt;
      } else if (form.waves && index < form.waves.length - 1) {
        // If there's a next wave, this wave ends when next wave starts
        waveEndDate = form.waves[index + 1].openedAt;
      } else {
        // Last wave and still open
        waveEndDate = new Date();
      }

      const candidates = formCandidates.filter((candidate) => {
        const appliedAt = candidate.appliedAt;
        return appliedAt >= openedAt && appliedAt < waveEndDate;
      });

      return {
        wave,
        candidates,
      };
    });

    return groups;
  }, [form]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (!form) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Candidates - ${form.title}`}
      size="xl"
    >
      <div className="space-y-6">
        {candidateGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No candidates found for this form
          </div>
        ) : (
          candidateGroups.map((group) => (
            <div key={group.wave.waveNumber} className="space-y-3">
              {/* Wave Header */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Wave {group.wave.waveNumber}
                    </h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>
                        Opened: {formatDate(group.wave.openedAt)}
                      </span>
                      {group.wave.closedAt && (
                        <span className="ml-4">
                          Closed: {formatDate(group.wave.closedAt)}
                        </span>
                      )}
                      {!group.wave.closedAt && (
                        <span className="ml-4 text-green-600 font-medium">
                          (Still Open)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {group.candidates.length} candidates
                  </div>
                </div>
              </div>

              {/* Candidates Table */}
              {group.candidates.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No candidates in this wave
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Experience
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Applied At
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.candidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {candidate.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {candidate.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-900">
                              {candidate.experience}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="text-sm text-gray-500">
                              {formatDateShort(candidate.appliedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {candidate.status === "qualified" ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Qualified
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Not Qualified
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
