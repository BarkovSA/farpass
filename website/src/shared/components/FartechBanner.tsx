/**
 * FartechBanner — ASCII-логотип FARTECH·FARPASS в стиле консоли.
 * Расположен: website/src/shared/components/FartechBanner.tsx
 *
 * Используется в App.tsx как первый блок главной страницы.
 * Скрыть: передайте пропс visible={false}
 */

interface FartechBannerProps {
  visible?: boolean;
}

export default function FartechBanner({ visible = true }: FartechBannerProps) {
  if (!visible) return null;

  return (
    <div className="w-full mb-6">
      {/* Терминальная обёртка */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-base-300 bg-[#0d1117]">

        {/* Строка-заголовок окна (как у macOS/iTerm) */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#161b22] border-b border-[#30363d]">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[11px] font-mono text-[#8b949e] select-none tracking-wide">
            fartech — farpass@farpost ~ — bash
          </span>
        </div>

        {/* Тело терминала */}
        <div className="px-4 pt-5 pb-6 overflow-x-auto">

          {/* Командная строка-иллюзия */}
          <p className="font-mono text-xs text-[#8b949e] mb-3 select-none">
            <span className="text-[#58a6ff]">fartech</span>
            <span className="text-[#8b949e]">@</span>
            <span className="text-[#3fb950]">farpost</span>
            <span className="text-[#8b949e]">:~ $ </span>
            <span className="text-[#f0f6fc]">farpass --logo</span>
          </p>

          {/* ASCII-логотип FARTECH */}
          <pre
            aria-label="FARTECH ASCII logo"
            className={[
              'font-mono text-[#58a6ff] font-bold leading-tight',
              // Адаптивный размер через CSS clamp — не ломает layout
              'text-[clamp(4px,1.1vw,13px)]',
              'sm:text-[clamp(6px,1.3vw,13px)]',
              'select-none whitespace-pre',
            ].join(' ')}
          >{`
  ███████╗ █████╗ ██████╗ ████████╗███████╗ ██████╗██╗  ██╗
  ██╔════╝██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔════╝██║  ██║
  █████╗  ███████║██████╔╝   ██║   █████╗  ██║     ███████║
  ██╔══╝  ██╔══██║██╔══██╗   ██║   ██╔══╝  ██║     ██╔══██║
  ██║     ██║  ██║██║  ██║   ██║   ███████╗╚██████╗██║  ██║
  ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝`}
          </pre>

          {/* Разделитель + FarPass */}
          <pre
            className={[
              'font-mono text-[#8b949e] leading-tight mt-1',
              'text-[clamp(4px,1.1vw,13px)]',
              'sm:text-[clamp(6px,1.3vw,13px)]',
              'select-none whitespace-pre',
            ].join(' ')}
          >{`  ─────────────────────────── · FarPass · ───────────────────────────`}
          </pre>

          {/* Тэглайн */}
          <pre
            className={[
              'font-mono leading-snug mt-1',
              'text-[clamp(4px,1.0vw,12px)]',
              'sm:text-[clamp(5px,1.1vw,12px)]',
              'select-none whitespace-pre',
            ].join(' ')}
          >
            <span className="text-[#3fb950]">{'  FAR remote access'}</span>
            <span className="text-[#8b949e]">{' · '}</span>
            <span className="text-[#f0a500]">{'TECH support'}</span>
            <span className="text-[#8b949e]">{' · '}</span>
            <span className="text-[#8b949e]">{'Технический отдел · ОА «Фарпост»'}</span>
          </pre>

          {/* Курсор мигающий */}
          <p className="font-mono text-[#8b949e] mt-3 text-[clamp(5px,1.1vw,13px)] select-none">
            <span className="text-[#58a6ff]">fartech</span>
            <span className="text-[#8b949e]">@</span>
            <span className="text-[#3fb950]">farpost</span>
            <span className="text-[#8b949e]">:~ $ </span>
            <span className="inline-block w-2 h-[1.1em] bg-[#58a6ff] align-middle animate-pulse" />
          </p>

        </div>
      </div>
    </div>
  );
}
