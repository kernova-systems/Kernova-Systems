import React, { useEffect, useRef, useState, useCallback } from 'react';

interface GlacierFlightCanvasProps {
  flightProgress: number; // 0.0 (inception buildings) to 1.0 (glaciers)
  className?: string;
  style?: React.CSSProperties;
}

export const GlacierFlightCanvas: React.FC<GlacierFlightCanvasProps> = ({
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

  // Preload all 180 high-resolution (1080p 30fps) WebP frames with matched contrast
  useEffect(() => {
    const totalFrames = 180;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const pad = String(i).padStart(3, '0');
      img.src = `/mountain-flight-frames/frame-${pad}.webp`;

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
    // Map 0.0 -> 1.0 to frame index 0 -> 179 (180 frames @ 30fps)
    const target = Math.min(179, Math.max(0, Math.floor(flightProgress * 179.99)));
    targetFrameRef.current = target;
  }, [flightProgress]);

  // Ultra-snappy, buttery 60fps/120fps animation loop with zero sluggish lag
  useEffect(() => {
    let running = true;

    const tick = () => {
      if (!running) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.005) {
        // Fast, direct tracking with smooth micro-easing
        currentFrameRef.current += diff * 0.48;
        const frameToRender = Math.min(179, Math.max(0, Math.round(currentFrameRef.current)));
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

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none select-none"
      />
    </div>
  );
};
