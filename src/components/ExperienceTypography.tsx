import React from 'react';

interface ExperienceTypographyProps {
  className?: string;
}

export const ExperienceTypography: React.FC<ExperienceTypographyProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center select-none text-[#000000] ${className}`}
      style={{
        lineHeight: 0.82,
        letterSpacing: '-0.025em',
      }}
    >
      {/* First line: THIS IS AN (SH) - Syne ExtraBold 800, Center Aligned */}
      <div
        className="font-extrabold text-[#000000] tracking-tight select-none text-center w-full"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(1.75rem, 7.2vw, 8.8rem)',
          lineHeight: 0.84,
          transform: 'translateY(-0.04em)',
          letterSpacing: '-0.03em',
        }}
      >
        THIS IS AN
      </div>

      {/* Second line: EXPERIENCE (SH) - Syne ExtraBold 800, Center Aligned */}
      <div
        className="font-extrabold text-[#000000] tracking-tight select-none text-center w-full"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(1.75rem, 7.2vw, 8.8rem)',
          lineHeight: 0.84,
          marginTop: '-0.04em',
          letterSpacing: '-0.03em',
        }}
      >
        EXPERIENCE
      </div>
    </div>
  );
};
