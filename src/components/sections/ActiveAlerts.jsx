import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { alerts } from '../../data/dashboard';

function AlertItem({ alert }) {
  const severityColor = {
    warning: 'text-status-warning border-status-warning',
    info: 'text-status-info border-brand-primary',
    danger: 'text-status-danger border-status-danger',
  }[alert.severity];

  const iconColor = {
    warning: 'text-status-warning',
    info: 'text-status-info',
    danger: 'text-status-danger',
  }[alert.severity];

  return (
    <div className="p-3 bg-brand-dark/50 border border-brand-border rounded-lg flex gap-3">
      <div className="mt-0.5 shrink-0">
        <Icon name={alert.icon} className={`w-5 h-5 ${iconColor}`} filled={alert.icon !== 'info'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-medium">{alert.title}</h4>
          <span className="text-xs text-brand-muted shrink-0">{alert.time}</span>
        </div>
        <p className="text-xs text-brand-muted mt-1">{alert.description}</p>
        <div
          className={`mt-2 inline-block px-2 py-0.5 border rounded text-[10px] font-medium ${severityColor}`}
        >
          {alert.severityLabel}
        </div>
      </div>
    </div>
  );
}

export default function ActiveAlerts() {
  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-sm uppercase tracking-wider">Active Alerts</h2>
        <div className="flex items-center gap-2">
          <a href="#" className="text-xs text-brand-primary hover:underline">
            View all
          </a>
          <button
            type="button"
            aria-label="More options"
            className="text-brand-muted hover:text-white"
          >
            <Icon name="dots" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((a) => (
          <AlertItem key={a.id} alert={a} />
        ))}
      </div>
    </Card>
  );
}