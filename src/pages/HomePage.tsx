import { motion } from "motion/react";

export default function HomePage() {
  return (
    <div className="h-screen w-full bg-ivory flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[20rem] text-charcoal whitespace-nowrap">
          JURIBOT
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <img src="/logo.svg" alt="Juribot Logo" className="h-32 w-auto" />
        <h1 className="font-serif text-4xl text-charcoal">Welcome Home</h1>
      </motion.div>
    </div>
  );
}
