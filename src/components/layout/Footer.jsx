import { Icon } from '../ui/Icon';
import { footerStatus, footerLinks } from '../../data/dashboard';

export default function Footer() {
  return (
    <footer className="h-10 bg-brand-dark border-t border-brand-border flex items-center justify-between px-4 md:px-6 shrink-0 text-xs text-brand-muted">
      <div className="hidden sm:block">PolySense Analytics © 2025</div>

      <div className="hidden md:flex items-center gap-6">
        {footerStatus.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-status-good" />
            {s.label}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 ml-auto sm:ml-0">
        {footerLinks.map((link) => (
          <a
            key={link.id}
            href="#"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Icon name={link.icon} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{link.label}</span>
          </a>
        ))}
      </div>
    </footer>
  );
}