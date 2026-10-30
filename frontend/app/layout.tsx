import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HireSense AI — Intelligent AI Resume Screening & Candidate Ranking Platform",
  description: "Transform your recruitment process with HireSense AI. Automated resume parsing, semantic skill evaluation, and instant candidate ranking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased light">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
