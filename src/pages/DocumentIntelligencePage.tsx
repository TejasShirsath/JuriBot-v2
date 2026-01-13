import { useState } from "react";
import { motion } from "motion/react";
import { FileText, CheckCircle, AlertCircle, X, File } from "lucide-react";
import clsx from "clsx";

import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Card } from "../components/common/Card";
import { FileUploader } from "../components/common/FileUploader";
import { ChatInterface } from "../components/common/ChatInterface";

const DocumentIntelligencePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "clauses" | "stats">(
    "summary"
  );

  const startAnalysis = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    // Simulate processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  return (
    <PageLayout sectionTitle="Document Intelligence">
      <PageHeader
        icon={FileText}
        tag="Document Intelligence"
        title="Upload to"
        highlightedTitle="Demystify."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 grow min-h-0">
        {/* Left Panel*/}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          {!analysisComplete ? (
            <FileUploader
              onFileSelect={startAnalysis}
              isAnalyzing={isAnalyzing}
              title="Drag & Drop or Click"
              description="Supports PDF, DOCX, and TXT files up to 25MB. All uploads are encrypted."
            />
          ) : (
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
                      {file?.name || "Non-Disclosure_Agreement.pdf"}
                    </h4>
                    <p className="text-xs text-charcoal/50">
                      {(file?.size ? (file.size / 1024).toFixed(2) : "124") +
                        " KB"}{" "}
                      • Processed Just Now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAnalysisComplete(false)}
                  className="text-xs font-bold tracking-wider text-charcoal/40 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> CLEAR
                </button>
              </div>

              {/* Results Tabs */}
              <div className="flex px-6 pt-6 gap-6 border-b border-stone-100/50">
                <button
                  onClick={() => setActiveTab("summary")}
                  className={clsx(
                    "pb-3 text-sm font-bold tracking-wide transition-colors relative",
                    activeTab === "summary"
                      ? "text-coffee"
                      : "text-charcoal/40 hover:text-charcoal/70"
                  )}
                >
                  SUMMARY
                  {activeTab === "summary" && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={clsx(
                    "pb-3 text-sm font-bold tracking-wide transition-colors relative",
                    activeTab === "stats"
                      ? "text-coffee"
                      : "text-charcoal/40 hover:text-charcoal/70"
                  )}
                >
                  KEY METRICS
                  {activeTab === "stats" && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("clauses")}
                  className={clsx(
                    "pb-3 text-sm font-bold tracking-wide transition-colors relative",
                    activeTab === "clauses"
                      ? "text-coffee"
                      : "text-charcoal/40 hover:text-charcoal/70"
                  )}
                >
                  CLAUSE BREAKDOWN
                  {activeTab === "clauses" && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-coffee"
                    />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto grow custom-scrollbar">
                {activeTab === "summary" && (
                  <div className="space-y-6 animate-fadeIn">
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
                      The uploaded document is a standard Non-Disclosure
                      Agreement (NDA) between "TechCorp Solutions" (Disclosing
                      Party) and "Innovate Labs" (Receiving Party). It
                      establishes confidentiality obligations for a duration of
                      3 years regarding proprietary software algorithms.
                    </div>

                    <div>
                      <h5 className="font-serif font-bold text-charcoal mb-3">
                        Key Provisions Simplified
                      </h5>
                      <ul className="space-y-3">
                        <li className="flex gap-3 text-sm text-charcoal/80 bg-stone-50 p-3 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-coffee mt-2 shrink-0"></div>
                          <span>
                            <strong>Confidentiality Period:</strong> The
                            obligation to keep information secret lasts for 3
                            years from the date of disclosure.
                          </span>
                        </li>
                        <li className="flex gap-3 text-sm text-charcoal/80 bg-stone-50 p-3 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-coffee mt-2 shrink-0"></div>
                          <span>
                            <strong>Exclusions:</strong> Information already
                            known to the public or independently developed is
                            not covered.
                          </span>
                        </li>
                        <li className="flex gap-3 text-sm text-charcoal/80 bg-stone-50 p-3 rounded-lg">
                          <div className="w-1.5 h-1.5 rounded-full bg-coffee mt-2 shrink-0"></div>
                          <span>
                            <strong>Jurisdiction:</strong> Disputes will be
                            resolved under the laws of New Delhi, India.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-stone-100">
                      <h5 className="font-serif font-bold text-charcoal mb-3 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-500" />
                        Critical Risk Flags
                      </h5>
                      <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-sm text-red-800">
                        <strong>Indemnification Clause Warning:</strong> Clause
                        8.2 imposes uncapped liability on the Receiving Party
                        for any breach, which is non-standard.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                    <div className="p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-1">
                        WORD COUNT
                      </p>
                      <p className="text-3xl font-serif text-charcoal">2,451</p>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-1">
                        CLAUSES
                      </p>
                      <p className="text-3xl font-serif text-charcoal">14</p>
                    </div>
                    <div className="col-span-2 p-4 bg-stone-50 rounded-xl">
                      <p className="text-xs font-bold tracking-wider text-charcoal/40 mb-3">
                        ENTITIES DETECTED
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white border border-stone-200 px-2 py-1 rounded text-xs text-charcoal/70">
                          TechCorp Solutions (Org)
                        </span>
                        <span className="bg-white border border-stone-200 px-2 py-1 rounded text-xs text-charcoal/70">
                          Innovate Labs (Org)
                        </span>
                        <span className="bg-white border border-stone-200 px-2 py-1 rounded text-xs text-charcoal/70">
                          New Delhi (Loc)
                        </span>
                        <span className="bg-white border border-stone-200 px-2 py-1 rounded text-xs text-charcoal/70">
                          10th Jan 2026 (Date)
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-charcoal">
                          Document Complexity Score
                        </p>
                        <span className="text-sm font-bold text-coffee">
                          Medium (6.5/10)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-coffee rounded-full"></div>
                      </div>
                      <p className="text-xs text-charcoal/40 mt-2">
                        Based on sentence length and legal jargon density.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "clauses" && (
                  <div className="space-y-4 animate-fadeIn">
                    {[1, 2, 3, 4].map((i) => (
                      <details
                        key={i}
                        className="group bg-stone-50 rounded-xl border border-stone-100 open:border-coffee/20 transition-all"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-charcoal text-sm select-none">
                          <span>
                            Clause {i}.0 —{" "}
                            {
                              [
                                "Definitions",
                                "Confidential Information",
                                "Non-Compete",
                                "Termination",
                              ][i - 1]
                            }
                          </span>
                          <span className="text-coffee group-open:rotate-180 transition-transform">
                            ▼
                          </span>
                        </summary>
                        <div className="px-4 pb-4 text-sm text-charcoal/70 leading-relaxed border-t border-stone-200/50 pt-3 mt-1">
                          <p className="mb-2 italic opacity-60">
                            "Original legal text would appear here..."
                          </p>
                          <p className="font-medium text-charcoal/90 bg-white p-3 rounded-lg border border-stone-100">
                            <strong>Meaning:</strong> This section defines what
                            is considered confidential. It explicitly includes
                            customer lists and pricing data.
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Panel: Chat Interface */}
        <div className="lg:col-span-5 h-full">
          <ChatInterface
            context="Document Context: NDA_v1.pdf"
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
