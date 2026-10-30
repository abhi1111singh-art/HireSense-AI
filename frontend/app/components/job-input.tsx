"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Plus, 
  Tag, 
  Layers, 
  Trash2,
  Calendar
} from "lucide-react";
import { API_BASE } from "../config";
import { Job } from "../types";

interface JobInputProps {
  onJobCreated: (job: Job) => void;
  activeJob: Job | null;
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onDeleteJob: (jobId: number, e: React.MouseEvent) => void;
  onShowToast?: (type: "success" | "error" | "info", message: string) => void;
}

const TEMPLATES = [
  {
    title: "Senior Full-Stack Engineer",
    description: "We are seeking a Senior Full-Stack Engineer to lead development of scalable microservices and client-facing web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust RESTful APIs, and lead technical architectures. Bachelor's or Master's degree in Computer Science preferred.",
  },
  {
    title: "AI / Data Scientist",
    description: "Seeking a Data Scientist to build and deploy predictive ML models and NLP pipelines. Required skills: Python, SQL, Machine Learning, Deep Learning, PyTorch, Scikit-Learn, and NLP. Experience with Large Language Models (LLMs) and data visualization tools is a big plus. 3+ years of experience required.",
  },
  {
    title: "Technical Product Manager",
    description: "We are hiring a Technical Product Manager to oversee SaaS platform growth and feature definition. Required skills: Agile, Scrum, Product Management, Jira, Roadmap planning, and system design concepts. You will collaborate with engineering teams to scope features and define product specifications. 4+ years of experience.",
  },
  {
    title: "DevOps & Cloud Architect",
    description: "Looking for an experienced DevOps and Infrastructure Architect. Required skills: AWS, Docker, Kubernetes, Terraform, CI/CD, GitHub Actions, Linux, and Bash scripting. Candidates should have 4+ years optimizing cloud infrastructure, telemetry, and automated deployment pipelines.",
  },
];

export default function JobInput({
  onJobCreated,
  activeJob,
  jobs,
  onSelectJob,
  onDeleteJob,
  onShowToast,
}: JobInputProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setMessage(`Applied "${template.title}" template.`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create job specification.");
      }

      const job: Job = await response.json();
      onJobCreated(job);
      setTitle("");
      setDescription("");
      setMessage("Screening pipeline created successfully!");
      onShowToast?.("success", `Created pipeline for "${job.title}"!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error: any) {
      alert(error.message || "An error occurred.");
      onShowToast?.("error", error.message || "Failed to create pipeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Form: Create Specification */}
      <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Job Specification Manager</h2>
              <p className="text-xs text-slate-500">Define criteria to benchmark candidate profiles</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
            AI Keyword Extraction
          </span>
        </div>

        {/* 1-Click Industry Templates */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            1-Click Industry Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
              >
                <Sparkles className="h-3 w-3 text-blue-600" />
                <span>{tmpl.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Job Position Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Senior Full-Stack Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Role Description & Required Skills <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="Specify responsibilities, required languages, frameworks, target years of experience, and degrees..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 disabled:bg-slate-300 transition"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Save & Configure Screening Pipeline</span>
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}
      </div>

      {/* Right Column: Existing Pipelines List & Active Details */}
      <div className="lg:col-span-5 space-y-6">
        {/* Active Pipeline Card */}
        {activeJob ? (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                Active Selected Pipeline
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                Ready for Screening
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900">{activeJob.title}</h3>
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {activeJob.description}
            </p>

            {/* Extracted Requirements Tags */}
            {activeJob.requirements && activeJob.requirements.length > 0 && (
              <div className="pt-2 border-t border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Extracted Benchmarks:
                </span>
                <div className="flex flex-wrap gap-1">
                  {activeJob.requirements.map((req, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-200/80 shadow-2xs"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
            <Briefcase className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-700">No Pipeline Selected</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Select one from the list below or create a new job profile.
            </p>
          </div>
        )}

        {/* Existing Pipelines List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              <span>Screening Pipelines ({jobs.length})</span>
            </h3>
          </div>

          {jobs.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No pipelines created yet. Apply an industry preset on the left to start!
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={`group flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition ${
                    activeJob?.id === job.id
                      ? "border-blue-500 bg-blue-50/40 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p
                      className={`text-xs font-bold truncate ${
                        activeJob?.id === job.id ? "text-blue-700" : "text-slate-800"
                      }`}
                    >
                      {job.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => onDeleteJob(job.id, e)}
                    className="opacity-0 group-hover:opacity-100 transition rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete pipeline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
