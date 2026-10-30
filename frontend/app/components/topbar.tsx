"use client";

import React, { useState, useRef, useEffect } from "react";
import Logo from "./logo";
import { 
  Search, 
  Bell, 
  Cpu, 
  Activity, 
  Briefcase, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Check, 
  Menu, 
  Sparkles,
  ExternalLink,
  Plus
} from "lucide-react";
import { Job, HealthStatus, AppNotification, AppNavigationTab } from "../types";

interface TopbarProps {
  jobs: Job[];
  activeJob: Job | null;
  onSelectJob: (job: Job) => void;
  onOpenNewJob: () => void;
  healthStatus: HealthStatus | null;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onMobileMenuToggle: () => void;
  onNavigate: (tab: AppNavigationTab) => void;
  onGoToLanding: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Topbar({
  jobs,
  activeJob,
  onSelectJob,
  onOpenNewJob,
  healthStatus,
  notifications,
  onMarkNotificationRead,
  onClearNotifications,
  onMobileMenuToggle,
  onNavigate,
  onGoToLanding,
  searchQuery,
  onSearchChange,
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-lg">
        {/* Mobile Hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates, skills, or job specs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-3.5 pl-9 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Right Controls: Engine Status, Pipeline Switcher, Notifications, User Menu */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* AI Engine Status Pill */}
        {healthStatus && (
          <div
            title={healthStatus.message}
            className={`hidden md:flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold shadow-2xs ${
              healthStatus.ollama_status === "connected"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {healthStatus.ollama_status === "connected" ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Cpu className="h-3.5 w-3.5" />
                <span>Ollama LLM</span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <Activity className="h-3.5 w-3.5" />
                <span>Local NLP Mode</span>
              </>
            )}
          </div>
        )}

        {/* Pipeline Dropdown */}
        {jobs.length > 0 ? (
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <select
                value={activeJob?.id || ""}
                onChange={(e) => {
                  const job = jobs.find((j) => j.id === Number(e.target.value));
                  if (job) onSelectJob(job);
                }}
                className="max-w-[170px] sm:max-w-[210px] truncate rounded-xl border border-slate-200 bg-white py-1.5 pr-7 pl-3 text-xs font-semibold text-slate-700 shadow-2xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onOpenNewJob}
              title="Add New Job Pipeline"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition shadow-2xs"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Pipeline</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 px-1">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[10px] font-semibold text-blue-600 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`rounded-xl p-2.5 text-xs transition cursor-pointer ${
                        n.read ? "bg-slate-50 text-slate-600" : "bg-blue-50/70 text-slate-900 border border-blue-100"
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 p-1.5 hover:bg-slate-50 transition"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-slate-900 to-blue-600 text-[11px] font-bold text-white shadow-2xs">
              HR
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-none">Alex Morgan</span>
              <span className="text-[10px] text-slate-400">Lead Recruiter</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Alex Morgan</p>
                <p className="text-[11px] text-slate-500">alex.morgan@company.com</p>
                <span className="mt-1.5 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  Talent Acquisition Team
                </span>
              </div>

              <div className="space-y-0.5 text-xs">
                <button
                  onClick={() => {
                    onNavigate("profile");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Profile</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate("settings");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-50 transition"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  <span>Platform Settings</span>
                </button>

                <button
                  onClick={() => {
                    onGoToLanding();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-50 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  <span>Landing Page Tour</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    onGoToLanding();
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-rose-600 hover:bg-rose-50 transition font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

