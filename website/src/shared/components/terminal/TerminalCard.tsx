import type { ReactNode, CSSProperties } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface TerminalCardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  style?: CSSProperties;
}

export default function TerminalCard({
  children,
  title,
  className = '',
  style: extraStyle,
}: TerminalCardProps) {
  const theme = useTerminalTheme();

  if (!theme) {
    // DaisyUI fallback
    return (
      <div className={`card bg-base-100 shadow-xl ${className}`} style={extraStyle}>
        <div className="card-body">{children}</div>
      </div>
    );
  }

  const borderChar =
    theme.style === 'retro'
      ? '═'
      : theme.style === 'matrix'
        ? '─'
        : '';

  const headerText =
    theme.style === 'vscode'
      ? `>_ ${title ?? ''}`
      : theme.style === 'retro'
        ? `╔══ ${(title ?? '').toUpperCase()} ══╗`
        : theme.style === 'matrix'
          ? `// ${(title ?? '').toUpperCase()} //`
          : title ?? '';

  return (
    <div
      className={`relative ${className}`}
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.style === 'vscode' ? '6px' : '2px',
        boxShadow: theme.borderGlow,
        transition: 'background 0.3s, border-color 0.3s',
        ...extraStyle,
      }}
    >
      {title && (
        <div
          className="px-4 pt-4 pb-2 select-none"
          style={{
            fontFamily: theme.fontFamily,
            color: theme.text,
            textShadow: theme.headingGlow,
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
        >
          {theme.style === 'retro' && (
            <span style={{ color: theme.textSecondary }}>
              {borderChar.repeat(20)}
              {'\n'}
            </span>
          )}
          {headerText}
        </div>
      )}
      <div className="px-4 pb-4 pt-2">{children}</div>
    </div>
  );
}
