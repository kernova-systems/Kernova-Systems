import React from 'react';

interface PlaceholderGridProps {
  variant: 'dark' | 'light';
  title?: string;
  subtitle?: string;
  width?: string;
  height?: string;
  className?: string;
}

export const PlaceholderGrid: React.FC<PlaceholderGridProps> = ({
  variant,
  title = 'ASSET PLACEHOLDER',
  subtitle = 'Grid Wireframe Area',
  width = '100%',
  height = '100%',
  className = '',
}) => {
  const isDark = variant === 'dark';
  const strokeColor = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.14)';
  const crossColor = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.3)';
  const textColor = isDark ? '#bbb9b9' : '#555555';
  const tagBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const patternId = `grid-pattern-${variant}-${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden border border-dashed select-none transition-all ${className}`}
      style={{
        width,
        height,
        borderColor: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.24)',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
      }}
    >
      {/* Background SVG Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke={strokeColor}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        {/* Fill with grid pattern */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* Diagonal placeholder wireframe lines */}
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke={strokeColor}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <line
          x1="100%"
          y1="0"
          x2="0"
          y2="100%"
          stroke={strokeColor}
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Corner Registration Marks (L-shapes) */}
      <div
        className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 pointer-events-none"
        style={{ borderColor: crossColor }}
      />
      <div
        className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 pointer-events-none"
        style={{ borderColor: crossColor }}
      />
      <div
        className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 pointer-events-none"
        style={{ borderColor: crossColor }}
      />
      <div
        className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 pointer-events-none"
        style={{ borderColor: crossColor }}
      />

      {/* Center Label for the Designer */}
      <div
        className="relative z-10 px-4 py-2 rounded flex flex-col items-center gap-1 backdrop-blur-xs text-center"
        style={{
          backgroundColor: tagBg,
          border: `1px solid ${crossColor}`,
        }}
      >
        <span
          className="text-xs sm:text-sm font-mono tracking-widest uppercase font-bold"
          style={{ color: isDark ? '#fefefe' : '#000000' }}
        >
          {title}
        </span>
        {subtitle && (
          <span
            className="text-[10px] sm:text-xs font-mono tracking-wider uppercase opacity-75"
            style={{ color: textColor }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
