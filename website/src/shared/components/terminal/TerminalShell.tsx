/**
 * TerminalShell — wraps the entire page when a terminal style is active.
 * When style='off' renders children as-is (DaisyUI unchanged).
 *
 * Also provides the scan-line / glitch overlay for retro & matrix styles
 * and sets the correct body background.
 */

import { useEffect, type ReactNode } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';
import MatrixRainCanvas from './MatrixRain';

interface TerminalShellProps {
  children: ReactNode;
}

export default function TerminalShell({ children }: TerminalShellProps) {
  const theme = useTerminalTheme();

  // set body bg for terminal styles (and clean up on unmount / style change)
  useEffect(() => {
    if (!theme) {
      document.body.style.background = '';
      return;
    }
    document.body.style.background = theme.pageBg;
    return () => {
      document.body.style.background = '';
    };
  }, [theme]);

  if (!theme) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        fontFamily: theme.fontFamily,
        color: theme.text,
        background: theme.pageBg,
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      {/* Matrix rain background animation */}
      {theme.style === 'matrix' && <MatrixRainCanvas />}
      {/* Scan-line / grid overlay */}
      {theme.overlayBg !== 'none' && (
        <div
          className="pointer-events-none fixed inset-0 z-50"
          style={{
            background: theme.overlayBg,
            opacity: theme.overlayOpacity,
          }}
        />
      )}
      {/* Vignette for retro */}
      {theme.style === 'retro' && (
        <div
          className="pointer-events-none fixed inset-0 z-40"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      )}
      {children}
    </div>
  );
}
