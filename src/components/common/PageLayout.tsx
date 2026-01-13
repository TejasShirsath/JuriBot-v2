import React from "react";
import { HomeNavbar } from "../home/HomeNavbar";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface PageLayoutProps {
  sectionTitle?: string;
  children: React.ReactNode;
  backButton?: boolean;
  backPath?: string;
  className?: string;
  fixedHeight?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  sectionTitle,
  children,
  backButton = true,
  backPath = "/home",
  className = "",
  fixedHeight = false,
}) => {
  return (
    <div
      className={`${
        fixedHeight ? "h-dvh" : "min-h-dvh"
      } bg-ivory flex flex-col relative font-sans text-charcoal overflow-x-hidden`}
    >
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0 mix-blend-multiply"></div>

      <div className="relative z-10 w-full shrink-0">
        <HomeNavbar sectionTitle={sectionTitle} />
      </div>

      <main
        className={`grow flex flex-col px-4 md:px-12 pb-6 pt-6 max-w-7xl mx-auto w-full relative z-10 min-h-0 ${className}`}
      >
        {backButton && (
          <div className="mb-4 shrink-0">
            <Link
              to={backPath}
              className="inline-flex items-center gap-1 text-charcoal/50 hover:text-coffee group transition-colors"
            >
              <ChevronLeft size={18} />
              <span className="group-hover:translate-x-1 transition-transform">
                back
              </span>
            </Link>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};
