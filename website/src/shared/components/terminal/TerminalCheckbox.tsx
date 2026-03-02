import { type InputHTMLAttributes } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TerminalCheckbox({ label, className = '', ...rest }: Props) {
  const theme = useTerminalTheme();

  if (!theme) {
    return (
      <label className={`cursor-pointer flex items-center space-x-3 p-2 rounded-md hover:bg-base-200 transition-colors ${className}`}>
        <input type="checkbox" className="checkbox checkbox-primary" {...rest} />
        <span className="label-text font-medium">{label}</span>
      </label>
    );
  }

  const checked = rest.checked ?? false;
  const indicator =
    theme.style === 'retro' || theme.style === 'vscode'
      ? checked
        ? '[x]'
        : '[ ]'
      : checked
        ? '[■]'
        : '[ ]';

  return (
    <label
      className="cursor-pointer flex items-center gap-2 p-2"
      style={{
        fontFamily: theme.fontFamily,
        color: theme.text,
        fontSize: '0.9rem',
      }}
    >
      <input type="checkbox" className="sr-only" {...rest} />
      <span
        style={{
          color: checked ? theme.accent : theme.textSecondary,
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}
      >
        {indicator}
      </span>
      <span>{label}</span>
    </label>
  );
}
