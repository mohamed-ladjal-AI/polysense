import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../ui/Icon';
import Select from '../ui/Select';
import { headerLineOptions } from '../../data/dashboard';
import { useAuth } from '../../hooks/useAuth';

const TITLES = {
  '/': { title: 'Dashboard', sub: 'Real-time overview of extrusion process' },
  '/live-process': { title: 'Live Process', sub: 'Streaming telemetry & machine visualization' },
  '/ai-predictions': { title: 'AI Predictions', sub: 'Soft-sensor degradation forecast & SHAP explainability' },
  '/alerts': { title: 'Alerts & Recommendations', sub: 'Preventative notifications & operating guidance' },
  '/history': { title: 'History & Reports', sub: 'Shift traceability, audit logs & production records' },
  '/settings': { title: 'Settings', sub: 'Machine parameters, model thresholds & SCADA interface' },
};

export default function Header({ isFullPage, onToggleFullPage }) {
  const { pathname } = useLocation();
  const t = TITLES[pathname] || TITLES['/'];

  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  const initials = (user?.displayName || 'AD')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else if (saved === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-16 bg-brand-dark/50 backdrop-blur border-b border-brand-border flex items-center justify-between px-4 md:px-6 shrink-0 print:hidden transition-colors">
      <div>
        <h1 className="text-xl font-semibold text-brand-text">{t.title}</h1>
        <p className="text-xs text-brand-muted">{t.sub}</p>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block">
          <Select
            options={headerLineOptions}
            ariaLabel="Select production line"
          />
        </div>

        {/* Full Page Presentation Toggle Button */}
        <button
          type="button"
          onClick={onToggleFullPage}
          title={isFullPage ? "Switch to Standard Fixed View" : "Expand to Full Page Presentation Mode (No Scrollbars)"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isFullPage
              ? 'bg-blue-600/30 border-blue-500 text-blue-400 dark:text-blue-300 shadow-sm'
              : 'bg-brand-panel border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary'
          }`}
        >
          <Icon name="expand" className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">
            {isFullPage ? 'Full View Active' : 'Full Page Mode'}
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 bg-brand-panel border border-brand-border rounded-lg px-3 py-1.5 text-sm text-brand-muted">
          <Icon name="calendar" className="w-4 h-4" />
          <span>2026-09-10 12:30:00</span>
        </div>

        {/* Working Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark/light theme"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          className="p-1.5 rounded-lg border border-brand-border text-brand-muted hover:text-brand-text hover:bg-brand-panel transition-all"
        >
          <Icon name={isDark ? 'sun' : 'moon'} className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="User account menu"
            title={`Signed in as ${user?.email || ''}`}
            className="w-8 h-8 rounded-full bg-brand-primary/80 border border-blue-400/30 flex items-center justify-center font-bold text-xs text-white shadow-sm hover:bg-brand-primary transition-colors cursor-pointer"
          >
            {initials}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="fixed z-20 top-12 right-4 md:right-6 w-60 bg-brand-panel border border-brand-border rounded-xl shadow-xl shadow-black/40 overflow-hidden">
                <div className="px-3.5 py-3 border-b border-brand-border">
                  <p className="text-sm font-semibold text-brand-text">
                    {user?.displayName || 'Operator'}
                  </p>
                  <p className="text-[11px] text-brand-muted truncate mt-0.5">
                    {user?.email || ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-status-danger hover:bg-brand-dark transition-colors"
                >
                  <Icon name="logout" className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}