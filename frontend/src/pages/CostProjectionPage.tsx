import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import {
  Calculator,
  IndianRupee,
  PieChart,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";
import clsx from "clsx";

import { PageLayout } from "../components/common/PageLayout";
import { PageHeader } from "../components/common/PageHeader";
import { Card } from "../components/common/Card";
import {
  EmptyState,
  LoadingOverlay,
} from "../components/common/StatusComponents";
import { StyledSelect } from "../components/common/StyledSelect";

const CostProjectionPage = () => {
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    caseType: "Civil",
    jurisdiction: "District Court",
    location: "Mumbai, Maharashtra",
    complexity: "Medium",
    duration: 12, // in months
    lawyerLevel: "Mid-Senior",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  // Mock Data for Charts
  const costData = [
    { name: "Legal Fees", value: 450000, color: "#C5A059" },
    { name: "Court Fees", value: 50000, color: "#2C2C2C" },
    { name: "Filing & Admin", value: 25000, color: "#E5E5E5" },
    { name: "Miscellaneous", value: 30000, color: "#A8A8A8" },
  ];

  const totalCost = costData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <PageLayout sectionTitle="Cost Projection">
      <PageHeader
        icon={Calculator}
        tag="Financial Planning"
        title="Smart Cost"
        highlightedTitle="Projection."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 grow min-h-0">
        {/* Left: Input Form */}
        <Card
          animate
          motionProps={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.3 },
          }}
          className="lg:col-span-4 overflow-y-auto custom-scrollbar h-auto max-h-full"
        >
          <h3 className="font-serif text-xl font-bold text-charcoal mb-4 flex items-center gap-2 sticky top-0 bg-white z-10">
            Case Parameters
            <Info size={16} className="text-charcoal/30" />
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                  Case Type
                </label>
                <StyledSelect
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 transition-colors"
                  value={formData.caseType}
                  onChange={(value) =>
                    setFormData({ ...formData, caseType: value })
                  }
                  options={[
                    "Civil",
                    "Criminal",
                    "Corporate",
                    "Family / Matrimonial",
                    "Property Dispute",
                    "Consumer",
                  ]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                  Jurisdiction
                </label>
                <StyledSelect
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 transition-colors"
                  value={formData.jurisdiction}
                  onChange={(value) =>
                    setFormData({ ...formData, jurisdiction: value })
                  }
                  options={[
                    "District Court",
                    "High Court",
                    "Supreme Court",
                    "Consumer Forum",
                    "Tribunal",
                  ]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                City / State
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                  Expected Duration
                </label>
                <span className="text-xs font-bold text-coffee">
                  {formData.duration} Months
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-coffee"
              />
              <div className="flex justify-between text-[10px] text-charcoal/40">
                <span>1 Month</span>
                <span>5 Years</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                  Complexity
                </label>
                <div className="flex gap-2">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, complexity: level })
                      }
                      className={clsx(
                        "flex-1 py-3 rounded-xl text-xs font-bold border transition-all",
                        formData.complexity === level
                          ? "border-coffee bg-coffee text-white shadow-md"
                          : "border-stone-200 bg-stone-50 text-charcoal/60 hover:bg-stone-100"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase">
                  Lawyer Tier
                </label>
                <StyledSelect
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 transition-colors"
                  value={formData.lawyerLevel}
                  onChange={(value) =>
                    setFormData({ ...formData, lawyerLevel: value })
                  }
                  options={[
                    "Junior Associate",
                    "Mid-Senior",
                    "Senior Counsel",
                    "Top Tier Firm",
                  ]}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white py-4 rounded-xl font-bold tracking-widest hover:bg-coffee transition-all duration-300 shadow-lg mt-4 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="animate-pulse">CALCULATING...</span>
              ) : (
                <>
                  ESTIMATE COSTS{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </Card>

        {/* Right: Results View */}
        <div className="lg:col-span-8 relative min-h-125 h-auto pb-10 mt-8 lg:mt-0">
          <AnimatePresence>
            {!showResults && !loading && (
              <EmptyState
                icon={PieChart}
                title="Ready to Estimate"
                description="Fill out the case parameters on the left to generate a detailed financial projection."
              />
            )}

            {loading && <LoadingOverlay message="Analyzing Market Rates..." />}

            {showResults && (
              <Card
                animate
                key="results"
                motionProps={{
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                }}
                className="p-0 border-none shadow-xl overflow-hidden bg-white"
              >
                <div className="bg-charcoal p-8 text-ivory">
                  <p className="text-sm font-bold tracking-widest opacity-60 uppercase mb-2">
                    Estimated Total Cost Range
                  </p>
                  <div className="flex items-baseline gap-2">
                    <IndianRupee size={32} className="text-gold" />
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
                      4.5L{" "}
                      <span className="text-2xl opacity-50 font-sans font-normal">
                        -
                      </span>{" "}
                      6.2L
                    </h2>
                  </div>
                  <p className="text-sm mt-4 text-white/60">
                    *Based on average timelines for {formData.caseType} cases in{" "}
                    {formData.location}.
                  </p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={costData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {costData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ReTooltip
                          formatter={(value: number | undefined) => [
                            `₹${value?.toLocaleString() ?? "0"}`,
                            "Cost",
                          ]}
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e5e5e5",
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                      <p className="text-[10px] uppercase font-bold text-charcoal/40">
                        Total
                      </p>
                      <p className="text-sm font-bold text-charcoal">
                        ₹{(totalCost / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-charcoal mb-4 border-b border-stone-100 pb-2">
                      Cost Breakdown
                    </h4>
                    {costData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-charcoal/80">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-charcoal">
                          ₹{(item.value / 1000).toFixed(0)}k
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-50 p-6 border-t border-stone-100">
                  <div className="flex gap-3 items-start">
                    <Info size={18} className="text-coffee shrink-0 mt-0.5" />
                    <p className="text-xs text-charcoal/60 leading-relaxed">
                      <strong>Disclaimer:</strong> This is a generated estimate
                      based on historical data. Actual costs may vary
                      significantly based on court delays, opponent strategy,
                      and case developments.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
};

export default CostProjectionPage;
