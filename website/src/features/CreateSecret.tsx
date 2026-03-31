import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { encryptMessage } from '@shared/lib/crypto';
import { postSecret } from '@shared/lib/api';
import { useConfig } from '@shared/hooks/useConfig';
import { useSecretForm } from '@shared/hooks/useSecretForm';
import { SecretOptions } from '@shared/components/SecretOptions';
import Result from '@features/display-secret/Result';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';
import { TerminalTextarea } from '@shared/components/terminal/TerminalInput';
import TerminalButton from '@shared/components/terminal/TerminalButton';
import TerminalLabel from '@shared/components/terminal/TerminalLabel';
import EncryptingOverlay from '@shared/components/EncryptingOverlay';
// animation flags intentionally disabled

export default function CreateSecret() {
  const { t } = useTranslation();
  const config = useConfig();
  const theme = useTerminalTheme();
  const [secret, setSecret] = useState('');
  const [encrypting, setEncrypting] = useState(false);
  // Анимация всегда отключена
  const showAnimation = false;
  const setShowAnimation = () => {};

  const {
    oneTime,
    setOneTime,
    generateKey,
    setGenerateKey,
    customPassword,
    setCustomPassword,
    result,
    setResult,
    getPassword,
    isCustomPassword,
  } = useSecretForm();

  type Secret = {
    secret: string;
    expiration: string;
    oneTime: boolean;
    generateKey: boolean;
    customPassword: string;
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Secret>({
    defaultValues: {
      expiration: '86400', // 1 день
      oneTime: false, // 10 открытий (oneTime=false)
      generateKey: true,
      customPassword: '',
    },
  });

  // Принудительно выставляем значения по умолчанию (на случай если кто-то попытается изменить)
  async function onSubmit(form: Secret) {
    form.expiration = '86400';
    form.oneTime = false;
    if (!form.secret) {
      return;
    }
    if (showAnimation) setEncrypting(true);
    const MIN_OVERLAY_MS = 5000;
    try {
      const pw = getPassword();
      const promises: Promise<unknown>[] = [
        postSecret({
          expiration: parseInt(form.expiration),
          message: await encryptMessage(form.secret, pw),
          one_time: config?.FORCE_ONETIME_SECRETS || oneTime,
        }),
      ];
      if (showAnimation) {
        promises.push(new Promise((r) => setTimeout(r, MIN_OVERLAY_MS)));
      }
      const [response] = await Promise.all(promises);
      const { data, status } = response as { data: { message: string }; status: number };
      if (status !== 200) {
        setError('secret', { type: 'submit', message: data.message });
      } else {
        setResult({
          password: pw,
          uuid: data.message,
          customPassword: isCustomPassword(),
        });
      }
    } finally {
      setEncrypting(false);
    }
  }

  if (result.uuid) {
    return (
      <Result
        password={result.password}
        uuid={result.uuid}
        prefix="s"
        customPassword={result.customPassword}
        oneTime={config?.FORCE_ONETIME_SECRETS || oneTime}
      />
    );
  }

  // ── Terminal title by style ──
  const titleText = theme
    ? theme.style === 'vscode'
      ? `>_ ${t('create.title')}`
      : theme.style === 'retro'
        ? `╔══ ${t('create.title').toUpperCase()} ══╗`
        : `// ${t('create.title').toUpperCase()} //`
    : t('create.title');

  // ── Encrypt button label by style ──
  const btnLabel = theme
    ? theme.style === 'retro'
      ? t('create.buttonEncrypt').toUpperCase()
      : theme.style === 'matrix'
        ? `EXECUTE ${t('create.buttonEncrypt').toUpperCase()}`
        : t('create.buttonEncrypt')
    : t('create.buttonEncrypt');

  return (
    <>
      <EncryptingOverlay visible={encrypting} />
      <h2
        className={theme ? '' : 'text-3xl font-bold mb-4'}
        style={
          theme
            ? {
                fontFamily: theme.fontFamily,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: theme.text,
                textShadow: theme.headingGlow,
                marginBottom: '1rem',
              }
            : undefined
        }
      >
        {titleText}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errors.secret && (
          <div
            className={theme ? '' : 'mb-4 text-red-600 text-sm font-medium'}
            style={
              theme
                ? {
                    color: theme.error,
                    fontFamily: theme.fontFamily,
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem',
                  }
                : undefined
            }
          >
            {theme && '[ERROR] '}
            {errors.secret.message?.toString()}
          </div>
        )}
        <div className={theme ? '' : 'form-control'}>
          <TerminalLabel>{t('create.inputSecretLabel')}</TerminalLabel>
          <TerminalTextarea
            {...register('secret')}
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder={t('create.inputSecretPlaceholder')}
            rows={4}
          />
        </div>

        <div className={theme ? 'mt-4' : 'form-control mt-4'}>
          <TerminalButton type="submit" variant="primary">
            {!theme && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            )}
            {btnLabel}
          </TerminalButton>
        </div>

        <SecretOptions
          register={register}
          oneTime={oneTime}
          setOneTime={setOneTime}
          generateKey={generateKey}
          setGenerateKey={setGenerateKey}
          customPassword={customPassword}
          setCustomPassword={setCustomPassword}
          showAnimation={showAnimation}
          setShowAnimation={setShowAnimation}
          hideExpiration
          hideOneTime
        />
      </form>
    </>
  );
}
