"use client";

import React from "react";
import { Users, Award, CheckCircle, Clock, Zap } from "lucide-react";
import { Candidate } from "../types";

interface MetricsOverviewProps {
  candidates: Candidate[];
}

export default function MetricsOverview({ candidates }: MetricsOverviewProps) {
  const totalCount = candidates.length;
  
  // Best Candidate
  const topCandidate = totalCount > 0
    ? [...candidates].sort((a, b) => b.score - a.score)[0]
    : null;

  // Qualified count (Score >= 75)
  const qualifiedCount = candidates.filter((c) => c.score >= 75).length;
  const qualifiedPercent = totalCount > 0 ? Math.round((qualifiedCount / totalCount) * 100) : 0;

  // Average Experience
  const avgExp = totalCount > 0
    ? (candidates.reduce((sum, c) => sum + (c.experience?.years || 0), 0) / totalCount).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {/* 1. Total Candidates */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Screened Applicants
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {totalCount}
          </span>
          <span className="text-xs font-semibold text-zinc-400">
            candidates
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          In active screening pipeline
        </p>
      </div>

      {/* 2. Top Match */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Top Match Score
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {topCandidate ? `${topCandidate.score}%` : "—"}
          </span>
          {topCandidate && (
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 truncate max-w-[110px]">
              {topCandidate.name}
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          {topCandidate ? "Highest alignment index" : "Awaiting resumes"}
        </p>
      </div>

      {/* 3. Qualified Pool */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Strong Matches
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {qualifiedCount}
          </span>
          <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
            ({qualifiedPercent}%)
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          Scoring ≥ 75% alignment threshold
        </p>
      </div>

      {/* 4. Average Experience */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Average Experience
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            {avgExp}
          </span>
          <span className="text-xs font-semibold text-zinc-400">
            years
          </span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          Average tenure across applicants
        </p>
      </div>
    </div>
  );
}
