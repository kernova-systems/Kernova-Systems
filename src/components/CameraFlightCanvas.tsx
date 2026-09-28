import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CameraFlightCanvasProps {
  flightProgress: number; // 0.0 (landscape) to 1.0 (clouds & transition to yellow)
  className?: string;
  style?: React.CSSProperties;
}

export const CameraFlightCanvas: React.FC<CameraFlightCanvasProps> = ({
  flightProgress,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isLoadedRef = useRef<boolean>(false);
  const [, setLoadProgress] = useState<number>(0);

  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number>(0);
  const lastRenderedFrameRef = useRef<number>(-1);

  // Object-cover canvas drawing function
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Calculate object-cover dimensions (zero letterbox, 100% full coverage)
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
    lastRenderedFrameRef.current = frameIdx;
  }, []);

  // Responsive canvas sizing with devicePixelRatio support
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrame]);

  // Preload all 120 frames in order on mount
  useEffect(() => {
    const totalFrames = 120;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `/camera-transition-frames/ezgif-frame-${pad}.jpg`;

      const onLoad = () => {
        loadedCount++;
        setLoadProgress(loadedCount / totalFrames);
        if (i === 1) {
          renderFrame(0);
        }
        if (loadedCount === totalFrames) {
          isLoadedRef.current = true;
          renderFrame(Math.round(currentFrameRef.current));
        }
      };

      img.onload = onLoad;
      img.onerror = onLoad;
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
  }, [renderFrame]);

  // Update target frame based on flight progress
  useEffect(() => {
    // Map 0.0 -> 1.0 to frame index 0 -> 119
    const target = Math.min(119, Math.max(0, Math.floor(flightProgress * 119.99)));
    targetFrameRef.current = target;
  }, [flightProgress]);

  // Silky 60fps/120fps animation loop with smooth momentum easing
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        // Velvety smooth cinematic frame interpolation
        currentFrameRef.current += diff * 0.22;
        const frameToRender = Math.min(119, Math.max(0, Math.round(currentFrameRef.current)));
        if (frameToRender !== lastRenderedFrameRef.current) {
          renderFrame(frameToRender);
        }
      } else if (Math.round(currentFrameRef.current) !== targetFrameRef.current) {
        currentFrameRef.current = targetFrameRef.current;
        renderFrame(targetFrameRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [renderFrame]);

  // Atmospheric fade into pure white clouds at the end of cloud flight
  const endFlightFadeOpacity = Math.max(0, Math.min(1, (flightProgress - 0.78) / 0.18));

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      style={style}
    >
      {/* Instant static baseline image (Frame 1) so there is never a blank or black flash */}
      <img
        src="/camera-transition-frames/ezgif-frame-001.jpg"
        alt="Landscape Flight Start"
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none select-none z-[1]"
      />

      {/* Seamless pure white cloud wash into Inception Section */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-150 z-[2]"
        style={{
          backgroundColor: '#FFFFFF',
          opacity: endFlightFadeOpacity,
        }}
      />
    </div>
  );
};
