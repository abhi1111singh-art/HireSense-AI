"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Scale, 
  CheckCircle2, 
  Sparkles,
  Mail,
  Check
} from "lucide-react";
import { API_BASE } from "../config";
import { Candidate } from "../types";

interface ComparisonMatrixProps {
  jobId: number;
  candidateIds: number[];
  onClose: () => void;
}

export default function ComparisonMatrix({ jobId, candidateIds, onClose }: ComparisonMatrixProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComparisonData() {
      try {
        const idsParam = candidateIds.join(",");
        const response = await fetch(`${API_BASE}/api/jobs/${jobId}/compare?ids=${idsParam}`);
        if (!response.ok) throw new Error("Failed to load candidate comparison");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        console.error(err);
        alert("Could not load candidate comparison details.");
      } finally {
        setLoading(false);
      }
    }

    if (candidateIds.length > 0) {
      fetchComparisonData();
    }
  }, [jobId, candidateIds]);

  // Highest score in current comparison set
  const maxScore = Math.max(...candidates.map((c) => c.score), 0);
  const maxExp = Math.max(...candidates.map((c) => c.experience?.years || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6">
      {/* Clickable Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative flex flex-col w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Side-by-Side Candidate Evaluation Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Evaluating {candidates.length} candidate profiles head-to-head
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Matrix Body */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading candidate matrix...</p>
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-center py-12 text-xs text-slate-400">No candidates available for comparison.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((cand) => {
                const isBestOverall = cand.score === maxScore && candidates.length > 1;
                const isBestExp = (cand.experience?.years || 0) === maxExp && candidates.length > 1;

                return (
                  <div
                    key={cand.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                      isBestOverall
                        ? "border-blue-500 bg-blue-50/20 shadow-md ring-1 ring-blue-500/20"
                        : "border-slate-200 bg-white shadow-xs"
                    }`}
                  >
                    <div>
                      {/* Name & Best Badge */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-black text-slate-900">{cand.name}</h3>
                          <p className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                            {cand.email || "No email listed"}
                          </p>
                        </div>

                        {isBestOverall && (
                          <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                            Top Pick
                          </span>
                        )}
                      </div>

                      {/* Scores Card */}
                      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">Overall Match</span>
                          <span className="text-base font-black text-blue-600">{cand.score}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Technical Fit</span>
                          <span className="font-bold text-slate-800">{cand.technical_score}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Experience Score</span>
                          <span className="font-bold text-slate-800">{cand.experience_score}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Education Score</span>
                          <span className="font-bold text-slate-800">{cand.education_score}%</span>
                        </div>
                      </div>

                      {/* Experience Info */}
                      <div className="mt-4 space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Experience Tenure
                        </span>
                        <p className="font-bold text-slate-800">
                          {cand.experience?.years || 0} Years{" "}
                          {isBestExp && (
                            <span className="text-emerald-600 text-[11px] font-semibold">
                              (Most Senior)
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {(cand.experience?.roles || []).join(", ") || "No roles listed"}
                        </p>
                      </div>

                      {/* Education */}
                      <div className="mt-4 space-y-1 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Education
                        </span>
                        <p className="font-semibold text-slate-800 text-[11px]">
                          {cand.education || "Bachelor's Degree"}
                        </p>
                      </div>

                      {/* Skills List */}
                      <div className="mt-4 space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Verified Skills
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(cand.skills || []).map((s, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Summary Quote */}
                    <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 italic">
                      &quot;{cand.summary || "Matches key role requirements."}&quot;
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
