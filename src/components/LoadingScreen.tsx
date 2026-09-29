import React, { useState, useEffect, useRef } from 'react';

// ─── Generate ALL frame paths ──────────────────────────────────────────────
const pad = (n: number, len = 3) => String(n).padStart(len, '0');

const ICE_FRAMES = Array.from({ length: 120 }, (_, i) =>
  `/break-the-ice-frames/frame-${pad(i + 1)}.webp`
);
const CAM_FRAMES = Array.from({ length: 120 }, (_, i) =>
  `/camera-transition-frames/ezgif-frame-${pad(i + 1)}.jpg`
);
const FLIGHT_FRAMES = Array.from({ length: 180 }, (_, i) =>
  `/mountain-flight-frames/frame-${pad(i + 1)}.webp`
);
const SCENE_IMAGES = [
  '/broken-glacier-edge.webp',
  '/broken-glacier-shelf.webp',
  '/down-bad-glacier.webp',
  '/Landscape_with_grass.jpg',
  '/glacier-background.webp',
  '/icemountain-crop.webp',
  '/spiderweb-crevasse.jpg',
  '/portfolio-screen-mobile.jpg',
  '/portfolio-screen-tablet.jpg',
  '/portfolio-screen.webp',
  '/fighter-jet-alpha.png',
  '/brand/kernova-full-logo-white.png',
  '/brand/kernova-full-logo-black.png',
];
const VIDEO_SRCS = [
  '/hero-video.mp4',
  '/camera-transition.mp4',
  '/static-grass-video.mp4',
  '/Camera_flying_into_clouds.mp4',
];

const ALL_IMAGES = [...ICE_FRAMES, ...CAM_FRAMES, ...FLIGHT_FRAMES, ...SCENE_IMAGES];
const TOTAL = ALL_IMAGES.length;

// Door animation duration in ms — fast snap, like a curtain dropping
const DOOR_DURATION = 480;

// ─────────────────────────────────────────────────────────────────────────────

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [doorsIn, setDoorsIn] = useState(false); // triggers door drop animation
  const loadedRef = useRef(0);
  const doneRef = useRef(false);
  const progressRef = useRef(0);

  // ── Preload every asset ───────────────────────────────────────────────────
  useEffect(() => {
    const videoLinks: HTMLLinkElement[] = VIDEO_SRCS.map((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
      return link;
    });

    const tick = () => {
      loadedRef.current += 1;
      const raw = Math.round((loadedRef.current / TOTAL) * 100);
      if (raw > progressRef.current) {
        progressRef.current = raw;
        setProgress(raw);
      }
      if (loadedRef.current >= TOTAL && !doneRef.current) {
        doneRef.current = true;
        // Brief hold at 100%, then drop the curtain
        setTimeout(() => setDoorsIn(true), 280);
      }
    };

    const CONCURRENCY = 6;
    let queued = 0;

    const fetchAsset = (src: string): Promise<void> =>
      fetch(src, { cache: 'force-cache' })
        .then((r) => r.blob())
        .catch(() => {})
        .finally(tick);

    const runQueue = () => {
      while (queued < ALL_IMAGES.length && queued - loadedRef.current < CONCURRENCY) {
        const idx = queued++;
        fetchAsset(ALL_IMAGES[idx]).then(runQueue);
      }
    };

    runQueue();

    return () => {
      videoLinks.forEach((l) => l.remove());
    };
  }, []);

  // ── Once doors finish slamming: call onComplete immediately ───────────────
  useEffect(() => {
    if (!doorsIn) return;
    // Wait for the CSS transition to finish, then hand off — no fade, instant cut
    const t = setTimeout(onComplete, DOOR_DURATION + 20);
    return () => clearTimeout(t);
  }, [doorsIn, onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'all',
      }}
    >
      {/* ── Loading screen: visible until doors slam shut ─────────────────── */}
      {!doorsIn && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Logo */}
          <img
            src="/brand/kernova-full-logo-white.png"
            alt="Kernova Systems"
            style={{
              height: 'clamp(32px, 5vw, 52px)',
              width: 'auto',
              marginBottom: 'clamp(36px, 6vh, 56px)',
              opacity: 0.95,
              display: 'block',
            }}
            draggable={false}
          />

          {/* Thin progress bar */}
          <div
            style={{
              width: 'clamp(160px, 28vw, 280px)',
              height: '1.5px',
              background: '#1a1a1a',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: '#ffffff',
                borderRadius: '999px',
                transition: 'width 0.3s ease-out',
              }}
            />
          </div>

          {/* Tagline */}
          <p
            style={{
              marginTop: 'clamp(14px, 2vh, 20px)',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(13px, 1.4vw, 17px)',
              color: '#444444',
              letterSpacing: '0.02em',
              userSelect: 'none',
              lineHeight: 1,
            }}
          >
            Good experiences take time
          </p>
        </div>
      )}

      {/* ── Theater curtain doors — always rendered, animate into position ────
          Top (black) door:   starts -73vh above screen → slams to 0
          Bottom (white) door: starts +27vh below screen → slams to 0
          Once slammed, onComplete fires and this entire component unmounts.
          The real HeroTransition (at progress=0) is underneath — identical
          dimensions, seamless handoff. User scrolls and website unfolds.
      ──────────────────────────────────────────────────────────────────────── */}

      {/* Top black door */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '73vh',
          background: '#000000',
          zIndex: 2,
          // Not yet triggered: offscreen above. Triggered: slam to 0.
          transform: doorsIn ? 'translateY(0)' : 'translateY(-100%)',
          transition: doorsIn
            ? `transform ${DOOR_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
          willChange: 'transform',
        }}
      >
        {/* Logo centred inside — matches the real hero black panel */}
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/brand/kernova-full-logo-white.png"
            alt=""
            aria-hidden="true"
            style={{
              height: 'clamp(80px, 18vw, 270px)',
              width: 'auto',
              display: 'block',
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom white door */}
      <div
        style={{
          position: 'absolute',
          top: '73vh',
          left: 0,
          width: '100%',
          height: '27vh',
          background: '#ffffff',
          zIndex: 2,
          transform: doorsIn ? 'translateY(0)' : 'translateY(100%)',
          transition: doorsIn
            ? `transform ${DOOR_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
