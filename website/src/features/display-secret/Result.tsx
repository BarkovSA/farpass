import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';
import TerminalButton from '@shared/components/terminal/TerminalButton';

interface ResultProps {
  password: string;
  uuid: string;
  prefix: string;
  customPassword: boolean;
  oneTime: boolean;
}

function Result({
  password,
  uuid,
  prefix,
  customPassword,
  oneTime,
}: ResultProps) {
  const { t } = useTranslation();
  const theme = useTerminalTheme();
  const [spoilerOpen, setSpoilerOpen] = useState(false);
  const oneClickLink = `${window.location.origin}/#/${prefix}/${uuid}/${password}`;
  const shortLink = `${window.location.origin}/#/${prefix}/${uuid}`;

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  // ── Copy button icon (only for off mode) ──
  const CopyIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
      />
    </svg>
  );

  // ═══════════════════════════════════════════
  //  TERMINAL RENDER
  // ═══════════════════════════════════════════
  if (theme) {
    const linePrefix =
      theme.style === 'vscode'
        ? '> '
        : theme.style === 'retro'
          ? '│ '
          : '';

    const labelStyle = {
      fontFamily: theme.fontFamily,
      color: theme.accent,
      fontWeight: 700 as const,
      fontSize: '0.95rem',
      textShadow: theme.headingGlow,
      marginBottom: '0.25rem',
    };

    const valueBoxStyle = {
      fontFamily: theme.fontFamily,
      fontSize: '0.85rem',
      color: theme.text,
      background: theme.pageBg,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.style === 'vscode' ? '4px' : '0',
      padding: '0.5rem 0.75rem',
      wordBreak: 'break-all' as const,
      overflowWrap: 'anywhere' as const,
    };

    const copyLabel =
      theme.style === 'matrix' ? 'COPY' : 'copy';

    // Retro box frame
    const RetroFrame = ({ children }: { children: React.ReactNode }) =>
      theme.style === 'retro' ? (
        <div style={{ fontFamily: theme.fontFamily }}>
          <div style={{ color: theme.textSecondary }}>
            ╔{'═'.repeat(50)}╗
          </div>
          {children}
          <div style={{ color: theme.textSecondary }}>
            ╚{'═'.repeat(50)}╝
          </div>
        </div>
      ) : (
        <>{children}</>
      );

    // Matrix status tag
    const statusTag = () =>
      theme.style === 'matrix' ? (
        <span style={{ color: theme.success, fontFamily: theme.fontFamily, fontSize: '0.8rem' }}>
          {`[OK] `}
        </span>
      ) : null;

    return (
      <div style={{ fontFamily: theme.fontFamily, color: theme.text }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: theme.headingGlow,
            color: theme.text,
          }}
        >
          {theme.style === 'vscode' && '>_ '}
          {theme.style === 'retro' && '╔══ '}
          {theme.style === 'matrix' && '// '}
          {theme.style === 'matrix'
            ? t('result.title').toUpperCase()
            : t('result.title')}
          {theme.style === 'retro' && ' ══╗'}
          {theme.style === 'matrix' && ' //'}
        </h2>

        <p style={{ color: theme.textSecondary, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {linePrefix}
          {t('result.subtitle')}
        </p>

        <RetroFrame>
          {/* One-click link */}
          {oneClickLink && !customPassword && (
            <div
              style={{
                marginBottom: '1.5rem',
                border: `2px solid ${theme.accent}`,
                borderRadius: theme.style === 'vscode' ? '8px' : '2px',
                padding: '1.5rem',
                background: theme.style === 'vscode'
                  ? 'rgba(88,166,255,0.08)'
                  : theme.style === 'matrix'
                    ? 'rgba(57,255,20,0.06)'
                    : 'rgba(0,204,0,0.06)',
                boxShadow: theme.style === 'matrix'
                  ? '0 0 20px rgba(57,255,20,0.15), inset 0 0 30px rgba(57,255,20,0.03)'
                  : theme.style === 'retro'
                    ? '0 0 15px rgba(0,200,0,0.2), inset 0 0 20px rgba(0,200,0,0.03)'
                    : '0 2px 12px rgba(88,166,255,0.12)',
              }}
            >
              {/* Big title */}
              <div
                style={{
                  fontFamily: theme.fontFamily,
                  color: theme.accent,
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  textShadow: theme.headingGlow,
                  marginBottom: '0.4rem',
                }}
              >
                {statusTag()}
                {theme.style === 'vscode' && '🔗 '}
                {theme.style === 'retro' && '>> '}
                {theme.style === 'matrix' && '▸ '}
                {t('result.rowLabelOneClick')}
              </div>
              <p style={{ color: theme.textSecondary, fontSize: '0.95rem', marginBottom: '1rem' }}>
                {linePrefix}
                {t('result.rowOneClickDescription')}
              </p>

              {/* Link value — large and prominent */}
              <div
                style={{
                  fontFamily: theme.fontFamily,
                  fontSize: '1.05rem',
                  color: theme.accent,
                  background: theme.pageBg,
                  border: `1px solid ${theme.accent}`,
                  borderRadius: theme.style === 'vscode' ? '6px' : '0',
                  padding: '0.85rem 1rem',
                  wordBreak: 'break-all' as const,
                  overflowWrap: 'anywhere' as const,
                  marginBottom: '0.75rem',
                  textShadow: theme.style === 'matrix' ? '0 0 6px rgba(57,255,20,0.5)' : 'none',
                }}
              >
                {oneClickLink}
              </div>

              {/* Copy button — full width */}
              <TerminalButton variant="primary" onClick={() => copyToClipboard(oneClickLink)}>
                {theme.style === 'matrix' ? '> COPY LINK' : theme.style === 'retro' ? '[ COPY LINK ]' : '$ copy link'}
              </TerminalButton>
            </div>
          )}
        </RetroFrame>

        {/* Create another — right after one-click link */}
        <div className="flex justify-center" style={{ marginBottom: '1.5rem' }}>
          <TerminalButton
            variant="outline"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            {t('result.buttonCreateAnother')}
          </TerminalButton>
        </div>

        {/* One-time warning — below one-click link */}
        {oneTime && (
          <div
            style={{
              border: `2px solid ${theme.warning}`,
              color: theme.warning,
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              marginTop: '0.75rem',
              fontFamily: theme.fontFamily,
              fontSize: '1rem',
              lineHeight: '1.5',
              borderRadius: theme.style === 'vscode' ? '6px' : '0',
              background: theme.style === 'vscode'
                ? 'rgba(240,165,0,0.08)'
                : theme.style === 'matrix'
                  ? 'rgba(204,255,0,0.06)'
                  : 'rgba(170,255,0,0.06)',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {theme.style === 'matrix' && '[WARNING] '}
              {theme.style === 'retro' && '⚠ '}
              {t('result.reminderTitle')}
            </div>
            <div style={{ fontSize: '0.95rem', opacity: 0.9 }}>
              {t('result.subtitleDownloadOnce')}
            </div>
          </div>
        )}

        {/* Spoiler: short link + decryption key */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setSpoilerOpen(!spoilerOpen)}
            style={{
              background: 'none',
              border: `1px solid ${theme.border}`,
              borderRadius: theme.style === 'vscode' ? '4px' : '0',
              color: theme.textSecondary,
              fontFamily: theme.fontFamily,
              fontSize: '0.85rem',
              padding: '0.5rem 0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = theme.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = theme.textSecondary)}
          >
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.2s',
                transform: spoilerOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                fontSize: '0.8rem',
              }}
            >
              ▶
            </span>
            {linePrefix}
            {t('result.spoilerToggle')}
          </button>

          {spoilerOpen && (
            <div
              style={{
                marginTop: '0.75rem',
                paddingLeft: '1rem',
                borderLeft: `2px solid ${theme.border}`,
              }}
            >
              <RetroFrame>
                {/* Short link */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={labelStyle}>
                    {statusTag()}
                    {linePrefix}
                    {t('result.rowLabelShortLink')}
                  </div>
                  <p style={{ color: theme.textSecondary, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    {linePrefix}
                    {t('result.rowShortLinkDescription')}
                  </p>
                  <div className="flex items-start gap-2">
                    <TerminalButton variant="copy" onClick={() => copyToClipboard(shortLink)}>
                      {copyLabel}
                    </TerminalButton>
                    <div style={valueBoxStyle} className="flex-1 min-w-0">
                      {shortLink}
                    </div>
                  </div>
                </div>

                {/* Decryption key */}
                <div>
                  <div style={labelStyle}>
                    {statusTag()}
                    {linePrefix}
                    {theme.style === 'matrix' ? '[KEY]' : ''}{' '}
                    {t('result.rowLabelDecryptionKey')}
                  </div>
                  <p style={{ color: theme.textSecondary, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    {linePrefix}
                    {t('result.rowDecryptionKeyDescription')}
                  </p>
                  <div className="flex items-start gap-2">
                    <TerminalButton variant="copy" onClick={() => copyToClipboard(password)}>
                      {copyLabel}
                    </TerminalButton>
                    <div style={valueBoxStyle} className="flex-1 min-w-0">
                      {password}
                    </div>
                  </div>
                </div>
              </RetroFrame>
            </div>
          )}
        </div>

      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  DAISYUI RENDER (off)
  // ═══════════════════════════════════════════
  return (
    <>
      {' '}
      <h2 className="text-3xl font-bold mb-2">{t('result.title')}</h2>
      <p className="mb-6 text-base">{t('result.subtitle')}</p>

      {/* One-click link — always visible, first */}
      {oneClickLink && !customPassword && (
        <div className="mb-6 p-8 bg-base-100 border-2 border-primary/30 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="font-bold text-xl mb-2 text-base-content">
            {t('result.rowLabelOneClick')}
          </div>
          <div className="text-base text-base-content/70 mb-5">
            {t('result.rowOneClickDescription')}
          </div>
          <div className="flex items-start gap-3">
            <button
              className="btn btn-primary font-medium shadow-sm hover:shadow transition-all duration-200 shrink-0 mt-1"
              onClick={() => copyToClipboard(oneClickLink)}
              title="Copy one-click link"
            >
              <CopyIcon />
              {t('common.copy')}
            </button>
            <div className="flex-1 bg-base-200/50 rounded-lg px-5 py-4 min-w-0">
              <code className="text-base text-base-content/80 font-mono break-words leading-relaxed">
                {oneClickLink}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Create another — right after one-click link */}
      <div className="flex justify-center mb-6">
        <button
          className="btn btn-outline btn-primary px-8 font-medium shadow-sm hover:shadow transition-all duration-200"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          {t('result.buttonCreateAnother')}
        </button>
      </div>

      {/* One-time warning — below one-click link */}
      {oneTime && (
        <div className="alert alert-warning mb-6 shadow-md border-2 border-warning/40 py-5 px-6">
          <svg
            className="w-8 h-8 stroke-current shrink-0"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <div>
            <div className="font-bold text-lg mb-1">
              {t('result.reminderTitle')}
            </div>
            <div className="text-base opacity-90">
              {t('result.subtitleDownloadOnce')}
            </div>
          </div>
        </div>
      )}

      {/* Spoiler: Short link + Decryption key */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setSpoilerOpen(!spoilerOpen)}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition-colors text-left cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${spoilerOpen ? 'rotate-90' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-sm font-medium text-base-content/70">
            {t('result.spoilerToggle')}
          </span>
        </button>

        {spoilerOpen && (
          <div className="mt-3 ml-3 pl-4 border-l-2 border-base-300 space-y-6">
            {/* Short link */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-lg mb-2 text-base-content">
                {t('result.rowLabelShortLink')}
              </div>
              <div className="text-sm text-base-content/70 mb-4">
                {t('result.rowShortLinkDescription')}
              </div>
              <div className="flex items-start gap-3">
                <button
                  className="btn btn-primary btn-sm font-medium shadow-sm hover:shadow transition-all duration-200 shrink-0 mt-1"
                  onClick={() => copyToClipboard(shortLink)}
                  title="Copy short link"
                >
                  <CopyIcon />
                </button>
                <div className="flex-1 bg-base-200/50 rounded-md px-4 py-3 min-h-[2.5rem] min-w-0">
                  <code className="text-sm text-base-content/80 font-mono break-words leading-relaxed">
                    {shortLink}
                  </code>
                </div>
              </div>
            </div>

            {/* Decryption key */}
            <div className="p-6 bg-base-100 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="font-semibold text-lg mb-2 text-base-content">
                {t('result.rowLabelDecryptionKey')}
              </div>
              <div className="text-sm text-base-content/70 mb-4">
                {t('result.rowDecryptionKeyDescription')}
              </div>
              <div className="flex items-start gap-3">
                <button
                  className="btn btn-primary btn-sm font-medium shadow-sm hover:shadow transition-all duration-200 shrink-0 mt-1"
                  onClick={() => copyToClipboard(password)}
                  title="Copy decryption key"
                >
                  <CopyIcon />
                </button>
                <div className="flex-1 bg-base-200/50 rounded-md px-4 py-3 min-h-[2.5rem] min-w-0">
                  <code className="text-sm text-base-content/80 font-mono break-words leading-relaxed">
                    {password}
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </>
  );
}

export default Result;
