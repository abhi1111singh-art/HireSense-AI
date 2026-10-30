"use client";

import React from "react";
import { 
  Briefcase, 
  Trash2, 
  Calendar, 
  Tag, 
  UploadCloud, 
  ListOrdered, 
  FileCode,
  Sparkles,
  Play
} from "lucide-react";
import { Job, ActiveTab } from "../types";

interface PipelineHeaderProps {
  activeJob: Job | null;
  candidateCount: number;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onDeleteJob: (jobId: number) => void;
  onLoadDemoResumes: () => void;
  isDemoLoading: boolean;
}

export default function PipelineHeader({
  activeJob,
  candidateCount,
  activeTab,
  onTabChange,
  onDeleteJob,
  onLoadDemoResumes,
  isDemoLoading,
}: PipelineHeaderProps) {
  if (!activeJob) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <Briefcase className="mx-auto h-10 w-10 text-zinc-400" />
        <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
          No Active Screening Pipeline Selected
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Create a new job specification or select one from the menu to screen candidates.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-800/80 dark:bg-zinc-950">
      
      {/* Top Banner with Title, Meta, and Actions */}
      <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          
          {/* Title & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 ring-1 ring-indigo-500/20 dark:bg-indigo-950/60 dark:text-indigo-300">
                Active Job Pipeline
              </span>
              <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium">
                <Calendar className="h-3 w-3" />
                {new Date(activeJob.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              {activeJob.title}
            </h1>

            <p className="max-w-3xl text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {activeJob.description}
            </p>

            {/* Extracted Requirements Chips */}
            {activeJob.requirements && activeJob.requirements.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1">
                  <Tag className="h-3 w-3 text-indigo-500" />
                  Key Benchmarks:
                </span>
                {activeJob.requirements.map((req, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 ring-1 ring-zinc-200/60 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800"
                  >
                    {req}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onLoadDemoResumes}
              disabled={isDemoLoading}
              title="Instantly process bundled sample candidate resumes"
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-3.5 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100/80 active:scale-95 disabled:opacity-50 dark:border-indigo-900/60 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
            >
              {isDemoLoading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
              ) : (
                <Play className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-current" />
              )}
              <span>Load 3 Demo Resumes</span>
            </button>

            <button
              onClick={() => onDeleteJob(activeJob.id)}
              title="Delete this pipeline and all evaluated candidates"
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Delete Pipeline</span>
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center border-t border-zinc-100 px-4 sm:px-6 dark:border-zinc-900 overflow-x-auto">
        <button
          onClick={() => onTabChange("leaderboard")}
          className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "leaderboard"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
          <span>Ranked Candidates</span>
          <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
            activeTab === "leaderboard"
              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
          }`}>
            {candidateCount}
          </span>
        </button>

        <button
          onClick={() => onTabChange("upload")}
          className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "upload"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload & Ingestion</span>
        </button>

        <button
          onClick={() => onTabChange("specs")}
          className={`flex items-center gap-2 border-b-2 py-3.5 px-3 text-xs font-bold transition whitespace-nowrap ${
            activeTab === "specs"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Job Specification & Templates</span>
        </button>
      </div>

    </div>
  );
}
