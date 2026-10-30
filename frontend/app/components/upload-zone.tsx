"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  File, 
  AlertCircle, 
  CheckCircle, 
  RefreshCcw, 
  X, 
  Sparkles, 
  CheckCircle2, 
  FileType,
  FileText
} from "lucide-react";
import { API_BASE } from "../config";

interface UploadZoneProps {
  activeJobId: number | null;
  activeJobTitle?: string;
  onCandidatesProcessed: (candidates: any[]) => void;
  onShowToast?: (type: "success" | "error" | "info", message: string) => void;
}

interface StagedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "staged" | "uploading" | "success" | "error";
  progress: number;
  errorMessage?: string;
}

// Sample resumes embedded for instant 1-click testing
const SAMPLE_RESUMES = [
  {
    name: "John_Doe_Senior_Backend.txt",
    content: `John Doe
john.doe@email.com | +1 (555) 123-4567 | San Francisco, CA | github.com/johndoe

SUMMARY:
Highly experienced Backend Engineer specializing in Python, FastAPI, and scalable system design. Proven track record of leading development teams, designing microservices architectures, and setting up automated CI/CD pipelines in AWS cloud environments. 

EXPERIENCE:
Senior Backend Engineer | TechCorp Inc. (2021 - Present)
- Designed and built a high-throughput transaction API using Python, FastAPI, and PostgreSQL, increasing system capacity by 150%.
- Containerized development and production staging environments using Docker, orchestrating container deployments using Kubernetes.
- Spearheaded CI/CD automation using GitHub Actions, reducing deployment time from 40 minutes to 6 minutes.
- Mentored 4 junior developers and reviewed architectures for robust security.

Software Engineer | Startup LLC (2018 - 2021)
- Developed REST APIs and microservices using Python and Flask.
- Integrated payment gateways (Stripe) and third-party SaaS services.
- Managed database migrations and optimization scripts for MySQL database.
- Collaborated on client web interfaces using React and JavaScript.

SKILLS:
- Languages: Python, JavaScript, SQL, Bash
- Frameworks/APIs: FastAPI, Django, Flask, React, REST APIs
- DevOps/Cloud: Docker, Kubernetes, AWS, Git, CI/CD, GitHub Actions
- Databases: PostgreSQL, MySQL, Redis

EDUCATION:
Master of Science in Computer Science
Stanford University (Graduated 2018)`,
  },
  {
    name: "Alex_Rivera_Data_Scientist.txt",
    content: `Alex Rivera
alex.rivera@datasci.org | +1 (333) 888-9999 | Austin, TX

SUMMARY:
Data Scientist and Machine Learning Engineer with 3+ years of experience designing, training, and deploying statistical models. Technical expertise in Python, SQL, NLP, and machine learning pipelines using PyTorch and Scikit-Learn.

EXPERIENCE:
Data Scientist | Insights AI (2022 - Present)
- Built NLP parsing pipelines using Python and Hugging Face transformers to classify text, improving automated ticket routing accuracy by 30%.
- Trained regression and classification models using Scikit-Learn and Pandas to predict client churn.
- Wrote highly optimized SQL queries to aggregate and analyze product usage data across 2M+ active accounts.
- Maintained production ML microservices running inside Docker containers on AWS.

Junior Machine Learning Engineer | DataLabs (2021 - 2022)
- Cleaned and prepared large datasets for neural network training using Pandas and NumPy.
- Assisted in training Deep Learning models using PyTorch for computer vision tasks.
- Created interactive dashboards to visualize key performance metrics using Tableau and Power BI.

SKILLS:
- Languages: Python, SQL, R
- ML Libraries: PyTorch, Tensorflow, Scikit-Learn, Pandas, NumPy, NLP, Transformers
- DevOps/Cloud: AWS, Docker, Git, Linux
- Data Tools: Tableau, Power BI, SQL Server, MongoDB

EDUCATION:
Bachelor of Science in Data Science
University of Texas at Austin (Graduated 2021)`,
  },
  {
    name: "Jane_Smith_Junior_Frontend.txt",
    content: `Jane Smith
jane.smith@webdev.com | +1 (444) 555-6666 | Chicago, IL | janesmith.dev

SUMMARY:
Motivated Junior Front-End Developer with a passion for building clean, user-friendly, and responsive web interfaces. Eager to contribute frontend skills in JavaScript, HTML, CSS, and Tailwind CSS. 

EXPERIENCE:
Junior Web Developer | WebSolutions Agency (2024 - Present)
- Crafted interactive landing pages and website layouts using HTML5, CSS3, and JavaScript.
- Standardized utility styling using Tailwind CSS, ensuring responsive design across mobile, tablet, and desktop views.
- Conducted cross-browser rendering bug fixes and improved site accessibility standards.
- Integrated jQuery widgets and simple REST APIs for contact forms.

Front-End Intern | Creative Digital (2023 - 2024)
- Assisted in building website templates using HTML, CSS, Bootstrap, and jQuery.
- Collaborated with UX design teams to translate Figma design screens into functioning web pages.
- Maintained documentation and performed version control using Git and GitHub.

SKILLS:
- Frontend Technologies: JavaScript, HTML, CSS, Sass, Tailwind CSS, Bootstrap, jQuery
- Design Tools: Figma, UI Design, Responsive Web Design
- Other: Git, GitHub, REST APIs

EDUCATION:
Associate Degree in Web Design and Development
Chicago Community College (Graduated 2023)`,
  },
];

export default function UploadZone({
  activeJobId,
  activeJobTitle,
  onCandidatesProcessed,
  onShowToast,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validExtensions = ["pdf", "docx", "doc", "txt"];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      stageIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      stageIncomingFiles(e.target.files);
    }
  };

  const stageIncomingFiles = (fileList: FileList) => {
    setValidationError(null);
    const newStaged: StagedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const ext = f.name.split(".").pop()?.toLowerCase() || "";

      if (!validExtensions.includes(ext)) {
        setValidationError(`Invalid format for "${f.name}". Supported formats: PDF, DOCX, DOC, TXT.`);
        continue;
      }

      // Check max size (10 MB limit)
      if (f.size > 10 * 1024 * 1024) {
        setValidationError(`"${f.name}" exceeds the 10 MB maximum file size.`);
        continue;
      }

      newStaged.push({
        id: `${f.name}-${Date.now()}-${i}`,
        file: f,
        name: f.name,
        size: f.size,
        status: "staged",
        progress: 0,
      });
    }

    if (newStaged.length > 0) {
      setStagedFiles((prev) => [...prev, ...newStaged]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setStagedFiles([]);
    setValidationError(null);
  };

  // Upload and parse all staged files via backend API
  const handleStartScreening = async () => {
    if (!activeJobId) {
      setValidationError("Please select or configure an active job pipeline first.");
      return;
    }

    if (stagedFiles.length === 0) {
      setValidationError("Please select or drop at least one resume file.");
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    // Mark uploading status
    setStagedFiles((prev) =>
      prev.map((item) => ({ ...item, status: "uploading", progress: 40 }))
    );

    try {
      const formData = new FormData();
      stagedFiles.forEach((item) => {
        formData.append("files", item.file);
      });

      // Advance progress bar
      setStagedFiles((prev) =>
        prev.map((item) => ({ ...item, progress: 75 }))
      );

      const response = await fetch(`${API_BASE}/api/jobs/${activeJobId}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resume screening failed on the backend server.");
      }

      const results = await response.json();

      setStagedFiles((prev) =>
        prev.map((item) => ({ ...item, status: "success", progress: 100 }))
      );

      onCandidatesProcessed(results);
      onShowToast?.("success", `Successfully screened ${results.length} candidate resumes!`);

      // Clear staged files after short delay
      setTimeout(() => {
        setStagedFiles([]);
      }, 3500);
    } catch (err: any) {
      setStagedFiles((prev) =>
        prev.map((item) => ({ ...item, status: "error", errorMessage: err.message }))
      );
      setValidationError(err.message || "Failed to process resumes.");
      onShowToast?.("error", "Failed to screen resumes. Check backend connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Click Load Sample Resumes
  const handleLoadSampleResumes = async () => {
    if (!activeJobId) {
      setValidationError("Please select or establish a job description first.");
      return;
    }

    setIsProcessing(true);
    setValidationError(null);

    const demoStaged: StagedFile[] = SAMPLE_RESUMES.map((sample, idx) => {
      const blob = new Blob([sample.content], { type: "text/plain" });
      const file = new (window as any).File([blob], sample.name, { type: "text/plain" });
      return {
        id: `demo-${idx}-${Date.now()}`,
        file: file,
        name: sample.name,
        size: blob.size,
        status: "uploading",
        progress: 50,
      };
    });

    setStagedFiles(demoStaged);

    try {
      const formData = new FormData();
      demoStaged.forEach((item) => {
        formData.append("files", item.file);
      });

      const response = await fetch(`${API_BASE}/api/jobs/${activeJobId}/resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Sample resume parsing failed.");
      }

      const results = await response.json();

      setStagedFiles((prev) =>
        prev.map((item) => ({ ...item, status: "success", progress: 100 }))
      );

      onCandidatesProcessed(results);
      onShowToast?.("success", `Evaluated 3 sample candidate profiles successfully!`);

      setTimeout(() => {
        setStagedFiles([]);
      }, 3500);
    } catch (err: any) {
      setStagedFiles((prev) =>
        prev.map((item) => ({ ...item, status: "error" }))
      );
      setValidationError(err.message || "Could not load sample resumes.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Ingest Candidate Resumes</h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
              Batch Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Target Pipeline:{" "}
            <span className="font-semibold text-slate-800">
              {activeJobTitle || "None selected"}
            </span>
          </p>
        </div>

        {/* 1-Click Demo Profiles Action */}
        <button
          onClick={handleLoadSampleResumes}
          disabled={!activeJobId || isProcessing}
          className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Load 3 Demo Resumes</span>
        </button>
      </div>

      {/* Validation Message Banner */}
      {validationError && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Large Drag and Drop Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (activeJobId && !isProcessing) {
            fileInputRef.current?.click();
          }
        }}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-14 px-6 text-center transition-all ${
          !activeJobId
            ? "cursor-not-allowed border-slate-200 bg-slate-50/50 opacity-60"
            : isDragActive
            ? "border-blue-500 bg-blue-50/30 scale-[1.01]"
            : "cursor-pointer border-slate-200 bg-slate-50/30 hover:border-blue-400 hover:bg-slate-50/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={!activeJobId || isProcessing}
        />

        <div
          className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition ${
            isDragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          <UploadCloud className="h-7 w-7" />
        </div>

        <p className="text-sm font-bold text-slate-800">
          Drag & drop candidate resumes here, or <span className="text-blue-600 underline">browse</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Supports PDF, DOCX, DOC, or TXT (up to 10 MB each)
        </p>

        {!activeJobId && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            Please establish or select a job profile above first
          </div>
        )}
      </div>

      {/* Staged Files List & Progress */}
      {stagedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Staged Files ({stagedFiles.length})
            </span>
            {!isProcessing && (
              <button
                onClick={handleClearAll}
                className="text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {stagedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <File className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    ({formatSize(file.size)})
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.status === "staged" && (
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
                      title="Remove file"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {file.status === "uploading" && (
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <RefreshCcw className="h-3 w-3 animate-spin" />
                      Screening...
                    </span>
                  )}

                  {file.status === "success" && (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Analyzed
                    </span>
                  )}

                  {file.status === "error" && (
                    <span className="flex items-center gap-1 text-rose-600 font-semibold">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Button: Start Screening */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartScreening}
              disabled={isProcessing || stagedFiles.length === 0}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isProcessing ? (
                <>
                  <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                  <span>Processing Resumes with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start AI Screening ({stagedFiles.length} Resumes)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
