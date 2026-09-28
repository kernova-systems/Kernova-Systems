import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { CenterStageMockup } from './CenterStageMockup';
import { CameraFlightCanvas } from './CameraFlightCanvas';
import { KernovaLogo } from './KernovaLogo';
import { ExperienceTypography } from './ExperienceTypography';
import { YellowSection } from './YellowSection';

export interface HeroTransitionProps {
  progress?: number;
  grassProgress?: number;
  onProgressChange?: (progress: number) => void;
  onScrollToNext?: () => void;
  perspectiveMode?: 'subtle' | 'balanced' | 'cinematic';
  flightProgress?: number;
  horizontalProgress?: number;
  exitProgress?: number;
  breakProgress?: number;
  zoomProgress?: number;
  flyUpProgress?: number;
}

export const HeroTransition: React.FC<HeroTransitionProps> = ({
  progress: externalProgress,
  grassProgress = 0,
  onProgressChange,
  onScrollToNext,
  perspectiveMode = 'balanced',
  flightProgress = 0,
  horizontalProgress = 0,
  exitProgress = 0,
  breakProgress = 0,
  zoomProgress = 0,
  flyUpProgress = 0,
}) => {
  const [internalProgress, setInternalProgress] = useState<number>(0);
  const progress = externalProgress !== undefined ? externalProgress : internalProgress;

  // Refs for animated elements
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const whitePanelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fgVideoRef = useRef<HTMLVideoElement>(null);

  // High-precision motion smoothing refs (continuous 60fps/120fps dampening)
  const targetProgressRef = useRef<number>(progress);
  const currentProgressRef = useRef<number>(progress);

  // Sync target progress on prop update
  useEffect(() => {
    targetProgressRef.current = progress;
    // When progress resets to 0 (from loop), snap native doors IMMEDIATELY to 100% closed!
    // This eliminates the second animation and prevents grasslands from ever showing during loop reset.
    if (progress === 0) {
      currentProgressRef.current = 0;
      if (blackPanelRef.current) {
        gsap.set(blackPanelRef.current, {
          transform: 'translate3d(0, 0vh, 0px) rotateX(0deg)',
          visibility: 'visible',
        });
      }
      if (whitePanelRef.current) {
        gsap.set(whitePanelRef.current, {
          transform: 'translate3d(0, 0vh, 0px) rotateX(0deg)',
          visibility: 'visible',
        });
      }
      if (cameraRigRef.current) {
        gsap.set(cameraRigRef.current, {
          transform: 'translate3d(0px, 0px, 0px)',
        });
      }
      if (logoRef.current) {
        gsap.set(logoRef.current, {
          transform: 'translate3d(0, 0vh, 0px) scale(1)',
        });
      }
      if (textRef.current) {
        gsap.set(textRef.current, {
          transform: 'translate3d(0, 0vh, 0px)',
        });
      }
    }
  }, [progress]);

  // Continuous auto-play and lockstep sync for background & foreground grass videos
  useEffect(() => {
    const bg = videoRef.current;
    const fg = fgVideoRef.current;
    if (bg) {
      bg.play().catch(() => {});
    }
    if (fg) {
      fg.play().catch(() => {});
    }

    if (!bg || !fg) return;

    const syncVideos = () => {
      if (Math.abs(fg.currentTime - bg.currentTime) > 0.05) {
        fg.currentTime = bg.currentTime;
      }
      if (bg.paused && !fg.paused) fg.pause();
      if (!bg.paused && fg.paused) fg.play().catch(() => {});
    };

    bg.addEventListener('play', () => fg.play().catch(() => {}));
    bg.addEventListener('pause', () => fg.pause());
    bg.addEventListener('seeking', () => {
      fg.currentTime = bg.currentTime;
    });
    bg.addEventListener('timeupdate', syncVideos);

    return () => {
      bg.removeEventListener('timeupdate', syncVideos);
    };
  }, []);

  // Perspective mapping in pixels
  const perspectiveValue = {
    subtle: 1500,
    balanced: 1200,
    cinematic: 900,
  }[perspectiveMode];

  // Update progress helper
  const setTransitionProgress = useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(1, val));
      setInternalProgress(clamped);
      if (onProgressChange) {
        onProgressChange(clamped);
      }
    },
    [onProgressChange]
  );

  // Continuous 60fps/120fps GSAP ticker damping with parallax depth
  useEffect(() => {
    const onTick = () => {
      if (
        !cameraRigRef.current ||
        !blackPanelRef.current ||
        !whitePanelRef.current
      ) {
        return;
      }

      const target = targetProgressRef.current;
      let current = currentProgressRef.current;
      const diff = target - current;

      // Ultra-fluid exponential dampening (smooth inertia glide, eliminates stepped wheel ticks)
      if (Math.abs(diff) > 0.0001) {
        current += diff * 0.09;
        currentProgressRef.current = current;
      } else {
        current = target;
        currentProgressRef.current = target;
      }

      // Synchronized motion parameters:
      // Gentle resting threshold: p in [0.00, 0.04]
      // Silky architectural parting: p in [0.04, 0.96]
      let openProgress = 0;
      if (current > 0.04) {
        openProgress = Math.min(1, (current - 0.04) / 0.92);
      }

      // Architectural power2.inOut curve for weighted, luxurious feel
      const ease = gsap.parseEase('power2.inOut')(openProgress);

      // 1. Primary Door Panels
      const blackY_vh = -ease * 76;
      const whiteY_vh = ease * 30;
      const camZ = ease * 320;
      const camY = Math.sin(openProgress * Math.PI) * -8;
      const tiltAngle = Math.sin(openProgress * Math.PI) * 2.0;

      // 2. Parallax: Logo floats with opposite vertical inertia inside black panel
      const logoY_vh = ease * 14;
      const logoScale = 1 - ease * 0.04;

      // 3. Parallax: Typography counter-drifts smoothly inside white panel
      const textY_vh = -ease * 7;

      // 4. Parallax: Grasslands background scale reveal
      const bgScale = 1.06 - ease * 0.06;

      // Apply transforms with GPU acceleration
      gsap.set(cameraRigRef.current, {
        transform: `translate3d(0px, ${camY}px, ${camZ}px)`,
        transformStyle: 'preserve-3d',
      });

      gsap.set(blackPanelRef.current, {
        transform: `translate3d(0, ${blackY_vh}vh, 0px) rotateX(${tiltAngle}deg)`,
        transformOrigin: 'top center',
        visibility: openProgress >= 1 ? 'hidden' : 'visible',
      });

      gsap.set(whitePanelRef.current, {
        transform: `translate3d(0, ${whiteY_vh}vh, 0px) rotateX(${-tiltAngle}deg)`,
        transformOrigin: 'bottom center',
        visibility: openProgress >= 1 ? 'hidden' : 'visible',
      });

      if (logoRef.current) {
        gsap.set(logoRef.current, {
          transform: `translate3d(0, ${logoY_vh}vh, 0px) scale(${logoScale})`,
          willChange: 'transform',
        });
      }

      if (textRef.current) {
        gsap.set(textRef.current, {
          transform: `translate3d(0, ${textY_vh}vh, 0px)`,
          willChange: 'transform',
        });
      }

      if (videoRef.current) {
        gsap.set(videoRef.current, {
          transform: `scale(${bgScale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        });
      }
    };

    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
    };
  }, []);

  // Smooth wheel scroll listener for unmanaged/standalone mode only
  useEffect(() => {
    if (externalProgress !== undefined) return;
    let currentProgress = progress;

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY * 0.00085;
      currentProgress = Math.max(0, Math.min(1, currentProgress + delta));
      setTransitionProgress(currentProgress);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [progress, externalProgress, setTransitionProgress]);

  // Touch gesture support for standalone mode
  useEffect(() => {
    if (externalProgress !== undefined) return;
    let touchStartY = 0;
    let initialTouchProgress = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      initialTouchProgress = progress;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const progressDelta = deltaY / (window.innerHeight * 0.65);
      setTransitionProgress(initialTouchProgress + progressDelta);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [progress, externalProgress, setTransitionProgress]);

  // Keyboard navigation for standalone mode
  useEffect(() => {
    if (externalProgress !== undefined) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        setTransitionProgress(Math.min(1, progress + 0.14));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setTransitionProgress(Math.max(0, progress - 0.14));
      } else if (e.key === 'Home') {
        e.preventDefault();
        setTransitionProgress(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setTransitionProgress(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [progress, externalProgress, setTransitionProgress]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-black"
      style={{
        backgroundColor: flightProgress >= 0.86 ? '#FFFFFF' : '#000000',
        perspective: `${perspectiveValue}px`,
        perspectiveOrigin: '50% 50%',
      }}
    >
      {/* 3D CAMERA RIG */}
      <div
        ref={cameraRigRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundColor: flightProgress >= 0.86 ? '#FFFFFF' : '#000000',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* ============================================================
            LAYER 0: INFINITE LOOPING STATIC GRASS VIDEO BACKGROUND
            Stays solid 100% opaque until canvas has completely covered it (no black flash!)
            ============================================================ */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none"
          style={{
            opacity: flightProgress >= 0.16 ? 0 : 1,
            visibility: flightProgress >= 0.18 ? 'hidden' : 'visible',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            poster="/Landscape_with_grass.jpg"
            className="w-full h-full object-cover object-center"
          >
            <source src="/static-grass-video.mp4" type="video/mp4" />
            <source src="/static grass video.mp4" type="video/mp4" />
            <img
              src="/Landscape_with_grass.jpg"
              alt="Landscape with grass fallback"
              className="w-full h-full object-cover object-center"
            />
          </video>
        </div>

        {/* ============================================================
            LAYER 0.5: SCROLL-DRIVEN CAMERA FLIGHT CANVAS (Frame 1 to 120)
            Fades in smoothly directly over the 100% opaque video background
            with Frame 1 baseline image (100% seamless, zero blank frames).
            ============================================================ */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden z-[5] pointer-events-none select-none"
          style={{
            opacity: Math.min(1, Math.max(0, flightProgress * 10)),
          }}
        >
          <CameraFlightCanvas flightProgress={flightProgress} />
        </div>

        {/* ============================================================
            LAYER 1: CENTRAL STAGE (Behind Opening Doors / Forward of Background)
            Contains the Responsive Grasslands Showcase Widget (65% visibility)
            ============================================================ */}
        <CenterStageMockup
          progress={progress}
          grassProgress={grassProgress}
          flightProgress={flightProgress}
        />

        {/* ============================================================
            LAYER 1.5: FOREGROUND SYNCHRONIZED GRASS OVERLAY
            Positioned directly in front of CenterStageMockup (z-[15])
            and behind the black doors (z-20).
            Fades out as camera flight begins towards yellow section.
            No CSS transition to prevent scroll-scrub stutter or popping.
            ============================================================ */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-[15]"
          style={{
            opacity:
              Math.min(1, Math.max(0, (progress - 0.08) / 0.45)) *
              Math.max(0, 1 - flightProgress * 6),
            visibility: flightProgress >= 0.18 ? 'hidden' : 'visible',
          }}
        >
          <video
            ref={fgVideoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center pointer-events-none select-none"
            style={{
              maskImage: 'url(/grass-foreground-mask.png?v=3)',
              WebkitMaskImage: 'url(/grass-foreground-mask.png?v=3)',
              maskSize: 'cover',
              WebkitMaskSize: 'cover',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
            }}
          >
            <source src="/static-grass-video.mp4" type="video/mp4" />
            <source src="/static grass video.mp4" type="video/mp4" />
          </video>
        </div>



        {/* ============================================================
            LAYER 1: UPPER BLACK PANEL (The Top Door Half)
            Position: Top 73% of viewport (0 to 73vh)
            Contains:
            - Hamburger Menu (top left)
            - Logo / Hero Mockup Grid Placeholder
            Motion: Translates UP by 76vh, exiting top at openProgress = 1.0
            ============================================================ */}
        <div
          ref={blackPanelRef}
          className="absolute top-0 left-0 w-full bg-[#000000] z-20 flex flex-col justify-between overflow-hidden"
          style={{
            height: '73vh',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Top spacer */}
          <div className="w-full px-8 md:px-12 pt-8 md:pt-10 h-14 pointer-events-none" />

          {/* Upper Door Panel: Official Kernova Systems Logo (Really Big, Center Aligned) */}
          <div ref={logoRef} className="flex-1 flex items-center justify-center px-6 w-full text-center">
            <KernovaLogo
              variant="full"
              theme="dark"
              height="clamp(80px, 18vw, 270px)"
            />
          </div>
        </div>

        {/* ============================================================
            LAYER 2: LOWER WHITE PANEL (The Bottom Door Half)
            Position: Absolute block at 73vh (covers 73vh to 100vh)
            Nothing at its back: Sits directly over the pure red canvas
            Contains:
            - Typography / Hero Copy Mockup Grid Placeholder
            Motion: Translates DOWN by 30vh, exiting bottom at openProgress = 1.0
            SYNCHRONIZED: Reaches bottom exit AT THE EXACT SAME TIME as black!
            ============================================================ */}
        <div
          ref={whitePanelRef}
          className="absolute left-0 w-full bg-[#fefefe] z-20 overflow-hidden"
          style={{
            top: '73vh',
            height: '27vh',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* Typography Mockup Space: Center Aligned */}
          <div ref={textRef} className="w-full h-full px-6 flex flex-col items-center justify-center text-center">
            <ExperienceTypography />
          </div>
        </div>
      </div>

      {/* ============================================================
          LAYER 2: INCEPTION SECTION (Pure White, Pop-Up Buildings)
          - Appears at the climax of the cloud flight (flightProgress >= 0.85)
          - The two buildings pop in (top pops down from top, bottom pops up from bottom)
          - FOLDING DIMENSIONS bold black text pops in the center on pure white background
          - Zero extra space, flush to top: 0 and bottom: 0
          ============================================================ */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden z-30"
        style={{
          opacity: flightProgress >= 0.85 ? 1 : 0,
          visibility: flightProgress >= 0.82 ? 'visible' : 'hidden',
          pointerEvents: flightProgress >= 0.90 ? 'auto' : 'none',
          transition: flightProgress === 0 ? 'none' : 'opacity 0.35s ease-out',
        }}
      >
        <YellowSection
          flightProgress={flightProgress}
          horizontalProgress={horizontalProgress}
          exitProgress={exitProgress}
          breakProgress={breakProgress}
          zoomProgress={zoomProgress}
          flyUpProgress={flyUpProgress}
          onExploreNext={onScrollToNext}
        />
      </div>

    </div>
  );
};
