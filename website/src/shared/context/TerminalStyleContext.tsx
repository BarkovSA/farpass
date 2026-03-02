import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  type TerminalStyle,
  TERMINAL_STYLES,
  TERMINAL_STYLE_KEY,
  getInitialTerminalStyle,
} from '@shared/theme/theme';

interface TerminalStyleContextValue {
  terminalStyle: TerminalStyle;
  setTerminalStyle: (s: TerminalStyle) => void;
  cycleTerminalStyle: () => void;
}

const TerminalStyleContext = createContext<TerminalStyleContextValue | null>(null);

export function TerminalStyleProvider({ children }: { children: ReactNode }) {
  const [terminalStyle, setTerminalStyleState] = useState<TerminalStyle>(getInitialTerminalStyle);

  const setTerminalStyle = (s: TerminalStyle) => {
    setTerminalStyleState(s);
    try {
      localStorage.setItem(TERMINAL_STYLE_KEY, s);
    } catch {
      void 0;
    }
  };

  const cycleTerminalStyle = () => {
    const idx = TERMINAL_STYLES.indexOf(terminalStyle);
    setTerminalStyle(TERMINAL_STYLES[(idx + 1) % TERMINAL_STYLES.length]);
  };

  // синхронизация между вкладками
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === TERMINAL_STYLE_KEY && e.newValue) {
        const val = e.newValue as TerminalStyle;
        if (TERMINAL_STYLES.includes(val)) setTerminalStyleState(val);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return (
    <TerminalStyleContext.Provider value={{ terminalStyle, setTerminalStyle, cycleTerminalStyle }}>
      {children}
    </TerminalStyleContext.Provider>
  );
}

export function useTerminalStyle() {
  const ctx = useContext(TerminalStyleContext);
  if (!ctx) throw new Error('useTerminalStyle must be used inside TerminalStyleProvider');
  return ctx;
}
