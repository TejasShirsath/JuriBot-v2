import React, { type ComponentProps } from "react";
import clsx from "clsx";
import { motion } from "motion/react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
  motionProps?: ComponentProps<typeof motion.div>;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  animate = false,
  motionProps,
  ...props
}) => {
  const baseClasses =
    "bg-white p-6 rounded-3xl border border-stone-200 shadow-sm";

  if (animate) {
    return (
      <motion.div className={clsx(baseClasses, className)} {...motionProps}>
        {children}
      </motion.div>
    );
  }

  return (
    <div className={clsx(baseClasses, className)} {...props}>
      {children}
    </div>
  );
};
