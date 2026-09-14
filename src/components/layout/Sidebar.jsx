import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { navigation, lineInfo } from '../../data/dashboard';

const ROUTE_MAP = {
  dashboard: '/',
  'live-process': '/live-process',
  'ai-predictions': '/ai-predictions',
  alerts: '/alerts',
  history: '/history',
  settings: '/settings',
};

function NavItem({ item }) {
  const to = ROUTE_MAP[item.id] || '#';
  const isPlaceholder = !ROUTE_MAP[item.id];

  if (isPlaceholder) {
    return (
      <a
        href="#"
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-brand-muted/60 cursor-not-allowed transition-colors"
        aria-disabled="true"
        title="Coming soon"
      >
        <Icon name={item.id} className="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
          isActive
            ? 'bg-blue-900/40 text-blue-400 font-medium border border-blue-800/50'
            : 'text-brand-muted hover:bg-brand-border hover:text-brand-text'
        }`
      }
    >
      <Icon name={item.id} className="w-5 h-5" />
      <span>{item.label}</span>
    </NavLink>
  );
}

function LineInfoCard() {
  return (
    <div className="p-4 mx-3 mb-4 rounded-xl bg-brand-dark border border-brand-border">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-xs tracking-wider text-brand-muted">
          {lineInfo.id}
        </span>
        <span className="flex items-center gap-1.5 text-status-good text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-status-good" />
          {lineInfo.status}
        </span>
      </div>
      <div className="space-y-2 text-xs">
        {lineInfo.fields.map((f) => (
          <div key={f.label} className="flex justify-between">
            <span className="text-brand-muted">{f.label}</span>
            <span className="font-medium text-right">{f.value}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full mt-4 py-2 border border-brand-border rounded-lg text-brand-muted hover:text-white hover:bg-brand-border transition-colors text-xs flex justify-between items-center px-3"
      >
        View machine details
        <Icon name="chevronRight" className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="w-64 bg-brand-panel border-r border-brand-border flex flex-col shrink-0"
      aria-label="Primary navigation"
    >
      <div className="h-16 flex items-center px-5 border-b border-brand-border gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-dark border border-brand-border flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-sm">
          <img
            src="/logo_only.png"
            alt="PolySense Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-bold text-lg tracking-tight leading-tight">
          PolySense
          <span className="text-brand-muted font-normal text-xs block -mt-1">
            ANALYTICS
          </span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-1">
        {navigation.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      <LineInfoCard />
    </aside>
  );
}