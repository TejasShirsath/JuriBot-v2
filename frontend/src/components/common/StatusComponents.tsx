import React from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-stone-200 rounded-3xl bg-white/50"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-100 rounded-full flex items-center justify-center mb-6 text-charcoal/20">
         <Icon size={32} className="md:w-10 md:h-10" />
      </div>
      {title && <h3 className="text-2xl font-serif text-charcoal mb-2">{title}</h3>}
      <p className="text-charcoal/50 max-w-sm">
         {description}
      </p>
    </motion.div>
  );
};

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl z-20"
    >
       <div className="w-16 h-16 border-4 border-stone-200 border-t-coffee rounded-full animate-spin mb-6"></div>
       <p className="text-xl font-serif text-charcoal">{message}</p>
    </motion.div>
  );
};
