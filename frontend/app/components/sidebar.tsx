"use client";

import React from "react";
import Logo from "./logo";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Briefcase, 
  Users, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  UserCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Activity, 
  Home,
  ExternalLink
} from "lucide-react";
import { AppNavigationTab, Job, HealthStatus } from "../types";

interface SidebarProps {
  activeTab: AppNavigationTab;
  onTabChange: (tab: AppNavigationTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  jobs: Job[];
  activeJob: Job | null;
  onSelectJob: (job: Job) => void;
  healthStatus: HealthStatus | null;
  candidateCount: number;
  onGoToLanding: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggleCollapse,
  jobs,
  activeJob,
  onSelectJob,
  healthStatus,
  candidateCount,
  onGoToLanding,
}: SidebarProps) {
  const navItems = [
    { id: "overview" as AppNavigationTab, label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "upload" as AppNavigationTab, label: "Upload Resumes", icon: <UploadCloud className="h-4 w-4" /> },
    { id: "jobs" as AppNavigationTab, label: "Job Descriptions", icon: <Briefcase className="h-4 w-4" /> },
    { 
      id: "candidates" as AppNavigationTab, 
      label: "Candidates", 
      icon: <Users className="h-4 w-4" />,
      badge: candidateCount > 0 ? candidateCount : undefined
    },
    { id: "screening" as AppNavigationTab, label: "Screening Results", icon: <CheckSquare className="h-4 w-4" /> },
    { id: "analytics" as AppNavigationTab, label: "Analytics & Reports", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "settings" as AppNavigationTab, label: "Settings", icon: <Settings className="h-4 w-4" /> },
    { id: "profile" as AppNavigationTab, label: "Profile", icon: <UserCircle className="h-4 w-4" /> },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 z-30 select-none ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100">
        {!collapsed ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange("overview")}>
            <Logo size="sm" />
          </div>
        ) : (
          <div className="mx-auto cursor-pointer" onClick={() => onTabChange("overview")}>
            <Logo size="sm" variant="icon" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="mb-2 px-3">
          {!collapsed ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Menu
            </span>
          ) : (
            <div className="h-2" />
          )}
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-bold shadow-xs border border-blue-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              } ${collapsed ? "justify-center" : "justify-between"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {item.icon}
                </span>
                {!collapsed && <span>{item.label}</span>}
              </div>

              {!collapsed && item.badge !== undefined && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* View Landing Page link */}
        <div className="pt-4 border-t border-slate-100 mt-4">
          <button
            onClick={onGoToLanding}
            title={collapsed ? "Landing Page" : undefined}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Home className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
            {!collapsed && <span>Landing Page</span>}
          </button>
        </div>
      </div>

      {/* Active Pipeline Status Card (Bottom) */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Active Pipeline</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>

            <p className="mt-1 text-xs font-bold text-slate-900 truncate">
              {activeJob ? activeJob.title : "No pipeline selected"}
            </p>

            <p className="text-[10px] text-slate-500 mt-0.5">
              {candidateCount} candidate{candidateCount === 1 ? "" : "s"} screened
            </p>

            {/* AI Engine Status Pill */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 font-medium">Engine:</span>
              <span className="font-semibold text-blue-700 flex items-center gap-1">
                {healthStatus?.ollama_status === "connected" ? (
                  <>
                    <Cpu className="h-3 w-3 text-emerald-600" />
                    Ollama LLM
                  </>
                ) : (
                  <>
                    <Activity className="h-3 w-3 text-blue-600" />
                    Local NLP
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-100 flex justify-center">
          <div
            title={`Active Pipeline: ${activeJob?.title || "None"}`}
            className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
      )}
    </aside>
  );
}

