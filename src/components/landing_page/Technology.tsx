import React from "react";

export const Team: React.FC = () => {
  return (
    <section
      id="tech"
      className="py-20 md:py-32 px-6 md:px-12 bg-linear-to-b from-ivory to-[#EFEBE0]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="font-serif text-4xl md:text-6xl text-charcoal leading-tight">
            BUILT WITH CARE, <br />
            <span className="italic text-coffee/90">DESIGNED FOR CLARITY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="relative pl-8 border-l-2 border-coffee">
              <h3 className="font-serif text-3xl text-charcoal mb-2">
                Thoughtful Intelligence
              </h3>
              <p className="font-serif italic text-xl text-charcoal/60 mb-6">
                Technology with Responsibility
              </p>
            </div>

            <p className="font-sans text-charcoal/80 leading-loose">
              Juribot is built by a team focused on simplifying complex legal
              language through careful engineering and data-driven design. Every
              feature is crafted to prioritize accuracy, transparency, and ease
              of understanding, helping users confidently navigate legal
              documents without confusion or intimidation.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="bg-transparent border border-charcoal text-charcoal px-8 py-3 rounded-full hover:bg-charcoal hover:text-ivory transition-colors text-xs font-bold tracking-widest">
                READ OUR RESEARCH
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 lg:left-2/3 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/50 rounded-full blur-3xl -z-10"></div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600&h=700"
                alt="Technology-driven legal assistance"
                className="w-72 md:w-96 h-96 md:h-120 object-cover rounded-t-[10rem] rounded-b-lg shadow-2xl filter sepia-[0.1]"
              />

              <div className="absolute top-10 -left-6 md:-left-12 bg-ivory p-4 rounded-xl shadow-lg border border-gold/20 flex flex-col items-center animate-bounce-slow">
                <span className="font-serif text-3xl font-bold text-coffee">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-charcoal/60">
                  Privacy First
                </span>
              </div>

              <div className="absolute bottom-10 -right-6 md:-right-12 bg-ivory w-24 h-24 rounded-full shadow-lg border border-gold/20 flex items-center justify-center group hover:scale-110 transition-transform">
                <div className="text-center">
                  <span className="font-serif text-2xl font-bold text-coffee block">
                    24/7
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-charcoal/60 block">
                    Accessible
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
