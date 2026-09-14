import { useState } from 'react';
import { Icon } from '../components/ui/Icon';
import { useAuth, demoCredentials } from '../hooks/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    const errors = {};
    if (!trimmed) errors.email = 'Enter your email';
    else if (!trimmed.includes('@')) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Enter your password';
    else if (password.length < 6) errors.password = 'Minimum 6 characters';

    setFieldErrors(errors);
    setError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email, password });
      if (remember) {
        localStorage.setItem('polysense_remember_email', trimmed);
      } else {
        localStorage.removeItem('polysense_remember_email');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setFieldErrors({});
    setError(null);
  };

  const inputClasses =
    'w-full bg-brand-panel border border-brand-border text-brand-text text-sm rounded-lg pl-10 pr-11 py-2.5 focus:outline-none transition-colors placeholder:text-brand-muted/60';

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Industrial grid + radial glow backdrop */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 15%, rgba(59,130,246,0.09), transparent 42%),' +
            'radial-gradient(circle at 82% 85%, rgba(16,185,129,0.06), transparent 42%),' +
            'linear-gradient(rgba(51,65,85,0.22) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(51,65,85,0.22) 1px, transparent 1px)',
          backgroundSize: 'auto, auto, 44px 44px, 44px 44px',
        }}
      />

      <div className="relative flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex flex-col items-center mb-7">
            <img
              src="/logo_with_text.png"
              alt="PolySense Analytics"
              className="h-20 object-contain mb-2"
            />
            <h1 className="text-2xl font-bold tracking-tight text-brand-text">
              PolySense Analytics
            </h1>
            <p className="text-sm text-brand-muted mt-1.5">
              Sign in to monitor your extrusion lines
            </p>
          </div>

          {/* Card */}
          <div className="bg-brand-panel border border-brand-border rounded-2xl p-6 shadow-2xl shadow-black/30">
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                Email
              </label>
              <div className="relative mb-4">
                <Icon name="mail" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((f) => ({ ...f, email: undefined }));
                  }}
                  placeholder="operator@polysense.industrial"
                  autoComplete="email"
                  className={`${inputClasses} ${
                    fieldErrors.email ? 'border-status-danger focus:border-status-danger' : ''
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 text-xs text-status-danger flex items-center gap-1">
                    <Icon name="alertTriangle" className="w-3 h-3" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex items-end justify-between mb-1.5">
                <label className="block text-xs font-semibold text-brand-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] font-semibold text-brand-primary hover:text-blue-400 transition-colors"
                >
                  Use demo credentials
                </button>
              </div>
              <div className="relative mb-4">
                <Icon name="lock" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-primary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((f) => ({ ...f, password: undefined }));
                  }}
                  placeholder="Minimum 6 characters"
                  autoComplete="current-password"
                  className={`${inputClasses} ${
                    fieldErrors.password ? 'border-status-danger focus:border-status-danger' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                </button>
                {fieldErrors.password && (
                  <p className="mt-1.5 text-xs text-status-danger flex items-center gap-1">
                    <Icon name="alertTriangle" className="w-3 h-3" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 mb-5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-brand-border accent-blue-600 bg-brand-dark"
                />
                <span className="text-sm text-brand-muted">Remember me</span>
              </label>

              {/* Error box */}
              {error && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-status-danger/10 border border-status-danger/40">
                  <Icon name="alertTriangle" className="w-4 h-4 text-status-danger shrink-0" />
                  <p className="text-xs text-brand-text">{error}</p>
                </div>
              )}

              {/* Sign in */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-bold shadow transition-colors"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Mock divider */}
            <div className="flex items-center gap-3 mt-6 mb-2">
              <div className="flex-1 h-px bg-brand-border" />
              <span className="text-[10px] font-bold tracking-widest text-brand-muted">
                MOCK AUTH
              </span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>
            <p className="text-center text-[11px] text-brand-muted">
              Demo build — any valid email &amp; 6+ char password works.
            </p>
          </div>

          {/* Footer tagline */}
          <p className="text-center text-[11px] text-brand-muted/70 mt-6 tracking-wide">
            AI-POWERED SOFT-SENSOR TO MAKE YOUR QUALITY DECISIONS
          </p>
        </div>
      </div>
    </div>
  );
}