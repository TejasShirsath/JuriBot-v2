import React from "react";
import {
  FileText,
  Languages,
  Calculator,
  Brain,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

export const PracticeAreas: React.FC = () => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Decoder",
      description:
        "Upload legal documents & instantly turn complex legal language into clear, easy to read text.",
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: "Regional Support",
      description:
        "Interact with Juribot in Hindi, Bengali, Tamil, Telugu, Marathi, and other Indian languages.",
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "Cost Estimator",
      description:
        "Get fast estimates for court fees, registration charges, and stamp duties before legal filings.",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Legal Chatbot",
      description:
        "Ask legal questions anytime and receive instant preliminary guidance on IPC and civil matters.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Case Analysis",
      description:
        "Submit case details to find relevant precedents and understand likely outcomes using past data.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Clause Clarity",
      description:
        "Review contracts to quickly identify risky clauses in rental or employment agreements.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-32 bg-ivory relative border-t border-charcoal/5 mt-30 md:mt-60"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-7.5">
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-6">
            EMPOWERING YOU WITH
            <span className="block mt-2 italic text-coffee">
              ARTIFICIAL INTELLIGENCE
            </span>
          </h2>

          <div className="w-16 h-0.5 bg-coffee mx-auto mb-6"></div>
          <p className="font-sans text-charcoal/60 max-w-md mx-auto leading-relaxed">
            Legal help shouldn't be expensive or confusing. Juribot uses
            advanced AI to make law accessible to every Indian citizen.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-start p-8 transition-all duration-300 hover:bg-white/60 rounded-xl hover:shadow-lg border border-transparent hover:border-gold/20"
            >
              <div className="w-14 h-14 bg-coffee/5 text-coffee rounded-2xl flex items-center justify-center mb-6 group-hover:bg-coffee group-hover:text-ivory transition-colors duration-300 shadow-sm">
                {feature.icon}
              </div>

              <h3 className="font-serif text-xl font-bold text-charcoal mb-3">
                {feature.title}
              </h3>

              <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-6 w-full h-px bg-charcoal/10 group-hover:bg-gold/40 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
