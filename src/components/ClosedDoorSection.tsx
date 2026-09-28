import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { KernovaLogo } from './KernovaLogo';
import { ExperienceTypography } from './ExperienceTypography';
import { CenterStageMockup } from './CenterStageMockup';

export interface ClosedDoorSectionProps {
  doorProgress?: number;
  onInteract?: () => void;
  trackRef?: React.RefObject<HTMLDivElement | null>;
}

export const ClosedDoorSection: React.FC<ClosedDoorSectionProps> = ({
  doorProgress = 0,
  onInteract,
  trackRef,
}) => {
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const whitePanelRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Motion smoothing refs for fluid 60fps/120fps glide
  const targetProgressRef = useRef<number>(doorProgress);
  const currentProgressRef = useRef<number>(doorProgress);

  useEffect(() => {
    targetProgressRef.current = doorProgress;
  }, [doorProgress]);

  // Auto-play grasslands backdrop video and sync with hero video if present
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
      const heroVideo = document.querySelector('#hero-section video') as HTMLVideoElement | null;
      if (heroVideo && !isNaN(heroVideo.currentTime)) {
        video.currentTime = heroVideo.currentTime;
      }
    }
  }, []);

  // Continuous GSAP ticker damping with parallax depth
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

      // Smooth exponential inertia damping
      if (Math.abs(diff) > 0.0001) {
        current += diff * 0.09;
        currentProgressRef.current = current;
      } else {
        current = target;
        currentProgressRef.current = target;
      }

      let openProgress = 0;
      if (current > 0.04) {
        openProgress = Math.min(1, (current - 0.04) / 0.92);
      }
      const ease = gsap.parseEase('power2.inOut')(openProgress);

      const blackY_vh = -ease * 76;
      const whiteY_vh = ease * 30;
      const camZ = ease * 320;
      const camY = Math.sin(openProgress * Math.PI) * -8;
      const tiltAngle = Math.sin(openProgress * Math.PI) * 2.0;

      const logoY_vh = ease * 14;
      const logoScale = 1 - ease * 0.04;
      const textY_vh = -ease * 7;
      const bgScale = 1.06 - ease * 0.06;

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

  return (
    <section
      ref={trackRef}
      id="loop-door-track"
      className="relative w-full bg-black select-none"
      style={{
        // 300vh track provides generous physical scroll length for slow, smooth, cinematic door parting
        height: '300vh',
      }}
    >
      <div
        id="loop-closed-door"
        onClick={onInteract}
        className="sticky top-0 w-full h-screen overflow-hidden select-none bg-black cursor-pointer"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* 3D CAMERA RIG (Wraps all layers matching HeroTransition) */}
        <div
          ref={cameraRigRef}
          className="absolute inset-0 w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* ============================================================
              LAYER 0: GRASSLANDS VIDEO BACKDROP (Behind opening doors)
              ============================================================ */}
          <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none select-none">
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
              LAYER 1: CENTRAL STAGE MOCKUP (65% visibility responsive widget)
              Pops up dynamically as bottom doors part open
              ============================================================ */}
          <CenterStageMockup progress={doorProgress} flightProgress={0} />

          {/* ============================================================
              LAYER 2: PARTING ARCHITECTURAL DOOR PANELS (z-30)
              ============================================================ */}
          {/* Upper Black Panel (73vh) */}
          <div
            ref={blackPanelRef}
            className="absolute top-0 left-0 w-full bg-[#000000] z-30 flex flex-col justify-between overflow-hidden"
            style={{
              height: '73vh',
              transformOrigin: 'top center',
              willChange: 'transform',
            }}
          >
            {/* Top spacer */}
            <div className="w-full px-8 md:px-12 pt-8 md:pt-10 h-14 pointer-events-none" />

            {/* Official Kernova Logo Area with floating parallax (Really Big, Center Aligned) */}
            <div ref={logoRef} className="flex-1 flex items-center justify-center px-6 w-full text-center">
              <KernovaLogo
                variant="full"
                theme="dark"
                height="clamp(80px, 18vw, 270px)"
              />
            </div>
          </div>

          {/* Lower White Panel (27vh) */}
          <div
            ref={whitePanelRef}
            className="absolute left-0 w-full bg-[#fefefe] z-30 overflow-hidden"
            style={{
              top: '73vh',
              height: '27vh',
              transformOrigin: 'bottom center',
              willChange: 'transform',
            }}
          >
            {/* Typography Area: Center Aligned */}
            <div ref={textRef} className="w-full h-full px-6 flex flex-col items-center justify-center text-center">
              <ExperienceTypography />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

