import React, { useEffect, useRef, useState, useCallback } from 'react';
import { KernovaLogo } from './KernovaLogo';

export interface BreakTheIceSectionProps {
  breakProgress?: number;
  zoomProgress?: number;
  flyUpProgress?: number;
}

// Physical polygonal ice shards for the "BREAK THE ICE" fracture effect.
// Slices the letters across central fault lines and diagonal shear paths.
// ALL shards fall VERTICALLY DOWN into the crevasse under gravity.
const ICE_SHARDS = [
  // --- TOP ROW SHARDS (All Falling Vertically Down into the Crevasse) ---
  {
    id: 'top-1',
    clip: 'polygon(0% 0%, 18% 0%, 17% 52%, 0% 46%)',
    dx: -12,
    dy: 460,
    dz: -110,
    rotZ: -8,
    rotX: 34,
    rotY: -6,
  },
  {
    id: 'top-2',
    clip: 'polygon(18% 0%, 36% 0%, 34% 44%, 17% 52%)',
    dx: -4,
    dy: 520,
    dz: -140,
    rotZ: 6,
    rotX: 42,
    rotY: 5,
  },
  {
    id: 'top-3',
    clip: 'polygon(36% 0%, 53% 0%, 51% 58%, 34% 44%)',
    dx: 6,
    dy: 490,
    dz: -125,
    rotZ: -6,
    rotX: 38,
    rotY: -4,
  },
  {
    id: 'top-4',
    clip: 'polygon(53% 0%, 70% 0%, 69% 45%, 51% 58%)',
    dx: 5,
    dy: 540,
    dz: -160,
    rotZ: 8,
    rotX: 45,
    rotY: 7,
  },
  {
    id: 'top-5',
    clip: 'polygon(70% 0%, 86% 0%, 85% 54%, 69% 45%)',
    dx: 10,
    dy: 480,
    dz: -115,
    rotZ: -7,
    rotX: 36,
    rotY: -5,
  },
  {
    id: 'top-6',
    clip: 'polygon(86% 0%, 100% 0%, 100% 48%, 85% 54%)',
    dx: 15,
    dy: 450,
    dz: -130,
    rotZ: 9,
    rotX: 40,
    rotY: 8,
  },

  // --- BOTTOM ROW SHARDS (All Falling Vertically Down into the Crevasse) ---
  {
    id: 'bot-1',
    clip: 'polygon(0% 46%, 17% 52%, 19% 100%, 0% 100%)',
    dx: -16,
    dy: 500,
    dz: -130,
    rotZ: 7,
    rotX: -28,
    rotY: 6,
  },
  {
    id: 'bot-2',
    clip: 'polygon(17% 52%, 34% 44%, 35% 100%, 19% 100%)',
    dx: -6,
    dy: 560,
    dz: -170,
    rotZ: -8,
    rotX: -36,
    rotY: -5,
  },
  {
    id: 'bot-3',
    clip: 'polygon(34% 44%, 51% 58%, 52% 100%, 35% 100%)',
    dx: -10,
    dy: 530,
    dz: -145,
    rotZ: 5,
    rotX: -32,
    rotY: 4,
  },
  {
    id: 'bot-4',
    clip: 'polygon(51% 58%, 69% 45%, 68% 100%, 52% 100%)',
    dx: 8,
    dy: 580,
    dz: -185,
    rotZ: -9,
    rotX: -38,
    rotY: -7,
  },
  {
    id: 'bot-5',
    clip: 'polygon(69% 45%, 85% 54%, 84% 100%, 68% 100%)',
    dx: 14,
    dy: 520,
    dz: -140,
    rotZ: 6,
    rotX: -30,
    rotY: 5,
  },
  {
    id: 'bot-6',
    clip: 'polygon(85% 54%, 100% 48%, 100% 100%, 84% 100%)',
    dx: 18,
    dy: 470,
    dz: -155,
    rotZ: -10,
    rotX: -34,
    rotY: -8,
  },
];

export const BreakTheIceSection: React.FC<BreakTheIceSectionProps> = ({
  breakProgress = 0,
  zoomProgress = 0,
  flyUpProgress = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chamberRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isLoadedRef = useRef<boolean>(false);
  const [, setLoadCount] = useState<number>(0);

  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);

  // Zoom-out & transform refs
  const glacierRigRef = useRef<HTMLDivElement>(null);
  const currentZoomRef = useRef<number>(0);
  const targetZoomRef = useRef<number>(0);
  const currentFlyUpRef = useRef<number>(0);
  const targetFlyUpRef = useRef<number>(0);

  // Interactive Contact Modal state
  const [showContactModal, setShowContactModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [windowHeight, setWindowHeight] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 900
  );

  // 120 frames scrubbed across the first 45% of breakProgress
  useEffect(() => {
    const frameP = Math.min(1, Math.max(0, breakProgress / 0.45));
    targetFrameRef.current = Math.min(119, Math.max(0, Math.floor(frameP * 119.99)));
  }, [breakProgress]);

  useEffect(() => {
    targetZoomRef.current = Math.max(0, Math.min(1, zoomProgress));
    if (zoomProgress === 0 && flyUpProgress === 0) {
      currentZoomRef.current = 0;
      currentFlyUpRef.current = 0;
      if (glacierRigRef.current) {
        glacierRigRef.current.style.transform = 'scale(1) translate3d(0, 0, 0)';
        glacierRigRef.current.style.opacity = '1';
      }
    }
  }, [zoomProgress, flyUpProgress]);

  useEffect(() => {
    targetFlyUpRef.current = Math.max(0, Math.min(1, flyUpProgress));
    if (zoomProgress === 0 && flyUpProgress === 0) {
      currentZoomRef.current = 0;
      currentFlyUpRef.current = 0;
      if (glacierRigRef.current) {
        glacierRigRef.current.style.transform = 'scale(1) translate3d(0, 0, 0)';
        glacierRigRef.current.style.opacity = '1';
      }
    }
  }, [zoomProgress, flyUpProgress]);

  // Updates zoom & flyUp transforms: zooming out and rapidly moving vertically up
  const updateZoomTransforms = useCallback((zoomP: number, flyUpP: number) => {
    const clampedZ = Math.max(0, Math.min(1, zoomP));
    const clampedFly = Math.max(0, Math.min(1, flyUpP));

    if (glacierRigRef.current) {
      if (clampedZ === 0 && clampedFly === 0) {
        glacierRigRef.current.style.transform = 'scale(1) translate3d(0, 0, 0)';
        glacierRigRef.current.style.opacity = '1';
        return;
      }
      // Zooming out: scale from 1.0 down to 0.70
      const scale = 1.0 - clampedZ * 0.30;
      // Rapidly moving vertically UP off top of screen
      const vh = window.innerHeight;
      const translateY = -(clampedFly * (vh * 1.4));
      glacierRigRef.current.style.transform = `scale(${scale}) translate3d(0, ${translateY}px, 0)`;
      glacierRigRef.current.style.opacity = String(Math.max(0, 1 - clampedFly * 1.25));
    }
  }, []);

  useEffect(() => {
    (window as any).__breakTheIce = {
      breakProgress,
      zoomProgress,
      flyUpProgress,
      currentFrame: currentFrameRef.current,
      targetFrame: targetFrameRef.current,
      isLoaded: isLoadedRef.current,
    };
  }, [breakProgress, zoomProgress, flyUpProgress]);

  // Render a specific frame onto the canvas using zero-letterbox object-cover scaling
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.width === 0 || canvas.height === 0) {
      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5);
      const chamber = chamberRef.current;
      const w = chamber && chamber.clientWidth > 0 ? chamber.clientWidth : window.innerWidth;
      const h = chamber && chamber.clientHeight > 0 ? chamber.clientHeight : window.innerHeight;
      if (w > 0 && h > 0) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
      }
    }

    if (canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 120; offset++) {
        const prev = imagesRef.current[frameIdx - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIdx + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih) * 1.005;
    const dw = Math.ceil(iw * scale);
    const dh = Math.ceil(ih * scale);
    const dx = Math.floor((cw - dw) / 2);
    const dy = Math.floor((ch - dh) / 2);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    lastRenderedFrameRef.current = frameIdx;
  }, []);

  // Preload all 120 1080p WebP frames
  useEffect(() => {
    const totalFrames = 120;
    const loaded: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');

      const onLoad = () => {
        count++;
        setLoadCount(count);
        if (i === 1 || Math.abs(i - 1 - Math.round(currentFrameRef.current)) <= 1) {
          renderFrame(Math.round(currentFrameRef.current));
        }
        if (count === totalFrames) {
          isLoadedRef.current = true;
          renderFrame(Math.round(currentFrameRef.current));
        }
      };

      img.onload = onLoad;
      img.onerror = onLoad;
      img.src = `/break-the-ice-frames/frame-${pad}.webp?v=clean`;

      if (img.complete && img.naturalWidth > 0) {
        onLoad();
      }

      loaded.push(img);
    }

    imagesRef.current = loaded;
  }, [renderFrame]);

  // Handle responsive canvas resize
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5);
      const chamber = chamberRef.current;
      const w = chamber && chamber.clientWidth > 0 ? chamber.clientWidth : window.innerWidth;
      const h = chamber && chamber.clientHeight > 0 ? chamber.clientHeight : window.innerHeight;

      if (w > 0 && h > 0) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        renderFrame(Math.round(currentFrameRef.current));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (chamberRef.current) {
      ro = new ResizeObserver(() => {
        handleResize();
      });
      ro.observe(chamberRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [renderFrame]);

  // Smooth animation interpolation loop
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;

      if (lastRenderedFrameRef.current === -1) {
        renderFrame(Math.round(currentFrameRef.current));
      }

      // 1. Frame momentum
      const diffF = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diffF) > 0.005) {
        currentFrameRef.current += diffF * 0.25;
        const frameToRender = Math.min(119, Math.max(0, Math.round(currentFrameRef.current)));
        if (frameToRender !== lastRenderedFrameRef.current) {
          renderFrame(frameToRender);
        }
      } else if (Math.round(currentFrameRef.current) !== targetFrameRef.current) {
        currentFrameRef.current = targetFrameRef.current;
        renderFrame(targetFrameRef.current);
      }

      // 2. Zoom & Fly transforms
      const diffZ = targetZoomRef.current - currentZoomRef.current;
      if (Math.abs(diffZ) > 0.001) {
        currentZoomRef.current += diffZ * 0.70;
      } else {
        currentZoomRef.current = targetZoomRef.current;
      }
      const diffFly = targetFlyUpRef.current - currentFlyUpRef.current;
      if (Math.abs(diffFly) > 0.001) {
        currentFlyUpRef.current += diffFly * 0.75;
      } else {
        currentFlyUpRef.current = targetFlyUpRef.current;
      }

      updateZoomTransforms(currentZoomRef.current, currentFlyUpRef.current);
      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [renderFrame, updateZoomTransforms]);

  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form submit handler for contact modal with Resend integration
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send message. Please try again.');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowContactModal(false);
        setFormData({ name: '', email: '', message: '' });
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to send enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showContactModal) {
        setShowContactModal(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showContactModal]);

  // =========================================================================
  // SCROLL PROGRESSION & SCROLL STAGGER ENGINE
  // =========================================================================

  // In the 120-frame glacier footage:
  // Frame 0-24 (breakProgress 0.00 -> 0.09): Solid, unbroken frozen surface.
  // Frame 25-66 (breakProgress 0.09 -> 0.25): Starburst spiderweb crack glimmers on surface.
  // Frame 67 (breakProgress ~0.248): Center collapses — THE ICE SHARDS BREAK!
  // Frame 68-96 (breakProgress 0.248 -> 0.365): Ice shards tumble and plunge VERTICALLY DOWN into crevasse.
  // Frame 97-120: Bottom chasm settles into icy mist.
  //
  // SYNCHRONIZED TIMING:
  // Text remains 100% solid & intact until Frame 67 (breakProgress = 0.248).
  // At Frame 67, text breaks into shards at the EXACT SAME INSTANT the ice breaks.
  // Both the ice shards and all text shards fall VERTICALLY DOWN together in exact lockstep.
  const BREAK_START = 0.248; // Frame 66-67: The exact moment the ice cracks into shards
  const BREAK_END = 0.365;   // Frame 96-98: Shards plunge deep into the chasm

  const shatterP = Math.min(1, Math.max(0, (breakProgress - BREAK_START) / (BREAK_END - BREAK_START)));
  // Gravitational vertical downward acceleration curve (y ~ 0.5 * g * t^1.8)
  const shatterEase = Math.pow(shatterP, 1.8);
  // Shards stay clearly visible as they fall down, then fade as they plunge deep into the dark chasm
  const shardOpacity = Math.max(0, 1 - Math.pow(shatterP, 2.4));
  const isShatterVisible = breakProgress < BREAK_END + 0.04;


  // Helper for computing scroll stagger: maps [start, end] into opacity & translation
  const getStagger = (start: number, end: number) => {
    const p = Math.min(1, Math.max(0, (breakProgress - start) / (end - start)));
    const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
    const isResting = p >= 0.999;
    return {
      opacity: p,
      transform: isResting ? 'none' : `translate3d(0, ${(1 - ease) * 50}px, 0)`,
      visibility: (p > 0.01 ? 'visible' : 'hidden') as 'visible' | 'hidden',
    };
  };

  // Staggered reveals for each section element:
  const stagger1 = getStagger(0.40, 0.54); // WE BUILD THE JOURNEY.
  const stagger2 = getStagger(0.48, 0.62); // Paragraphs
  const stagger3 = getStagger(0.58, 0.72); // Contact Us Button
  const stagger4 = getStagger(0.66, 0.80); // Footer

  // Overall contact section visibility and parallax lift across long scroll trigger
  const isContactVisible = breakProgress >= 0.38;
  // Moves text body vertically down by 20px during its final resting position
  const finalDownShift = Math.min(1, Math.max(0, (breakProgress - 0.70) / 0.30)) * 20;
  const vh = windowHeight;
  const liftAmount = vh < 700 ? 260 : vh < 850 ? 180 : 110;
  const sectionParallaxY = -(Math.max(0, breakProgress - 0.70) * liftAmount) + finalDownShift;

  return (
    <section
      ref={containerRef}
      id="break-the-ice-section"
      className="relative w-full h-full min-h-screen bg-black select-none overflow-hidden"
      style={{
        backgroundColor: '#000000',
      }}
    >
      <div
        ref={chamberRef}
        className="w-full h-full relative flex items-center justify-center bg-black overflow-hidden"
      >
        {/* GLACIER RIG */}
        <div
          ref={glacierRigRef}
          className="relative w-full h-full flex items-center justify-center select-none will-change-transform"
          style={{
            transformOrigin: '50% 50%',
            transform: 'scale(1) translate3d(0, 0, 0)',
          }}
        >
          {/* Instant static baseline image (Frame 1) so there is never a blank flash */}
          <img
            src="/break-the-ice-frames/frame-001.webp"
            alt="Frozen Ice Surface"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{
              filter: 'brightness(0.9) contrast(82%) blur(0.6px) saturate(0.92)',
            }}
          />

          {/* Hardware-accelerated 2D Canvas for 120-frame scrub */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block pointer-events-none select-none z-[1]"
            style={{
              filter: 'brightness(0.9) contrast(82%) blur(0.6px) saturate(0.92)',
            }}
          />


          {/* ============================================================
              "BREAK THE ICE" (SH) - PHYSICAL ICE FRACTURE & SHATTER RIG
              - 12 interlocking polygonal shards tessellating along realistic ice fault lines
              - At scroll = 0: Reconstructs the seamless intact title (100% identical)
              - As scroll progresses (0.02 -> 0.30): Shards violently fracture along
                jagged shear paths in 3D (perspective, roll, pitch, yaw, translation)
                tumbling directly into the opening ice crevasse
              ============================================================ */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[3] px-4"
            style={{
              visibility: isShatterVisible ? 'visible' : 'hidden',
              perspective: '1200px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            <div
              className="relative w-full px-2 sm:px-6 flex items-center justify-center will-change-transform overflow-visible"
              style={{
                opacity: shardOpacity,
                transform: `scale(${1 - Math.min(BREAK_START, breakProgress) * 0.04})`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Invisible spacer giving the shard container identical sizing & alignment */}
              <h2
                aria-hidden="true"
                className="font-extrabold uppercase text-white tracking-tight text-center select-none w-full invisible pointer-events-none"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(1.4rem, 7vw, 8.5rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.025em',
                  whiteSpace: 'nowrap',
                  width: '100%',
                }}
              >
                BREAK THE ICE
              </h2>

              {/* 12 Interlocking Physical Ice Shards */}
              {ICE_SHARDS.map((shard) => {
                const tx = shard.dx * shatterEase;
                const ty = shard.dy * shatterEase;
                const tz = shard.dz * shatterEase;
                const rz = shard.rotZ * shatterEase;
                const rx = shard.rotX * shatterEase;
                const ry = shard.rotY * shatterEase;
                const scale = 1 - shatterEase * 0.12;

                return (
                  <div
                    key={shard.id}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                    style={{
                      clipPath: shard.clip,
                      WebkitClipPath: shard.clip,
                      transform: `translate3d(${tx}px, ${ty}px, ${tz}px) rotateZ(${rz}deg) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <h2
                      className="font-extrabold uppercase text-white tracking-tight text-center select-none w-full"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: 'clamp(1.4rem, 7vw, 8.5rem)',
                        lineHeight: 0.88,
                        letterSpacing: '-0.025em',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        textShadow:
                          '0 8px 50px rgba(0,0,0,0.9), 0 0 70px rgba(122,191,255,0.45)',
                      }}
                    >
                      BREAK THE ICE
                    </h2>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ============================================================
              CONTACT SECTION & FOOTER DIRECTLY ON THE BROKEN ICE GLACIER
              - Sizing increased by over 150px (expanded container & massive typography)
              - Pill on top removed
              - Driven by deliberate scroll stagger
              - Supported by a generous long scroll trigger runway
              ============================================================ */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-[4] px-4 sm:px-8 pointer-events-none"
            style={{
              visibility: isContactVisible ? 'visible' : 'hidden',
            }}
          >
            <div
              className="relative z-10 text-center max-w-[1240px] mx-auto flex flex-col items-center justify-center w-full px-2"
              style={{
                transform: `translate3d(0, ${sectionParallaxY}px, 0)`,
                transition: 'transform 0.1s ease-out',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              {/* 1. Header: WE BUILD THE JOURNEY. (H) */}
              <div
                style={{
                  opacity: stagger1.opacity,
                  transform: stagger1.transform,
                  visibility: stagger1.visibility,
                  transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
                }}
                className="w-full"
              >
                <h2
                  className="text-2xl sm:text-4xl md:text-6xl lg:text-[76px] xl:text-[88px] font-bold uppercase text-white tracking-tight leading-[1.02] select-none"
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    color: '#ffffff',
                    textShadow: '0 2px 25px rgba(0,0,0,0.4)',
                  }}
                >
                  WE BUILD THE JOURNEY.
                </h2>
              </div>

              {/* 2. Paragraphs (I) - Black */}
              <div
                style={{
                  opacity: stagger2.opacity,
                  transform: stagger2.transform,
                  visibility: stagger2.visibility,
                  transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
                }}
                className="mt-3 sm:mt-5 space-y-1.5 sm:space-y-2 max-w-[960px] mx-auto w-full px-2"
              >
                <p
                  className="text-base sm:text-xl md:text-2xl lg:text-[32px] text-white font-bold leading-relaxed select-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700,
                    color: '#ffffff',
                    textShadow: '0 1px 16px rgba(0,0,0,0.5)',
                  }}
                >
                  Your website is only the beginning.
                </p>
                <p
                  className="text-xs sm:text-sm md:text-xl lg:text-[24px] text-white font-semibold leading-relaxed select-none"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    color: '#ffffff',
                    textShadow: '0 1px 16px rgba(0,0,0,0.5)',
                  }}
                >
                  We build the digital systems around your business. Connecting your website, applications, CRM, automation and AI into one experience.
                </p>
              </div>

              {/* 3. Rectangular "Contact Us" Button */}
              <div
                style={{
                  opacity: stagger3.opacity,
                  transform: stagger3.transform,
                  visibility: stagger3.visibility,
                  transition: 'opacity 0.12s ease-out, transform 0.12s ease-out',
                }}
                className="mt-6 sm:mt-10 flex justify-center w-full"
              >
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  className="pointer-events-auto inline-flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-14 md:px-16 py-3.5 sm:py-5 bg-[#004bb5] hover:bg-[#003893] active:scale-[0.98] text-white font-extrabold uppercase text-xs sm:text-base md:text-xl tracking-widest shadow-2xl shadow-[#004bb5]/30 transition-all duration-200 cursor-pointer group rounded-lg"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    borderRadius: '8px',
                  }}
                >
                  <span>Contact Us</span>
                  <span className="transform group-hover:translate-x-1.5 transition-transform">→</span>
                </button>
              </div>

              {/* END stagger3 */}
            </div>
          </div>

          {/* ============================================================
              FOOTER — Pinned to absolute bottom of the ice section
              Layout: Logo LEFT · Legal links RIGHT (row 1) · Socials RIGHT (row 2)
              ============================================================ */}
          <div
            style={{
              opacity: stagger4.opacity,
              visibility: stagger4.visibility,
              transition: 'opacity 0.15s ease-out',
            }}
            className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-auto px-4 sm:px-8 md:px-12 py-3 sm:py-5 md:py-7"
          >
            <footer className="w-full flex items-end justify-between gap-4">

              {/* LEFT — Kernova logo */}
              <div className="flex-shrink-0">
                <KernovaLogo variant="full" theme="dark" height="clamp(28px, 5vw, 80px)" />
              </div>

              {/* RIGHT — Legal links (row 1) + Social icons (row 2) */}
              <div className="flex flex-col items-end gap-1.5 sm:gap-3">

                {/* Legal links */}
                <div className="flex items-center gap-3 sm:gap-6 md:gap-10">
                  {[
                    { label: 'Privacy Policy', href: '/privacy-policy.html' },
                    { label: 'Terms & Conditions', href: '/terms.html' },
                    { label: 'Cookie Policy', href: '/cookies.html' },
                  ].map(({ label, href }) => (
                    <a
                      key={href}
                      href={href}
                      className="text-white hover:underline transition-all cursor-pointer"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 700,
                        fontSize: 'clamp(9px, 1.2vw, 18px)',
                        color: '#ffffff',
                        textShadow: '0 1px 12px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-3 sm:gap-5 text-white">

                  {/* Instagram */}
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"
                    className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100 cursor-pointer">
                    <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* X */}
                  <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)"
                    className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100 cursor-pointer">
                    <svg className="w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"
                    className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100 cursor-pointer">
                    <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"
                    className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100 cursor-pointer">
                    <svg className="w-3 h-3 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.761-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>

                </div>
              </div>
            </footer>
          </div>

        </div>

      </div>

      {/* ============================================================
          INTERACTIVE CONTACT TRANSMISSION MODAL (ON "CONTACT US" CLICK)
          ============================================================ */}
      {showContactModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[92dvh] overflow-y-auto bg-[#070b10] border border-white/20 rounded-2xl p-6 sm:p-10 md:p-12 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow: '0 25px 70px rgba(0,0,0,0.95), 0 0 50px rgba(0,75,181,0.25)',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-white/50 hover:text-white text-xl sm:text-2xl font-mono p-1.5 transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#004bb5]/20 border border-[#004bb5] flex items-center justify-center mx-auto text-[#004bb5] text-xl sm:text-2xl">
                  ✓
                </div>
                <h4
                  className="text-xl sm:text-2xl md:text-3xl font-bold uppercase text-white"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Message Sent
                </h4>
                <p className="text-xs sm:text-sm md:text-base text-gray-400">
                  Thank you. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 sm:space-y-6 pt-1 sm:pt-2">
                <div>
                  <label className="block text-xs sm:text-sm font-mono tracking-wider uppercase text-white/70 mb-1.5 sm:mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3.5 md:py-4 bg-black/60 border border-white/15 rounded-lg text-white text-xs sm:text-sm md:text-base font-sans placeholder:text-white/30 focus:border-[#004bb5] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-mono tracking-wider uppercase text-white/70 mb-1.5 sm:mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@studio.com"
                    className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3.5 md:py-4 bg-black/60 border border-white/15 rounded-lg text-white text-xs sm:text-sm md:text-base font-sans placeholder:text-white/30 focus:border-[#004bb5] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-mono tracking-wider uppercase text-white/70 mb-1.5 sm:mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="What are you building?"
                    className="w-full px-3.5 sm:px-5 py-2.5 sm:py-3.5 md:py-4 bg-black/60 border border-white/15 rounded-lg text-white text-xs sm:text-sm md:text-base font-sans placeholder:text-white/30 focus:border-[#004bb5] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
                    {errorMessage}
                  </div>
                )}

                <div className="pt-1 sm:pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-4 md:py-4.5 px-6 sm:px-8 bg-[#004bb5] hover:bg-[#003893] active:scale-[0.98] text-white font-bold uppercase text-xs sm:text-sm md:text-base rounded-lg transition-all cursor-pointer shadow-lg shadow-[#004bb5]/25 tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
