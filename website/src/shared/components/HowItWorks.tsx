/**
 * HowItWorks — визуальная схема того, как работает FarPass.
 * Показывается пользователям на главной странице.
 *
 * Управление видимостью: пропс `visible` (по умолчанию true).
 * Можно скрыть целиком через конфиг DISABLE_HOW_IT_WORKS, если он появится.
 */

import { useTranslation } from 'react-i18next';

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

  if (!visible) return null;

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
