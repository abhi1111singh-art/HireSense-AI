"use client";

import React, { useState } from "react";
import Logo from "./logo";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Layers, 
  FileText, 
  Users, 
  Cpu, 
  TrendingUp, 
  Clock, 
  Target, 
  Check, 
  ChevronRight,
  Search,
  Scale
} from "lucide-react";

interface LandingPageProps {
  onEnterApp: (initialTab?: string) => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);

  const features = [
    {
      title: "Semantic Resume Parsing",
      icon: <FileText className="h-5 w-5 text-blue-600" />,
      tag: "Dual AI Engine",
      description: "Extract verified technical skills, career progression, and credentials from PDF, DOCX, and TXT resumes with zero manual entry.",
    },
    {
      title: "Multidimensional Alignment Scoring",
      icon: <Target className="h-5 w-5 text-indigo-600" />,
      tag: "Precision Matrix",
      description: "Weights candidate profiles across technical expertise, verified experience tenure, and education pedigree for accurate fit.",
    },
    {
      title: "Candidate Comparison Grid",
      icon: <Scale className="h-5 w-5 text-emerald-600" />,
      tag: "Head-to-Head",
      description: "Select up to 3 candidates and compare technical proficiencies, role histories, and score breakdowns side-by-side in real time.",
    },
    {
      title: "Real-time ATS Analytics",
      icon: <BarChart3 className="h-5 w-5 text-violet-600" />,
      tag: "Talent Intelligence",
      description: "Track candidate score distributions, screening funnel conversion rates, and skill supply vs demand across your job pipeline.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Define Job Specification",
      description: "Input custom job requirements or choose from industry presets for Full-Stack, AI Engineering, or Product Management.",
    },
    {
      num: "02",
      title: "Ingest Resumes in Batch",
      description: "Drag and drop candidate resumes in PDF, DOCX, DOC, or TXT formats with instantaneous extraction and parsing.",
    },
    {
      num: "03",
      title: "AI Analysis & Scoring",
      description: "Dual-engine AI scores technical capabilities, experience duration, and educational background against job criteria.",
    },
    {
      num: "04",
      title: "Prioritize & Hire Top Talent",
      description: "Review ranked leaderboards, inspect candidate dossiers, and export executive hiring reports in 1-click.",
    },
  ];

  const stats = [
    { value: "85%", label: "Screening Time Saved", desc: "Automate manual resume reading" },
    { value: "3.4x", label: "Qualified Candidate Pipeline", desc: "Precision keyword & semantic match" },
    { value: "0 ms", label: "Cloud Data Exposure", desc: "100% private local AI processing" },
    { value: "98.2%", label: "Recruiter Satisfaction", desc: "Based on benchmark hiring trials" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#showcase" className="hover:text-blue-600 transition">Product Preview</a>
            <a href="#benefits" className="hover:text-blue-600 transition">Enterprise Benefits</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onEnterApp("overview")}
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterApp("overview")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Soft Ambient Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs mb-6">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Next-Gen Recruitment Intelligence</span>
              <span className="h-1 w-1 rounded-full bg-blue-500" />
              <span className="text-blue-900 font-bold">HireSense AI 2.0</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.12]">
              Hire Smarter. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 bg-clip-text text-transparent">
                Discover Better Talent.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600">
              AI-powered resume screening that helps you identify top candidates, evaluate skills, and accelerate your hiring process.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => onEnterApp("overview")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("showcase");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 transition"
              >
                <span>Explore Platform</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Quick Micro-Features */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Local LLM & NLP Engine
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Zero Cloud Dependency
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> PDF, DOCX, TXT Support
              </span>
            </div>
          </div>

          {/* Hero Visual: Interactive Dashboard Snapshot */}
          <div id="showcase" className="mt-14 relative mx-auto max-w-5xl">
            {/* Ambient Shadow glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-slate-500/20 blur-xl opacity-75" />

            <div className="relative rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-xs font-bold text-slate-400 tracking-wider">
                    HIRESENSE AI DASHBOARD PREVIEW
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    Dual AI Engine Online
                  </span>
                  <button
                    onClick={() => onEnterApp("overview")}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 transition"
                  >
                    Open Live App →
                  </button>
                </div>
              </div>

              {/* Mock Dashboard Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric Card 1 */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                    <span>Screened Resumes</span>
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-slate-900">48 Profiles</div>
                  <p className="mt-1 text-[11px] text-emerald-600 font-medium">↑ 100% automated parsing</p>
                </div>

                {/* Metric Card 2 */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                    <span>Top Match Alignment</span>
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-blue-600">94.5% Score</div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">Senior Backend Lead</p>
                </div>

                {/* Metric Card 3 */}
                <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
                    <span>Shortlisted Pool</span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="mt-2 text-2xl font-black text-emerald-600">12 Candidates</div>
                  <p className="mt-1 text-[11px] text-slate-500 font-medium">≥ 80% Match Threshold</p>
                </div>
              </div>

              {/* Mock Candidate Leaderboard Table */}
              <div className="mt-4 rounded-xl border border-slate-100 bg-white overflow-hidden shadow-xs">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Top Ranked Candidates (Real-time Evaluation)
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Updated just now</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        JD
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">John Doe</p>
                        <p className="text-[11px] text-slate-500">6.5 Years Exp • Python, FastAPI, Docker, PostgreSQL</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        94% Match
                      </span>
                      <button
                        onClick={() => onEnterApp("candidates")}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        AR
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Alex Rivera</p>
                        <p className="text-[11px] text-slate-500">3.5 Years Exp • Python, PyTorch, SQL, NLP, Transformers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                        88% Match
                      </span>
                      <button
                        onClick={() => onEnterApp("candidates")}
                        className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition"
                      >
                        Inspect Dossier
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating UI Badges */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Instant Heuristic Scoring</p>
                  <p className="text-[10px] text-slate-500">Calculated in &lt; 250 milliseconds</p>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-5 -right-5 items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Local Privacy First</p>
                  <p className="text-[10px] text-slate-500">Zero candidate data shared externally</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Platform Introduction / Trusted Hiring Workflow */}
      <section className="border-t border-slate-100 bg-slate-50/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Enterprise Talent Screening Engine
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              A high-precision ATS layer designed for modern engineering & talent teams
            </p>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Standard keyword filters miss high-potential talent. HireSense AI evaluates technical proficiency, role tenure depth, and verified career progression simultaneously.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs text-center">
                <div className="text-3xl font-black text-blue-600">{stat.value}</div>
                <div className="mt-1 text-xs font-bold text-slate-900">{stat.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Key Features with Modern Icon Cards */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-200">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered for velocity, accuracy, and recruiter joy
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Everything you need to screen hundreds of candidates and build high-performing teams without fatigue.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-blue-50 transition">
                      {feat.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {feat.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:gap-1.5 transition-all">
                  <span>Explore feature</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works – 4 Simple Steps */}
      <section id="how-it-works" className="border-t border-slate-100 bg-slate-50/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Frictionless Hiring Workflow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              From job post to prioritized shortlist in 4 steps
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              No complex setup or training required. Start screening resumes within 60 seconds.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="text-3xl font-black text-blue-600/30 mb-3">{step.num}</div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onEnterApp("upload")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-slate-800 transition"
            >
              <span>Try Screening Workflow Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Section 4 & 5: AI-Powered Resume Analysis Showcase & Candidate Scoring Preview */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5 space-y-6">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 border border-blue-200">
                AI Deep Synthesis
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
                Structured Candidate Dossiers with AI Verdicts
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Never guess how a candidate’s skills map to your requirements. HireSense AI evaluates core frameworks, tenure history, and educational background to produce a transparent alignment summary.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Verified Technical Inventory</p>
                    <p className="text-xs text-slate-500">Highlights matched skills and surfaces missing requirements instantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Career Progression Timeline</p>
                    <p className="text-xs text-slate-500">Reconstructs chronological job positions and company experience.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Side-by-Side Candidate Matrix</p>
                    <p className="text-xs text-slate-500">Head-to-head comparison to make final interview decisions confident.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onEnterApp("screening")}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <span>Launch Screening Demo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Interactive Candidate Card Card */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      Sample Candidate Dossier
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">John Doe</h3>
                    <p className="text-xs text-slate-500">john.doe@email.com • San Francisco, CA</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                      94.0% Overall Fit
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Status: Shortlisted</p>
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Technical</span>
                    <p className="text-base font-extrabold text-blue-600 mt-0.5">95%</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Experience</span>
                    <p className="text-base font-extrabold text-indigo-600 mt-0.5">92%</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Education</span>
                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">90%</p>
                  </div>
                </div>

                {/* AI Summary Quote */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    AI Synthesis Verdict
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Strong candidate with 6.5+ years of demonstrable Python, FastAPI, and Docker experience. Proven background architecting scalable backend APIs at TechCorp. Highly recommended for Senior role.
                  </p>
                </div>

                {/* Skills Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "AWS", "CI/CD", "Redis", "REST APIs"].map((s, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200/50"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Benefits & Productivity Section */}
      <section id="benefits" className="border-t border-slate-100 bg-slate-50/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Why Recruiters Choose HireSense AI
            </span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for speed, fairness, and precision
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">85% Faster Shortlisting</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Replace hours of manual resume scanning with an instant, multi-dimensional ranking algorithm that highlights the strongest matches immediately.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Objective & Consistent Evaluation</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Every applicant is measured against the same standardized job criteria, reducing human bias and ensuring top performers aren’t overlooked.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Local Privacy & Compliance</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Run locally with Ollama or local high-velocity NLP heuristics. Candidate personal data stays safely within your controlled infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Modern CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-8 py-16 text-center text-white shadow-2xl sm:px-16">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/30">
                Get Started with HireSense AI Today
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight">
                Transform Your Hiring Workflow Now
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Join forward-thinking hiring managers and technical recruiters who screen smarter, discover better talent, and save hours every single week.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => onEnterApp("overview")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 active:scale-95 transition"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEnterApp("upload")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  <span>Upload Sample Resumes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Professional Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Logo size="sm" />
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-500">
              © {new Date().getFullYear()} HireSense AI. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 font-medium text-slate-600">
            <button onClick={() => onEnterApp("overview")} className="hover:text-blue-600 transition">
              Overview
            </button>
            <button onClick={() => onEnterApp("screening")} className="hover:text-blue-600 transition">
              Screening
            </button>
            <button onClick={() => onEnterApp("analytics")} className="hover:text-blue-600 transition">
              Analytics
            </button>
            <button onClick={() => onEnterApp("settings")} className="hover:text-blue-600 transition">
              Settings
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

