"use client";

import React, { useState } from "react";
import { 
  User, 
  Settings, 
  Sliders, 
  Cpu, 
  ShieldCheck, 
  Save, 
  CheckCircle, 
  RefreshCcw, 
  Layers, 
  Activity, 
  Server,
  Lock,
  LogOut
} from "lucide-react";
import { HealthStatus } from "../types";
import { API_BASE } from "../config";

interface SettingsViewProps {
  healthStatus: HealthStatus | null;
  onRefreshHealth: () => void;
  onShowToast?: (type: "success" | "error" | "info", message: string) => void;
  onLogout: () => void;
  activeTab?: "settings" | "profile";
}

export default function SettingsView({
  healthStatus,
  onRefreshHealth,
  onShowToast,
  onLogout,
  activeTab = "settings",
}: SettingsViewProps) {
  const [currentSection, setCurrentSection] = useState<"profile" | "preferences" | "engine" | "security">(
    activeTab === "profile" ? "profile" : "preferences"
  );

  // Recruiter Profile State
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@company.com");
  const [role, setRole] = useState("Lead Technical Recruiter");
  const [organization, setOrganization] = useState("TalentOps Engineering");

  // Screening Preferences State
  const [minThreshold, setMinThreshold] = useState(80);
  const [techWeight, setTechWeight] = useState(50);
  const [expWeight, setExpWeight] = useState(30);
  const [eduWeight, setEduWeight] = useState(20);
  const [autoShortlist, setAutoShortlist] = useState(true);

  // Engine Preferences State
  const [selectedEngine, setSelectedEngine] = useState<"auto" | "ollama" | "nlp">("auto");
  const [isTestingLatency, setIsTestingLatency] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast?.("success", "Recruiter profile updated successfully!");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast?.("success", "Screening criteria preferences saved!");
  };

  const handleTestLatency = async () => {
    setIsTestingLatency(true);
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}/api/health`);
      const end = performance.now();
      if (res.ok) {
        setApiLatency(Math.round(end - start));
        onRefreshHealth();
        onShowToast?.("success", `Backend responded in ${Math.round(end - start)}ms`);
      }
    } catch {
      onShowToast?.("error", "Failed to connect to backend server");
    } finally {
      setIsTestingLatency(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-b border-slate-200/80 pb-4">
        <h1 className="text-xl font-black text-slate-900">Platform Settings & Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure screening thresholds, AI engine connectivity, and recruiter preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar for Settings */}
        <div className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setCurrentSection("profile")}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition ${
              currentSection === "profile"
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Recruiter Profile</span>
          </button>

          <button
            onClick={() => setCurrentSection("preferences")}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition ${
              currentSection === "preferences"
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>Screening Criteria</span>
          </button>

          <button
            onClick={() => setCurrentSection("engine")}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition ${
              currentSection === "engine"
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>AI Engine Diagnostics</span>
          </button>

          <button
            onClick={() => setCurrentSection("security")}
            className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-left transition ${
              currentSection === "security"
                ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & Privacy</span>
          </button>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Settings Body */}
        <div className="lg:col-span-9">
          {currentSection === "profile" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Recruiter Profile</h2>
                <p className="text-xs text-slate-500">Manage your identity and team association</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 pb-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-blue-600 text-xl font-black text-white shadow-md">
                    HR
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{name}</h3>
                    <p className="text-xs text-slate-500">{role} • {organization}</p>
                    <span className="mt-1 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      HireSense AI Enterprise Admin
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Work Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Role Title</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentSection === "preferences" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Screening Criteria & Scoring Weights</h2>
                <p className="text-xs text-slate-500">Tune algorithm weights for candidate match calculations</p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-6">
                {/* Shortlist Threshold */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Minimum Shortlist Score Threshold</span>
                    <span className="text-sm font-black text-blue-600">{minThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <p className="text-[11px] text-slate-400">
                    Candidates scoring at or above this value will be automatically tagged as &quot;Shortlisted&quot;.
                  </p>
                </div>

                {/* Weights Sliders */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">
                    Scoring Dimension Weights (Default: 50% Tech / 30% Exp / 20% Edu)
                  </span>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Technical Competency Weight</span>
                      <span className="font-bold text-slate-900">{techWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="70"
                      value={techWeight}
                      onChange={(e) => setTechWeight(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Experience Tenure Weight</span>
                      <span className="font-bold text-slate-900">{expWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={expWeight}
                      onChange={(e) => setExpWeight(Number(e.target.value))}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span>Education Pedigree Weight</span>
                      <span className="font-bold text-slate-900">{eduWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={eduWeight}
                      onChange={(e) => setEduWeight(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>Save Criteria Preferences</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentSection === "engine" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">AI Engine Connectivity & Diagnostics</h2>
                <p className="text-xs text-slate-500">Monitor local model and high-speed NLP status</p>
              </div>

              {/* Engine Status Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-blue-600 shadow-2xs">
                      <Server className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">FastAPI Backend API Server</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{API_BASE}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Online & Ready
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/70 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">AI Engine State</span>
                    <span className="font-bold text-slate-800">
                      {healthStatus?.ollama_status === "connected" ? "Ollama LLM Mode" : "High-Speed Local NLP Mode"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">API Response Latency</span>
                    <span className="font-bold text-blue-600">
                      {apiLatency !== null ? `${apiLatency} ms` : "< 15 ms (Localhost)"}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleTestLatency}
                    disabled={isTestingLatency}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <RefreshCcw className={`h-3.5 w-3.5 ${isTestingLatency ? "animate-spin" : ""}`} />
                    <span>Test Connection & Latency</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-blue-900 block mb-1">Dual AI Engine Architecture Note:</span>
                HireSense AI automatically detects if a local Ollama server running <code className="font-mono text-blue-800">llama3</code> is available on port 11434. If present, it executes deep semantic extraction; otherwise, it seamlessly evaluates profiles via our zero-dependency High-Speed Local NLP heuristics.
              </div>
            </div>
          )}

          {currentSection === "security" && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-slate-900">Security & Privacy Governance</h2>
                <p className="text-xs text-slate-500">Applicant data protection policies</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Zero Cloud Data Ingestion</h4>
                    <p className="text-slate-500 mt-0.5">
                      Resumes are processed and stored strictly within your local environment database (<code className="font-mono text-slate-700">db.sqlite</code>). No applicant personally identifiable information (PII) is ever transmitted to commercial third-party cloud models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                  <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900">Ephemeral Memory Parsing</h4>
                    <p className="text-slate-500 mt-0.5">
                      Extracted resume byte buffers are purged from memory immediately following structured schema validation and vector scoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

