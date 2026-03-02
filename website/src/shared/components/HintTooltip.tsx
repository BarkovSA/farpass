/**
 * HintTooltip — плавающая подсказка "куда жать".
 *
 * ─── КАК ПОДКЛЮЧИТЬ / ВКЛЮЧИТЬ ─────────────────────────────────────────────
 *  Файл: website/src/shared/components/HintTooltip.tsx
 *
 *  В App.tsx (или любом месте):
 *    import HintTooltip from '@shared/components/HintTooltip';
 *    ...
 *    <HintTooltip />
 *
 *  Режим отладки (панель открыта сразу, без клика):
 *    • Добавьте ?hints=true в URL: http://localhost:5173/?hints=true
 *    • ИЛИ в консоли браузера:  localStorage.setItem('farpass_hints', '1')
 *      затем обновите страницу
 *
 *  Чтобы скрыть кнопку совсем — передайте пропс disabled:
 *    <HintTooltip disabled />
 * ───────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Hint {
  num: number;
  textKey: string;
  icon: string;
}

const HINTS: Hint[] = [
  { num: 1, icon: '✍️', textKey: 'hints.step1' },
  { num: 2, icon: '⏱️', textKey: 'hints.step2' },
  { num: 3, icon: '🔒', textKey: 'hints.step3' },
  { num: 4, icon: '📋', textKey: 'hints.step4' },
  { num: 5, icon: '📨', textKey: 'hints.step5' },
];

/** Проверяем URL (?hints=true) и localStorage для режима отладки */
function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('hints') === 'true') return true;
  try {
    return localStorage.getItem('farpass_hints') === '1';
  } catch {
    return false;
  }
}

interface HintTooltipProps {
  /** Полностью скрыть компонент (кнопка не рендерится) */
  disabled?: boolean;
}

export default function HintTooltip({ disabled = false }: HintTooltipProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);

  // Автооткрытие в debug-режиме
  useEffect(() => {
    if (isDebugMode()) {
      setOpen(true);
    }
  }, []);

  if (disabled) return null;

  return (
    <>
      {/* ── Плавающая кнопка-триггер ─────────────────────────────────── */}
      <button
        type="button"
        aria-label={t('hints.toggleButton')}
        title={t('hints.toggleButton')}
        onClick={() => setOpen((v) => !v)}
        className={[
          'fixed bottom-6 right-6 z-50',
          'w-12 h-12 rounded-full shadow-lg',
          'flex items-center justify-center',
          'text-xl font-bold transition-all duration-200',
          open
            ? 'bg-primary text-primary-content rotate-45 scale-110'
            : 'bg-base-100 border-2 border-primary text-primary hover:scale-110',
        ].join(' ')}
      >
        {open ? '✕' : '?'}
      </button>

      {/* ── Панель подсказок ─────────────────────────────────────────── */}
      {open && (
        <div
          role="dialog"
          aria-label={t('hints.panelTitle')}
          className={[
            'fixed bottom-24 right-6 z-50',
            'w-72 rounded-2xl shadow-2xl',
            'bg-base-100 border border-base-300',
            'overflow-hidden',
            'animate-[fadeInUp_0.2s_ease-out]',
          ].join(' ')}
          style={{ animation: 'fadeInUp 0.2s ease-out' }}
        >
          {/* Заголовок */}
          <div className="bg-primary text-primary-content px-4 py-3 flex items-center gap-2">
            <span className="text-lg">💡</span>
            <div>
              <p className="font-semibold text-sm">{t('hints.panelTitle')}</p>
              <p className="text-xs opacity-75">{t('hints.panelSubtitle')}</p>
            </div>
          </div>

          {/* Список подсказок */}
          <ul className="divide-y divide-base-200">
            {HINTS.map((hint) => (
              <li key={hint.num} className="flex items-start gap-3 px-4 py-3">
                {/* Номер */}
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {hint.num}
                </span>
                {/* Иконка + текст */}
                <div className="flex items-start gap-1.5 min-w-0">
                  <span className="text-base leading-tight">{hint.icon}</span>
                  <p className="text-xs text-base-content/80 leading-snug">{t(hint.textKey)}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Подвал — debug статус */}
          {isDebugMode() && (
            <div className="px-4 py-2 bg-warning/10 border-t border-warning/20 text-xs text-warning font-mono">
              🛠 debug: ?hints=true
            </div>
          )}
        </div>
      )}

      {/* ── Инлайн-анимация (без tailwind-animate plugin) ─────────────── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
