import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { HeroTransition } from './components/HeroTransition';
import { KernovaLogo } from './components/KernovaLogo';
import { LoadingScreen } from './components/LoadingScreen';

export default function App() {
  const [progress, setProgress] = useState<number>(0);
  const [doorsOpen, setDoorsOpen] = useState<boolean>(false);
  const [grassProgress, setGrassProgress] = useState<number>(0);
  const [flightProgress, setFlightProgress] = useState<number>(0);
  const [horizontalProgress, setHorizontalProgress] = useState<number>(0);
  const [exitProgress, setExitProgress] = useState<number>(0);
  const [iceProgress, setIceProgress] = useState<number>(0);
  const [glacierZoom, setGlacierZoom] = useState<number>(0);
  const [glacierFlyUp, setGlacierFlyUp] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('kernova_loaded') === 'true';
  });

  const handleLoadingComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('kernova_loaded', 'true');
    }
    setIsLoaded(true);
  }, []);

  const stickyTrackRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isAnimRef = useRef<boolean>(false);
  const doorsOpenRef = useRef<boolean>(false);
  const progressRef = useRef<number>(0);
  const iceProgressRef = useRef<number>(0);

  // Always enforce top-of-page load with closed hero doors
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Synchronize state refs and debug window properties
  useEffect(() => {
    doorsOpenRef.current = doorsOpen;
    progressRef.current = progress;
    iceProgressRef.current = iceProgress;
    (window as any).__appState = {
      doorsOpen,
      progress,
      flightProgress,
      horizontalProgress,
      exitProgress,
      iceProgress,
      scrollY: window.scrollY,
    };
  }, [
    doorsOpen,
    progress,
    flightProgress,
    horizontalProgress,
    exitProgress,
    iceProgress,
  ]);

  // Smooth scroll past door opening phase when clicked (1.35s majestic glide)
  const handleOpenDoors = useCallback(() => {
    if (isAnimRef.current) return;
    const track = stickyTrackRef.current;
    if (!track) return;
    const vh = window.innerHeight;
    const scrollDistance = Math.max(1, track.offsetHeight - vh);
    const targetY = scrollDistance * 0.125;

    isAnimRef.current = true;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetY, {
        duration: 1.6,
        easing: (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        onComplete: () => {
          isAnimRef.current = false;
        },
      });
    } else {
      const proxy = { y: window.scrollY };
      gsap.to(proxy, {
        y: targetY,
        duration: 1.35,
        ease: 'power2.inOut',
        onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }),
        onComplete: () => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
          isAnimRef.current = false;
        },
      });
    }
  }, []);

  // Smooth scroll to top, closing doors gracefully (1.25s glide)
  const handleCloseDoors = useCallback(() => {
    if (isAnimRef.current) return;
    isAnimRef.current = true;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: 1.25,
        easing: (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
        onComplete: () => {
          isAnimRef.current = false;
        },
      });
    } else {
      const proxy = { y: window.scrollY };
      gsap.to(proxy, {
        y: 0,
        duration: 1.25,
        ease: 'power2.inOut',
        onUpdate: () => window.scrollTo({ top: proxy.y, behavior: 'instant' }),
        onComplete: () => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          isAnimRef.current = false;
        },
      });
    }
  }, []);

  // Calculate normalized progress values based on real browser scroll position
  const updateScrollProgress = useCallback(() => {
    const track = stickyTrackRef.current;
    if (!track) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, track.offsetHeight - vh);

    // Clamped track progress [0.0, 1.0] across full scroll track
    const trackP = Math.max(0, Math.min(1, scrollY / maxScroll));

    // Phase 0: Door Opening [0.00, 0.11] (~110vh) - Slower, calmer architectural parting
    const doorP = Math.min(1, Math.max(0, trackP / 0.11));

    // Phase 0.5: Tranquil Grassland Viewing & Narrative [0.11, 0.28] (~170vh)
    const grass = Math.min(1, Math.max(0, (trackP - 0.11) / 0.17));

    // Phase 1: Camera Flight across hills into clouds [0.28, 0.44] (~160vh)
    const flight = Math.min(1, Math.max(0, (trackP - 0.28) / 0.16));

    // Phase 2: Horizontal Inception skyline traverse [0.44, 0.70] (~260vh - generous runway for 4s delay per text)
    const horizontal = Math.min(1, Math.max(0, (trackP - 0.44) / 0.26));

    // Phase 3: Inception skylines pop out / glacier backdrop reveals [0.70, 0.77] (~70vh)
    const exit = Math.min(1, Math.max(0, (trackP - 0.70) / 0.07));

    // Phase 4 & 5: Ice breaking, Contact Section Scroll Stagger, and Footer [0.77, 1.00] (~230vh)
    // The website cleanly ends at the footer when trackP reaches 1.0
    const ice = Math.min(1, Math.max(0, (trackP - 0.77) / 0.23));

    setProgress(doorP);
    setDoorsOpen(doorP > 0.04);
    setGrassProgress(grass);
    setFlightProgress(flight);
    setHorizontalProgress(horizontal);
    setExitProgress(exit);
    setIceProgress(ice);
  }, []);

  // Lenis smooth momentum scroll engine + passive sync listeners
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.55,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 1.0,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const updateMotion = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(updateMotion);
    };
    rafId = requestAnimationFrame(updateMotion);

    lenis.on('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateScrollProgress);
      window.removeEventListener('scroll', updateScrollProgress);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [updateScrollProgress]);

  // Keyboard navigation support: simple & responsive
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimRef.current) return;
      const scrollY = window.scrollY;
      const track = stickyTrackRef.current;
      if (!track) return;
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, track.offsetHeight - vh);

      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        if (progressRef.current < 0.5) {
          e.preventDefault();
          handleOpenDoors();
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (scrollY <= maxScroll * 0.17) {
          handleCloseDoors();
        }
      } else if (e.key === 'Escape') {
        handleCloseDoors();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOpenDoors, handleCloseDoors]);

  return (
    <main className="relative w-full font-sans selection:bg-black selection:text-white bg-black">
      {/* ================================================================
          HERO CHAMBER (PINNED VIEWPORT)
          - Starts 100% closed with official Kernova door panels at top.
          - Doors part open smoothly on initial scroll or click.
          - Leads into Grasslands -> Flight -> Inception -> Ice Glacier Contact Section.
          - The website ends at the footer.
          ================================================================ */}
      <section
        id="hero-section"
        className="fixed inset-0 w-full h-screen overflow-hidden select-none z-0"
        style={{
          backgroundColor:
            exitProgress > 0
              ? '#000000'
              : flightProgress >= 0.86
              ? '#FFFFFF'
              : '#000000',
          cursor: progress < 0.9 ? 'pointer' : 'default',
        }}
        onClick={() => {
          if (progress < 0.9) {
            handleOpenDoors();
          }
        }}
      >
        <HeroTransition
          progress={progress}
          grassProgress={grassProgress}
          flightProgress={flightProgress}
          horizontalProgress={horizontalProgress}
          exitProgress={exitProgress}
          breakProgress={iceProgress}
          zoomProgress={glacierZoom}
          flyUpProgress={glacierFlyUp}
          perspectiveMode="balanced"
        />
      </section>

      {/* ================================================================
          PHYSICAL SCROLL TRACK SPACER (1000vh)
          - Generous physical track for cinematic door parting,
            camera flight, city traverse (with 4-second scroll delay per text),
            ice breaking, contact section scroll stagger, and footer.
          ================================================================ */}
      <div
        ref={stickyTrackRef}
        id="hero-scroll-track"
        className="relative w-full pointer-events-none"
        style={{
          height: '1000vh',
        }}
      />

      {/* ================================================================
          TOP-LEFT COMPACT KERNOVA LOGO (HOME / DOOR SECTION RETURN)
          - Appears as doors part open
          - Extremely compact, sleek, glassmorphic button
          - Clicking it glides smoothly back to the closed door/hero section
          ================================================================ */}
      <button
        type="button"
        onClick={handleCloseDoors}
        aria-label="Return to home section"
        className="fixed top-3 left-3 sm:top-5 sm:left-5 z-50 p-1 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center pointer-events-auto"
        style={{
          opacity: progress > 0.03 ? 1 : 0,
          visibility: progress > 0.03 ? 'visible' : 'hidden',
          pointerEvents: progress > 0.03 ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, visibility 0.3s ease, transform 0.2s ease',
          background: 'none',
          border: 'none',
          boxShadow: 'none',
        }}
      >
        <KernovaLogo variant="symbol" theme="dark" height="28px" />
      </button>

      {/* Loading screen — rendered on top of everything, fades out once assets are ready */}
      {!isLoaded && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
    </main>
  );
}
