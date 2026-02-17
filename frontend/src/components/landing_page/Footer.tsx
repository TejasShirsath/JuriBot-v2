import React from "react";
import { ArrowRight } from "lucide-react";
import { PixelatedCanvas } from "../common/PixelatedCanvas";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  return (
    <footer id="footer">
      {/* Benefits Section */}
      <div className="bg-charcoal text-ivory py-24 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          <div className="lg:col-span-4 space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl leading-tight">
              WHAT BENEFITS <br />
              <span className="italic text-gold">WILL YOU GET</span> <br />
              FROM JURIBOT?
            </h2>
            <p className="font-sans text-ivory/60 leading-relaxed max-w-sm">
              We provide high quality AI legal assistance for you with the best
              integrated technology and verified legal data.
            </p>
            <div className="pt-4">
              <Link to="/auth">
                <button className="relative overflow-hidden group bg-ivory text-charcoal px-8 py-3 font-bold tracking-widest text-xs transition-transform hover:scale-105">
                  <span className="relative z-10">TRY JURIBOT NOW</span>
                  <div className="absolute inset-0 bg-gold transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out"></div>
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center my-12 lg:my-0">
            <div className="relative w-72 h-96">
              <div
                className="absolute inset-0 bg-[#EFEBE0] transform rotate-3 shadow-2xl transition-transform duration-500 hover:rotate-0"
                style={{
                  clipPath: "polygon(5% 5%, 100% 0%, 95% 95%, 0% 100%)",
                  borderRadius: "2px",
                }}
              ></div>
              <div className="absolute inset-4 overflow-hidden">
                <PixelatedCanvas
                  src="/logo_gold.svg"
                  width={260}
                  height={400}
                  cellSize={3}
                  dotScale={0.9}
                  shape="square"
                  backgroundColor="#3E2723"
                  dropoutStrength={0.2}
                  interactive
                  distortionStrength={3}
                  distortionRadius={80}
                  distortionMode="swirl"
                  followSpeed={0.2}
                  jitterStrength={4}
                  jitterSpeed={4}
                  sampleAverage
                  tintColor="#3E2723"
                  tintStrength={0.2}
                  objectFit="contain"
                  className="rounded-xl border border-neutral-800 shadow-lg w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold text-charcoal p-4 shadow-xl max-w-35">
                <p className="font-serif text-sm font-bold leading-tight">
                  "Clarity before decisions."
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-12 pl-0 lg:pl-12">
            <div>
              <h3 className="font-serif text-xl mb-3 text-ivory">
                Instant Analysis
              </h3>
              <p className="font-sans text-sm text-ivory/50 leading-relaxed">
                Upload complex legal documents and get immediate, simplified
                summaries. No waiting for appointments.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-3 text-ivory">
                Regional Support
              </h3>
              <p className="font-sans text-sm text-ivory/50 leading-relaxed">
                You have a right to understand the law in your own language. We
                support Hindi, Tamil, Telugu, and more.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-3 text-ivory">
                24/7 Availability
              </h3>
              <p className="font-sans text-sm text-ivory/50 leading-relaxed">
                Our AI team is available round the clock to provide help, cost
                estimates, and preliminary legal guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-ivory text-charcoal pt-24 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center mb-24">
            <h2 className="font-serif text-3xl md:text-4xl mb-10">
              NEED LEGAL HELP?
            </h2>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-8">
              <div className="relative">
                <button className="border border-charcoal/20 px-8 py-3 bg-white hover:bg-charcoal hover:text-ivory transition-colors duration-300 text-xs font-bold tracking-widest uppercase relative z-10">
                  Contact Us
                </button>
                <div className="absolute top-1 left-1 w-full h-full border border-charcoal/10 z-0"></div>
              </div>

              <div className="hidden md:block w-24 h-px bg-charcoal"></div>
              <ArrowRight className="md:hidden w-6 h-6 text-charcoal/50" />

              <span className="font-serif text-3xl md:text-4xl italic">
                LET'S CHAT
              </span>
            </div>

            <a
              href="mailto:hello@juribot.in"
              className="font-serif text-[38px] md:text-7xl lg:text-8xl hover:text-coffee transition-colors duration-300 break-all md:break-normal"
            >
              HELLO@JURIBOT.IN
            </a>
          </div>

          {/* Footer */}
          <div className="border-t border-charcoal/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-serif text-xl font-bold tracking-wide flex items-center gap-2">
              JURIBOT
              <span className="text-[9px] bg-charcoal text-ivory px-1.5 py-0.5 rounded font-sans tracking-widest">
                AI
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-widest text-charcoal/60">
              <a href="#" className="hover:text-charcoal transition-colors">
                HOME
              </a>
              <a
                href="#features"
                className="hover:text-charcoal transition-colors"
              >
                FEATURES
              </a>
              <a href="#tech" className="hover:text-charcoal transition-colors">
                TECHNOLOGY
              </a>
              <a
                href="#footer"
                className="hover:text-charcoal transition-colors"
              >
                CONTACTS
              </a>
            </div>

            <a
              href="https://github.com/mohitooo28/JuriBot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center md:text-right text-[12px] text-charcoal/40 font-sans leading-tight hover:text-charcoal transition-colors block"
            >
              <p>&copy; {new Date().getFullYear()} Developed by Mohit.</p>
              <p>Group 09 | BEIT-2 ACE</p>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
