import FeaturesSection from '@shared/components/FeaturesSection';
import HowItWorks from '@shared/components/HowItWorks';
import HintTooltip from '@shared/components/HintTooltip';
import FartechBanner from '@shared/components/FartechBanner';
import { TerminalStyleProvider } from '@shared/context/TerminalStyleContext';
import TerminalShell from '@shared/components/terminal/TerminalShell';
import CreateSecret from '@features/CreateSecret';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useConfig } from '@shared/hooks/useConfig';
import Navbar from '@shared/components/Navbar';
import Prefetcher from '@features/display-secret/Prefetcher';
import Upload from '@features/Upload';
import { useTranslation } from 'react-i18next';
import { useTerminalTheme } from '@shared/hooks/useTerminalTheme';

function AppFooter() {
  const { t } = useTranslation();
  const { PRIVACY_NOTICE_URL, IMPRINT_URL } = useConfig();
  const theme = useTerminalTheme();

  // ── Terminal footer ──
  if (theme) {
    const now = new Date();
    const dateStr = now
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .toUpperCase()
      .replace(/ /g, '-');

    const footerText =
      theme.style === 'vscode'
        ? `FarPass · FARTECH · Farpost · ${dateStr}`
        : theme.style === 'retro'
          ? `${'═'.repeat(20)} ${dateStr} ${'═'.repeat(20)}`
          : `[SYSTEM] FarPass v1.0 // FARTECH // Farpost`;

    return (
      <footer
        style={{
          fontFamily: theme.fontFamily,
          color: theme.textSecondary,
          fontSize: '0.75rem',
          textAlign: 'center',
          padding: '1rem 0',
          borderTop: `1px solid ${theme.border}`,
          letterSpacing: '0.05em',
          transition: 'background 0.3s, color 0.3s, border-color 0.3s',
        }}
      >
        {footerText}
      </footer>
    );
  }

  // ── DaisyUI footer ──
  return (
    <footer className="bg-base-100 border-t border-base-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {PRIVACY_NOTICE_URL && PRIVACY_NOTICE_URL.trim() && (
              <>
                <a
                  href={PRIVACY_NOTICE_URL}
                  className="text-base-content/70 hover:text-primary transition-colors duration-200 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('footer.privacyNotice')}
                </a>
                <span className="text-base-content/40">•</span>
              </>
            )}
            {IMPRINT_URL && IMPRINT_URL.trim() && (
              <>
                <a
                  href={IMPRINT_URL}
                  className="text-base-content/70 hover:text-primary transition-colors duration-200 underline decoration-dotted underline-offset-4 hover:decoration-solid"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('footer.imprint')}
                </a>
                <span className="text-base-content/40">•</span>
              </>
            )}
            <span className="text-base-content/70">
              {t('footer.createdBy')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MainCard() {
  const theme = useTerminalTheme();
  const { DISABLE_UPLOAD } = useConfig();

  const routes = (
    <Routes>
      <Route path="/" element={<CreateSecret />} />
      {!DISABLE_UPLOAD && (
        <Route path="/upload" element={<Upload />} />
      )}
      <Route
        path="/:format/:key/:password"
        element={<Prefetcher />}
      />
      <Route path="/:format/:key" element={<Prefetcher />} />
    </Routes>
  );

  if (theme) {
    return <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>{routes}</div>;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {routes}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TerminalStyleProvider>
      <AppInner />
    </TerminalStyleProvider>
  );
}

function AppInner() {
  const theme = useTerminalTheme();

  return (
    <TerminalShell>
      <div
        className={theme ? 'min-h-screen flex flex-col' : 'min-h-screen bg-base-200 flex flex-col'}
      >
        <HashRouter>
          <Navbar />

          {/* Main Content */}
          {theme ? (
            <div className="container mx-auto mb-auto px-4 py-8">
              {/* ASCII-логотип FARTECH — верхняя часть единого блока */}
              <FartechBanner />
              {/* Единый терминальный корпус: HowItWorks → форма → Features */}
              <div
                style={{
                  background: theme.cardBg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: theme.style === 'vscode' ? '6px' : '2px',
                  boxShadow: theme.borderGlow,
                  padding: '1.5rem',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <HowItWorks />
                <MainCard />
                <FeaturesSection />
              </div>
            </div>
          ) : (
            <div className="container mx-auto mb-auto px-4 py-8">
              <FartechBanner />
              <HowItWorks />
              <MainCard />
              <FeaturesSection />
            </div>
          )}

          {/* Плавающая кнопка с подсказками (где нажимать) */}
          <HintTooltip />
        </HashRouter>
        <AppFooter />
      </div>
    </TerminalShell>
  );
}
