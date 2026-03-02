/**
 * EncryptingOverlay — анимированный оверлей «Shred → Scramble → Seal → Lock».
 *
 * 1. Shred   — «документ» в центре взрывается на осколки, которые разлетаются
 * 2. Scramble — осколки кружат по орбитам (CSS keyframes), символы мутнеют
 * 3. Seal    — осколки «засасываются» в сейф (воронка)
 * 4. Lock    — замок защёлкивается
 *
 * DaisyUI mode — CSS-анимированная карточка с SVG-сейфом.
 * Terminal modes — ASCII-art версия с теми же фазами.
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';
import type { TerminalThemeConfig } from '@shared/hooks/useTerminalTheme';

interface EncryptingOverlayProps {
  visible: boolean;
}

/* ── Фазы анимации ── */
type Phase = 'shred' | 'scramble' | 'seal' | 'lock';
const PHASES: Phase[] = ['shred', 'scramble', 'seal', 'lock'];
const PHASE_DURATION = 1200; // ms на фазу

/* ── Символьные «осколки» ── */
const SHARD_CHARS = '█▓▒░▪▫◆◇●○★☆♦♣♠♥'.split('');
const SCRAMBLE_CHARS = '0123456789ABCDEFabcdef!@#$%^&*'.split('');

function randomChar(chars: string[]) {
  return chars[Math.floor(Math.random() * chars.length)];
}

/* ── Подписи фаз ── */
const PHASE_LABELS: Record<string, Record<Phase, string>> = {
  ru: {
    shred: 'Разбиваем секрет на осколки…',
    scramble: 'Перемешиваем и шифруем…',
    seal: 'Запечатываем в сейф…',
    lock: 'Замок закрыт. Готово!',
  },
  en: {
    shred: 'Shredding the secret into pieces…',
    scramble: 'Scrambling & encrypting…',
    seal: 'Sealing into the vault…',
    lock: 'Lock engaged. Done!',
  },
};

function getPhaseLabel(lang: string, phase: Phase): string {
  return (PHASE_LABELS[lang] ?? PHASE_LABELS.en)[phase];
}

/* ═══ Генерация «осколков» ═══ */
interface Shard {
  id: number;
  char: string;
  angle: number;   // радианы — направление разлёта
  radius: number;  // % — дальность разлёта
  orbitR: number;  // px — радиус орбиты для scramble
  orbitSpeed: number; // s — длительность оборота
  orbitDir: number; // 1 | -1
  size: number;
}

function generateShards(count: number): Shard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    char: randomChar(SHARD_CHARS),
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5,
    radius: 70 + Math.random() * 50,
    orbitR: 30 + Math.random() * 45,
    orbitSpeed: 1.8 + Math.random() * 1.4,
    orbitDir: Math.random() > 0.5 ? 1 : -1,
    size: 0.7 + Math.random() * 0.7,
  }));
}

/* ═══════════════════════════════
   Основной компонент
   ═══════════════════════════════ */
export default function EncryptingOverlay({ visible }: EncryptingOverlayProps) {
  const { i18n } = useTranslation();
  const theme = useTerminalTheme();
  const [phase, setPhase] = useState<Phase>('shred');
  const [shredReady, setShredReady] = useState(false); // doc → explode trigger
  const [scrambleText, setScrambleText] = useState('');
  const shards = useMemo(() => generateShards(20), []);

  // Прогон фаз
  useEffect(() => {
    if (!visible) {
      setPhase('shred');
      setShredReady(false);
      return;
    }
    let idx = 0;
    setPhase(PHASES[0]);
    setShredReady(false);
    // Небольшая задержка: сначала показать «документ», потом взорвать
    const shredTimer = setTimeout(() => setShredReady(true), 180);

    const interval = setInterval(() => {
      idx++;
      if (idx < PHASES.length) {
        setPhase(PHASES[idx]);
      } else {
        idx = 0;
        setPhase(PHASES[0]);
        setShredReady(false);
        setTimeout(() => setShredReady(true), 180);
      }
    }, PHASE_DURATION);
    return () => { clearInterval(interval); clearTimeout(shredTimer); };
  }, [visible]);

  // Scramble text
  useEffect(() => {
    if (!visible || phase !== 'scramble') return;
    const id = setInterval(() => {
      setScrambleText(
        Array.from({ length: 20 }, () => randomChar(SCRAMBLE_CHARS)).join(''),
      );
    }, 60);
    return () => clearInterval(id);
  }, [visible, phase]);

  const phaseIdx = PHASES.indexOf(phase);
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'en';

  if (!visible) return null;

  /* ═══ TERMINAL MODE ═══ */
  if (theme) {
    return (
      <TerminalOverlay
        theme={theme}
        phase={phase}
        phaseIdx={phaseIdx}
        scrambleText={scrambleText}
        lang={lang}
      />
    );
  }

  /* ═══ DAISYUI MODE ═══ */
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="card bg-base-100 shadow-2xl p-8 flex flex-col items-center gap-4 min-w-[340px] max-w-[420px] overflow-hidden relative">

        {/* Контейнер анимации */}
        <div className="relative w-52 h-52 flex items-center justify-center">

          {/* ── Фаза shred: «документ» → взрыв осколков ── */}
          {phase === 'shred' && (
            <>
              {/* Документ в центре (видим до взрыва) */}
              <div
                className="absolute transition-all duration-300 ease-out"
                style={{
                  opacity: shredReady ? 0 : 1,
                  transform: shredReady ? 'scale(1.5)' : 'scale(1)',
                }}
              >
                <svg width="56" height="68" viewBox="0 0 56 68" fill="none">
                  <rect x="4" y="4" width="48" height="60" rx="4"
                    fill="oklch(0.65 0.24 16 / 0.12)" stroke="oklch(0.65 0.24 16)" strokeWidth="2" />
                  <line x1="14" y1="18" x2="42" y2="18" stroke="oklch(0.65 0.24 16 / 0.5)" strokeWidth="2" />
                  <line x1="14" y1="26" x2="38" y2="26" stroke="oklch(0.65 0.24 16 / 0.4)" strokeWidth="2" />
                  <line x1="14" y1="34" x2="40" y2="34" stroke="oklch(0.65 0.24 16 / 0.3)" strokeWidth="2" />
                  <line x1="14" y1="42" x2="34" y2="42" stroke="oklch(0.65 0.24 16 / 0.25)" strokeWidth="2" />
                  <text x="28" y="56" textAnchor="middle" fill="oklch(0.65 0.24 16)" fontSize="10" fontWeight="bold">SECRET</text>
                </svg>
              </div>
              {/* Осколки разлетаются */}
              {shards.map((s) => (
                <span
                  key={s.id}
                  className="absolute pointer-events-none"
                  style={{
                    fontSize: `${s.size}rem`,
                    color: 'oklch(0.65 0.24 16)',
                    opacity: shredReady ? 1 : 0,
                    transform: shredReady
                      ? `translate(${Math.cos(s.angle) * s.radius}%, ${Math.sin(s.angle) * s.radius}%) scale(1)`
                      : 'translate(0, 0) scale(0)',
                    transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                >
                  {s.char}
                </span>
              ))}
            </>
          )}

          {/* ── Фаза scramble: осколки кружат по орбитам ── */}
          {phase === 'scramble' && shards.map((s) => (
            <span
              key={s.id}
              className="absolute pointer-events-none vault-orbit"
              style={{
                fontSize: `${s.size}rem`,
                color: 'oklch(0.65 0.24 16 / 0.85)',
                // Каждый осколок — на своей орбите
                '--orbit-r': `${s.orbitR}px`,
                '--orbit-speed': `${s.orbitSpeed}s`,
                '--orbit-start': `${Math.round((s.angle / (Math.PI * 2)) * 360)}deg`,
                '--orbit-dir': s.orbitDir,
                animationDirection: s.orbitDir === -1 ? 'reverse' : 'normal',
              } as React.CSSProperties}
            >
              {randomChar(SCRAMBLE_CHARS)}
            </span>
          ))}

          {/* ── Фаза seal: осколки втягиваются в сейф ── */}
          {phase === 'seal' && (
            <>
              {shards.map((s) => (
                <span
                  key={s.id}
                  className="absolute pointer-events-none vault-suck-in"
                  style={{
                    fontSize: `${s.size}rem`,
                    color: 'oklch(0.65 0.24 16)',
                    '--start-x': `${Math.cos(s.angle) * s.orbitR}px`,
                    '--start-y': `${Math.sin(s.angle) * s.orbitR}px`,
                  } as React.CSSProperties}
                >
                  {s.char}
                </span>
              ))}
              {/* Сейф появляется */}
              <div className="absolute inset-0 flex items-center justify-center vault-appear">
                <VaultIcon locked={false} />
              </div>
            </>
          )}

          {/* ── Фаза lock: сейф + замок ── */}
          {phase === 'lock' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <VaultIcon locked={true} />
            </div>
          )}
        </div>

        {/* Скрамбл-строка */}
        {phase === 'scramble' && (
          <div className="font-mono text-xs tracking-widest text-primary/50 h-5 overflow-hidden animate-pulse">
            {scrambleText}
          </div>
        )}

        {/* Подпись фазы */}
        <p className="text-base font-semibold text-base-content text-center min-h-[1.5rem] transition-all duration-300">
          {getPhaseLabel(lang, phase)}
        </p>

        {/* Прогресс-точки */}
        <div className="flex gap-2 mt-1">
          {PHASES.map((p, i) => (
            <div
              key={p}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i <= phaseIdx ? '2.5rem' : '1rem',
                backgroundColor:
                  i <= phaseIdx
                    ? 'oklch(0.65 0.24 16)'
                    : 'oklch(0.65 0.24 16 / 0.2)',
                opacity: i <= phaseIdx ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ SVG Vault / Safe Icon ═══ */
function VaultIcon({ locked }: { locked: boolean }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Корпус */}
      <rect x="12" y="20" width="72" height="64" rx="8"
        fill="oklch(0.65 0.24 16 / 0.15)" stroke="oklch(0.65 0.24 16)" strokeWidth="3" />
      {/* Дверца */}
      <rect x="20" y="28" width="56" height="48" rx="4"
        fill="oklch(0.65 0.24 16 / 0.08)" stroke="oklch(0.65 0.24 16 / 0.5)" strokeWidth="1.5" />
      {/* Колесо-ручка */}
      <circle cx="48" cy="52" r="12" fill="none"
        stroke="oklch(0.65 0.24 16)" strokeWidth="2.5"
        className={locked ? '' : 'animate-spin'}
        style={{ transformOrigin: '48px 52px', animationDuration: '1.5s' }} />
      {/* Спицы */}
      <line x1="48" y1="40" x2="48" y2="64" stroke="oklch(0.65 0.24 16 / 0.5)" strokeWidth="1.5" />
      <line x1="36" y1="52" x2="60" y2="52" stroke="oklch(0.65 0.24 16 / 0.5)" strokeWidth="1.5" />
      {/* Замок (появляется на фазе lock) */}
      {locked && (
        <g className="vault-lock-bounce">
          <rect x="40" y="10" width="16" height="14" rx="3" fill="oklch(0.55 0.25 280)" />
          <path d="M44 10V6a4 4 0 018 0v4" fill="none"
            stroke="oklch(0.55 0.25 280)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="48" cy="17" r="2" fill="white" />
        </g>
      )}
      {/* Ножки */}
      <rect x="16" y="84" width="8" height="6" rx="2" fill="oklch(0.65 0.24 16 / 0.5)" />
      <rect x="72" y="84" width="8" height="6" rx="2" fill="oklch(0.65 0.24 16 / 0.5)" />
    </svg>
  );
}

/* ═══ TERMINAL ASCII VERSION ═══ */

const ASCII_FRAMES: Record<Phase, string[]> = {
  shred: [
    '    ╭──────────╮',
    '    │ ▓▒░█▓▒░█ │',
    '    │  SECRET   │',
    '    ╰──────────╯',
    '      ↓ ↓ ↓ ↓',
    '   ▒ ░ █ ▓ ▒ ░ █',
    '  ░ ▓ █ ▒ ░ ▓ █ ▒',
  ],
  scramble: [
    '  ╭ ┄ ┄ ┄ ┄ ┄ ┄ ╮',
    '  ┆ @#!$%^&*()  ┆',
    '  ┆  AES-256    ┆',
    '  ┆ f7a2b9c1e3  ┆',
    '  ╰ ┄ ┄ ┄ ┄ ┄ ┄ ╯',
    '    ↻ ↻ ↻ ↻ ↻',
  ],
  seal: [
    '   ╔═══════════╗',
    '   ║  ╭─────╮  ║',
    '   ║  │(···)│  ║',
    '   ║  ╰─────╯  ║',
    '   ║    VAULT   ║',
    '   ╚═══════════╝',
    '    ← ← ░▒▓ → →',
  ],
  lock: [
    '      ╭─╮      ',
    '      │ │      ',
    '   ╔══╧═╧══╗   ',
    '   ║ [████] ║   ',
    '   ║ LOCKED ║   ',
    '   ╚════════╝   ',
    '      🔒       ',
  ],
};

function TerminalOverlay({
  theme,
  phase,
  phaseIdx,
  scrambleText,
  lang,
}: {
  theme: TerminalThemeConfig;
  phase: Phase;
  phaseIdx: number;
  scrambleText: string;
  lang: string;
}) {
  const getAsciiFrame = useCallback(() => {
    if (phase === 'scramble') {
      const frame = [...ASCII_FRAMES.scramble];
      frame[1] = `  ┆ ${scrambleText.slice(0, 10)} ┆`;
      frame[3] = `  ┆ ${scrambleText.slice(10, 20)} ┆`;
      return frame;
    }
    return ASCII_FRAMES[phase];
  }, [phase, scrambleText]);

  const ascii = getAsciiFrame();
  const progressChars = PHASES.map((_, i) =>
    i < phaseIdx ? '█' : i === phaseIdx ? '▓' : '░',
  ).join('');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        style={{
          background: theme.cardBg,
          border: `2px solid ${theme.accent}`,
          borderRadius: theme.style === 'vscode' ? '8px' : '2px',
          boxShadow:
            theme.style === 'matrix'
              ? '0 0 30px rgba(57,255,20,0.2)'
              : theme.style === 'retro'
                ? '0 0 20px rgba(0,200,0,0.15)'
                : '0 0 20px rgba(88,166,255,0.15)',
          padding: '2rem 2.5rem',
          minWidth: '340px',
          maxWidth: '460px',
          textAlign: 'center' as const,
        }}
      >
        {/* Header */}
        <div
          style={{
            color: theme.accent,
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            textShadow: theme.headingGlow,
          }}
        >
          {theme.style === 'vscode' && '>_ '}
          {theme.style === 'retro' && '╔══ '}
          {theme.style === 'matrix' && '// '}
          {lang === 'ru' ? 'ШИФРОВАНИЕ' : 'ENCRYPTING'}
          {theme.style === 'retro' && ' ══╗'}
          {theme.style === 'matrix' && ' //'}
        </div>

        {/* ASCII Art */}
        <div
          style={{
            fontFamily: theme.fontFamily,
            fontSize: '0.8rem',
            lineHeight: '1.4',
            color: phase === 'lock' ? theme.success : theme.accent,
            textShadow:
              theme.style === 'matrix' ? '0 0 8px rgba(57,255,20,0.5)' : 'none',
            minHeight: '7rem',
            whiteSpace: 'pre',
            transition: 'color 0.3s',
          }}
        >
          {ascii.map((line, i) => (
            <div key={`${phase}-${i}`}>{line}</div>
          ))}
        </div>

        {/* Phase label */}
        <div
          style={{
            color: theme.textSecondary,
            fontSize: '0.85rem',
            marginTop: '0.75rem',
            marginBottom: '0.5rem',
            transition: 'all 0.3s',
          }}
        >
          {getPhaseLabel(lang, phase)}
        </div>

        {/* Phase progress */}
        <div
          style={{
            color: theme.accent,
            fontSize: '0.9rem',
            letterSpacing: '0.3em',
            fontFamily: theme.fontFamily,
          }}
        >
          [{progressChars}]{' '}
          {Math.min(100, Math.round(((phaseIdx + 1) / PHASES.length) * 100))}%
        </div>
      </div>
    </div>
  );
}
