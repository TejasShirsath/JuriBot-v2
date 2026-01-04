import React, { useEffect, useRef } from "react";
import { ArrowDown, Play } from "lucide-react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { EncryptedText } from "../ui/EncryptedText";
import "@google/model-viewer";
// @ts-ignore
import justiceStatue from "../../assets/JusticeStatue.glb";
// @ts-ignore
import hammerAnimation from "../../assets/hammer.json";

interface HeroProps {
  startAnimation?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ startAnimation = true }) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (startAnimation) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.stop();
    }
  }, [startAnimation]);

  return (
    <section className="relative w-full min-h-screen bg-ivory flex flex-col items-center">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] select-none">
        <span className="font-serif text-[15rem] md:text-[25rem] leading-none text-charcoal tracking-tighter whitespace-nowrap">
          JURIBOT
        </span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-400 h-full min-h-screen flex flex-col md:block">
        {/* Heading */}
        <div className="pt-32 md:pt-24 text-center relative z-20 px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal leading-[1.1] md:leading-[0.95]">
            <span className="block font-medium">INTELLIGENT LEGAL</span>
            <EncryptedText
              text="COMPANION"
              className="block italic font-light mt-2 md:mt-4"
              encryptedClassName="text-charcoal/40"
              revealedClassName="text-charcoal"
              revealDelayMs={50}
              start={startAnimation}
            />
          </h1>
        </div>

        {/* 3D Model */}
        <div className="relative w-full h-[50vh] md:h-screen md:absolute md:inset-0 md:flex md:items-start md:justify-center z-10 pointer-events-none">
          <div className="w-full h-full md:w-247.5 md:h-247.5 lg:w-287.5 lg:h-287.5 relative md:mt-65 lg:mt-52">
            {/* @ts-ignore */}
            <model-viewer
              src={justiceStatue}
              alt="A 3D model of Lady Justice"
              auto-rotate
              camera-controls
              disable-zoom
              disable-pan
              interaction-prompt="none"
              tabIndex={-1}
              camera-orbit="0deg 90deg"
              min-camera-orbit="auto 90deg "
              max-camera-orbit="auto 90deg"
              shadow-intensity="1"
              style={{ width: "100%", height: "100%", pointerEvents: "auto" }}
            >
              <div slot="progress-bar"></div>
              {/* @ts-ignore */}
            </model-viewer>
          </div>
        </div>

        <div className="px-6 md:px-0 mt-8 md:mt-0 md:absolute md:bottom-12 md:left-12 lg:left-24 z-20 flex flex-col items-start md:max-w-xs">
          {/* Arrow */}
          <div className="hidden md:block animate-bounce mb-4 ml-1">
            <ArrowDown
              className="w-8 h-8 text-charcoal font-thin"
              strokeWidth={1}
            />
          </div>

          <p className="font-sans text-charcoal/80 text-sm md:text-base leading-relaxed mb-6">
            <span className="font-serif font-bold text-lg block mb-2 text-charcoal">
              Democratizing Justice
            </span>
            Instant answers to your legal doubts in Hindi, Tamil, Telugu, and
            more.
          </p>

          {/* Hammer */}
          <div className="mb-8 w-28 h-28 md:w-42 md:h-42 transform -rotate-12 hover:rotate-0 transition-transform duration-700">
            <Lottie
              lottieRef={lottieRef}
              animationData={hammerAnimation}
              loop={false}
              autoplay={false}
            />
          </div>
        </div>

        <div className="px-6 md:px-0 mt-8 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 md:right-12 lg:right-24 z-20 flex flex-col items-start md:items-end md:text-right md:max-w-xs">
          <p className="font-sans text-charcoal/80 text-sm md:text-base leading-relaxed mb-6">
            Upload complex contracts and get simple summaries instantly.
            Calculate case costs and understand clauses without the jargon.
          </p>

          {/* Badge */}
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full border border-charcoal/20 flex items-center justify-center animate-spin-slow hover:pause">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <path
                  id="curve"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="transparent"
                />
                <text className="text-[11px] font-bold uppercase tracking-widest fill-charcoal">
                  <textPath href="#curve">
                    Your Legal AI • Always Available •
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-6 h-6 text-coffee fill-coffee" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
