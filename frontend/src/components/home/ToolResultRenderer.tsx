import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Scale, FileText } from "lucide-react";

interface CostBreakdownData {
  legal_fees: number;
  court_fees: number;
  filing_admin_fees: number;
  miscellaneous_fees: number;
  total_cost: number;
}

interface VerdictAnalyticsData {
  status: string;
  meta: {
    category: string;
    jurisdiction: string;
  };
  summary: {
    similar_cases_found: number;
    avg_case_duration_years: number;
    dominant_outcome: {
      label: string;
      probability_percent: number;
    };
  };
  outcome_probability_distribution: {
    win: number;
    settled: number;
    lost: number;
  };
  top_precedents: Array<{
    case_id: string;
    case_name: string;
    court: string;
    year: number;
    status: string;
    summary: string;
  }>;
}

interface ToolResultData {
  status: string;
  tool: string;
  data?: CostBreakdownData;
  visualization?: string;
  meta?: any;
  summary?: any;
  outcome_probability_distribution?: any;
  top_precedents?: any[];
  message?: string;
}

interface ToolResultRendererProps {
  result: ToolResultData;
}

const COST_COLORS = {
  legal_fees: "#8B4513",
  court_fees: "#D4A574",
  filing_admin_fees: "#C19A6B",
  miscellaneous_fees: "#E5C9A8",
};

const OUTCOME_COLORS = {
  win: "#22c55e",
  settled: "#f59e0b",
  lost: "#ef4444",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export const ToolResultRenderer: React.FC<ToolResultRendererProps> = ({
  result,
}) => {
  if (result.status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-3">
        <p className="text-red-700 text-sm font-medium">
          Error: {result.message || "An error occurred"}
        </p>
      </div>
    );
  }

  // Cost Estimator Visualization
  if (result.tool === "cost_estimator" && result.data) {
    const costData = result.data;
    const pieData = [
      { name: "Legal Fees", value: costData.legal_fees },
      { name: "Court Fees", value: costData.court_fees },
      { name: "Filing & Admin", value: costData.filing_admin_fees },
      { name: "Miscellaneous", value: costData.miscellaneous_fees },
    ];

    return (
      <div className="bg-linear-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-xl p-5 my-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-coffee/10 flex items-center justify-center">
            <Scale className="w-4 h-4 text-coffee" />
          </div>
          <h3 className="font-serif font-bold text-charcoal">
            Cost Breakdown
          </h3>
        </div>

        {/* Total Cost Banner */}
        <div className="bg-coffee/10 rounded-lg p-4 mb-4 border border-coffee/20">
          <p className="text-xs text-charcoal/60 uppercase tracking-wide mb-1">
            Estimated Total Cost
          </p>
          <p className="text-3xl font-bold text-coffee font-serif">
            {formatCurrency(costData.total_cost)}
          </p>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      Object.values(COST_COLORS)[
                        index % Object.values(COST_COLORS).length
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Legal Fees</p>
            <p className="text-lg font-bold text-charcoal">
              {formatCurrency(costData.legal_fees)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Court Fees</p>
            <p className="text-lg font-bold text-charcoal">
              {formatCurrency(costData.court_fees)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Filing & Admin</p>
            <p className="text-lg font-bold text-charcoal">
              {formatCurrency(costData.filing_admin_fees)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Miscellaneous</p>
            <p className="text-lg font-bold text-charcoal">
              {formatCurrency(costData.miscellaneous_fees)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verdict Analytics Visualization
  if (result.tool === "verdict_analytics" && result.summary) {
    const verdictData = result as VerdictAnalyticsData;
    const outcomeData = [
      {
        name: "Win",
        probability: verdictData.outcome_probability_distribution.win,
      },
      {
        name: "Settled",
        probability: verdictData.outcome_probability_distribution.settled,
      },
      {
        name: "Lost",
        probability: verdictData.outcome_probability_distribution.lost,
      },
    ];

    return (
      <div className="bg-linear-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-xl p-5 my-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-coffee/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-coffee" />
          </div>
          <h3 className="font-serif font-bold text-charcoal">
            Verdict Analytics
          </h3>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Similar Cases</p>
            <p className="text-2xl font-bold text-coffee">
              {verdictData.summary.similar_cases_found}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Avg Duration</p>
            <p className="text-2xl font-bold text-coffee">
              {verdictData.summary.avg_case_duration_years.toFixed(1)}y
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-stone-200">
            <p className="text-xs text-charcoal/60 mb-1">Likely Outcome</p>
            <p className="text-lg font-bold text-coffee capitalize">
              {verdictData.summary.dominant_outcome.label}
            </p>
          </div>
        </div>

        {/* Outcome Probability Chart */}
        <div className="bg-white rounded-lg p-4 mb-4">
          <h4 className="text-sm font-semibold text-charcoal mb-3">
            Outcome Probabilities
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={outcomeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="name" stroke="#44403c" />
              <YAxis stroke="#44403c" />
              <Tooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e7e5e4",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="probability" radius={[8, 8, 0, 0]}>
                {outcomeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      OUTCOME_COLORS[
                        entry.name.toLowerCase() as keyof typeof OUTCOME_COLORS
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Precedents */}
        {verdictData.top_precedents &&
          verdictData.top_precedents.length > 0 && (
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Relevant Precedents
              </h4>
              <div className="space-y-3">
                {verdictData.top_precedents.slice(0, 3).map((precedent, idx) => (
                  <div
                    key={idx}
                    className="border-l-4 border-coffee/30 pl-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-medium text-sm text-charcoal">
                        {precedent.case_name}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          precedent.status === "allowed"
                            ? "bg-green-100 text-green-700"
                            : precedent.status === "dismissed"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {precedent.status}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 mb-1">
                      {precedent.court} • {precedent.year}
                    </p>
                    {precedent.summary && (
                      <p className="text-xs text-charcoal/70 italic">
                        {precedent.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    );
  }

  return null;
};
