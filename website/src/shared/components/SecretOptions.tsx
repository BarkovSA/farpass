import { useTranslation } from 'react-i18next';
import type { UseFormRegister } from 'react-hook-form';
import { useConfig } from '@shared/hooks/useConfig';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';
import TerminalCheckbox from '@shared/components/terminal/TerminalCheckbox';
import TerminalLabel from '@shared/components/terminal/TerminalLabel';
import { TerminalInputField } from '@shared/components/terminal/TerminalInput';

interface SecretOptionsProps {
  register: UseFormRegister<any>;
  oneTime: boolean;
  setOneTime: (value: boolean) => void;
  generateKey: boolean;
  setGenerateKey: (value: boolean) => void;
  customPassword: string;
  setCustomPassword: (value: string) => void;
  expirationLabel?: string;
  showAnimation: boolean;
  setShowAnimation: (value: boolean) => void;
  hideExpiration?: boolean;
  hideOneTime?: boolean;
}

export function SecretOptions({
  register,
  oneTime,
  setOneTime,
  generateKey,
  setGenerateKey,
  customPassword,
  setCustomPassword,
  expirationLabel,
  showAnimation,
  setShowAnimation,
  hideExpiration = false,
  hideOneTime = false,
}: SecretOptionsProps) {
  const { t } = useTranslation();
  const config = useConfig();
  const theme = useTerminalTheme();

  // ── Expiration radio options ──
  const expirationOptions = [
    { value: '3600', label: t('expiration.optionOneHourLabel'), defaultChecked: true },
    { value: '86400', label: t('expiration.optionOneDayLabel'), defaultChecked: false },
    { value: '604800', label: t('expiration.optionOneWeekLabel'), defaultChecked: false },
  ];

  // ── TERMINAL RENDER ──
  if (theme) {
    const radioIndicator = (checked: boolean) =>
      theme.style === 'retro' || theme.style === 'vscode'
        ? checked
          ? '(●)'
          : '( )'
        : checked
          ? '[●]'
          : '[ ]';

    return (
      <div style={{ marginTop: '1.5rem' }}>
        {!hideExpiration && (
          <>
            <TerminalLabel>
              {expirationLabel || t('expiration.legend')}
            </TerminalLabel>
            <div className="flex flex-wrap gap-4 mt-2">
              {expirationOptions.map(opt => (
                <label
                  key={opt.value}
                  className="cursor-pointer flex items-center gap-2 p-2"
                  style={{
                    fontFamily: theme.fontFamily,
                    color: theme.text,
                    fontSize: '0.9rem',
                  }}
                >
                  <input
                    type="radio"
                    {...register('expiration')}
                    value={opt.value}
                    defaultChecked={opt.defaultChecked}
                    className="sr-only peer"
                  />
                  <span
                    className="peer-checked:text-[var(--t-accent)]"
                    style={{
                      color: theme.textSecondary,
                      fontWeight: 600,
                    }}
                  >
                    <span className="hidden peer-checked:inline" style={{ color: theme.accent }}>
                      {radioIndicator(true)}
                    </span>
                  </span>
                  <RadioIndicator theme={theme} name="expiration" value={opt.value} register={register} defaultChecked={opt.defaultChecked} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: '1.5rem' }}>
          {!hideOneTime && !config?.FORCE_ONETIME_SECRETS && (
            <TerminalCheckbox
              label={t('create.inputOneTimeLabel')}
              {...register('oneTime')}
              checked={oneTime}
              onChange={() => setOneTime(!oneTime)}
            />
          )}
          <TerminalCheckbox
            label={t('create.inputGenerateKeyLabel')}
            {...register('generateKey')}
            checked={generateKey}
            onChange={() => setGenerateKey(!generateKey)}
          />
          <TerminalCheckbox
            label={t('create.showAnimationLabel')}
            checked={showAnimation}
            onChange={() => setShowAnimation(!showAnimation)}
          />
        </div>

        {!generateKey && (
          <div style={{ marginTop: '1rem' }}>
            <TerminalLabel>{t('create.inputCustomPasswordLabel')}</TerminalLabel>
            <TerminalInputField
              type="password"
              {...register('customPassword')}
              value={customPassword}
              onChange={e => setCustomPassword(e.target.value)}
              placeholder={t('create.inputCustomPasswordPlaceholder')}
            />
          </div>
        )}
      </div>
    );
  }

  // ── DAISYUI RENDER (off) ──
  return (
    <div className="form-control mt-6">
      <label className="cursor-pointer flex items-center space-x-3 p-2 rounded-md hover:bg-base-200 transition-colors">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          {...register('generateKey')}
          checked={generateKey}
          onChange={() => setGenerateKey(!generateKey)}
        />
        <span className="label-text font-medium">
          {t('create.inputGenerateKeyLabel')}
        </span>
      </label>
      {/* Кнопка анимации убрана по требованию, анимация всегда отключена */}
      {!generateKey && (
        <div className="mt-4">
          <label className="label">
            <span className="label-text font-medium">
              {t('create.inputCustomPasswordLabel')}
            </span>
          </label>
          <input
            type="password"
            {...register('customPassword')}
            className="input input-bordered w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            value={customPassword}
            onChange={e => setCustomPassword(e.target.value)}
            placeholder={t('create.inputCustomPasswordPlaceholder')}
          />
        </div>
      )}
    </div>
  );
}

/* ── Small helper: terminal-styled radio indicator ── */
import { useState, useEffect, useRef, type CSSProperties } from 'react';
import type { TerminalThemeConfig } from '@shared/hooks/useTerminalTheme';

function RadioIndicator({
  theme,
  name,
  value,
  register,
  defaultChecked,
}: {
  theme: TerminalThemeConfig;
  name: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  defaultChecked: boolean;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [checked, setChecked] = useState(defaultChecked);
  const { ref: rhfRef, ...rhfRest } = register(name as 'expiration');

  const indicator =
    theme.style === 'retro' || theme.style === 'vscode'
      ? checked ? '(●)' : '( )'
      : checked ? '[●]' : '[ ]';

  useEffect(() => {
    const input = ref.current;
    if (!input) return;
    const onChange = () => setChecked(input.checked);
    // Listen on all radios with the same name
    const form = input.form;
    if (!form) return;
    const radios = form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);
    radios.forEach(r => r.addEventListener('change', onChange));
    return () => radios.forEach(r => r.removeEventListener('change', onChange));
  }, [name]);

  const style: CSSProperties = {
    color: checked ? theme.accent : theme.textSecondary,
    fontWeight: 600,
    fontFamily: theme.fontFamily,
  };

  return (
    <>
      <input
        type="radio"
        ref={el => {
          ref.current = el;
          rhfRef(el);
        }}
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
        {...rhfRest}
      />
      <span style={style}>{indicator}</span>
    </>
  );
}
