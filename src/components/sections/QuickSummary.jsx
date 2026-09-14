import Card from '../ui/Card';
import { quickSummary } from '../../data/dashboard';

function RiskGauge({ value, dasharray }) {
  const color = value < 40 ? 'text-status-good' : value < 70 ? 'text-status-warning' : 'text-status-danger';
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <path
          className="text-brand-dark"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={color}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${dasharray}, 100`}
          strokeWidth="4"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold leading-none ${color}`}>{value}%</span>
        <span className="text-[10px] text-brand-muted mt-1">Risk Index</span>
      </div>
    </div>
  );
}

export default function QuickSummary() {
  return (
    <Card>
      <h2 className="font-semibold text-sm uppercase tracking-wider mb-4">
        Quick Summary
        <span className="text-brand-muted font-normal text-xs capitalize"> (Shift)</span>
      </h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <RiskGauge value={quickSummary.riskValue} dasharray={quickSummary.riskDasharray} />
        <div className="flex-1 w-full space-y-3 text-sm">
          {quickSummary.stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex justify-between items-center ${
                i < quickSummary.stats.length - 1 ? 'border-b border-brand-border/50 pb-2' : ''
              }`}
            >
              <span className="text-brand-muted">{s.label}</span>
              <span className={`font-medium ${s.danger ? 'text-status-danger' : ''}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}