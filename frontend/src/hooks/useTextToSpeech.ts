import { useCallback, useRef, useEffect, useState } from "react";

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
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  callbacksRef.current = { onStart, onEnd };

  // Load voices when they become available
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    // Load voices immediately if available
    loadVoices();

    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      // Check if speech synthesis is supported
      if (!("speechSynthesis" in window)) {
        console.error("Speech synthesis not supported");
        callbacksRef.current.onEnd?.();
        return;
      }

      // Cancel any ongoing speech
      speechSynthesis.cancel();

      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        // Set voice to female voice
        const voices = speechSynthesis.getVoices();
        
        if (voices.length > 0) {
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

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event);
          callbacksRef.current.onEnd?.();
        };

        // Resume speech synthesis if paused (fixes iOS/Safari issue)
        speechSynthesis.resume();
        speechSynthesis.speak(utterance);
      }, 100);
    },
    [rate, pitch, volume, voicesLoaded]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
  }, []);

  const isSpeaking = useCallback(() => {
    return speechSynthesis.speaking;
  }, []);

  // Initialize speech synthesis (call on user interaction)
  const initialize = useCallback(() => {
    if ("speechSynthesis" in window) {
      // Trigger voice loading
      speechSynthesis.getVoices();
      // Play silent utterance to initialize
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak, stop, isSpeaking, initialize };
}
