import { useCallback, useRef } from "react";

interface UseTTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useTextToSpeech(options: UseTTSOptions = {}) {
  const { rate = 1, pitch = 1.2, volume = 1, onStart, onEnd } = options;
  const callbacksRef = useRef({ onStart, onEnd });
  callbacksRef.current = { onStart, onEnd };

  const speak = useCallback(
    (text: string) => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice to female voice
      const voices = speechSynthesis.getVoices();
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("woman") ||
          (voice.lang.includes("en") && voice.name.toLowerCase().includes("zira")) ||
          (voice.lang.includes("en") && voice.name.toLowerCase().includes("aria"))
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (voices.length > 0) {
        // Fallback: use the second voice (often female) or first available
        utterance.voice = voices[Math.min(1, voices.length - 1)];
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      utterance.onstart = () => {
        callbacksRef.current.onStart?.();
      };

      utterance.onend = () => {
        callbacksRef.current.onEnd?.();
      };

      utterance.onerror = () => {
        callbacksRef.current.onEnd?.();
      };

      speechSynthesis.speak(utterance);
    },
    [rate, pitch, volume]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  const isSpeaking = useCallback(() => {
    return speechSynthesis.speaking;
  }, []);

  return { speak, stop, isSpeaking };
}
