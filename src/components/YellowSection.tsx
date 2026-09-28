import React, { useRef, useState, useEffect, useCallback } from 'react';
import { BreakTheIceSection } from './BreakTheIceSection';

export interface YellowSectionProps {
  onScrollToTop?: () => void;
  flightProgress?: number;
  horizontalProgress?: number;
  exitProgress?: number;
  breakProgress?: number;
  zoomProgress?: number;
  flyUpProgress?: number;
  isPopped?: boolean;
  onExploreNext?: () => void;
  children?: React.ReactNode;
}

export const YellowSection: React.FC<YellowSectionProps> = ({
  flightProgress,
  horizontalProgress = 0,
  exitProgress = 0,
  breakProgress = 0,
  zoomProgress = 0,
  flyUpProgress = 0,
  isPopped: externalIsPopped,
  onExploreNext,
  children,
}) => {
  // Pop in when flightProgress reaches clouds (>= 0.86)
  // Otherwise, default to popped in (true)
  const isPopped =
    externalIsPopped !== undefined
      ? externalIsPopped
      : flightProgress !== undefined
      ? flightProgress >= 0.86
      : true;

  // Smooth exit transition progress (0 = fully visible skylines, 1 = popped down to plain white)
  const exitP = Math.max(0, Math.min(1, exitProgress));
  // Smoothstep easing for physical natural momentum
  const exitEase = exitP * exitP * (3 - 2 * exitP);

  // Track tile measurement for seamless modulo wrapping
  // The mega panorama has natural dimensions 3824 x 436 (aspect ratio 8.77)
  const [tileWidth, setTileWidth] = useState<number>(3800);
  const containerRef = useRef<HTMLDivElement>(null);
  const topImgRef = useRef<HTMLImageElement>(null);
  const botImgRef = useRef<HTMLImageElement>(null);

  // Measure rendered tile width dynamically on mount, resize, or image load
  const updateTileWidth = useCallback(() => {
    if (topImgRef.current && topImgRef.current.clientWidth > 100) {
      setTileWidth(topImgRef.current.clientWidth);
    } else if (botImgRef.current && botImgRef.current.clientWidth > 100) {
      setTileWidth(botImgRef.current.clientWidth);
    } else if (containerRef.current) {
      // Fallback based on container height * natural aspect ratio (3824 / 436)
      const h = containerRef.current.clientHeight * 0.43;
      setTileWidth(Math.round(h * (3824 / 436)));
    }
  }, []);

  useEffect(() => {
    updateTileWidth();
    window.addEventListener('resize', updateTileWidth);
    return () => window.removeEventListener('resize', updateTileWidth);
  }, [updateTileWidth]);

  // Total horizontal journey distance in pixels across the dimension
  // 4800px represents an epic cinematic traverse through the continuous metropolis
  const totalTravelDistance = 4800;
  const currentOffsetPx = horizontalProgress * totalTravelDistance;

  // Calculate modulo offset for perfect mathematical seamless loop:
  // normalizedOffset is strictly within [0, tileWidth)
  const normalizedOffset =
    tileWidth > 0 ? ((currentOffsetPx % tileWidth) + tileWidth) % tileWidth : 0;

  // Array of 3 mega-tiles (each ~4000px rendered) spans over 12,000px for zero-gap infinity
  const tiles = [0, 1, 2];

  return (
    <section
      ref={containerRef}
      id="yellow-section"
      className="relative w-full h-full min-h-screen bg-white flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ============================================================
          GLACIER BACKDROP (BreakTheIceSection)
          - Fades in seamlessly as the buildings pop down on exit
          - Plays the 120-frame ice breaking animation directly on scroll!
          ============================================================ */}
      <div
        id="glacier-backdrop"
        className="absolute inset-0 w-full h-full select-none overflow-hidden bg-black"
        style={{
          opacity: exitP > 0 ? Math.min(1, exitP * 1.5) : 0,
          visibility: exitP > 0 ? 'visible' : 'hidden',
          transition: exitP > 0 ? 'none' : 'opacity 0.4s ease-out',
          zIndex: exitP >= 0.7 ? 30 : 0,
          pointerEvents: exitP >= 0.7 && breakProgress >= 0.35 ? 'auto' : 'none',
        }}
      >
        <BreakTheIceSection
          breakProgress={breakProgress}
          zoomProgress={zoomProgress}
          flyUpProgress={flyUpProgress}
        />
      </div>
      {/* ============================================================
          TOP SKYLINE: INVERTED CITY (Pops down from ceiling, pops away on exit)
          - Fills the upper portion of the frame (43vh)
          - Flush to top (top: 0) — ZERO extra space
          - Inner track translates horizontally with seamless modulo loop
          ============================================================ */}
      <div
        className="absolute top-0 left-0 w-full overflow-hidden select-none pointer-events-none z-10"
        style={{
          height: 'clamp(100px, 34vh, 44vh)',
          transform:
            exitP > 0
              ? `translate3d(0, ${-exitEase * 105}%, 0)`
              : isPopped
              ? 'translate3d(0, 0%, 0)'
              : 'translate3d(0, -105%, 0)',
          transition:
            exitP > 0
              ? 'none'
              : 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0s, opacity 0.5s ease-out 0s',
          opacity: exitP > 0 ? Math.max(0, 1 - exitP * 1.5) : isPopped ? 1 : 0,
          visibility: exitP >= 0.99 ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex flex-row h-full w-max pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${-normalizedOffset}px, 0, 0)`,
          }}
        >
          {tiles.map((i) => (
            <img
              key={`top-tile-${i}`}
              ref={i === 0 ? topImgRef : undefined}
              src="/inception-city-top-v2.png"
              alt="Inception Inverted City Skyline"
              onLoad={updateTileWidth}
              className="h-full w-auto block flex-shrink-0 select-none pointer-events-none"
              style={{
                height: '100%',
                width: 'auto',
                aspectRatio: '3824 / 436',
                filter: 'grayscale(100%) brightness(0.84) contrast(106%)',
              }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* ============================================================
          MIDDLE ARENA: HORIZON SLIT FOR TYPOGRAPHY & TRAVERSAL HUD
          - Pure luminous WHITE background (#FFFFFF)
          - Centered in the middle horizon gap between the two skylines
          - Stagger Phase 3: Emerges smoothly after both skylines (delay: 0.28s)
          - Smoothly fades and scales away on exit
          ============================================================ */}
      <div
        className="relative w-full flex-1 flex flex-col items-center justify-center px-6 z-20 pointer-events-auto"
        style={{
          transform:
            exitP > 0
              ? `scale(${1 - exitEase * 0.08}) translate3d(0, ${exitEase * 20}px, 0)`
              : isPopped
              ? 'scale(1) translate3d(0, 0, 0)'
              : 'scale(0.92) translate3d(0, 15px, 0)',
          opacity: exitP > 0 ? Math.max(0, 1 - exitP * 2.2) : isPopped ? 1 : 0,
          transition:
            exitP > 0
              ? 'none'
              : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.28s, opacity 0.6s ease-out 0.28s',
          visibility: exitP >= 0.55 ? 'hidden' : 'visible',
        }}
      >
        {children || (
          <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center select-none px-4 w-full">
            {/* Horizontal Narrative Multi-Step Display (Responsive heights and scaling) */}
            <div className="relative w-full min-h-[140px] sm:min-h-[170px] md:min-h-[220px] flex items-center justify-center">
              {[
                {
                  id: 'step-1',
                  header: 'THEY FIND YOU.',
                  lines: ['Your website gets the attention.', 'Then the journey begins.'],
                },
                {
                  id: 'step-2',
                  header: 'THEY REACH OUT.',
                  lines: ['A form is filled.', 'A message is sent. A call is made.'],
                },
                {
                  id: 'step-3',
                  header: 'THEN IT SPLITS.',
                  lines: [
                    'Website. WhatsApp. Email.',
                    'Spreadsheets. People. Different systems.',
                  ],
                },
                {
                  id: 'step-4',
                  header: 'AND THE LEAD DOES NOTHING.',
                  lines: [
                    "Not because they weren't interested.",
                    'Because nothing moved them forward.',
                  ],
                },
              ].map((item, idx) => {
                // Compute entrance, wide stationary delay plateau, and exit:
                const slotStart = idx * 0.25;
                const slotEnd = (idx + 1) * 0.25;

                let stepOpacity = 0;
                let stepX = 0;
                let isVisible = false;

                if (horizontalProgress >= slotStart - 0.04 && horizontalProgress <= slotEnd + 0.04) {
                  const localT = Math.max(0, Math.min(1, (horizontalProgress - slotStart) / 0.25));

                  if (idx === 0) {
                    if (localT < 0.82) {
                      // 1. Stationary Scroll Delay: Background scrolls, text does NOT move or change!
                      stepOpacity = 1;
                      stepX = 0;
                      isVisible = true;
                    } else {
                      const exitT = (localT - 0.82) / 0.18;
                      stepOpacity = Math.max(0, 1 - exitT);
                      stepX = -exitT * 35;
                      isVisible = stepOpacity > 0.01;
                    }
                  } else if (idx === 3) {
                    if (localT < 0.18) {
                      const enterT = localT / 0.18;
                      stepOpacity = Math.min(1, enterT);
                      stepX = (1 - enterT) * 35;
                      isVisible = stepOpacity > 0.01;
                    } else {
                      // Stationary Scroll Delay until exit phase
                      stepOpacity = 1;
                      stepX = 0;
                      isVisible = true;
                    }
                  } else {
                    if (localT < 0.18) {
                      const enterT = localT / 0.18;
                      stepOpacity = Math.min(1, enterT);
                      stepX = (1 - enterT) * 35;
                      isVisible = stepOpacity > 0.01;
                    } else if (localT > 0.82) {
                      const exitT = (localT - 0.82) / 0.18;
                      stepOpacity = Math.max(0, 1 - exitT);
                      stepX = -exitT * 35;
                      isVisible = stepOpacity > 0.01;
                    } else {
                      // Stationary Scroll Delay: Background scrolls, text does NOT move or change!
                      stepOpacity = 1;
                      stepX = 0;
                      isVisible = true;
                    }
                  }
                } else if (idx === 0 && horizontalProgress <= 0) {
                  stepOpacity = 1;
                  stepX = 0;
                  isVisible = true;
                } else if (idx === 3 && horizontalProgress >= 1) {
                  stepOpacity = 1;
                  stepX = 0;
                  isVisible = true;
                }

                return (
                  <div
                    key={item.id}
                    className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-150"
                    style={{
                      opacity: stepOpacity,
                      transform: `translate3d(${stepX}px, 0, 0)`,
                      visibility: isVisible ? 'visible' : 'hidden',
                      pointerEvents: isVisible ? 'auto' : 'none',
                    }}
                  >
                    {/* Header: Syne Bold 700 (H) - Responsive Scaling */}
                    <h3
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-[52px] xl:text-[60px] font-bold uppercase tracking-wider text-black select-none leading-tight"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.header}
                    </h3>

                    {/* Paragraph lines: Inter Medium 500 (I) - Responsive Scaling */}
                    <div className="mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-2">
                      {item.lines.map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className="text-sm sm:text-base md:text-xl lg:text-[25px] xl:text-[28px] text-black/90 font-medium leading-relaxed select-none"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          BOTTOM SKYLINE: UPRIGHT CITY (Pops up from floor, pops down on exit)
          - Fills the lower portion of the frame (43vh)
          - Flush to bottom (bottom: 0) all the way to the edge of the frame
          - Inner track translates horizontally with seamless modulo loop
          ============================================================ */}
      <div
        className="absolute bottom-0 left-0 w-full overflow-hidden select-none pointer-events-none z-10"
        style={{
          height: 'clamp(100px, 34vh, 44vh)',
          transform:
            exitP > 0
              ? `translate3d(0, ${exitEase * 105}%, 0)`
              : isPopped
              ? 'translate3d(0, 0%, 0)'
              : 'translate3d(0, 105%, 0)',
          transition:
            exitP > 0
              ? 'none'
              : 'transform 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.14s, opacity 0.5s ease-out 0.14s',
          opacity: exitP > 0 ? Math.max(0, 1 - exitP * 1.5) : isPopped ? 1 : 0,
          visibility: exitP >= 0.99 ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex flex-row h-full w-max pointer-events-none will-change-transform"
          style={{
            transform: `translate3d(${-normalizedOffset}px, 0, 0)`,
          }}
        >
          {tiles.map((i) => (
            <img
              key={`bot-tile-${i}`}
              ref={i === 0 ? botImgRef : undefined}
              src="/inception-city-bottom-v2.png"
              alt="Inception Upright City Skyline"
              onLoad={updateTileWidth}
              className="h-full w-auto block flex-shrink-0 select-none pointer-events-none"
              style={{
                height: '100%',
                width: 'auto',
                aspectRatio: '3824 / 436',
                filter: 'grayscale(100%) brightness(0.84) contrast(106%)',
              }}
              draggable={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
