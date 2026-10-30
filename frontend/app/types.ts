export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  created_at: string;
}

export interface CandidateExperience {
  years: number;
  roles: string[];
  companies: string[];
}

export interface Candidate {
  id: number;
  job_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience: CandidateExperience;
  education: string | null;
  summary: string | null;
  score: number;
  technical_score: number;
  experience_score: number;
  education_score: number;
  resume_text: string | null;
  created_at: string;
  status?: "Shortlisted" | "Under Review" | "Low Match";
}

export interface HealthStatus {
  status: string;
  ollama_status: "connected" | "fallback_mode" | string;
  message: string;
}

export type ViewMode = "table" | "cards";

export type ActiveTab = "leaderboard" | "upload" | "specs";

export type AppNavigationTab =
  | "overview"
  | "upload"
  | "jobs"
  | "candidates"
  | "screening"
  | "analytics"
  | "settings"
  | "profile";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "info" | "warning";
}
