import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EncryptedText } from "../ui/EncryptedText";

const data = [
  { name: "Jargon", fullLabel: "Confused by Jargon", users: 120 },
  { name: "Clauses", fullLabel: "Missed Important Clauses", users: 95 },
  { name: "Awareness", fullLabel: "Lack of Legal Awareness", users: 80 },
  { name: "Scams", fullLabel: "Victim of Legal Scams", users: 60 },
  { name: "Advice", fullLabel: "Reliance on Informal Advice", users: 45 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { fullLabel, users } = payload[0].payload;

    return (
      <div className="bg-ivory p-4 border border-coffee/20 shadow-xl rounded-none">
        <p className="font-serif text-coffee font-bold mb-1">{fullLabel}</p>
        <p className="text-sm font-sans text-charcoal">
          Users: <span className="font-bold">{users}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const FirmStats: React.FC = () => {
  return (
    <section className="py-20 bg-coffee text-ivory">
      <style>{`
        .recharts-wrapper *:focus {
          outline: none !important;
        }
        .recharts-surface:focus {
          outline: none !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Side */}
        <div>
          <h3 className="font-serif text-3xl md:text-4xl mb-6">
            Understanding the Real Problem
          </h3>
          <p className="font-sans text-ivory/70 leading-relaxed mb-8">
            Legal documents often confuse users through technical wording,
            hidden clauses, and lack of legal awareness. Juribot simplifies
            documents and highlights risks clearly.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <EncryptedText
                text="~60%"
                className="block text-4xl font-serif text-gold mb-1"
                encryptedClassName="text-gold/40"
                revealedClassName="text-gold"
                revealDelayMs={50}
              />
              <span className="text-xs uppercase tracking-widest text-ivory/60">
                Face Confusion
              </span>
            </div>

            <div>
              <EncryptedText
                text="250+"
                className="block text-4xl font-serif text-gold mb-1"
                encryptedClassName="text-gold/40"
                revealedClassName="text-gold"
                revealDelayMs={50}
              />
              <span className="text-xs uppercase tracking-widest text-ivory/60">
                Docs Analyzed
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80 w-full bg-white/5 p-6 rounded-xl border border-white/10">
          <h4 className="font-serif text-lg mb-6 text-center text-ivory/90">
            Common Pain Points
          </h4>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#F5F0E6",
                  fontSize: 12,
                  fontFamily: "Lato",
                }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#F5F0E6",
                  fontSize: 12,
                  fontFamily: "Lato",
                }}
              />
              <Tooltip cursor={false} content={<CustomTooltip />} />
              <Bar
                dataKey="users"
                radius={[4, 4, 0, 0]}
                barSize={40}
                activeBar={false}
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#C5A059" : "#A68545"}
                    strokeWidth={0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
