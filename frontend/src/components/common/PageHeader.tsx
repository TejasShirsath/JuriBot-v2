import React from "react";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  tag: string;
  title: string;
  highlightedTitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ icon: Icon, tag, title, highlightedTitle }) => {
  return (
    <header className="mb-6 text-center md:text-left shrink-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coffee/5 text-coffee text-xs font-bold tracking-widest uppercase mb-2"
      >
        <Icon size={14} />
        {tag}
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-serif text-3xl md:text-4xl text-charcoal mb-2"
      >
        {title} <span className="text-coffee italic">{highlightedTitle}</span>
      </motion.h1>
    </header>
  );
};
