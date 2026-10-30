"use client";

import React from "react";
import { Sparkles, BrainCircuit } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export default function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const iconSizes = {
    sm: "h-7 w-7 rounded-lg",
    md: "h-9 w-9 rounded-xl",
    lg: "h-11 w-11 rounded-2xl",
  };

  const svgSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Icon Badge */}
      <div
        className={`relative flex items-center justify-center bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-600 text-white shadow-md shadow-blue-950/15 ring-1 ring-white/20 transition-transform duration-200 group-hover:scale-105 ${iconSizes[size]}`}
      >
        <BrainCircuit className={svgSizes[size]} />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      </div>

      {variant === "full" && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
            Hire<span className="text-blue-600">Sense</span>
          </span>
          <span className="rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
            AI
          </span>
        </div>
      )}
    </div>
  );
}

