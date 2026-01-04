import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  isScrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "#" },
    { name: "FEATURES", href: "#features" },
    { name: "TECHNOLOGY", href: "#tech" },
    { name: "CONTACT", href: "#footer" },
  ];

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-300 ease-in-out px-6 md:px-12 py-4 ${
        isScrolled
          ? "bg-ivory/95 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="shrink-0">
          <span className="font-serif text-2xl font-bold tracking-wide text-charcoal flex items-center gap-2">
            JURIBOT
            <span className="text-[10px] bg-coffee text-ivory px-2 py-0.5 rounded-full font-sans tracking-widest">
              AI
            </span>
          </span>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex space-x-8 lg:space-x-12 items-center">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-bold tracking-widest text-charcoal/80 hover:text-coffee transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Link to="/auth">
            <button className="bg-coffee text-ivory px-8 py-3 rounded-tr-xl rounded-bl-xl text-xs font-bold tracking-widest hover:bg-charcoal transition-all duration-300 transform hover:scale-105 shadow-lg border border-transparent hover:border-gold/30 cursor-pointer">
              GET STARTED
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-charcoal focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-ivory border-b border-coffee/10 shadow-xl p-6 flex flex-col space-y-4 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold tracking-widest text-charcoal hover:text-gold"
            >
              {link.name}
            </a>
          ))}
          <Link to="/auth" className="w-full">
            <button className="bg-coffee text-ivory px-6 py-3 w-full text-xs font-bold tracking-widest mt-4 cursor-pointer">
              GET STARTED
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};
