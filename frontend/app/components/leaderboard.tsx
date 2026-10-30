"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Layers, 
  Scale, 
  Download, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  Award, 
  Clock, 
  Briefcase,
  ChevronRight
} from "lucide-react";
import { Candidate, ViewMode } from "../types";

interface LeaderboardProps {
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onCompareCandidates: (selectedIds: number[]) => void;
  activeJobTitle?: string;
  onNavigateUpload?: () => void;
}

export default function Leaderboard({
  candidates,
  onSelectCandidate,
  onCompareCandidates,
  activeJobTitle,
  onNavigateUpload,
}: LeaderboardProps) {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "experience" | "name">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Toggle selection for comparison
  const handleSelectCompare = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can compare a maximum of 3 candidates simultaneously.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleSortToggle = (field: "score" | "experience" | "name") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "name" ? "asc" : "desc");
    }
  };

  // Get unique skills
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => (c.skills || []).forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered and Sorted list
  const processedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

        const matchesSkill =
          !skillFilter ||
          (c.skills || []).some((s) => s.toLowerCase() === skillFilter.toLowerCase());

        const candidateStatus =
          c.score >= 80 ? "Shortlisted" : c.score >= 50 ? "Under Review" : "Low Match";

        const matchesStatus = !statusFilter || candidateStatus === statusFilter;

        return matchesSearch && matchesSkill && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        const valA = sortBy === "score" ? a.score : a.experience?.years || 0;
        const valB = sortBy === "score" ? b.score : b.experience?.years || 0;
        return sortOrder === "desc" ? valB - valA : valA - valB;
      });
  }, [candidates, search, skillFilter, statusFilter, sortBy, sortOrder]);

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Shortlisted",
      };
    if (score >= 50)
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Under Review",
      };
    return {
      badge: "bg-slate-100 text-slate-600 border-slate-200",
      label: "Low Match",
    };
  };

  const handleExportCSV = () => {
    if (processedCandidates.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Score", "Technical", "Experience Years", "Education", "Skills"];
    const rows = processedCandidates.map((c) => [
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
    link.setAttribute("download", `HireSense_Rankings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
      {/* Top Controls Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Candidate Leaderboard ({processedCandidates.length})
            </h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              AI Prioritized
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeJobTitle ? `Ranked for ${activeJobTitle}` : "Screening Results"}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {selectedIds.length >= 2 && (
            <button
              onClick={() => onCompareCandidates(selectedIds)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition"
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Compare Selected ({selectedIds.length})</span>
            </button>
          )}

          {processedCandidates.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Export filtered candidates to CSV"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "table" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`p-1.5 rounded-lg transition ${
                viewMode === "cards" ? "bg-white text-blue-600 shadow-2xs" : "text-slate-400 hover:text-slate-700"
              }`}
              title="Cards grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-3.5 pl-9 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Skill Filter */}
        <div className="sm:col-span-4 relative">
          <SlidersHorizontal className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2 pr-8 pl-9 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="">All Skills ({allSkills.length})</option>
            {allSkills.map((skill, idx) => (
              <option key={idx} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Shortlisted">Shortlisted (≥ 80%)</option>
            <option value="Under Review">Under Review (50-79%)</option>
            <option value="Low Match">Low Match (&lt; 50%)</option>
          </select>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {processedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-2xl text-center">
          <Layers className="h-10 w-10 text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-700">No matching candidates found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {candidates.length === 0
              ? "Upload resumes in the Upload section to screen applicant profiles."
              : "Try adjusting your search criteria or clearing active filters."}
          </p>
          {candidates.length === 0 && onNavigateUpload && (
            <button
              onClick={onNavigateUpload}
              className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition"
            >
              Upload Resumes Now
            </button>
          )}
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-2 w-8 text-center" title="Select to compare">
                  Compare
                </th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSortToggle("name")}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Candidate Profile
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSortToggle("score")}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Match Score
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3">
                  <button
                    onClick={() => handleSortToggle("experience")}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Experience
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="py-3 px-3">Top Extracted Skills</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-2 text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedCandidates.map((cand) => {
                const { badge, label } = getScoreBadge(cand.score);
                const isSelected = selectedIds.includes(cand.id);

                return (
                  <tr
                    key={cand.id}
                    className={`group transition hover:bg-slate-50/70 ${
                      isSelected ? "bg-blue-50/30" : ""
                    }`}
                  >
                    {/* Compare Checkbox */}
                    <td className="py-3.5 px-2 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectCompare(cand.id)}
                        className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    {/* Candidate Name & Contact */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                          {cand.name}
                        </span>
                        <div className="mt-0.5 flex items-center gap-2.5 text-[11px] text-slate-400">
                          {cand.email && (
                            <span className="flex items-center gap-1 truncate max-w-[160px]">
                              <Mail className="h-3 w-3" />
                              {cand.email}
                            </span>
                          )}
                          {cand.phone && (
                            <span className="hidden md:flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {cand.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Score Indicator */}
                    <td className="py-3.5 px-3">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-sm font-black text-blue-600">{cand.score}%</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Fit</span>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">
                          {cand.experience?.years || 0} Years
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                          {(cand.experience?.roles || []).slice(0, 2).join(", ") || "No role listed"}
                        </span>
                      </div>
                    </td>

                    {/* Skills */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(cand.skills || []).slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            onClick={() => setSkillFilter(skillFilter === skill ? "" : skill)}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 cursor-pointer hover:bg-slate-200 transition"
                          >
                            {skill}
                          </span>
                        ))}
                        {(cand.skills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 pt-0.5 font-medium">
                            +{cand.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${badge}`}>
                        {label}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-2 text-right">
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* CARDS GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedCandidates.map((cand) => {
            const { badge, label } = getScoreBadge(cand.score);
            const isSelected = selectedIds.includes(cand.id);

            return (
              <div
                key={cand.id}
                className={`group rounded-2xl border p-5 shadow-xs transition hover:shadow-md ${
                  isSelected ? "border-blue-500 bg-blue-50/20" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectCompare(cand.id)}
                      className="h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {cand.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate max-w-[160px]">
                        {cand.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge}`}>
                    {label}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-y border-slate-100 py-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Match</span>
                    <span className="text-lg font-black text-blue-600">{cand.score}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Experience</span>
                    <span className="font-bold text-slate-800">{cand.experience?.years || 0} Yrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Technical</span>
                    <span className="font-bold text-slate-800">{cand.technical_score}%</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {(cand.skills || []).slice(0, 4).map((s, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => onSelectCandidate(cand)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>View Full Dossier</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
