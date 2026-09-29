import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import {
  Calendar,
  Heart,
  BookOpen,
  MessageSquare,
  FileText,
  Settings,
  ArrowRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface CenterStageMockupProps {
  progress?: number;
  grassProgress?: number;
  flightProgress?: number;
}

type DeviceMode = 'mobile' | 'tablet' | 'desktop';

const getDeviceMode = (): DeviceMode => {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();
  const isTabletDevice =
    /ipad/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
    (/android/.test(ua) && !/mobile/.test(ua)) ||
    /tablet|playbook|silk/.test(ua);
  const isPhoneDevice = !isTabletDevice && /iphone|ipod|android.*mobile|mobile|windows phone|blackberry/i.test(ua);

  const w = window.innerWidth;
  const h = window.innerHeight;

  // If landscape on desktop/laptop or landscape tablet (w >= 900 and landscape):
  // Use desktop vector sanctuary dashboard! It scales via cqw and looks incredible.
  if (w >= 900 && w >= h * 1.1) return 'desktop';
  if (w >= 1024) return 'desktop';

  // If portrait tablet or medium viewport in portrait:
  if ((isTabletDevice && h >= w) || (w >= 600 && w < 1024 && h >= w)) return 'tablet';

  // If mobile phone or narrow screen:
  if (isPhoneDevice || w < 600) return 'mobile';

  return 'desktop';
};

export const CenterStageMockup: React.FC<CenterStageMockupProps> = ({
  progress = 0,
  grassProgress = 0,
  flightProgress = 0,
}) => {
  const [dimensions, setDimensions] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1440,
    h: typeof window !== 'undefined' ? window.innerHeight : 900,
  }));
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => getDeviceMode());

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      });
      setDeviceMode(getDeviceMode());
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Configuration tuned per device form factor
  // Note: HeroTransition cameraRigRef applies ~1.3636x perspective zoom (camZ = 320px in 1200px perspective),
  // so max-widths are calibrated with / 1.3636 to prevent horizontal screen overflow at any zoom level.
  const deviceConfig = {
    mobile: {
      popupTravel: 340,
      borderRadius: 'rounded-[22px] sm:rounded-[26px]',
      style: {
        width: 'min(calc(72vw / 1.3636), 260px)',
        aspectRatio: '360 / 800',
        maxWidth: 'calc(76vw / 1.3636)',
      } as React.CSSProperties,
    },
    tablet: {
      popupTravel: 380,
      borderRadius: 'rounded-xl',
      style: {
        width: 'min(calc(64vw / 1.3636), 400px)',
        aspectRatio: '593 / 792',
        maxWidth: 'calc(75vw / 1.3636)',
      } as React.CSSProperties,
    },
    desktop: {
      popupTravel: 500,
      borderRadius: 'rounded-2xl',
      style: {
        width: 'min(calc(84vw / 1.3636), 960px)',
        aspectRatio: '1024 / 495',
        maxHeight: 'min(calc(50vh / 1.3636), 480px)',
        maxWidth: 'calc(88vw / 1.3636)',
        containerType: 'inline-size',
      } as React.CSSProperties,
    },
  }[deviceMode];

  // =========================================================================
  // 1. WIDGET VERTICAL POP-UP & POP-DOWN ANIMATION
  // - Starts emerging when doors open (progress >= 0.20)
  // - Anchored into foreground grass: exactly 60% visible above screen bottom (40% submerged)
  // - When user scrolls (grassProgress > 0.20), widget pops down into the grass
  // =========================================================================
  const vh = dimensions.h;
  const vw = dimensions.w;
  const camScale = 1.3636;

  const widget3DWidth = {
    mobile: Math.min((vw * 0.72) / camScale, 260),
    tablet: Math.min((vw * 0.64) / camScale, 400),
    desktop: Math.min((vw * 0.84) / camScale, 960),
  }[deviceMode];

  const widget3DHeight = {
    mobile: widget3DWidth * (800 / 360),
    tablet: widget3DWidth * (792 / 593),
    desktop: Math.min(widget3DWidth * (495 / 1024), Math.min((vh * 0.50) / camScale, 480)),
  }[deviceMode];

  // Resting position: EXACTLY 60% of the widget is visible above the bottom of the screen (40% submerged into the grass) irrespective of device size
  const yBottom = (vh * 0.50) / camScale;
  const rawRestingY = yBottom - 0.10 * widget3DHeight;

  // ── SAFE-ZONE GUARD ──────────────────────────────────────────────────────
  // The text block lives at the viewport centre. On narrow/tall screens the
  // widget can creep up into the text area. We measure where the text ends
  // (centre + half the estimated text block height) in camera-compensated
  // coordinates and force the widget top to always be BELOW that line.
  //
  // Text block estimated heights in camera-space:
  //   mobile  ≈ 130px  (h2 ~28px + para ~36px + gaps)
  //   tablet  ≈ 110px
  //   desktop ≈ 90px
  const textBlockHalfHeight = { mobile: 80, tablet: 70, desktop: 55 }[deviceMode];
  // Centre of the viewport in camera-compensated coords:
  const viewportCentreY = vh / 2 / camScale;
  // Minimum Y value for the widget top (text bottom + 16px breathing room):
  const minWidgetTopY = viewportCentreY + textBlockHalfHeight / camScale + 16;
  // restingY is the *top* of the widget (it translates DOWN from centre):
  // widget top in viewport = (vh/2 / camScale) + restingY — widget3DHeight/2
  // We want: (vh/2/camScale) + restingY - widget3DHeight/2  >=  minWidgetTopY
  // ⟹  restingY  >=  minWidgetTopY - (vh/2/camScale) + widget3DHeight/2
  const minRestingY = minWidgetTopY - viewportCentreY + widget3DHeight / 2;
  const restingY = Math.max(rawRestingY, minRestingY);
  const popupTravel = deviceConfig.popupTravel;

  // Entrance pop-up as doors open:
  let entranceT = 0;
  if (progress > 0.20) {
    entranceT = Math.min(1, (progress - 0.20) / 0.78);
  }
  const popEase = gsap.parseEase('back.out(1.4)')(entranceT);
  const entranceY = restingY + (1 - popEase) * popupTravel;
  const entranceScale = 0.85 + popEase * 0.15;
  const entranceOpacity = Math.min(1, entranceT * 5.0);

  // Widget pops down when viewer scrolls in grasslands (grassProgress > 0.20)
  const popDownT = Math.min(1, Math.max(0, (grassProgress - 0.18) / 0.30));
  const popDownEase = gsap.parseEase('power2.inOut')(popDownT);
  const popDownY = popDownEase * (popupTravel * 1.35);
  const popDownOpacity = Math.max(0, 1 - popDownT * 1.5);
  const popDownScale = 1 - popDownEase * 0.12;

  // Flight pop-down if camera flight takes off:
  const exitT = Math.min(1, flightProgress / 0.15);
  const exitEase = gsap.parseEase('power2.in')(exitT);
  const exitY = exitEase * popupTravel;
  const exitOpacity = Math.max(0, 1 - exitT * 2);

  const widgetY = entranceY + popDownY + exitY;
  const widgetScale = entranceScale * popDownScale;
  const widgetOpacity = entranceOpacity * popDownOpacity * exitOpacity;

  // =========================================================================
  // 2. TEXT 1: YOU'RE MOVING. (H)
  // Positioned in the exact same open central area that Text 2 captures.
  // =========================================================================
  const textBaseShift = vh < 700 ? -18 : vh < 850 ? -32 : -48;
  const text1BaseShift = textBaseShift;
  const text1EntranceT = Math.min(1, Math.max(0, (progress - 0.18) / 0.70));
  const text1EntranceEase = gsap.parseEase('power2.out')(text1EntranceT);
  const text1ExitT = Math.min(1, Math.max(0, (grassProgress - 0.14) / 0.22));
  const text1ExitEase = gsap.parseEase('power2.in')(text1ExitT);
  const text1Y = (1 - text1EntranceEase) * 30 - text1ExitEase * 30 + text1BaseShift;
  const text1Scale = 0.94 + text1EntranceEase * 0.06;
  const text1Opacity = Math.min(1, text1EntranceT * 3.5) * Math.max(0, 1 - text1ExitT * 1.5) * Math.max(0, 1 - flightProgress * 6);

  // =========================================================================
  // 3. TEXT 2: "But somewhere between / 'I'm interested' / and / 'let's do this' / something gets lost."
  // Pops up as viewer scrolls, widget pops down, background is video.
  // Shares the exact same vertical center offset and space as Text 1.
  // =========================================================================
  const text2BaseShift = textBaseShift;
  const text2EntranceT = Math.min(1, Math.max(0, (grassProgress - 0.24) / 0.28));
  const text2EntranceEase = gsap.parseEase('power2.out')(text2EntranceT);
  const text2ExitT = Math.min(1, Math.max(0, (grassProgress - 0.84) / 0.16));
  const text2ExitEase = gsap.parseEase('power2.in')(text2ExitT);
  const text2Y = (1 - text2EntranceEase) * 30 - text2ExitEase * 30 + text2BaseShift;
  const text2Scale = 0.94 + text2EntranceEase * 0.06;
  const text2Opacity = Math.min(1, text2EntranceT * 2.4) * Math.max(0, 1 - text2ExitT * 1.5) * Math.max(0, 1 - flightProgress * 8);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 flex flex-col items-center justify-center">
      {/* =========================================================================
          TEXT 1: IN THE EXACT SAME CENTRAL MEADOW SPACE AS TEXT 2
          Header: Syne Bold 700 (H)
          Para: Inter Medium 500 (I)
          ========================================================================= */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-20"
        style={{
          transform: `translate3d(0, ${text1Y}px, 0) scale(${text1Scale})`,
          opacity: text1Opacity,
          willChange: 'transform, opacity',
          visibility: text1Opacity <= 0.005 ? 'hidden' : 'visible',
        }}
      >
        <div
          className="text-center mx-auto flex flex-col items-center pointer-events-auto px-2"
          style={{
            maxWidth: 'min(calc(84vw / 1.3636), 640px)',
            width: '100%',
          }}
        >
          <h2
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold uppercase tracking-tight text-[#0A140D] drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] leading-[1.08] select-none"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            YOU'RE MOVING.
          </h2>
          <p
            className="mt-1.5 sm:mt-2.5 text-xs sm:text-sm md:text-base lg:text-lg text-[#1E3024] font-medium max-w-md mx-auto leading-relaxed drop-shadow-[0_1px_10px_rgba(255,255,255,0.95)] select-none px-2"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            Your business is moving every day.<br className="hidden sm:inline" />
            People are finding you. People are reaching out.
          </p>
        </div>
      </div>

      {/* =========================================================================
          TEXT 2: POETIC CONNECTOR
          ========================================================================= */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none z-30"
        style={{
          transform: `translate3d(0, ${text2Y}px, 0) scale(${text2Scale})`,
          opacity: text2Opacity,
          willChange: 'transform, opacity',
          visibility: text2Opacity <= 0.005 ? 'hidden' : 'visible',
        }}
      >
        <div
          className="text-center mx-auto flex flex-col items-center py-2 px-2"
          style={{
            maxWidth: 'min(calc(84vw / 1.3636), 640px)',
            width: '100%',
          }}
        >
          {/* Line 1: But somewhere between */}
          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg text-[#0A140D] font-semibold leading-relaxed drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] select-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            But somewhere between
          </p>

          {/* Line 2: "I'm interested" */}
          <p
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A140D] font-bold italic my-0.5 sm:my-1.5 leading-[1.08] drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] select-none"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontStyle: 'italic',
            }}
          >
            “I’m interested”
          </p>

          {/* Line 3: and */}
          <p
            className="text-[10px] sm:text-xs md:text-sm lg:text-base text-[#1E3024] font-semibold my-0.5 drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)] select-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            and
          </p>

          {/* Line 4: "let's do this" */}
          <p
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#0A140D] font-bold italic my-0.5 sm:my-1.5 leading-[1.08] drop-shadow-[0_2px_14px_rgba(255,255,255,0.95)] select-none"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 700,
              fontStyle: 'italic',
            }}
          >
            “let’s do this”
          </p>

          {/* Line 5: something gets lost. */}
          <p
            className="text-xs sm:text-sm md:text-base lg:text-lg text-[#0A140D] font-semibold leading-relaxed mt-1 sm:mt-2 drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)] select-none"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
            }}
          >
            something gets lost.
          </p>
        </div>
      </div>

      {/* =========================================================================
          SHOWCASE WIDGET (RESPONSIVE):
          - Phone: portfolio-screen-mobile.jpg (aspect 360 / 800)
          - Tablet: portfolio-screen-tablet.jpg (aspect 593 / 792)
          - Desktop: Vector Trinity Care Sanctuary Dashboard (aspect 1024 / 495)
          - Vertically POPS UP from below with back.out spring curve
          ========================================================================= */}
      <div
        className={`group relative pointer-events-auto shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95),0_12px_35px_-5px_rgba(0,0,0,0.7)] border border-white/25 bg-[#FAF9F5] overflow-hidden transition-shadow duration-300 hover:border-white/40 ${deviceConfig.borderRadius}`}
        style={{
          ...deviceConfig.style,
          transform: `translate3d(0, ${widgetY}px, 0) scale(${widgetScale})`,
          opacity: widgetOpacity,
          willChange: 'transform, opacity',
          visibility: widgetOpacity <= 0.005 ? 'hidden' : 'visible',
        }}
      >
        {/* Subtle glass reflection highlight on the top surface */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.10] z-20 ${deviceConfig.borderRadius}`}
          aria-hidden="true"
        />

        {/* Subtle inner bevel / border highlight for device realism */}
        <div
          className={`pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 z-20 ${deviceConfig.borderRadius}`}
          aria-hidden="true"
        />

        {/* =====================================================================
            1. PHONE WIDGET: portfolio-screen-mobile.jpg
            ===================================================================== */}
        {deviceMode === 'mobile' && (
          <div className="w-full h-full relative bg-[#FAF9F5] overflow-hidden select-none">
            <img
              src="/portfolio-screen-mobile.jpg"
              alt="Trinity Care Mobile Sanctuary"
              className="w-full h-full object-cover object-top select-none pointer-events-none block"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        )}

        {/* =====================================================================
            2. TABLET WIDGET: portfolio-screen-tablet.jpg
            ===================================================================== */}
        {deviceMode === 'tablet' && (
          <div className="w-full h-full relative bg-[#FAF9F5] overflow-hidden select-none flex flex-col items-center">
            <img
              src="/portfolio-screen-tablet.jpg"
              alt="Trinity Care Tablet Sanctuary"
              className="w-full h-full object-contain object-top select-none pointer-events-none block"
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </div>
        )}

        {/* =====================================================================
            3. DESKTOP WIDGET: NATIVE VECTOR REACT UI (100% CRYSTAL CLEAR AT ANY RESOLUTION)
            ===================================================================== */}
        {deviceMode === 'desktop' && (
        <div className="w-full h-full flex flex-row font-sans text-slate-800 bg-[#FAF9F5] select-none">
          {/* -------------------------------------------------------------
              LEFT SIDEBAR (~18% width)
              ------------------------------------------------------------- */}
          <aside
            className="bg-[#FBFBFA] border-r border-[#EBE8E1] flex flex-col justify-between py-[2.2cqw] px-[1.8cqw] select-none shrink-0"
            style={{ width: '18.2%' }}
          >
              <div>
                {/* Brand Logo & Name */}
                <div className="flex items-center gap-[0.7cqw] mb-[1.8cqw]">
                  <img
                    src="/trinity-care-logo.jpeg"
                    alt="Trinity Care Logo"
                    className="rounded-full object-cover shrink-0 border border-[#2B613D]/20 shadow-xs"
                    style={{ width: '2.4cqw', height: '2.4cqw' }}
                  />
                  <div className="flex flex-col justify-center leading-none">
                    <span
                      className="font-bold text-[#1C2B22] tracking-tight"
                      style={{ fontSize: '1.2cqw' }}
                    >
                      Trinity Care
                    </span>
                    <span
                      className="uppercase text-[#57685D] font-medium tracking-wider mt-[0.2cqw]"
                      style={{ fontSize: '0.75cqw' }}
                    >
                      Client Sanctuary
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button: Request Session */}
                <button
                  type="button"
                  className="w-full bg-[#2B613D] hover:bg-[#235032] text-white font-medium rounded-lg flex items-center justify-center gap-[0.6cqw] shadow-xs transition-colors cursor-pointer"
                  style={{
                    paddingTop: '0.7cqw',
                    paddingBottom: '0.7cqw',
                    fontSize: '1.05cqw',
                  }}
                >
                  <Calendar style={{ width: '1.2cqw', height: '1.2cqw' }} />
                  <span>Request Session</span>
                </button>

                {/* Secondary Fast Action Buttons: Journal & Check In */}
                <div className="grid grid-cols-2 gap-[0.6cqw] mt-[0.8cqw]">
                  <button
                    type="button"
                    className="bg-white hover:bg-slate-50 border border-[#E0DCD3] rounded-md text-[#57685D] font-medium flex items-center justify-center gap-[0.4cqw] transition-colors cursor-pointer"
                    style={{
                      paddingTop: '0.5cqw',
                      paddingBottom: '0.5cqw',
                      fontSize: '0.88cqw',
                    }}
                  >
                    <BookOpen style={{ width: '1.0cqw', height: '1.0cqw' }} />
                    <span>Journal</span>
                  </button>
                  <button
                    type="button"
                    className="bg-white hover:bg-slate-50 border border-[#E0DCD3] rounded-md text-[#57685D] font-medium flex items-center justify-center gap-[0.4cqw] transition-colors cursor-pointer"
                    style={{
                      paddingTop: '0.5cqw',
                      paddingBottom: '0.5cqw',
                      fontSize: '0.88cqw',
                    }}
                  >
                    <Heart style={{ width: '1.0cqw', height: '1.0cqw', color: '#E11D48' }} />
                    <span>Check In</span>
                  </button>
                </div>

                {/* Workspace Navigation Label */}
                <div
                  className="uppercase font-semibold text-[#8C9B90] tracking-wider mt-[1.8cqw] mb-[0.6cqw] px-[0.4cqw]"
                  style={{ fontSize: '0.75cqw' }}
                >
                  Sanctuary Workspace
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-[0.3cqw]">
                  {/* Overview (Active) */}
                  <div
                    className="bg-[#EAF1EB] text-[#2B613D] font-semibold rounded-lg flex items-center gap-[0.7cqw]"
                    style={{
                      padding: '0.65cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <Layers style={{ width: '1.2cqw', height: '1.2cqw', color: '#2B613D' }} />
                    <span>Overview</span>
                  </div>

                  {/* Sessions */}
                  <div
                    className="text-[#57685D] hover:text-[#1C2B22] rounded-lg flex items-center gap-[0.7cqw] transition-colors cursor-pointer"
                    style={{
                      padding: '0.6cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <Calendar style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    <span>Sessions</span>
                  </div>

                  {/* Journal & Mood */}
                  <div
                    className="text-[#57685D] hover:text-[#1C2B22] rounded-lg flex items-center gap-[0.7cqw] transition-colors cursor-pointer"
                    style={{
                      padding: '0.6cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <BookOpen style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    <span>Journal & Mood</span>
                  </div>

                  {/* Messages */}
                  <div
                    className="text-[#57685D] hover:text-[#1C2B22] rounded-lg flex items-center gap-[0.7cqw] transition-colors cursor-pointer"
                    style={{
                      padding: '0.6cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <MessageSquare style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    <span>Messages</span>
                  </div>

                  {/* Care Plan */}
                  <div
                    className="text-[#57685D] hover:text-[#1C2B22] rounded-lg flex items-center gap-[0.7cqw] transition-colors cursor-pointer"
                    style={{
                      padding: '0.6cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <FileText style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    <span>Care Plan</span>
                  </div>

                  {/* Settings */}
                  <div
                    className="text-[#57685D] hover:text-[#1C2B22] rounded-lg flex items-center gap-[0.7cqw] transition-colors cursor-pointer"
                    style={{
                      padding: '0.6cqw 0.8cqw',
                      fontSize: '0.98cqw',
                    }}
                  >
                    <Settings style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    <span>Settings</span>
                  </div>
                </nav>
              </div>

              {/* Bottom SOS Support Pill & Legal */}
              <div className="pt-[1cqw] border-t border-[#EBE8E1]/80">
                <div
                  className="border border-rose-200 bg-rose-50/70 text-rose-600 rounded-lg flex items-center justify-between font-semibold"
                  style={{
                    padding: '0.4cqw 0.8cqw',
                    fontSize: '0.85cqw',
                  }}
                >
                  <div className="flex items-center gap-[0.5cqw]">
                    <Shield style={{ width: '1.1cqw', height: '1.1cqw' }} />
                    <span>SOS Support</span>
                  </div>
                  <span
                    className="bg-rose-500 text-white rounded-full font-bold uppercase"
                    style={{
                      padding: '0.1cqw 0.5cqw',
                      fontSize: '0.65cqw',
                    }}
                  >
                    24/7
                  </span>
                </div>

                <div
                  className="text-[#8C9B90] text-center mt-[0.6cqw]"
                  style={{ fontSize: '0.65cqw' }}
                >
                  About • Privacy • Terms • Guidelines
                </div>
              </div>
            </aside>

            {/* -------------------------------------------------------------
                MAIN CONTENT AREA (~81.8% width)
                ------------------------------------------------------------- */}
            <main
              className="flex-1 bg-[#FAF9F5] flex flex-col justify-between overflow-hidden"
              style={{ padding: '2.4cqw 3.0cqw 2.0cqw 3.0cqw' }}
            >
              {/* Top Banner Row */}
              <div className="flex items-start justify-between">
                <div>
                  <h1
                    className="font-bold text-[#1C2B22] tracking-tight leading-tight"
                    style={{ fontSize: '2.5cqw' }}
                  >
                    Welcome, Sanctuary
                  </h1>
                  <p
                    className="text-[#57685D] font-normal leading-relaxed mt-[0.4cqw]"
                    style={{ fontSize: '1.1cqw' }}
                  >
                    &ldquo;Because Every Heart Deserves to Heal.&rdquo; Your private space for therapeutic reflections, guided somatic tools, and upcoming appointments.
                  </p>
                </div>

                {/* Top Right Request a Session Button */}
                <button
                  type="button"
                  className="bg-[#2B613D] hover:bg-[#235032] text-white font-medium rounded-lg flex items-center gap-[0.6cqw] shadow-xs transition-colors shrink-0 cursor-pointer"
                  style={{
                    padding: '0.8cqw 1.6cqw',
                    fontSize: '1.15cqw',
                  }}
                >
                  <Calendar style={{ width: '1.3cqw', height: '1.3cqw' }} />
                  <span>Request a Session</span>
                </button>
              </div>

              {/* Three Stat / Summary Cards */}
              <div className="grid grid-cols-3 gap-[1.6cqw] my-[1.6cqw]">
                {/* Card 1: Next Consultation */}
                <div
                  className="bg-[#F4F3EE] border border-[#E6E3DA] rounded-xl flex flex-col justify-between"
                  style={{ padding: '1.4cqw 1.6cqw' }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-medium text-[#57685D]"
                      style={{ fontSize: '0.95cqw' }}
                    >
                      Next Consultation
                    </span>
                    <div
                      className="rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"
                      style={{ width: '2.2cqw', height: '2.2cqw' }}
                    >
                      <Calendar style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold text-[#1C2B22] tracking-tight"
                      style={{ fontSize: '1.8cqw', marginTop: '0.4cqw' }}
                    >
                      None Scheduled
                    </div>
                    <div
                      className="text-[#8C9B90] mt-[0.2cqw]"
                      style={{ fontSize: '0.88cqw' }}
                    >
                      Request your slot in 1-tap
                    </div>
                  </div>
                </div>

                {/* Card 2: Emotional Well-Being */}
                <div
                  className="bg-[#F4F3EE] border border-[#E6E3DA] rounded-xl flex flex-col justify-between"
                  style={{ padding: '1.4cqw 1.6cqw' }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-medium text-[#57685D]"
                      style={{ fontSize: '0.95cqw' }}
                    >
                      Emotional Well-Being
                    </span>
                    <div
                      className="rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"
                      style={{ width: '2.2cqw', height: '2.2cqw' }}
                    >
                      <Heart style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold text-[#1C2B22] tracking-tight"
                      style={{ fontSize: '1.8cqw', marginTop: '0.4cqw' }}
                    >
                      Log Today
                    </div>
                    <div
                      className="text-[#8C9B90] mt-[0.2cqw]"
                      style={{ fontSize: '0.88cqw' }}
                    >
                      Tap to record how you feel
                    </div>
                  </div>
                </div>

                {/* Card 3: Personal Journal */}
                <div
                  className="bg-[#F4F3EE] border border-[#E6E3DA] rounded-xl flex flex-col justify-between"
                  style={{ padding: '1.4cqw 1.6cqw' }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="font-medium text-[#57685D]"
                      style={{ fontSize: '0.95cqw' }}
                    >
                      Personal Journal
                    </span>
                    <div
                      className="rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0"
                      style={{ width: '2.2cqw', height: '2.2cqw' }}
                    >
                      <BookOpen style={{ width: '1.2cqw', height: '1.2cqw' }} />
                    </div>
                  </div>
                  <div>
                    <div
                      className="font-bold text-[#1C2B22] tracking-tight"
                      style={{ fontSize: '1.8cqw', marginTop: '0.4cqw' }}
                    >
                      0
                    </div>
                    <div
                      className="text-[#8C9B90] mt-[0.2cqw]"
                      style={{ fontSize: '0.88cqw' }}
                    >
                      Private Reflections Saved
                    </div>
                  </div>
                </div>
              </div>

              {/* Large Lower Card: Your Next Session */}
              <div
                className="bg-white border border-[#E6E3DA] rounded-xl flex-1 flex flex-col justify-between"
                style={{ padding: '1.6cqw 2.0cqw' }}
              >
                {/* Card Header Row */}
                <div className="flex items-center justify-between border-b border-[#F0ECE3] pb-[1.0cqw]">
                  <div className="flex items-center gap-[0.7cqw]">
                    <Calendar style={{ width: '1.4cqw', height: '1.4cqw', color: '#2B613D' }} />
                    <span
                      className="font-semibold text-[#1C2B22]"
                      style={{ fontSize: '1.2cqw' }}
                    >
                      Your Next Session
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-[#2B613D] hover:underline font-semibold flex items-center gap-[0.4cqw] cursor-pointer"
                    style={{ fontSize: '1.05cqw' }}
                  >
                    <span>All Sessions (0)</span>
                    <ArrowRight style={{ width: '1.1cqw', height: '1.1cqw' }} />
                  </button>
                </div>

                {/* Empty State Center */}
                <div className="flex flex-col items-center justify-center py-[1.2cqw] text-center my-auto">
                  <div
                    className="rounded-full bg-[#EAF1EB] text-[#2B613D] flex items-center justify-center mb-[0.8cqw]"
                    style={{ width: '3.6cqw', height: '3.6cqw' }}
                  >
                    <Calendar style={{ width: '1.8cqw', height: '1.8cqw' }} />
                  </div>

                  <h3
                    className="font-bold text-[#1C2B22] tracking-tight"
                    style={{ fontSize: '1.4cqw' }}
                  >
                    No Consultations Scheduled
                  </h3>

                  <p
                    className="text-[#57685D] mt-[0.3cqw] max-w-[38cqw]"
                    style={{ fontSize: '1.0cqw', lineHeight: 1.35 }}
                  >
                    Request an in-person clinical consultation with your designated therapist at Trinity Sanctuary.
                  </p>

                  <button
                    type="button"
                    className="bg-[#2B613D] hover:bg-[#235032] text-white font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                    style={{
                      padding: '0.8cqw 2.0cqw',
                      fontSize: '1.05cqw',
                      marginTop: '1.0cqw',
                    }}
                  >
                    Request Session Now
                  </button>
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
