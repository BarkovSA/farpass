/**
 * FartechBanner — ASCII-логотип FARTECH·FARPASS.
 * Файл: website/src/shared/components/FartechBanner.tsx
 *
 * Стили переключаются кнопкой в навбаре (как цветовая схема).
 * Варианты: off | vscode | retro | matrix
 */

import { useTerminalStyle } from '@shared/context/TerminalStyleContext';

const LOGO = `  ███████╗ █████╗ ██████╗ ████████╗███████╗ ██████╗██╗  ██╗
  ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║  ██║
  █████╗  ███████║██████╔╝   ██║   █████╗  ██║     ███████║
  ██╔══╝  ██╔══██║██╔══██╗   ██║   ██╔══╝  ██║     ██╔══██║
  ██║     ██║  ██║██║  ██║   ██║   ███████╗╚██████╗██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝`;

const DIVIDER = `  ─────────────────────────── · FarPass · ───────────────────────────`;

const TAGLINE_PARTS = {
  far: '  FAR remote access',
  dot1: ' · ',
  tech: 'TECH support',
  dot2: ' · ',
  org: 'Технический отдел · ОА «Фарпост»',
};

// ── Общий размер шрифта (адаптивный) ──────────────────────────────────────
const FONT_SIZE = 'text-[clamp(5px,1.1vw,12.5px)] sm:text-[clamp(6px,1.25vw,12.5px)]';

// ── Шапка окна (три точки) ─────────────────────────────────────────────────
function WindowChrome({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#30363d]" style={{ background: '#161b22' }}>
      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
      <span className="ml-3 text-[11px] font-mono text-[#8b949e] select-none tracking-wide">{label}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  VSCODE — тёмный GitHub / VSCode стиль
// ══════════════════════════════════════════════════════════════════════════
function BannerVSCode() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-[#30363d]" style={{ background: '#0d1117' }}>
      <WindowChrome label="fartech — farpass@farpost ~ — bash" />
      <div className="px-4 pt-4 pb-5 overflow-x-auto">
        <p className={`font-mono ${FONT_SIZE} text-[#8b949e] mb-2 select-none`}>
          <span className="text-[#58a6ff]">fartech</span>
          <span className="text-[#8b949e]">@</span>
          <span className="text-[#3fb950]">farpost</span>
          <span className="text-[#8b949e]">:~ $ </span>
          <span className="text-[#f0f6fc]">farpass --logo</span>
        </p>
        <pre className={`font-mono font-bold leading-tight ${FONT_SIZE} text-[#58a6ff] select-none whitespace-pre`}>{LOGO}</pre>
        <pre className={`font-mono leading-tight ${FONT_SIZE} text-[#8b949e] select-none whitespace-pre mt-0.5`}>{DIVIDER}</pre>
        <pre className={`font-mono leading-snug ${FONT_SIZE} select-none whitespace-pre mt-0.5`}>
          <span className="text-[#3fb950]">{TAGLINE_PARTS.far}</span>
          <span className="text-[#8b949e]">{TAGLINE_PARTS.dot1}</span>
          <span className="text-[#f0a500]">{TAGLINE_PARTS.tech}</span>
          <span className="text-[#8b949e]">{TAGLINE_PARTS.dot2}</span>
          <span className="text-[#8b949e]">{TAGLINE_PARTS.org}</span>
        </pre>
        <p className={`font-mono ${FONT_SIZE} text-[#8b949e] mt-2 select-none`}>
          <span className="text-[#58a6ff]">fartech</span>
          <span>@</span>
          <span className="text-[#3fb950]">farpost</span>
          <span>:~ $ </span>
          <span className="inline-block w-2 h-[1.1em] bg-[#58a6ff] align-middle animate-pulse" />
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  RETRO — CRT-монитор, зелёный фосфор на чёрном
// ══════════════════════════════════════════════════════════════════════════
function BannerRetro() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#1a2a1a]"
      style={{
        background: '#050f05',
        boxShadow: '0 0 40px rgba(0,255,70,0.15), inset 0 0 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* CRT-шапка */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#003300]" style={{ background: '#020a02' }}>
        <span className="font-mono text-[10px] text-[#00cc00] tracking-widest select-none opacity-70 uppercase">
          ■ FARTECH TERMINAL v1.0 ■ READY
        </span>
      </div>

      {/* Тело с эффектом scan-lines */}
      <div className="px-4 pt-4 pb-5 overflow-x-auto relative">
        {/* scan-line overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)',
          }}
        />

        <p className={`font-mono ${FONT_SIZE} text-[#00bb00] mb-2 select-none opacity-70`}>
          {'C:\\FARTECH> farpass /logo'}
        </p>
        <pre
          className={`font-mono font-bold leading-tight ${FONT_SIZE} select-none whitespace-pre`}
          style={{ color: '#00ff46', textShadow: '0 0 8px rgba(0,255,70,0.8)' }}
        >{LOGO}</pre>
        <pre
          className={`font-mono leading-tight ${FONT_SIZE} select-none whitespace-pre mt-0.5 opacity-50`}
          style={{ color: '#00cc00' }}
        >{DIVIDER}</pre>
        <pre className={`font-mono leading-snug ${FONT_SIZE} select-none whitespace-pre mt-0.5`}>
          <span style={{ color: '#00ff46', textShadow: '0 0 6px rgba(0,255,70,0.6)' }}>{TAGLINE_PARTS.far}</span>
          <span style={{ color: '#007700' }}>{TAGLINE_PARTS.dot1}</span>
          <span style={{ color: '#aaff00', textShadow: '0 0 6px rgba(170,255,0,0.5)' }}>{TAGLINE_PARTS.tech}</span>
          <span style={{ color: '#007700' }}>{TAGLINE_PARTS.dot2}</span>
          <span style={{ color: '#00aa00' }}>{TAGLINE_PARTS.org}</span>
        </pre>
        <p className={`font-mono ${FONT_SIZE} mt-2 select-none`} style={{ color: '#00bb00', opacity: 0.7 }}>
          {'C:\\FARTECH> '}
          <span
            className="inline-block w-2 h-[1.1em] align-middle animate-pulse"
            style={{ background: '#00ff46', boxShadow: '0 0 6px #00ff46' }}
          />
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  MATRIX — яркий зелёный, неоновый, глитч-полосы
// ══════════════════════════════════════════════════════════════════════════
function BannerMatrix() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl border border-[#003300]"
      style={{
        background: 'linear-gradient(180deg, #000d00 0%, #001200 100%)',
        boxShadow: '0 0 60px rgba(0,255,0,0.2)',
      }}
    >
      <WindowChrome label="MATRIX SHELL — FARTECH SECURE CHANNEL" />

      <div className="px-4 pt-4 pb-5 overflow-x-auto relative">
        {/* Глитч-полосы */}
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.04]"
          style={{
            background: 'repeating-linear-gradient(90deg, #00ff00 0px, transparent 1px, transparent 8px)',
          }}
        />

        <p className={`font-mono ${FONT_SIZE} mb-2 select-none`} style={{ color: '#00aa00' }}>
          <span style={{ color: '#00ff00' }}>root</span>
          <span>@</span>
          <span style={{ color: '#00cc00' }}>FARTECH-NODE-01</span>
          <span>:~# </span>
          <span style={{ color: '#ffffff' }}>exec farpass --logo --decrypt</span>
        </p>

        <pre
          className={`font-mono font-bold leading-tight ${FONT_SIZE} select-none whitespace-pre`}
          style={{
            color: '#00ff41',
            textShadow: '0 0 10px rgba(0,255,65,0.9), 0 0 20px rgba(0,255,65,0.5)',
            letterSpacing: '0.01em',
          }}
        >{LOGO}</pre>

        <pre
          className={`font-mono leading-tight ${FONT_SIZE} select-none whitespace-pre mt-0.5`}
          style={{ color: '#005500' }}
        >{DIVIDER}</pre>

        <pre className={`font-mono leading-snug ${FONT_SIZE} select-none whitespace-pre mt-0.5`}>
          <span style={{ color: '#00ff41', textShadow: '0 0 8px rgba(0,255,65,0.7)' }}>{TAGLINE_PARTS.far}</span>
          <span style={{ color: '#004400' }}>{TAGLINE_PARTS.dot1}</span>
          <span style={{ color: '#39ff14', textShadow: '0 0 8px rgba(57,255,20,0.7)' }}>{TAGLINE_PARTS.tech}</span>
          <span style={{ color: '#004400' }}>{TAGLINE_PARTS.dot2}</span>
          <span style={{ color: '#007700' }}>{TAGLINE_PARTS.org}</span>
        </pre>

        {/* Статус-строка */}
        <p
          className={`font-mono ${FONT_SIZE} mt-3 select-none opacity-60`}
          style={{ color: '#00ff41', letterSpacing: '0.05em' }}
        >
          {'[ENCRYPTED] [AES-256] [ONE-TIME] '}
          <span
            className="inline-block w-2 h-[1.1em] align-middle animate-pulse"
            style={{ background: '#00ff41', boxShadow: '0 0 8px #00ff41' }}
          />
        </p>

        <p className={`font-mono ${FONT_SIZE} mt-1 select-none`} style={{ color: '#00aa00' }}>
          <span style={{ color: '#00ff00' }}>root</span>
          <span>@</span>
          <span style={{ color: '#00cc00' }}>FARTECH-NODE-01</span>
          <span>:~# </span>
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  Корневой компонент
// ══════════════════════════════════════════════════════════════════════════
export default function FartechBanner() {
  const { terminalStyle } = useTerminalStyle();

  if (terminalStyle === 'off') return null;

  return (
    <div className="w-full mb-6">
      {terminalStyle === 'vscode' && <BannerVSCode />}
      {terminalStyle === 'retro' && <BannerRetro />}
      {terminalStyle === 'matrix' && <BannerMatrix />}
    </div>
  );
}
