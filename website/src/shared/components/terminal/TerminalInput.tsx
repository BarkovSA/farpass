import { forwardRef, type TextareaHTMLAttributes, type InputHTMLAttributes } from 'react';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

/* ──────────────────────────────────────────── TerminalInput (text / password) */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** pass-through for react-hook-form */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
};

export const TerminalInputField = forwardRef<HTMLInputElement, InputProps>(
  function TerminalInputField({ className = '', style: extra, ...rest }, ref) {
    const theme = useTerminalTheme();

    if (!theme) {
      return (
        <input
          ref={ref}
          className={`input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
          style={extra}
          {...rest}
        />
      );
    }

    return (
      <input
        ref={ref}
        className={className}
        style={{
          width: '100%',
          padding: '0.625rem 0.75rem',
          fontFamily: theme.fontFamily,
          fontSize: '0.9rem',
          color: theme.text,
          background: theme.pageBg,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.style === 'vscode' ? '4px' : '0',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          caretColor: theme.accent,
          ...extra,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = theme.accent;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accent}22`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = theme.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...rest}
      />
    );
  },
);

/* ──────────────────────────────────────────── TerminalTextarea */
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TerminalTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TerminalTextarea({ className = '', style: extra, ...rest }, ref) {
    const theme = useTerminalTheme();

    if (!theme) {
      return (
        <textarea
          ref={ref}
          className={`textarea textarea-bordered w-full min-h-[100px] text-base p-4 resize-y focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-base-100 ${className}`}
          style={extra}
          {...rest}
        />
      );
    }

    const placeholder =
      theme.style === 'matrix' ? 'Enter payload...' : rest.placeholder;

    return (
      <textarea
        ref={ref}
        className={className}
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '0.75rem',
          fontFamily: theme.fontFamily,
          fontSize: '0.9rem',
          color: theme.text,
          background: theme.pageBg,
          border: `1px solid ${theme.border}`,
          borderRadius: theme.style === 'vscode' ? '4px' : '0',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          caretColor: theme.style === 'retro' ? '#00ff46' : theme.accent,
          ...extra,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = theme.accent;
          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accent}22`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = theme.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
        placeholder={placeholder}
        {...rest}
      />
    );
  },
);

/* Default export is the textarea (most used) */
export default TerminalTextarea;
