import React from 'react';

export const BlueSection: React.FC = () => {
  return (
    <section
      id="blue-section"
      className="relative w-full min-h-[160vh] bg-black text-white overflow-hidden select-none"
    >
      {/* ============================================================
          GLACIER BACKGROUND IMAGE (Replaces former solid blue section)
          Matches Frame 120 of Transition 2 seamlessly
          ============================================================ */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <img
          src="/glacier-background.webp"
          alt="Arctic Glacier Ice Mountain"
          className="w-full h-full object-cover object-top filter brightness-95 contrast-105"
        />
        {/* Soft atmospheric overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black pointer-events-none" />
      </div>

      {/* ============================================================
          CONTENT ARENA: ARCHITECTED FOR EXTREMES
          ============================================================ */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between px-6 pt-28 pb-20 max-w-6xl mx-auto">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/40 backdrop-blur-md shadow-lg shadow-black/40 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#7abfff] animate-pulse" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#7abfff]">
            Glacial Intelligence // Cold Architecture
          </span>
        </div>

        {/* Center Main Headline */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-12">
          <h2
            className="font-black text-white uppercase tracking-tight text-center leading-[0.92] font-cy-grand select-none"
            style={{
              fontFamily: "'Cy Grotesk v3 Grand', 'Archivo Black', 'Syne', sans-serif",
              fontSize: 'clamp(2.6rem, 6.2vw, 5.8rem)',
              letterSpacing: '-0.03em',
              textShadow: '0 4px 30px rgba(0,0,0,0.7)',
            }}
          >
            ARCHITECTED FOR EXTREMES
          </h2>

          <p
            className="mt-6 text-sm sm:text-base md:text-lg text-white/90 font-medium tracking-wide max-w-xl mx-auto leading-relaxed select-none drop-shadow-md"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Clinical systems operating with zero degradation at the outer frontier of performance.
          </p>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/15">
          <div className="p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md flex flex-col items-start">
            <span className="text-3xl lg:text-4xl font-black text-white font-cy-grand">99.999%</span>
            <span className="mt-1 text-xs font-bold text-[#7abfff] uppercase tracking-wider">Zero-Fault Uptime</span>
            <p className="mt-2 text-xs text-white/70 leading-normal">
              Autonomous failover protocols designed for relentless continuous operations.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md flex flex-col items-start">
            <span className="text-3xl lg:text-4xl font-black text-white font-cy-grand">&lt; 1.2ms</span>
            <span className="mt-1 text-xs font-bold text-[#7abfff] uppercase tracking-wider">Cold-Array Latency</span>
            <p className="mt-2 text-xs text-white/70 leading-normal">
              Deterministic routing engines operating across distributed neural edge nodes.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md flex flex-col items-start">
            <span className="text-3xl lg:text-4xl font-black text-white font-cy-grand">256-BIT</span>
            <span className="mt-1 text-xs font-bold text-[#7abfff] uppercase tracking-wider">Quantum Resistant</span>
            <p className="mt-2 text-xs text-white/70 leading-normal">
              End-to-end cryptographic integrity certified for clinical telemetry records.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

