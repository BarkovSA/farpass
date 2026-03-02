/**
 * HowItWorks — визуальная схема того, как работает FarPass.
 * Показывается пользователям на главной странице.
 *
 * Управление видимостью: пропс `visible` (по умолчанию true).
 * Можно скрыть целиком через конфиг DISABLE_HOW_IT_WORKS, если он появится.
 *
 * Terminal styles: vscode — mono numbered list, retro — ASCII arrows,
 * matrix — coloured status lines.
 */

import { useTranslation } from 'react-i18next';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

interface Step {
  icon: string;
  labelKey: string;
  descKey: string;
  color: string;
}

const STEPS: Step[] = [
  {
    icon: '✍️',
    labelKey: 'howItWorks.step1Label',
    descKey: 'howItWorks.step1Desc',
    color: 'text-primary',
  },
  {
    icon: '🔐',
    labelKey: 'howItWorks.step2Label',
    descKey: 'howItWorks.step2Desc',
    color: 'text-warning',
  },
  {
    icon: '🔗',
    labelKey: 'howItWorks.step3Label',
    descKey: 'howItWorks.step3Desc',
    color: 'text-info',
  },
  {
    icon: '📨',
    labelKey: 'howItWorks.step4Label',
    descKey: 'howItWorks.step4Desc',
    color: 'text-success',
  },
  {
    icon: '👁️',
    labelKey: 'howItWorks.step5Label',
    descKey: 'howItWorks.step5Desc',
    color: 'text-secondary',
  },
  {
    icon: '💥',
    labelKey: 'howItWorks.step6Label',
    descKey: 'howItWorks.step6Desc',
    color: 'text-error',
  },
];

interface HowItWorksProps {
  /** Позволяет скрыть блок программно (например, для A/B или отладки) */
  visible?: boolean;
}

export default function HowItWorks({ visible = true }: HowItWorksProps) {
  const { t } = useTranslation();
  const theme = useTerminalTheme();

  if (!visible) return null;

  // ═══════════════════════════════════════════
  //  TERMINAL RENDER
  // ═══════════════════════════════════════════
  if (theme) {
    const arrow =
      theme.style === 'retro'
        ? ' ──> '
        : theme.style === 'matrix'
          ? '  →  '
          : '  →  ';

    return (
      <div
        style={{
          marginTop: '2rem',
          marginBottom: '1.5rem',
          fontFamily: theme.fontFamily,
          color: theme.text,
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: theme.headingGlow,
            color: theme.text,
          }}
        >
          {theme.style === 'vscode' && '>_ '}
          {theme.style === 'retro' && '═══ '}
          {theme.style === 'matrix' && '// '}
          {t('howItWorks.title')}
          {theme.style === 'retro' && ' ═══'}
          {theme.style === 'matrix' && ' //'}
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: theme.textSecondary,
            fontSize: '0.8rem',
            marginBottom: '1rem',
          }}
        >
          {t('howItWorks.subtitle')}
        </p>

        {/* Steps as numbered mono list */}
        <div
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.style === 'vscode' ? '6px' : '2px',
            boxShadow: theme.borderGlow,
            padding: '1rem 1.25rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          {STEPS.map((step, idx) => {
            const num = `${idx + 1}.`;
            const statusColor =
              theme.style === 'matrix'
                ? idx < 3
                  ? theme.accent
                  : idx < 5
                    ? theme.warning
                    : theme.error
                : theme.text;

            return (
              <div key={step.labelKey} className="flex items-start" style={{ marginBottom: idx < STEPS.length - 1 ? '0.35rem' : 0 }}>
                <span
                  style={{
                    color: theme.accent,
                    fontWeight: 700,
                    minWidth: '1.5rem',
                    display: 'inline-block',
                  }}
                >
                  {num}
                </span>
                <span style={{ color: statusColor, fontWeight: 600 }}>
                  {t(step.labelKey)}
                </span>
                <span style={{ color: theme.textSecondary, marginLeft: '0.5rem' }}>
                  — {t(step.descKey)}
                </span>
                {idx < STEPS.length - 1 && (
                  <span
                    className="hidden sm:inline"
                    style={{ color: theme.textSecondary, marginLeft: '0.25rem' }}
                  >
                    {arrow}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  DAISYUI RENDER (off)
  // ═══════════════════════════════════════════
  return (
    <div className="mt-12 mb-4">
      {/* Заголовок */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-base-content mb-2">
          {t('howItWorks.title')}
        </h2>
        <p className="text-base-content/60 text-sm">{t('howItWorks.subtitle')}</p>
      </div>

      {/* Шаги */}
      <div className="flex flex-wrap justify-center items-start gap-0">
        {STEPS.map((step, idx) => (
          <div key={step.labelKey} className="flex items-start">
            {/* Карточка шага */}
            <div className="flex flex-col items-center w-28 sm:w-32">
              {/* Номер + иконка */}
              <div className="relative mb-2">
                <div className="w-14 h-14 rounded-full bg-base-100 border-2 border-base-300 flex items-center justify-center text-2xl shadow-sm">
                  {step.icon}
                </div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-content text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
              </div>

              {/* Текст */}
              <p className={`text-xs font-semibold text-center leading-tight mb-1 ${step.color}`}>
                {t(step.labelKey)}
              </p>
              <p className="text-xs text-center text-base-content/50 leading-tight px-1">
                {t(step.descKey)}
              </p>
            </div>

            {/* Стрелка между шагами (кроме последнего) */}
            {idx < STEPS.length - 1 && (
              <div className="flex items-center pt-5 px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-base-content/25 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
