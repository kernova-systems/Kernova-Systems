import React, { useState } from 'react';
import { KernovaLogo } from './KernovaLogo';

export const BlackSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact-and-footer" className="relative w-full bg-black text-white overflow-hidden">
      {/* ============================================================
          TOP AREA: EXPANSIVE HERO CONTACT SECTION & TACTICAL JET
          - Clean architectural vertical scale (min-h-[80vh] py-14 sm:py-20 md:py-24)
          - Deep ambient radar glow & telemetry markers
          - Large, imposing fighter jet asset
          - Comprehensive dark-mode contact interface
          ============================================================ */}
      <div className="relative w-full min-h-[80vh] py-14 sm:py-20 md:py-24 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* BLANK ICE GLACIER BACKDROP */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <img
            src="/break-the-ice-frames/frame-001.webp?v=clean"
            alt="Blank Ice Glacier Surface"
            className="w-full h-full object-cover object-center filter brightness-[0.76] contrast-[108%]"
          />
          {/* Subtle radial and linear gradient overlay for immaculate contrast and legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 95% 75% at 50% 35%, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.78) 65%, rgba(0,0,0,0.96) 100%), linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.92) 100%)',
            }}
          />
        </div>

        {/* Ambient atmospheric backdrop glow */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-[1]">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#7abfff]/[0.10] rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-white/[0.04] rounded-full blur-[100px]" />
          {/* Subtle aerospace grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Tactical Header Badge */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-6 sm:mb-8 text-[10px] sm:text-xs font-mono tracking-[0.25em] text-[#7abfff] uppercase font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7abfff] animate-pulse" />
          <span>MISSION CONTROL // SYSTEM ENGAGEMENT</span>
        </div>

        {/* Imposing Architectural Manifesto */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mb-10 sm:mb-14">
          {/* 1. Header: WE BUILD THE JOURNEY. (H) */}
          <h2
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase text-white tracking-tight leading-[1.05] select-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textShadow: '0 4px 30px rgba(0,0,0,0.8)',
            }}
          >
            WE BUILD THE JOURNEY.
          </h2>

          {/* 2. Paragraphs (I) */}
          <div className="mt-4 sm:mt-6 space-y-2 max-w-2xl mx-auto">
            <p
              className="text-base sm:text-lg md:text-xl text-gray-200 font-medium leading-relaxed select-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              Your website is only the beginning.
            </p>
            <p
              className="text-sm sm:text-base md:text-lg text-gray-400 font-medium leading-relaxed select-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              We build the digital systems around your business. Connecting your website, applications, CRM, automation and AI into one experience.
            </p>
          </div>

          {/* 3. Header: AT SPEED. (H) */}
          <div className="mt-8 sm:mt-10">
            <h3
              className="text-2xl sm:text-4xl md:text-5xl font-bold uppercase text-[#7abfff] tracking-tight leading-tight select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              AT SPEED.
            </h3>

            {/* 4. Paragraph: From idea to working system... (I) */}
            <p
              className="mt-2 text-sm sm:text-base md:text-lg text-gray-300 font-medium leading-relaxed max-w-xl mx-auto select-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              From idea to working system, without months of waiting.
            </p>
          </div>

          {/* 5. Header: WE BUILD. YOU MOVE. (H) */}
          <div className="mt-8 sm:mt-10">
            <h3
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase text-white tracking-tight leading-tight select-none"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textShadow: '0 4px 25px rgba(0,0,0,0.8)',
              }}
            >
              WE BUILD. YOU MOVE.
            </h3>
          </div>

          {/* 6. Contact Button */}
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => {
                document.getElementById('contact-form-card')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#7abfff] hover:brightness-110 active:scale-95 text-black font-extrabold uppercase text-xs sm:text-sm md:text-base tracking-widest shadow-xl shadow-[#7abfff]/25 transition-all duration-300 cursor-pointer group"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                letterSpacing: '0.12em',
              }}
            >
              <span>CONTACT</span>
              <span className="transform group-hover:translate-y-0.5 transition-transform">↓</span>
            </button>
          </div>
        </div>

        {/* Full-Scale Tactical Dark-Mode Contact Form */}
        <div id="contact-form-card" className="relative z-10 w-full max-w-2xl mx-auto px-4 scroll-mt-12">
          <div className="relative rounded-2xl bg-[#090a0d]/90 border border-white/10 p-6 sm:p-10 md:p-12 shadow-2xl shadow-black/90 backdrop-blur-xl overflow-hidden">
            {/* Tactical Corner Crosshairs */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-[#7abfff]/50 pointer-events-none" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-[#7abfff]/50 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-[#7abfff]/50 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-[#7abfff]/50 pointer-events-none" />

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#7abfff]/20 border border-[#7abfff]/50 flex items-center justify-center text-[#7abfff] text-2xl mb-5 shadow-lg shadow-[#7abfff]/20">
                  ✓
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-cy-grand">
                  TRANSMISSION RECEIVED
                </h3>
                <p className="mt-3 text-sm text-gray-300 max-w-md leading-relaxed font-sans">
                  Your flight coordinates have been logged into our systems pipeline. Our executive team will dispatch a direct response within 240 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', message: '' });
                  }}
                  className="mt-6 px-6 py-2 rounded-full border border-white/20 text-xs font-mono tracking-wider uppercase text-white/80 hover:text-white hover:border-white transition-colors"
                >
                  TRANSMIT ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-mono tracking-widest uppercase text-white/70 font-semibold mb-2"
                  >
                    IDENTIFIER // FULL NAME OR ORGANIZATION
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe // Apex Clinical Systems"
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#7abfff] rounded-lg text-sm sm:text-base text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#7abfff]/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] font-mono tracking-widest uppercase text-white/70 font-semibold mb-2"
                  >
                    COMMUNICATION CHANNEL // WORK EMAIL
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. j.doe@apexclinical.com"
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#7abfff] rounded-lg text-sm sm:text-base text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#7abfff]/50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[11px] font-mono tracking-widest uppercase text-white/70 font-semibold mb-2"
                  >
                    MISSION SCOPE // PROJECT REQUIREMENTS
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Outline your speed requirements, target timeline, or architectural scope..."
                    className="w-full px-4 py-3.5 bg-black/60 border border-white/15 focus:border-[#7abfff] rounded-lg text-sm sm:text-base text-white placeholder-white/25 outline-none transition-all duration-200 focus:ring-1 focus:ring-[#7abfff]/50 resize-none overscroll-contain"
                  />
                </div>

                {/* Prominent High-Impact Launch Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 bg-[#7abfff] hover:brightness-110 active:scale-[0.98] text-black font-black uppercase text-xs sm:text-sm md:text-base rounded-lg transition-all cursor-pointer shadow-xl shadow-[#7abfff]/25 font-cta flex items-center justify-center gap-3 tracking-widest group"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                    }}
                  >
                    <span>{isSubmitting ? 'TRANSMITTING...' : 'CONTACT'}</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </form>
            )}

            {/* Direct Transmission Metadata */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-[10px] sm:text-xs font-mono text-white/40">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>DIRECT: ops@kernova.systems</span>
              </div>
              <div>ENCRYPTION: 4096-BIT RSA</div>
              <div>SLA: &lt; 240 MIN</div>
            </div>
          </div>
        </div>
      </div>


      {/* ============================================================
          FOOTER DETAILS (Black Ground)
          ============================================================ */}
      <footer className="relative w-full bg-black pt-12 pb-16 px-6 flex flex-col items-center justify-center z-10 border-t border-white/10">
        {/* Official Brand Logo from Playbook */}
        <div className="mb-3">
          <KernovaLogo variant="full" theme="dark" height={38} />
        </div>

        {/* Contrasting domain style from playbook Page 4 & 5 */}
        <p
          className="font-garamond text-xs sm:text-sm text-[#bbb9b9] mb-8 select-none"
          style={{ letterSpacing: '0.35em' }}
        >
          Kernova.systems
        </p>

        {/* Three Legal Pages Links */}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 md:gap-24 text-xs sm:text-sm text-[#bbb9b9] font-serif mb-10">
          <a href="#legal-1" className="hover:text-white transition-colors">
            Legal Pages
          </a>
          <a href="#legal-2" className="hover:text-white transition-colors">
            Legal Pages
          </a>
          <a href="#legal-3" className="hover:text-white transition-colors">
            Legal Pages
          </a>
        </div>

        {/* Social Icons (Instagram, X, YouTube, LinkedIn) */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 text-white/80">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            className="hover:text-white transition-opacity opacity-80 hover:opacity-100"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* X (formerly Twitter) */}
          <a
            href="https://x.com"
            aria-label="X (Twitter)"
            className="hover:text-white transition-opacity opacity-80 hover:opacity-100"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com"
            aria-label="YouTube"
            className="hover:text-white transition-opacity opacity-80 hover:opacity-100"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            aria-label="LinkedIn"
            className="hover:text-white transition-opacity opacity-80 hover:opacity-100"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </footer>
    </section>
  );
};
