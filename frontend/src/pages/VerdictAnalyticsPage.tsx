import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scale, Calendar, MapPin, Gavel, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Cell,
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

const VerdictAnalyticsPage = () => {
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const [formData, setFormData] = useState({
    caseCategory: "Corporate Dispute",
    jurisdiction: "Delhi High Court",
    yearRange: [2018, 2024],
    opponentType: "Corporate Entity",
    facts: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 2000);
  };

  // Mock Data
  const outcomeData = [
    { name: "Win", value: 65, color: "#10B981" },
    { name: "Settled", value: 20, color: "#F59E0B" },
    { name: "Lost", value: 15, color: "#EF4444" },
  ];

  return (
    <PageLayout sectionTitle="Verdict Analytics">
      <PageHeader
        icon={Scale}
        tag="Historical Insights"
        title="Predict Outcomes"
        highlightedTitle="Before Filing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 grow">
        {/* Left Panel */}
        <Card
          animate
          motionProps={{
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.3 },
          }}
          className="lg:col-span-4 flex flex-col h-auto"
        >
          <h3 className="font-serif text-xl font-bold text-charcoal mb-4 flex items-center gap-2 shrink-0">
            Case Context
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase block mb-2">
                Category
              </label>
              <StyledSelect
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 text-sm"
                value={formData.caseCategory}
                onChange={(value) =>
                  setFormData({ ...formData, caseCategory: value })
                }
                options={[
                  "Corporate Dispute",
                  "Intellectual Property",
                  "Constitutional Matter",
                  "Criminal Appeal",
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase block mb-2">
                Jurisdiction
              </label>
              <StyledSelect
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 text-sm"
                value={formData.jurisdiction}
                onChange={(value) =>
                  setFormData({ ...formData, jurisdiction: value })
                }
                options={[
                  "Delhi High Court",
                  "Bombay High Court",
                  "Supreme Court of India",
                  "Karnataka High Court",
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-bold tracking-wider text-charcoal/60 uppercase block mb-2">
                Key Facts Summary
              </label>
              <textarea
                rows={4}
                placeholder="Enter brief facts e.g. 'Breach of contract regarding software delivery delays...'"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-charcoal focus:outline-none focus:border-coffee/50 text-sm resize-none"
                value={formData.facts}
                onChange={(e) =>
                  setFormData({ ...formData, facts: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-white py-4 rounded-xl font-bold tracking-widest hover:bg-coffee transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? "ANALYZING..." : "ANALYZE TRENDS"}
            </button>
          </form>
        </Card>

        {/* Right Panel */}
        <div className="lg:col-span-8 relative flex flex-col min-h-125 mt-8 lg:mt-0">
          <AnimatePresence>
            {!showResults && !loading && (
              <EmptyState
                icon={MapPin}
                description="Select parameters to define the search scope."
              />
            )}

            {loading && <LoadingOverlay message="Mining Legal Database..." />}

            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pr-2 pb-10"
              >
                {/* Top Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="flex flex-col justify-center">
                    <p className="text-xs font-bold text-charcoal/40 uppercase mb-2">
                      Similar Cases Found
                    </p>
                    <p className="text-4xl font-serif text-charcoal">1,248</p>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <TrendingUp size={12} /> High relevance
                    </p>
                  </Card>
                  <Card className="flex flex-col justify-center">
                    <p className="text-xs font-bold text-charcoal/40 uppercase mb-2">
                      Avg. Case Duration
                    </p>
                    <p className="text-4xl font-serif text-charcoal">
                      2.4{" "}
                      <span className="text-lg font-sans text-charcoal/40">
                        Years
                      </span>
                    </p>
                  </Card>
                  <Card className="flex flex-col justify-center col-span-2 md:col-span-1">
                    <p className="text-xs font-bold text-charcoal/40 uppercase mb-2">
                      Dominant Outcome
                    </p>
                    <p className="text-4xl font-serif text-green-600">Win</p>
                    <p className="text-xs text-charcoal/40 mt-1">
                      65% probability
                    </p>
                  </Card>
                </div>

                {/* Chart Section */}
                <Card>
                  <h4 className="font-bold text-charcoal mb-6">
                    Outcome Probability Distribution
                  </h4>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={outcomeData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          horizontal={false}
                          stroke="#e5e5e5"
                        />
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          tick={{
                            fill: "#2C2C2C",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                          width={60}
                          axisLine={false}
                          tickLine={false}
                        />
                        <ReTooltip cursor={{ fill: "#f5f5f4" }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                          {outcomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Precedents List */}
                <div>
                  <h4 className="font-bold text-charcoal mb-4 flex items-center justify-between">
                    <span>Top Precedents</span>
                    <span className="text-xs font-normal text-charcoal/50">
                      Sorted by relevance
                    </span>
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "TechSolutions Ltd v. Innovate Corp",
                        year: "2023",
                        outcome: "Allowed",
                        court: "Delhi High Court",
                        summary:
                          "Court upheld the confidentiality clause citing clear definition of trade secrets.",
                      },
                      {
                        title: "State Bank v. Vijay Kumar",
                        year: "2021",
                        outcome: "Dismissed",
                        court: "Supreme Court",
                        summary:
                          "Appeal dismissed due to lack of substantial evidence regarding breach.",
                      },
                      {
                        title: "Global Systems v. Union of India",
                        year: "2022",
                        outcome: "Pending",
                        court: "Bombay High Court",
                        summary: "Interim relief granted to the petitioner.",
                      },
                    ].map((c, i) => (
                      <Card
                        key={i}
                        animate
                        motionProps={{
                          initial: { opacity: 0, x: 20 },
                          animate: { opacity: 1, x: 0 },
                          transition: { delay: i * 0.1 },
                        }}
                        className="hover:border-coffee/30 transition-colors group cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-serif font-bold text-lg text-charcoal group-hover:text-coffee transition-colors">
                              {c.title}
                            </h5>
                            <p className="text-xs text-charcoal/50 flex items-center gap-2 mt-1">
                              <Gavel size={12} /> {c.court} •{" "}
                              <Calendar size={12} /> {c.year}
                            </p>
                          </div>
                          <span
                            className={clsx(
                              "text-xs font-bold px-3 py-1 rounded-full border",
                              c.outcome === "Allowed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : c.outcome === "Dismissed"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {c.outcome}
                          </span>
                        </div>
                        <p className="text-sm text-charcoal/70 leading-relaxed">
                          {c.summary}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageLayout>
  );
};

export default VerdictAnalyticsPage;
