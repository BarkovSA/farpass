/**
 * useTerminalTheme — returns a theme object with colors, CSS variables,
 * and helper flags for the current terminal style.
 *
 * When style is 'off', returns null so components render default DaisyUI.
 */

import { useTerminalStyle } from '@shared/context/TerminalStyleContext';
import type { TerminalStyle } from '@shared/theme/theme';

export interface TerminalThemeConfig {
  style: 'vscode' | 'retro' | 'matrix';
  fontFamily: string;
  pageBg: string;
  cardBg: string;
  border: string;
  text: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  /** Additional box-shadow for borders / glow effects */
  borderGlow: string;
  /** text-shadow for headings */
  headingGlow: string;
  /** Button background */
  btnBg: string;
  btnHoverBg: string;
  btnText: string;
  /** Prefix for button text (e.g. "$ " for vscode) */
  btnPrefix: string;
  /** CSS for scan-lines / grid overlay */
  overlayBg: string;
  overlayOpacity: number;
}

const FONT = "'JetBrains Mono', monospace";

const VSCODE_THEME: TerminalThemeConfig = {
  style: 'vscode',
  fontFamily: FONT,
  pageBg: '#0d1117',
  cardBg: '#161b22',
  border: '#30363d',
  text: '#f0f6fc',
  textSecondary: '#9ba5af',
  accent: '#58a6ff',
  success: '#3fb950',
  warning: '#f0a500',
  error: '#ff7b72',
  borderGlow: 'none',
  headingGlow: 'none',
  btnBg: '#238636',
  btnHoverBg: '#2ea043',
  btnText: '#ffffff',
  btnPrefix: '$ ',
  overlayBg: 'none',
  overlayOpacity: 0,
};

const RETRO_THEME: TerminalThemeConfig = {
  style: 'retro',
  fontFamily: FONT,
  pageBg: '#050f05',
  cardBg: '#020a02',
  border: '#003300',
  text: '#00ff46',
  textSecondary: '#00bb00',
  accent: '#00cc00',
  success: '#00ff46',
  warning: '#aaff00',
  error: '#ff4400',
  borderGlow: '0 0 8px rgba(0,200,0,0.3)',
  headingGlow: '0 0 8px rgba(0,255,70,0.6)',
  btnBg: '#003300',
  btnHoverBg: '#004400',
  btnText: '#00ff46',
  btnPrefix: '',
  overlayBg:
    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
  overlayOpacity: 0.12,
};

const MATRIX_THEME: TerminalThemeConfig = {
  style: 'matrix',
  fontFamily: FONT,
  pageBg: 'linear-gradient(180deg, #000d00 0%, #001200 100%)',
  cardBg: 'rgba(0,20,0,0.85)',
  border: '#003300',
  text: '#00ff41',
  textSecondary: '#009900',
  accent: '#39ff14',
  success: '#00ff41',
  warning: '#ccff00',
  error: '#ff0040',
  borderGlow: '0 0 12px rgba(0,255,65,0.3)',
  headingGlow: '0 0 10px rgba(0,255,65,0.9), 0 0 20px rgba(0,255,65,0.5)',
  btnBg: 'transparent',
  btnHoverBg: 'rgba(0,255,65,0.1)',
  btnText: '#00ff41',
  btnPrefix: '> ',
  overlayBg:
    'repeating-linear-gradient(90deg, #00ff00 0px, transparent 1px, transparent 8px)',
  overlayOpacity: 0.04,
};

const THEMES: Record<string, TerminalThemeConfig> = {
  vscode: VSCODE_THEME,
  retro: RETRO_THEME,
  matrix: MATRIX_THEME,
};

export function getTerminalTheme(
  style: TerminalStyle,
): TerminalThemeConfig | null {
  if (style === 'off') return null;
  return THEMES[style] ?? null;
}

/**
 * React hook — returns theme config or null when style='off'.
 */
export function useTerminalTheme(): TerminalThemeConfig | null {
  const { terminalStyle } = useTerminalStyle();
  return getTerminalTheme(terminalStyle);
}
