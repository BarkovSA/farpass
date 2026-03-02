/**
 * MatrixRain — Canvas-based falling characters animation
 * for the Matrix terminal style background.
 *
 * Renders a fixed, full-screen <canvas> behind all content.
 * Only mounts when the current terminal style is 'matrix'.
 */

import { useEffect, useRef, memo } from 'react';

const CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const FONT_SIZE = 12;
const FADE_ALPHA = 0.08;
const FRAME_INTERVAL = 65; // ms between frames (~15 fps, slower cascade)

function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / FONT_SIZE);
    const drops: number[] = Array.from({ length: columns }, () =>
      Math.random() * -100,
    );

    function draw(now: number) {
      animId = requestAnimationFrame(draw);

      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      // Semi-transparent black overlay to create fading trail
      ctx!.fillStyle = `rgba(0, 5, 0, ${FADE_ALPHA})`;
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Dimmer palette — sits deep in the background
        ctx!.fillStyle =
          Math.random() > 0.97
            ? '#99ffbb'
            : Math.random() > 0.85
              ? '#228a3a'
              : '#145a22';

        ctx!.fillText(char, x, y);

        // Reset drop when it reaches bottom (with randomness)
        if (y > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.22,
      }}
    />
  );
}

export default memo(MatrixRainCanvas);
