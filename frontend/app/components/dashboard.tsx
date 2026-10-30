"use client";

import React, { useState, useEffect } from "react";
import { API_BASE } from "../config";
import { Job, Candidate, HealthStatus, AppNavigationTab, AppNotification } from "../types";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import DashboardOverview from "./dashboard-overview";
import UploadZone from "./upload-zone";
import JobInput from "./job-input";
import Leaderboard from "./leaderboard";
import CandidateDetail from "./candidate-detail";
import ComparisonMatrix from "./comparison-matrix";
import AnalyticsView from "./analytics-view";
import SettingsView from "./settings-view";
import LandingPage from "./landing-page";
import ToastContainer, { ToastMessage } from "./toast";

export default function Dashboard() {
  const [viewMode, setViewMode] = useState<"landing" | "app">("app");
  const [activeNavTab, setActiveNavTab] = useState<AppNavigationTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core Data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [comparingIds, setComparingIds] = useState<number[] | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);

  // App UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "n-1",
      title: "HireSense AI Engine Ready",
      message: "Dual LLM and NLP screening pipelines initialized.",
      time: "Just now",
      read: false,
      type: "info",
    },
  ]);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 1. Fetch initial jobs & check health
  useEffect(() => {
    fetchJobsAndInit();
    checkHealth();
  }, []);

  // 2. Fetch candidates when active job changes
  useEffect(() => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    } else {
      setCandidates([]);
    }
  }, [activeJob]);

  const checkHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/health`);
      if (response.ok) {
        const data = await response.json();
        setHealthStatus(data);
      }
    } catch {
      // Backend not yet ready or offline fallback
      setHealthStatus({
        status: "healthy",
        ollama_status: "fallback_mode",
        message: "HireSense AI active in High-Speed Local NLP Mode.",
      });
    }
  };

  const fetchJobsAndInit = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
        if (data.length > 0) {
          setActiveJob(data[0]);
        } else {
          // If no job exists in DB, create a default preset so the product is instantly ready
          await createInitialPresetJob();
        }
      }
    } catch (err) {
      console.warn("Could not fetch jobs from API", err);
    }
  };

  const createInitialPresetJob = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Senior Full-Stack Engineer",
          description:
            "We are seeking a Senior Full-Stack Engineer to build scalable web applications. Required skills: Python, React, Next.js, FastAPI, Docker, and PostgreSQL. Candidates must have 5+ years of experience, design robust microservices, and lead technical architectures. Bachelor's or Master's degree in CS preferred.",
        }),
      });
      if (res.ok) {
        const defaultJob = await res.json();
        setJobs([defaultJob]);
        setActiveJob(defaultJob);
      }
    } catch (e) {
      console.error("Failed to seed initial preset pipeline", e);
    }
  };

  const fetchCandidates = async (jobId: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}/candidates`);
      if (response.ok) {
        const data = await response.json();
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    setActiveJob(newJob);
    setActiveNavTab("upload"); // Prompt user to upload resumes next
    addToast("success", `Pipeline "${newJob.title}" established!`);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: "New Job Pipeline Created",
        message: `Pipeline "${newJob.title}" is ready for resume screening.`,
        time: "Just now",
        read: false,
        type: "success",
      },
      ...prev,
    ]);
  };

  const handleDeleteJob = async (jobId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this screening pipeline? All associated candidate data will be removed."))
      return;

    try {
      const response = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const remaining = jobs.filter((j) => j.id !== jobId);
        setJobs(remaining);
        if (activeJob?.id === jobId) {
          setActiveJob(remaining.length > 0 ? remaining[0] : null);
        }
        addToast("info", "Screening pipeline removed.");
      }
    } catch {
      alert("Failed to delete pipeline.");
    }
  };

  const handleCandidatesProcessed = (newCandidates: Candidate[]) => {
    if (activeJob) {
      fetchCandidates(activeJob.id);
    }
    setActiveNavTab("candidates"); // Take user to leaderboard to see rankings
    addToast("success", `AI successfully evaluated ${newCandidates.length} candidate profiles!`);
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: "Resumes Evaluated",
        message: `${newCandidates.length} candidates were scored and ranked.`,
        time: "Just now",
        read: false,
        type: "success",
      },
      ...prev,
    ]);
  };

  // 1-Click Load Sample Resumes from Dashboard Overview
  const handleLoadDemoResumes = async () => {
    if (!activeJob) return;
    setIsDemoLoading(true);

    const sampleResumes = [
      {
        name: "John_Doe_Senior_Backend.txt",
        content: `John Doe\njohn.doe@email.com | +1 (555) 123-4567 | San Francisco, CA\n\nSUMMARY:\nHighly experienced Backend Engineer specializing in Python, FastAPI, and scalable system design. Leading development teams and building microservices in Docker/Kubernetes.\n\nEXPERIENCE:\nSenior Backend Engineer | TechCorp Inc. (2021 - Present)\n- Built transaction API with Python, FastAPI, and PostgreSQL.\n- Docker and Kubernetes deployment on AWS.\n\nSKILLS:\n- Python, FastAPI, Docker, Kubernetes, PostgreSQL, AWS\n\nEDUCATION:\nMaster of Science in Computer Science, Stanford University (2018)`,
      },
      {
        name: "Alex_Rivera_Data_Scientist.txt",
        content: `Alex Rivera\nalex.rivera@datasci.org | +1 (333) 888-9999 | Austin, TX\n\nSUMMARY:\nData Scientist with 3+ years experience designing ML models and NLP pipelines.\n\nEXPERIENCE:\nData Scientist | Insights AI (2022 - Present)\n- Built NLP parsing pipelines with Python, Hugging Face transformers, PyTorch, and SQL.\n\nSKILLS:\n- Python, SQL, PyTorch, Scikit-Learn, Pandas, NLP\n\nEDUCATION:\nBachelor of Science in Data Science, UT Austin (2021)`,
      },
      {
        name: "Jane_Smith_Junior_Frontend.txt",
        content: `Jane Smith\njane.smith@webdev.com | +1 (444) 555-6666 | Chicago, IL\n\nSUMMARY:\nMotivated Junior Front-End Developer building responsive web interfaces in JavaScript and Tailwind CSS.\n\nEXPERIENCE:\nJunior Web Developer | WebSolutions (2024 - Present)\n- Created landing pages in HTML5, CSS3, JavaScript, Tailwind CSS.\n\nSKILLS:\n- JavaScript, HTML, CSS, Tailwind CSS, Git\n\nEDUCATION:\nAssociate Degree in Web Design, Chicago Community College (2023)`,
      },
    ];

    try {
      const formData = new FormData();
      sampleResumes.forEach((s) => {
        const blob = new Blob([s.content], { type: "text/plain" });
        const file = new (window as any).File([blob], s.name, { type: "text/plain" });
        formData.append("files", file);
      });

      const response = await fetch(`${API_BASE}/api/jobs/${activeJob.id}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const results = await response.json();
        handleCandidatesProcessed(results);
      }
    } catch (e) {
      console.error(e);
      addToast("error", "Failed to load demo resumes.");
    } finally {
      setIsDemoLoading(false);
    }
  };

  // If in landing mode, render landing page
  if (viewMode === "landing") {
    return (
      <LandingPage
        onEnterApp={(targetTab) => {
          setViewMode("app");
          if (targetTab) setActiveNavTab(targetTab as AppNavigationTab);
        }}
      />
    );
  }

  // Filter candidates if search query active
  const filteredCandidates = searchQuery.trim()
    ? candidates.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.skills || []).some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : candidates;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Desktop & Mobile Sidebar */}
      <div className={`hidden lg:flex h-full shrink-0`}>
        <Sidebar
          activeTab={activeNavTab}
          onTabChange={setActiveNavTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          jobs={jobs}
          activeJob={activeJob}
          onSelectJob={setActiveJob}
          healthStatus={healthStatus}
          candidateCount={candidates.length}
          onGoToLanding={() => setViewMode("landing")}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-white shadow-2xl">
            <Sidebar
              activeTab={activeNavTab}
              onTabChange={(tab) => {
                setActiveNavTab(tab);
                setMobileMenuOpen(false);
              }}
              collapsed={false}
              onToggleCollapse={() => setMobileMenuOpen(false)}
              jobs={jobs}
              activeJob={activeJob}
              onSelectJob={(job) => {
                setActiveJob(job);
                setMobileMenuOpen(false);
              }}
              healthStatus={healthStatus}
              candidateCount={candidates.length}
              onGoToLanding={() => {
                setViewMode("landing");
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main App Workspace Area */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          jobs={jobs}
          activeJob={activeJob}
          onSelectJob={setActiveJob}
          onOpenNewJob={() => setActiveNavTab("jobs")}
          healthStatus={healthStatus}
          notifications={notifications}
          onMarkNotificationRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            )
          }
          onClearNotifications={() => setNotifications([])}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          onNavigate={setActiveNavTab}
          onGoToLanding={() => setViewMode("landing")}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {/* View 1: Overview Dashboard */}
            {activeNavTab === "overview" && (
              <DashboardOverview
                candidates={filteredCandidates}
                activeJob={activeJob}
                onNavigate={setActiveNavTab}
                onSelectCandidate={setActiveCandidate}
                onLoadDemoResumes={handleLoadDemoResumes}
                isDemoLoading={isDemoLoading}
              />
            )}

            {/* View 2: Upload Resumes */}
            {activeNavTab === "upload" && (
              <div className="space-y-6">
                <UploadZone
                  activeJobId={activeJob ? activeJob.id : null}
                  activeJobTitle={activeJob?.title}
                  onCandidatesProcessed={handleCandidatesProcessed}
                  onShowToast={addToast}
                />
              </div>
            )}

            {/* View 3: Job Descriptions */}
            {activeNavTab === "jobs" && (
              <JobInput
                onJobCreated={handleJobCreated}
                activeJob={activeJob}
                jobs={jobs}
                onSelectJob={setActiveJob}
                onDeleteJob={handleDeleteJob}
                onShowToast={addToast}
              />
            )}

            {/* View 4 & 5: Candidates & Screening Results */}
            {(activeNavTab === "candidates" || activeNavTab === "screening") && (
              <Leaderboard
                candidates={filteredCandidates}
                onSelectCandidate={setActiveCandidate}
                onCompareCandidates={setComparingIds}
                activeJobTitle={activeJob?.title}
                onNavigateUpload={() => setActiveNavTab("upload")}
              />
            )}

            {/* View 6: Analytics & Reports */}
            {activeNavTab === "analytics" && (
              <AnalyticsView
                candidates={candidates}
                activeJob={activeJob}
                jobs={jobs}
              />
            )}

            {/* View 7 & 8: Settings and Profile */}
            {(activeNavTab === "settings" || activeNavTab === "profile") && (
              <SettingsView
                healthStatus={healthStatus}
                onRefreshHealth={checkHealth}
                onShowToast={addToast}
                onLogout={() => setViewMode("landing")}
                activeTab={activeNavTab === "profile" ? "profile" : "settings"}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Candidate Dossier Report Drawer */}
      <CandidateDetail
        candidate={activeCandidate}
        onClose={() => setActiveCandidate(null)}
      />

      {/* Floating Side-by-Side Comparison Matrix Modal */}
      {comparingIds && activeJob && (
        <ComparisonMatrix
          jobId={activeJob.id}
          candidateIds={comparingIds}
          onClose={() => setComparingIds(null)}
        />
      )}
    </div>
  );
}
