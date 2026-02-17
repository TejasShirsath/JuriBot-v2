import { useState } from "react";
import { motion } from "motion/react";
import { FileText, CheckCircle, AlertCircle, X, File } from "lucide-react";
import clsx from "clsx";

import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Card } from "../components/common/Card";
import { FileUploader } from "../components/common/FileUploader";
import { ChatInterface } from "../components/common/ChatInterface";

// ---- Types matching the /upload API response ----
interface SummaryData {
  summary: string;
  key_provisions_simplified?: string[];
  critical_risk_flags?: string[];
}

interface KeyMetrics {
  word_count: number;
  clauses: number;
  entities_detected: string[];
  document_complexity_score: string;
}

interface ClauseItem {
  clause_title: string;
  clause_summary: string;
}

interface ClauseBreakdown {
  clauses: ClauseItem[];
}

interface AnalysisResult {
  document_id: string;
  summary: SummaryData;
  key_metrics: KeyMetrics;
  clause_breakdown: ClauseBreakdown;
}

const API_BASE = import.meta.env.VITE_API_URL;

// ---- Helpers ----

/** Parse "7 — Moderate complexity due to …" into { score: 7, justification: "…" } */
function parseComplexityScore(raw: string): {
  score: number;
  label: string;
  justification: string;
} {
  const numMatch = raw.match(/(\d+(?:\.\d+)?)/);
  const score = numMatch ? parseFloat(numMatch[1]) : 5;
  const label = score <= 3 ? "Low" : score <= 6 ? "Medium" : "High";
  // Everything after the first dash / colon is the justification
  const justification =
    raw
      .replace(/^[\d.]+\s*[/\d]*\s*[-–—:.]?\s*/, "")
      .trim() || "Based on document analysis.";
  return { score, label, justification };
}

const DocumentIntelligencePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "clauses" | "stats">(
    "summary"
  );

  const startAnalysis = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }

      const data: AnalysisResult = await res.json();
      setAnalysis(data);
      setAnalysisComplete(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setAnalysisComplete(false);
    setAnalysis(null);
    setFile(null);
    setError(null);
  };

  const complexity = analysis
    ? parseComplexityScore(analysis.key_metrics.document_complexity_score)
    : null;

  return (
    <PageLayout sectionTitle="Document Intelligence">
      <PageHeader
        icon={FileText}
        tag="Document Intelligence"
        title="Upload to"
        highlightedTitle="Demystify."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 grow min-h-0">
        {/* Left Panel */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          {!analysisComplete ? (
            <>
              <FileUploader
                onFileSelect={startAnalysis}
                isAnalyzing={isAnalyzing}
                title="Drag & Drop or Click"
                description="Supports PDF, DOCX, and TXT files up to 25MB. All uploads are encrypted."
              />
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : analysis ? (
            <Card
              animate
              motionProps={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
              }}
              className="flex-1 border-stone-200 shadow-sm flex flex-col overflow-hidden p-0"
            >
              {/* File Header */}
              <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                    <File size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal">
                      {file?.name ?? "Document"}
                    </h4>
                    <p className="text-xs text-charcoal/50">
                      {file
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : "Unknown size"}{" "}
                      • Processed Just Now
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="text-xs font-bold tracking-wider text-charcoal/40 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> CLEAR
                </button>
              </div>

              {/* Results Tabs */}
              <div className="flex px-6 pt-6 gap-6 border-b border-stone-100/50">
                {(
                  [
                    ["summary", "SUMMARY"],
                    ["stats", "KEY METRICS"],
                    ["clauses", "CLAUSE BREAKDOWN"],
                  ] as const
                ).map(([tab, label]) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={clsx(
                      "pb-3 text-sm font-bold tracking-wide transition-colors relative",
                      activeTab === tab
                        ? "text-coffee"
                        : "text-charcoal/40 hover:text-charcoal/70"
                    )}
                  >
                    {label}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto grow custom-scrollbar">
                {/* ===== SUMMARY TAB ===== */}
                {activeTab === "summary" && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Main summary */}
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-amber-900/80 text-sm leading-relaxed">
                      <div className="flex items-start gap-2 mb-2">
                        <CheckCircle
                          size={16}
                          className="text-amber-600 mt-0.5"
                        />
                        <span className="font-bold text-amber-800">
                          Brief Overview
                        </span>
                      </div>
                      {analysis.summary.summary}
                    </div>

                    {/* Key Provisions (optional) */}
                    {analysis.summary.key_provisions_simplified &&
                      analysis.summary.key_provisions_simplified.length > 0 && (
                        <div>
                          <h5 className="font-serif font-bold text-charcoal mb-3">
                            Key Provisions Simplified
                          </h5>
                          <ul className="space-y-3">
                            {analysis.summary.key_provisions_simplified.map(
                              (provision, i) => (
                                <li
                                  key={i}
                                  className="flex gap-3 text-sm text-charcoal/80 bg-stone-50 p-3 rounded-lg"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-coffee mt-2 shrink-0" />
                                  <span>{provision}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Critical Risk Flags (optional) */}
                    {analysis.summary.critical_risk_flags &&
                      analysis.summary.critical_risk_flags.length > 0 && (
                        <div className="pt-4 border-t border-stone-100">
                          <h5 className="font-serif font-bold text-charcoal mb-3 flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-500" />
                            Critical Risk Flags
                          </h5>
                          <div className="space-y-2">
                            {analysis.summary.critical_risk_flags.map(
                              (flag, i) => (
                                <div
                                  key={i}
                                  className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-800"
                                >
                                  {flag}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* ===== KEY METRICS TAB ===== */}
                {activeTab === "stats" && (
                  <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                    <div className="p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-1">
                        WORD COUNT
                      </p>
                      <p className="text-3xl font-serif text-charcoal">
                        {analysis.key_metrics.word_count.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-1">
                        CLAUSES
                      </p>
                      <p className="text-3xl font-serif text-charcoal">
                        {analysis.key_metrics.clauses}
                      </p>
                    </div>

                    {/* Entities */}
                    <div className="col-span-2 p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-3">
                        ENTITIES DETECTED
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analysis.key_metrics.entities_detected.length > 0 ? (
                          analysis.key_metrics.entities_detected.map(
                            (entity, i) => (
                              <span
                                key={i}
                                className="bg-white border border-stone-200 px-2 py-1 rounded text-xs text-charcoal/70"
                              >
                                {entity}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-xs text-charcoal/40 italic">
                            No entities detected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Complexity Score */}
                    {complexity && (
                      <div className="col-span-2 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-charcoal">
                            Document Complexity Score
                          </p>
                          <span className="text-sm font-bold text-coffee">
                            {complexity.label} ({complexity.score}/10)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-coffee rounded-full transition-all"
                            style={{
                              width: `${(complexity.score / 10) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-charcoal/40 mt-2">
                          {complexity.justification}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ===== CLAUSE BREAKDOWN TAB ===== */}
                {activeTab === "clauses" && (
                  <div className="space-y-4 animate-fadeIn">
                    {analysis.clause_breakdown.clauses.length > 0 ? (
                      analysis.clause_breakdown.clauses.map((clause, i) => (
                        <details
                          key={i}
                          className="group bg-stone-50 rounded-xl border border-stone-100 open:border-coffee/20 transition-all"
                        >
                          <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-charcoal text-sm select-none">
                            <span>
                              Clause {i + 1} — {clause.clause_title}
                            </span>
                            <span className="text-coffee group-open:rotate-180 transition-transform">
                              ▼
                            </span>
                          </summary>
                          <div className="px-4 pb-4 text-sm text-charcoal/70 leading-relaxed border-t border-stone-200/50 pt-3 mt-1">
                            <p className="font-medium text-charcoal/90 bg-white p-3 rounded-lg border border-stone-100">
                              {clause.clause_summary}
                            </p>
                          </div>
                        </details>
                      ))
                    ) : (
                      <p className="text-sm text-charcoal/50 italic text-center py-12">
                        No clauses were detected in this document.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : null}
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="lg:col-span-5 h-full">
          <ChatInterface
            context={
              analysis
                ? `Document Context: ${file?.name ?? "Uploaded Document"}`
                : "General Legal Assistant"
            }
            suggestions={[
              "Summarize the termination clause.",
              "Is there a non-compete agreement?",
              "What are the penalties for breach?",
              "Who are the parties involved?",
            ]}
            className="h-full shadow-lg border-stone-200"
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentIntelligencePage;
