import { motion } from "motion/react";
import { FileText, Calculator, Scale, Bot } from "lucide-react";
import { HomeNavbar } from "../components/home/HomeNavbar";
import { ModuleCard } from "../components/home/ModuleCard";

export default function HomePage() {
  const modules = [
    {
      title: "Document Intelligence",
      description:
        "Instantly summarize and interrogate legal documents in any language for immediate clarity and insight.",
      icon: <FileText size={24} />,
    },
    {
      title: "Cost Projection",
      description:
        "Calculate precise legal cost estimates based on case parameters to effectively plan your financial strategy.",
      icon: <Calculator size={24} />,
    },
    {
      title: "Verdict Analytics",
      description:
        "Leverage historical data to predict case outcomes and gain strategic advantages through pattern analysis.",
      icon: <Scale size={24} />,
    },
    {
      title: "Virtual Counsel",
      description:
        "Your always-on legal assistant for instant guidance, research, and answers to complex legal inquiries.",
      icon: <Bot size={24} />,
    },
  ];

  return (
    <div className="min-h-screen md:h-screen w-full bg-ivory flex flex-col relative overflow-x-hidden md:overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0 mix-blend-multiply"></div>

      <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-125 h-125 bg-coffee/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0 flex items-center justify-center overflow-hidden">
        <span className="font-serif text-[15vw] md:text-[20rem] text-charcoal whitespace-nowrap select-none">
          JURIBOT
        </span>
      </div>

      <HomeNavbar />

      <main className="grow flex flex-col items-center justify-center px-6 md:px-12 relative z-10 pb-12 pt-24 md:pt-0">
        <div className="max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20 relative"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/10 rounded-full blur-3xl"></div>
            <h1 className="font-serif text-5xl md:text-7xl text-charcoal mb-6 tracking-tight leading-none relative z-10">
              Legal Clarity.{" "}
              <span className="italic text-coffee block mt-2">Instantly.</span>
            </h1>
            <p className="font-sans text-charcoal/50 text-lg max-w-lg mx-auto leading-relaxed relative z-10">
              Select a specialized module below to harness the power of AI for
              your legal needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => (
              <ModuleCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                delay={0.4 + index * 0.1}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
