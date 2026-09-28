import React from 'react';

export const IceMountainSection: React.FC = () => {
  return (
    <section
      id="ice-mountain-section"
      className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-6 py-28 sm:py-36 md:py-44 select-none overflow-hidden bg-gradient-to-b from-white via-white to-black text-black"
    >
      {/* ============================================================
          CONTENT ARENA: ARCHITECTED FOR EXTREMES
          ============================================================ */}
      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        <h2
          className="font-black text-black uppercase tracking-tight text-center leading-[0.92] font-cy-grand select-none"
          style={{
            fontFamily: "'Cy Grotesk v3 Grand', 'Archivo Black', 'Syne', sans-serif",
            fontSize: 'clamp(2.6rem, 6.5vw, 6.2rem)',
            letterSpacing: '-0.03em',
          }}
        >
          ARCHITECTED FOR EXTREMES
        </h2>

        <p
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-2xl text-black/85 font-medium tracking-wide max-w-xl sm:max-w-2xl mx-auto leading-relaxed select-none"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Clinical systems operating with zero degradation at the outer frontier of performance.
        </p>
      </div>
    </section>
  );
};
