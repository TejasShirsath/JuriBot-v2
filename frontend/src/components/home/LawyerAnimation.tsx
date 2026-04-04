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

  // Play a specific video (restart if same video)
  const playVideo = useCallback((key: VideoKey) => {
    const video = videoRefs.current[key];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, []);

  // Pause all videos except the active one
  const pauseOtherVideos = useCallback((exceptKey: VideoKey) => {
    (Object.keys(VIDEO_SOURCES) as VideoKey[]).forEach((key) => {
      if (key !== exceptKey) {
        const video = videoRefs.current[key];
        if (video) {
          video.pause();
        }
      }
    });
  }, []);

  // Determine which video should be active based on state
  useEffect(() => {
    if (state === "idle") {
      setActiveVideo("idle");
      pauseOtherVideos("idle");
      playVideo("idle");
      setTalkingAfterReadPhase("intro");
    } else if (state === "reading") {
      setActiveVideo("reading");
      pauseOtherVideos("reading");
      playVideo("reading");
    } else if (state === "reading_frozen") {
      // Keep reading video visible but paused on last frame - do nothing
    } else if (state === "talking") {
      const talkingKey = getRandomTalkingKey();
      setActiveVideo(talkingKey);
      pauseOtherVideos(talkingKey);
      playVideo(talkingKey);
    } else if (state === "talking_after_read") {
      if (talkingAfterReadPhase === "intro") {
        setActiveVideo("talkingAfterRead");
        pauseOtherVideos("talkingAfterRead");
        playVideo("talkingAfterRead");
      }
    }
    // talkingAfterReadPhase intentionally excluded - only react to state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pauseOtherVideos, playVideo]);

  const handleVideoEnded = useCallback(
    (key: VideoKey) => {
      if (key !== activeVideo) {
        return;
      }

      // Reading animation ends - freeze on last frame, notify parent
      if (key === "reading") {
        onReadingComplete?.();
        // Don't set new video - stays frozen on last frame
        return;
      }

      // Talking animations: loop randomly while in talking state
      if (state === "talking" && isTalkingKey(key)) {
        const nextKey = getRandomTalkingKey();
        setActiveVideo(nextKey);
        pauseOtherVideos(nextKey);
        playVideo(nextKey);
        return;
      }

      // talking_after_read: first play intro, then loop talking
      if (state === "talking_after_read") {
        if (talkingAfterReadPhase === "intro" && key === "talkingAfterRead") {
          setTalkingAfterReadPhase("loop");
          const nextKey = getRandomTalkingKey();
          setActiveVideo(nextKey);
          pauseOtherVideos(nextKey);
          playVideo(nextKey);
          return;
        }

        if (talkingAfterReadPhase === "loop" && isTalkingKey(key)) {
          const nextKey = getRandomTalkingKey();
          setActiveVideo(nextKey);
          pauseOtherVideos(nextKey);
          playVideo(nextKey);
          return;
        }
      }
    },
    [activeVideo, state, talkingAfterReadPhase, onReadingComplete, pauseOtherVideos, playVideo]
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-linear-to-b from-ivory to-stone-100 overflow-hidden">
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
