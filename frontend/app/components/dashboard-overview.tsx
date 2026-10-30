"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  UploadCloud, 
  Briefcase, 
  ArrowRight, 
  FileText, 
  Layers, 
  BarChart3, 
  Clock, 
  Download,
  Scale,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { Candidate, Job, AppNavigationTab } from "../types";

interface DashboardOverviewProps {
  candidates: Candidate[];
  activeJob: Job | null;
  onNavigate: (tab: AppNavigationTab) => void;
  onSelectCandidate: (candidate: Candidate) => void;
  onLoadDemoResumes: () => void;
  isDemoLoading: boolean;
}

export default function DashboardOverview({
  candidates,
  activeJob,
  onNavigate,
  onSelectCandidate,
  onLoadDemoResumes,
  isDemoLoading,
}: DashboardOverviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter((c) => c.score >= 80);
  const underReview = candidates.filter((c) => c.score >= 50 && c.score < 80);
  const lowMatch = candidates.filter((c) => c.score < 50);

  const avgScore = totalCandidates > 0
    ? Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / totalCandidates)
    : 0;

  const avgExp = totalCandidates > 0
    ? (candidates.reduce((sum, c) => sum + (c.experience?.years || 0), 0) / totalCandidates).toFixed(1)
    : "0.0";

  // Score distribution buckets for chart
  const scoreDistributionData = useMemo(() => {
    const buckets = [
      { range: "0-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ];

    candidates.forEach((c) => {
      if (c.score <= 40) buckets[0].count++;
      else if (c.score <= 60) buckets[1].count++;
      else if (c.score <= 80) buckets[2].count++;
      else buckets[3].count++;
    });

    return buckets;
  }, [candidates]);

  // Activity / Competency Dimensions breakdown
  const competencyData = useMemo(() => {
    if (totalCandidates === 0) {
      return [
        { metric: "Technical", avg: 0 },
        { metric: "Experience", avg: 0 },
        { metric: "Education", avg: 0 },
      ];
    }
    const techAvg = Math.round(candidates.reduce((s, c) => s + (c.technical_score || 0), 0) / totalCandidates);
    const expAvg = Math.round(candidates.reduce((s, c) => s + (c.experience_score || 0), 0) / totalCandidates);
    const eduAvg = Math.round(candidates.reduce((s, c) => s + (c.education_score || 0), 0) / totalCandidates);

    return [
      { metric: "Technical Skills", avg: techAvg },
      { metric: "Experience Depth", avg: expAvg },
      { metric: "Education Fit", avg: eduAvg },
    ];
  }, [candidates, totalCandidates]);

  // Export CSV helper
  const handleExportCSV = () => {
    if (candidates.length === 0) {
      alert("No candidate data to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Score", "Technical", "Experience Years", "Education", "Skills"];
    const rows = candidates.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      c.score,
      c.technical_score,
      c.experience?.years || 0,
      `"${c.education || ""}"`,
      `"${(c.skills || []).join(", ")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HireSense_Candidates_${activeJob?.id || "Export"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>HireSense AI Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, Talent Acquisition
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeJob
                ? `Currently evaluating candidates for "${activeJob.title}". Review top rankings, inspect skill dossiers, or batch-upload new applicant profiles.`
                : "Get started by selecting or defining a job specification and uploading candidate resumes to begin automated screening."}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate("upload")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 active:scale-95 transition"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Resumes</span>
            </button>
            <button
              onClick={() => onNavigate("jobs")}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              <Briefcase className="h-4 w-4" />
              <span>Job Specs</span>
            </button>
            {totalCandidates > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition"
                title="Export CSV Report"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Resumes Screened */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Screened
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalCandidates}</span>
            <span className="text-xs font-semibold text-slate-400">resumes</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Across {activeJob ? "active pipeline" : "all pipelines"}
          </p>
        </div>

        {/* Card 2: Shortlisted Candidates */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Shortlisted
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{shortlisted.length}</span>
            <span className="text-xs font-semibold text-emerald-700">
              ({totalCandidates > 0 ? Math.round((shortlisted.length / totalCandidates) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            ≥ 80% alignment score threshold
          </p>
        </div>

        {/* Card 3: Average Candidate Score */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Average Match
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600">{avgScore}%</span>
            <span className="text-xs font-semibold text-slate-400">overall</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Pool median alignment index
          </p>
        </div>

        {/* Card 4: Average Experience */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Avg Experience
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{avgExp}</span>
            <span className="text-xs font-semibold text-slate-400">years</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Average career tenure depth
          </p>
        </div>
      </div>

      {/* Charts Row: Score Distribution & Screening Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Distribution Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Candidate Score Distribution</h2>
              <p className="text-[11px] text-slate-500">Frequency of candidate scores across benchmark tiers</p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              {totalCandidates} Evaluated
            </span>
          </div>

          <div className="h-56 w-full">
            {mounted && totalCandidates > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl">
                <BarChart3 className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No screening data available</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Upload resumes or load sample candidates to view score distributions.</p>
                {activeJob && (
                  <button
                    onClick={onLoadDemoResumes}
                    disabled={isDemoLoading}
                    className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 transition"
                  >
                    {isDemoLoading ? "Processing Sample Profiles..." : "Load 3 Sample Resumes"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Competency Dimensions Average */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Evaluation Dimensions</h2>
                <p className="text-[11px] text-slate-500">Average sub-scores across candidate pool</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg %</span>
            </div>

            <div className="space-y-4">
              {competencyData.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{comp.metric}</span>
                    <span className="font-bold text-blue-600">{comp.avg}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${comp.avg}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Talent Pool Status:</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {shortlisted.length} Qualified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                {underReview.length} Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Candidates Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Screening Activity</h2>
            <p className="text-[11px] text-slate-500">Latest parsed and evaluated candidate profiles</p>
          </div>
          <button
            onClick={() => onNavigate("candidates")}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All Candidates</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-slate-200 rounded-xl text-center">
            <FileText className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No candidate resumes processed yet</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
              Upload resumes in the Upload section or load our pre-bundled sample profiles to begin testing right away.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onNavigate("upload")}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
              >
                Go to Resume Upload
              </button>
              {activeJob && (
                <button
                  onClick={onLoadDemoResumes}
                  disabled={isDemoLoading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  {isDemoLoading ? "Loading..." : "Load Demo Resumes"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Match Score</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">Top Skills</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.slice(0, 5).map((cand) => {
                  const status =
                    cand.score >= 80 ? "Shortlisted" : cand.score >= 50 ? "Under Review" : "Low Match";
                  const statusColor =
                    cand.score >= 80
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : cand.score >= 50
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-slate-100 text-slate-600 border-slate-200";

                  return (
                    <tr key={cand.id} className="group hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {cand.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{cand.email || "No email listed"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-black text-blue-600 text-sm">{cand.score}%</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700">{cand.experience?.years || 0} Yrs</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(cand.skills || []).slice(0, 3).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusColor}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => onSelectCandidate(cand)}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

