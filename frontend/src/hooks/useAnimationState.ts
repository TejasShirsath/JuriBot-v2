import { useState, useCallback } from "react";

export type AnimationState =
  | "idle"
  | "reading"
  | "talking"
  | "talking_after_read";

interface AnimationConfig {
  currentState: AnimationState;
  hasDocument: boolean;
}

export function useAnimationState() {
  const [config, setConfig] = useState<AnimationConfig>({
    currentState: "idle",
    hasDocument: false,
  });

  const startReading = useCallback(() => {
    setConfig((prev) => ({ ...prev, currentState: "reading" }));
  }, []);

  const finishReading = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      currentState: "talking_after_read",
      hasDocument: true,
    }));
  }, []);

  const startTalking = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      currentState: prev.hasDocument ? "talking_after_read" : "talking",
    }));
  }, []);

  const finishTalking = useCallback(() => {
    setConfig((prev) => ({ ...prev, currentState: "idle" }));
  }, []);

  const resetDocument = useCallback(() => {
    setConfig((prev) => ({ ...prev, hasDocument: false }));
  }, []);

  return {
    currentState: config.currentState,
    hasDocument: config.hasDocument,
    startReading,
    finishReading,
    startTalking,
    finishTalking,
    resetDocument,
  };
}
