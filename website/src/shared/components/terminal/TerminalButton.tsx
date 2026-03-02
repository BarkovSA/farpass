import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface TerminalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'copy';
  children: ReactNode;
}

export default function TerminalButton({
  variant = 'primary',
  children,
  className = '',
  style: extra,
  ...rest
}: TerminalButtonProps) {
  const theme = useTerminalTheme();
  const [hovered, setHovered] = useState(false);

  if (!theme) {
    const cls =
      variant === 'outline'
        ? 'btn btn-outline btn-primary'
        : variant === 'ghost'
          ? 'btn btn-ghost border border-base-300'
          : variant === 'copy'
            ? 'btn btn-primary btn-sm font-medium shadow-sm hover:shadow transition-all duration-200 shrink-0'
            : 'btn btn-primary w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200';
    return (
      <button className={`${cls} ${className}`} style={extra} {...rest}>
        {children}
      </button>
    );
  }

  // ── Terminal-styled button ──
  const isPrimary = variant === 'primary';
  const isCopy = variant === 'copy';
  const isGhost = variant === 'ghost' || variant === 'outline';

  let bg = theme.btnBg;
  let color = theme.btnText;
  let border = theme.border;
  let boxShadow = theme.borderGlow;
  let prefix = '';
  let suffix = '';

  if (isPrimary) {
    prefix = theme.btnPrefix;
    if (theme.style === 'retro') {
      prefix = hovered ? '[> ' : '[  ';
      suffix = hovered ? ' <]' : '  ]';
    }
    if (theme.style === 'matrix') {
      prefix = '> ';
      suffix = ' <';
      border = theme.accent;
      boxShadow = hovered
        ? `0 0 16px ${theme.accent}66, 0 0 4px ${theme.accent}33`
        : `0 0 8px ${theme.accent}33`;
    }
    bg = hovered ? theme.btnHoverBg : theme.btnBg;
  }

  if (isCopy) {
    bg = 'transparent';
    color = theme.accent;
    border = theme.border;
    if (theme.style === 'matrix') {
      prefix = '[';
      suffix = ']';
    }
  }

  if (isGhost) {
    bg = 'transparent';
    color = theme.accent;
    border = theme.border;
  }

  return (
    <button
      className={className}
      style={{
        fontFamily: theme.fontFamily,
        fontSize: isPrimary ? '1rem' : '0.85rem',
        fontWeight: 600,
        color,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: theme.style === 'vscode' ? '4px' : '0',
        padding: isPrimary ? '0.75rem 1.5rem' : '0.4rem 0.75rem',
        width: isPrimary ? '100%' : undefined,
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow,
        letterSpacing: '0.02em',
        ...extra,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {prefix}
      {children}
      {suffix}
    </button>
  );
}
