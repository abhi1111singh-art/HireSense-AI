"use client";

import React from "react";
import { 
  Sparkles, 
  Cpu, 
  Activity, 
  Plus, 
  Briefcase, 
  Layers,
  ChevronDown
} from "lucide-react";
import { Job, HealthStatus } from "../types";

interface HeaderProps {
  jobs: Job[];
  activeJob: Job | null;
  onSelectJob: (job: Job) => void;
  onOpenNewJob: () => void;
  healthStatus: HealthStatus | null;
  candidateCount: number;
}

export default function Header({
  jobs,
  activeJob,
  onSelectJob,
  onOpenNewJob,
  healthStatus,
  candidateCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="h-5 w-5" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900">
                Hire<span className="text-blue-600">Sense</span>
              </span>
              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 ring-1 ring-blue-500/20">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Intelligent AI Resume Screening & Candidate Ranking Platform
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* AI Engine Status Pill */}
          {healthStatus && (
            <div 
              title={healthStatus.message}
              className={`hidden md:flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs ${
                healthStatus.ollama_status === "connected"
                  ? "border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "border-sky-200 bg-sky-50/80 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-400"
              }`}
            >
              {healthStatus.ollama_status === "connected" ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                  <Cpu className="h-3.5 w-3.5" />
                  <span>Ollama LLM Engine</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
                  </span>
                  <Activity className="h-3.5 w-3.5" />
                  <span>High-Speed NLP Engine</span>
                </>
              )}
            </div>
          )}

          {/* Active Pipeline Dropdown */}
          {jobs.length > 0 && (
            <div className="relative flex items-center">
              <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
                <Briefcase className="h-3.5 w-3.5 text-indigo-500 shrink-0 hidden sm:block" />
                <span className="text-[11px] font-bold text-zinc-400 uppercase hidden lg:inline">
                  Pipeline:
                </span>
                <select
                  value={activeJob?.id || ""}
                  onChange={(e) => {
                    const found = jobs.find((j) => j.id === Number(e.target.value));
                    if (found) onSelectJob(found);
                  }}
                  className="bg-transparent font-semibold text-zinc-850 outline-none dark:text-zinc-150 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="dark:bg-zinc-900">
                      {job.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* New Pipeline Button */}
          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 sm:px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Pipeline</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

      </div>
    </header>
  );
}
