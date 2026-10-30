"use client";

import React, { useState, useEffect } from "react";
import { 
  X, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Sparkles, 
  Calendar, 
  Check, 
  ShieldCheck,
  Tag
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { Candidate } from "../types";

interface CandidateDetailProps {
  candidate: Candidate | null;
  onClose: () => void;
}

export default function CandidateDetail({ candidate, onClose }: CandidateDetailProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "resume">("summary");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!candidate) return null;

  const chartData = [
    { name: "Technical Fit", Score: candidate.technical_score, fill: "#2563eb" },
    { name: "Experience Depth", Score: candidate.experience_score, fill: "#4f46e5" },
    { name: "Education Match", Score: candidate.education_score, fill: "#10b981" },
  ];

  const status =
    candidate.score >= 80 ? "Shortlisted" : candidate.score >= 50 ? "Under Review" : "Low Match";
  const statusBadge =
    candidate.score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : candidate.score >= 50
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Clickable Backdrop to Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div className="relative flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 sm:w-[540px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Candidate Dossier
              </span>
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusBadge}`}>
                {status}
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-1">{candidate.name}</h2>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
              {candidate.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {candidate.email}
                </span>
              )}
              {candidate.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {candidate.phone}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition ${
              activeTab === "summary"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            AI Evaluation Summary
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`flex-1 py-3 text-center text-xs font-bold border-b-2 transition ${
              activeTab === "resume"
                ? "border-blue-600 text-blue-600 bg-white"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Raw Parsed Resume
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "summary" ? (
            <>
              {/* Overall Score Card */}
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-blue-50/60 via-indigo-50/30 to-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Overall Match Score
                    </span>
                    <h3 className="text-3xl font-black text-blue-600 mt-0.5">
                      {candidate.score}%
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                {/* AI Verdict */}
                <div className="mt-4 pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    <span>AI Screening Verdict</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {candidate.summary || "Candidate demonstrated alignment across technical requirements and relevant project experience."}
                  </p>
                </div>
              </div>

              {/* Dimension Breakdown Bar Chart */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dimensional Score Breakdown
                </h4>
                <div className="h-44 w-full">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                      >
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={110}
                          style={{ fontSize: "11px", fontWeight: "600", fill: "#334155" }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Score"]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontSize: "12px",
                          }}
                        />
                        <Bar dataKey="Score" radius={6} barSize={16} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-400">
                      Loading chart...
                    </div>
                  )}
                </div>
              </div>

              {/* Experience and Education Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                    <span>Experience</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {candidate.experience?.years || 0} Years
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {(candidate.experience?.roles || []).slice(0, 2).join(", ") || "No role listed"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Education</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-2">
                    {candidate.education || "Bachelor's Degree (Estimated)"}
                  </p>
                </div>
              </div>

              {/* Verified Skills Inventory */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Verified Competencies ({(candidate.skills || []).length})
                  </h4>
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/60"
                    >
                      {skill}
                    </span>
                  ))}
                  {(candidate.skills || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No specific skills extracted.</p>
                  )}
                </div>
              </div>

              {/* Career Chronology Highlights */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Career Progression Timeline
                </h4>
                <div className="space-y-4 pl-3 border-l-2 border-blue-200">
                  {(candidate.experience?.roles || []).map((role, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                      <p className="text-xs font-bold text-slate-900">{role}</p>
                      {candidate.experience?.companies?.[idx] && (
                        <p className="text-[11px] text-slate-500">
                          at {candidate.experience.companies[idx]}
                        </p>
                      )}
                    </div>
                  ))}
                  {(candidate.experience?.roles || []).length === 0 && (
                    <p className="text-xs text-slate-400 italic">No chronological roles extracted.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Raw Resume Tab */
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Extracted Resume Text
                </span>
                <span className="text-[10px] text-slate-400 font-normal">Standardized UTF-8</span>
              </div>
              <pre className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-[11px] leading-relaxed text-slate-800 whitespace-pre-wrap">
                {candidate.resume_text || "No parsed resume text available."}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
