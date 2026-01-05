import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  icon,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative h-64 w-full perspective-1000"
    >
      <div className="relative h-full w-full bg-white rounded-2xl border border-stone-200 p-6 transition-all duration-500 ease-out group-hover:shadow-[0_20px_50px_-12px_rgba(197,160,89,0.3)] group-hover:-translate-y-2 group-hover:border-gold/30 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl transition-all duration-700 group-hover:bg-gold/20 group-hover:scale-150"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-stone-50 rounded-xl text-charcoal group-hover:bg-coffee group-hover:text-ivory transition-colors duration-500 shadow-sm">
              {icon}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
              <ArrowUpRight className="text-gold" size={24} />
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-charcoal mb-2 group-hover:text-coffee transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-charcoal/60 leading-relaxed line-clamp-3 group-hover:text-charcoal/80 transition-colors duration-300">
              {description}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-gold/0 via-gold/50 to-gold/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
        </div>
      </div>
    </motion.div>
  );
};
