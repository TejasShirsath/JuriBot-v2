import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const languages = [
  { text: "Hello", lang: "English" },
  { text: "नमस्कार", lang: "Marathi" },
  { text: "നമസ്കാരം", lang: "Malayalam" },
  { text: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ", lang: "Punjabi" },
  { text: "নমস্কার", lang: "Bengali" },
  { text: "नमस्ते", lang: "Hindi" },
  { text: "வணக்கம்", lang: "Tamil" },
  { text: "నమస్కారం", lang: "Telugu" },
  { text: "ನಮಸ್ಕಾರ", lang: "Kannada" },
  { text: "آداب", lang: "Urdu" },
  { text: "नमस्कारः", lang: "Sanskrit" },
  { text: "નમસ્તે", lang: "Gujarati" },
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Cycle through languages
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % languages.length);
    }, 120);

    // Start exit sequence
    const timer = setTimeout(() => {
      clearInterval(interval);
      setIsExiting(true);
      // Hide text slightly before curtains open or as they open
      setTimeout(() => setShowContent(false), 200);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col pointer-events-none">
      {/* Top Half */}
      <motion.div
        initial={{ y: 0 }}
        animate={isExiting ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} // Custom bezier for smooth "fast" feel
        className="absolute top-0 left-0 w-full h-1/2 bg-charcoal z-20"
      />

      {/* Bottom Half */}
      <motion.div
        initial={{ y: 0 }}
        animate={isExiting ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => {
          if (isExiting) onComplete();
        }}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-charcoal z-20"
      />

      {/* Text Content */}
      <AnimatePresence>
        {showContent && !isExiting && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center">
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.1 }}
                className="text-2xl md:text-4xl font-serif text-ivory font-light min-w-[200px] text-center"
              >
                {languages[index].text}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
