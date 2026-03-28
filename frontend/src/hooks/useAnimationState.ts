import { useState, useCallback } from "react";

export type AnimationState =
  | "idle"
  | "reading"
  | "reading_frozen"
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

  const freezeReading = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      currentState: "reading_frozen",
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
    setConfig((prev) => ({ ...prev, hasDocument: false, currentState: "idle" }));
  }, []);

  return {
    currentState: config.currentState,
    hasDocument: config.hasDocument,
    startReading,
    freezeReading,
    startTalking,
    finishTalking,
    resetDocument,
  };
}
