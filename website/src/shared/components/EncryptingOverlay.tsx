/**
 * EncryptingOverlay — показывает анимированный оверлей
 * во время шифрования / загрузки секрета на сервер.
 *
 * DaisyUI mode: полупрозрачная карточка с пульсирующим замком.
 * Terminal modes: стилизованный вывод «команд» с ASCII-прогрессом.
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface EncryptingOverlayProps {
  /** Показать оверлей */
  visible: boolean;
}

// Фразы, «печатающиеся» в терминальном режиме
const TERMINAL_LINES_RU = [
  '> Инициализация шифрования...',
  '> Генерация ключей OpenPGP...',
  '> Шифрование данных AES-256...',
  '> Отправка на сервер...',
];
const TERMINAL_LINES_EN = [
  '> Initializing encryption...',
  '> Generating OpenPGP keys...',
  '> Encrypting payload AES-256...',
  '> Uploading to server...',
];

export default function EncryptingOverlay({ visible }: EncryptingOverlayProps) {
  const { t, i18n } = useTranslation();
  const theme = useTerminalTheme();
  const [lineIdx, setLineIdx] = useState(0);

  const lines = i18n.language === 'ru' ? TERMINAL_LINES_RU : TERMINAL_LINES_EN;

  // Cycle through terminal lines
  useEffect(() => {
    if (!visible) {
      setLineIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLineIdx((prev) => (prev + 1) % lines.length);
    }, 900);
    return () => clearInterval(interval);
  }, [visible, lines.length]);

  if (!visible) return null;

  // ── Terminal overlay ──
  if (theme) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)',
          fontFamily: theme.fontFamily,
        }}
      >
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.style === 'vscode' ? '8px' : '2px',
            boxShadow: theme.borderGlow,
            padding: '2rem 2.5rem',
            minWidth: '340px',
            maxWidth: '460px',
          }}
        >
          {/* Header */}
          <div
            style={{
              color: theme.accent,
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textShadow: theme.headingGlow,
              textAlign: 'center',
            }}
          >
            {theme.style === 'vscode' && '>_ '}
            {theme.style === 'retro' && '╔══ '}
            {theme.style === 'matrix' && '// '}
            {t('create.buttonEncrypt').toUpperCase()}
            {theme.style === 'retro' && ' ══╗'}
            {theme.style === 'matrix' && ' //'}
          </div>

          {/* Animated lines */}
          <div style={{ minHeight: '5rem' }}>
            {lines.slice(0, lineIdx + 1).map((line, i) => (
              <div
                key={i}
                style={{
                  color: i === lineIdx ? theme.accent : theme.textSecondary,
                  fontSize: '0.85rem',
                  marginBottom: '0.3rem',
                  opacity: i === lineIdx ? 1 : 0.6,
                }}
              >
                {line}
                {i === lineIdx && (
                  <span className="terminal-heading-pulse" style={{ marginLeft: '2px' }}>
                    █
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ASCII progress bar */}
          <div
            style={{
              marginTop: '1rem',
              color: theme.accent,
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
            }}
          >
            <ProgressBar accentColor={theme.accent} secondaryColor={theme.textSecondary} />
          </div>
        </div>
      </div>
    );
  }

  // ── DaisyUI overlay ──
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="card bg-base-100 shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
        {/* Animated lock icon */}
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-primary animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          {/* Spinning ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
        <p className="text-lg font-semibold text-base-content">
          {t('create.buttonEncrypt')}...
        </p>
        <progress className="progress progress-primary w-56" />
      </div>
    </div>
  );
}

/** ASCII-style animated progress bar */
function ProgressBar({
  accentColor,
  secondaryColor,
}: {
  accentColor: string;
  secondaryColor: string;
}) {
  const [pos, setPos] = useState(0);
  const WIDTH = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((p) => (p + 1) % (WIDTH + 1));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const filled = '█'.repeat(pos);
  const empty = '░'.repeat(WIDTH - pos);

  return (
    <span>
      <span style={{ color: secondaryColor }}>[</span>
      <span style={{ color: accentColor }}>{filled}</span>
      <span style={{ color: secondaryColor }}>{empty}</span>
      <span style={{ color: secondaryColor }}>]</span>
      <span style={{ color: secondaryColor, marginLeft: '0.5rem' }}>
        {Math.round((pos / WIDTH) * 100)}%
      </span>
    </span>
  );
}
