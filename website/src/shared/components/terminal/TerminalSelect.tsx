import { forwardRef, type SelectHTMLAttributes } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

type Props = SelectHTMLAttributes<HTMLSelectElement>;

const TerminalSelect = forwardRef<HTMLSelectElement, Props>(
  function TerminalSelect({ className = '', style: extra, children, ...rest }, ref) {
    const theme = useTerminalTheme();

    if (!theme) {
      return (
        <select
          ref={ref}
          className={`select select-bordered w-full ${className}`}
          style={extra}
          {...rest}
        >
          {children}
        </select>
      );
    }

    return (
      <select
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          fontFamily: theme.fontFamily,
          fontSize: '0.9rem',
          color: theme.text,
          background: theme.pageBg,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.style === 'vscode' ? '4px' : '0',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'auto',
          transition: 'border-color 0.2s',
          ...extra,
        }}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

export default TerminalSelect;
