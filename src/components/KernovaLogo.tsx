import React from 'react';

export interface KernovaLogoProps {
  className?: string;
  variant?: 'full' | 'wordmark' | 'symbol';
  theme?: 'dark' | 'light';
  height?: number | string;
  alt?: string;
}

export const KernovaLogo: React.FC<KernovaLogoProps> = ({
  className = '',
  variant = 'full',
  theme = 'dark',
  height,
  alt = 'Kernova Systems',
}) => {
  // Select matching authentic asset from the Kernova Visual Playbook with 4K resolution
  const assetMap = {
    dark: {
      full: '/brand/kernova-full-logo-white-4k.png',
      wordmark: '/brand/kernova-logo-white-4k.png',
      symbol: '/brand/kernova-symbol-white-4k.png',
    },
    light: {
      full: '/brand/kernova-full-logo-black-4k.png',
      wordmark: '/brand/kernova-logo-black-4k.png',
      symbol: '/brand/kernova-symbol-black-4k.png',
    },
  };

  const asset1xMap = {
    dark: {
      full: '/brand/kernova-full-logo-white.png',
      wordmark: '/brand/kernova-logo-white.png',
      symbol: '/brand/kernova-symbol-white.png',
    },
    light: {
      full: '/brand/kernova-full-logo-black.png',
      wordmark: '/brand/kernova-logo-black.png',
      symbol: '/brand/kernova-symbol-black.png',
    },
  };

  const assetSrc = assetMap[theme][variant];
  const asset1x = asset1xMap[theme][variant];

  // Specific aspect ratios based on visual playbook extractions:
  // symbol: 354/364 (~0.97)
  // wordmark: 758/364 (~2.08)
  // full: 768/364 (~2.11)
  const defaultHeight = {
    full: 'clamp(54px, 7.5vw, 105px)',
    wordmark: 'clamp(48px, 6.8vw, 95px)',
    symbol: 'clamp(44px, 6.0vw, 84px)',
  }[variant];

  return (
    <div className={`inline-flex items-center justify-center select-none pointer-events-auto ${className}`}>
      <img
        src={assetSrc}
        srcSet={`${asset1x} 1x, ${assetSrc} 2x`}
        alt={alt}
        className="w-auto max-w-full object-contain filter drop-shadow-sm transition-opacity duration-200"
        style={{
          height: height || defaultHeight,
          imageRendering: 'auto',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
        }}
        loading="eager"
        decoding="sync"
      />
    </div>
  );
};
