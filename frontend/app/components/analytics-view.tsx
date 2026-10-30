"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users, 
  CheckCircle2, 
  Award, 
  Clock, 
  Filter, 
  PieChart as PieIcon,
  Layers,
  ArrowRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Candidate, Job } from "../types";

interface AnalyticsViewProps {
  candidates: Candidate[];
  activeJob: Job | null;
  jobs: Job[];
}

export default function AnalyticsView({ candidates, activeJob, jobs }: AnalyticsViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.score >= 80).length;
  const underReview = candidates.filter((c) => c.score >= 50 && c.score < 80).length;
  const lowMatch = candidates.filter((c) => c.score < 50).length;

  const avgScore = total > 0 ? Math.round(candidates.reduce((s, c) => s + c.score, 0) / total) : 0;
  const avgExp = total > 0 ? (candidates.reduce((s, c) => s + (c.experience?.years || 0), 0) / total).toFixed(1) : "0.0";

  // Score distribution
  const scoreBuckets = useMemo(() => {
    const buckets = [
      { range: "0-40%", count: 0, fill: "#94a3b8" },
      { range: "41-60%", count: 0, fill: "#60a5fa" },
      { range: "61-80%", count: 0, fill: "#3b82f6" },
      { range: "81-100%", count: 0, fill: "#10b981" },
    ];
    candidates.forEach((c) => {
      if (c.score <= 40) buckets[0].count++;
      else if (c.score <= 60) buckets[1].count++;
      else if (c.score <= 80) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [candidates]);

  // Skill Frequency Analysis
  const topSkills = useMemo(() => {
    const map: Record<string, number> = {};
    candidates.forEach((c) => {
      (c.skills || []).forEach((s) => {
        map[s] = (map[s] || 0) + 1;
      });
    });

    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [candidates]);

  // Status Distribution Pie Data
  const statusPieData = [
    { name: "Shortlisted (≥80%)", value: shortlisted, color: "#10b981" },
    { name: "Under Review (50-79%)", value: underReview, color: "#f59e0b" },
    { name: "Low Match (<50%)", value: lowMatch, color: "#cbd5e1" },
  ].filter((d) => d.value > 0);

  const handleExportCSV = () => {
    if (candidates.length === 0) {
      alert("No data available to export.");
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
    link.setAttribute("download", `HireSense_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Analytics & Recruitment Intelligence</h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
              Live Reports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of applicant metrics for {activeJob?.title || "all screening pipelines"}
          </p>
        </div>

        {total > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            <span>Download Full CSV Report</span>
          </button>
        )}
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Applicants</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{total}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ingested & parsed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Conversion Rate</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {total > 0 ? Math.round((shortlisted / total) * 100) : 0}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{shortlisted} Shortlisted profiles</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mean Score</span>
          <p className="text-2xl font-black text-blue-600 mt-2">{avgScore}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Average pool match</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mean Experience</span>
          <p className="text-2xl font-black text-indigo-600 mt-2">{avgExp} Yrs</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Career duration</p>
        </div>
      </div>

      {/* Hiring Funnel Visualization */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Talent Screening Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative">
            <span className="text-[10px] font-bold uppercase text-slate-400">Step 1: Resumes Uploaded</span>
            <p className="text-xl font-black text-slate-900 mt-1">{total}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">100% Ingested</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-blue-50/40 p-4 relative">
            <span className="text-[10px] font-bold uppercase text-blue-700">Step 2: Dual AI Parsed</span>
            <p className="text-xl font-black text-blue-600 mt-1">{total}</p>
            <p className="text-[11px] text-blue-600/80 mt-0.5">100% Extracted</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-indigo-50/40 p-4 relative">
            <span className="text-[10px] font-bold uppercase text-indigo-700">Step 3: Under Review</span>
            <p className="text-xl font-black text-indigo-600 mt-1">{underReview + shortlisted}</p>
            <p className="text-[11px] text-indigo-600/80 mt-0.5">≥ 50% Threshold</p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 relative">
            <span className="text-[10px] font-bold uppercase text-emerald-700">Step 4: Top Shortlist</span>
            <p className="text-xl font-black text-emerald-600 mt-1">{shortlisted}</p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">≥ 80% Fit (Interview Ready)</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Distribution Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Score Alignment Histogram</h2>
          <p className="text-[11px] text-slate-500 mb-4">Frequency of applicant scores across benchmark intervals</p>
          <div className="h-60 w-full">
            {mounted && total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No data available for chart.
              </div>
            )}
          </div>
        </div>

        {/* Top Extracted Skills Frequency */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">Top Skills Frequency</h2>
            <p className="text-[11px] text-slate-500 mb-4">Most prevalent verified competencies in the pool</p>
            {topSkills.length > 0 ? (
              <div className="space-y-3">
                {topSkills.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="font-bold text-blue-600">{item.count} profiles</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${(item.count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No skills extracted yet.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            Based on {total} parsed resumes in current session.
          </div>
        </div>
      </div>
    </div>
  );
}

