import React, { useRef, useEffect, useState, useCallback } from "react";
import type { AnimationState } from "../../hooks/useAnimationState";

import doingNothingVideo from "../../assets/animation/doing_nothing.webm";
import readingDocumentVideo from "../../assets/animation/reading_the_document.webm";
import talking1Video from "../../assets/animation/talking1.webm";
import talking2Video from "../../assets/animation/talking2.webm";
import talkingAfterReadingVideo from "../../assets/animation/talking_after_reading_document.webm";

interface LawyerAnimationProps {
  state: AnimationState;
  onReadingComplete?: () => void;
}

type VideoKey = "idle" | "reading" | "talking1" | "talking2" | "talkingAfterRead";

const getRandomTalkingKey = (): VideoKey => {
  return Math.random() > 0.5 ? "talking1" : "talking2";
};

const isTalkingKey = (key: VideoKey) => key === "talking1" || key === "talking2";

const VIDEO_SOURCES: Record<VideoKey, string> = {
  idle: doingNothingVideo,
  reading: readingDocumentVideo,
  talking1: talking1Video,
  talking2: talking2Video,
  talkingAfterRead: talkingAfterReadingVideo,
};

export const LawyerAnimation: React.FC<LawyerAnimationProps> = ({
  state,
  onReadingComplete,
}) => {
  const videoRefs = useRef<Partial<Record<VideoKey, HTMLVideoElement>>>({});
  const previousActiveVideo = useRef<VideoKey | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoKey>("idle");
  const [talkingAfterReadPhase, setTalkingAfterReadPhase] = useState<
    "intro" | "loop"
  >("intro");

  const setVideoRef = useCallback(
    (key: VideoKey) => (element: HTMLVideoElement | null) => {
      if (element) {
        videoRefs.current[key] = element;
      }
    },
    []
  );

  const activateVideo = useCallback((key: VideoKey) => {
    setActiveVideo(key);
  }, []);

  useEffect(() => {
    if (state === "idle") {
      activateVideo("idle");
      setTalkingAfterReadPhase("intro");
    } else if (state === "reading") {
      activateVideo("reading");
    } else if (state === "talking") {
      activateVideo(getRandomTalkingKey());
    } else if (state === "talking_after_read") {
      if (talkingAfterReadPhase === "intro") {
        activateVideo("talkingAfterRead");
      } else if (!isTalkingKey(activeVideo)) {
        activateVideo(getRandomTalkingKey());
      }
    }
  }, [state, talkingAfterReadPhase, activeVideo, activateVideo]);

  useEffect(() => {
    const previousKey = previousActiveVideo.current;
    if (previousKey && previousKey !== activeVideo) {
      const previousVideo = videoRefs.current[previousKey];
      if (previousVideo) {
        previousVideo.pause();
      }
    }

    const currentVideo = videoRefs.current[activeVideo];
    if (currentVideo) {
      if (previousKey !== activeVideo) {
        currentVideo.currentTime = 0;
      }
      currentVideo.play().catch(() => {});
    }

    previousActiveVideo.current = activeVideo;
  }, [activeVideo]);

  const handleVideoEnded = useCallback(
    (key: VideoKey) => {
      if (key !== activeVideo) {
        return;
      }

      if (state === "reading" && key === "reading") {
        onReadingComplete?.();
        return;
      }

      if (state === "talking" && isTalkingKey(key)) {
        activateVideo(getRandomTalkingKey());
        return;
      }

      if (state === "talking_after_read") {
        if (talkingAfterReadPhase === "intro" && key === "talkingAfterRead") {
          setTalkingAfterReadPhase("loop");
          activateVideo(getRandomTalkingKey());
          return;
        }

        if (talkingAfterReadPhase === "loop" && isTalkingKey(key)) {
          activateVideo(getRandomTalkingKey());
        }
      }
    },
    [
      activeVideo,
      state,
      talkingAfterReadPhase,
      onReadingComplete,
      activateVideo,
    ]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-ivory to-stone-100 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gold/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-coffee/20 rounded-full blur-3xl" />
      </div>

      {(Object.keys(VIDEO_SOURCES) as VideoKey[]).map((key) => (
        <video
          key={key}
          ref={setVideoRef(key)}
          src={VIDEO_SOURCES[key]}
          preload="auto"
          muted
          playsInline
          loop={key === "idle"}
          onEnded={() => handleVideoEnded(key)}
          className={`z-10 max-h-full max-w-full object-contain transition-none ${
            activeVideo === key
              ? "relative opacity-100"
              : "absolute opacity-0 pointer-events-none"
          }`}
        />
      ))}
    </div>
  );
};
