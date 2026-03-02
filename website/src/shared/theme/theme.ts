export type LogicalTheme = 'light' | 'dark';
export type ColorScheme = 'orange' | 'violet';
export type TerminalStyle = 'off' | 'vscode' | 'retro' | 'matrix';

export const LIGHT_DAISY_THEME = 'emerald';
export const DARK_DAISY_THEME = 'dim';

export const THEME_STORAGE_KEY = 'themeMode';
export const COLOR_SCHEME_KEY = 'colorScheme';
export const TERMINAL_STYLE_KEY = 'terminalStyle';

export const TERMINAL_STYLES: TerminalStyle[] = ['off', 'vscode', 'retro', 'matrix'];

export function getInitialTerminalStyle(): TerminalStyle {
  try {
    const stored = localStorage.getItem(TERMINAL_STYLE_KEY) as TerminalStyle | null;
    if (stored && TERMINAL_STYLES.includes(stored)) return stored;
  } catch {
    void 0;
  }
  return 'vscode';
}

export function getInitialColorScheme(): ColorScheme {
  try {
    const stored = localStorage.getItem(COLOR_SCHEME_KEY) as ColorScheme | null;
    if (stored === 'orange' || stored === 'violet') return stored;
  } catch {
    void 0;
  }
  return 'orange';
}

export function logicalToDaisyTheme(mode: LogicalTheme): string {
  return mode === 'dark' ? DARK_DAISY_THEME : LIGHT_DAISY_THEME;
}

export function getInitialLogicalTheme(): LogicalTheme {
  try {
    const stored = localStorage.getItem(
      THEME_STORAGE_KEY,
    ) as LogicalTheme | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // ignore and fall back to media query
  }
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}
