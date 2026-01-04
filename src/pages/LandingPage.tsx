import React, { useState, useEffect } from "react";
import { Navbar } from "../components/landing_page/Navbar";
import { Hero } from "../components/landing_page/Hero";
import { PracticeAreas } from "../components/landing_page/Features";
import { Team } from "../components/landing_page/Technology";
import { FirmStats } from "../components/landing_page/Stats";
import { Footer } from "../components/landing_page/Footer";
import { LoadingScreen } from "../components/ui/LoadingScreen";

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 10);
    setTimeout(() => window.scrollTo(0, 0), 100);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-ivory">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-50 mix-blend-multiply"></div>

      <Navbar isScrolled={isScrolled} />

      <main className="grow z-10">
        <Hero startAnimation={!isLoading} />
        <PracticeAreas />
        <FirmStats />
        <Team />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
