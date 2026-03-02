import type { ReactNode } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function TerminalLabel({ children, className = '' }: Props) {
  const theme = useTerminalTheme();

  if (!theme) {
    return (
      <label className={`label ${className}`}>
        <span className="label-text font-semibold text-base">{children}</span>
      </label>
    );
  }

  return (
    <label
      className={className}
      style={{
        display: 'block',
        fontFamily: theme.fontFamily,
        fontSize: '0.85rem',
        fontWeight: 600,
        color: theme.textSecondary,
        marginBottom: '0.35rem',
        letterSpacing: '0.03em',
      }}
    >
      {children}
    </label>
  );
}
