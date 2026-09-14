import { useEffect, useState } from 'react';
import LiveChart from '../components/sections/LiveChart';
import StatusDot from '../components/ui/StatusDot';

const STAT_TEMPLATES = [
  { label: 'Active Operator', value: 'Admin', sub: 'Day Shift', accent: 'good' },
  { label: 'Run Time', sub: 'since 04:42', accent: 'good', kind: 'runTime' },
  { label: 'Total Output', unit: ' t', sub: 'this shift', accent: 'primary', kind: 'output' },
  { label: 'Material', value: 'PVC rigide', sub: 'Grade A', accent: 'info' },
];

function pad(n) {
  return n.toString().padStart(2, '0');
}

function formatRunTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function LiveStat({ stat }) {
  const [runTime, setRunTime] = useState(20537);
  const [output, setOutput] = useState(4.82);

  useEffect(() => {
    const id = setInterval(() => {
      setRunTime((t) => t + 1);
      setOutput((o) => +(o + 0.0014).toFixed(3));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const accent = {
    good: 'text-status-good',
    primary: 'text-brand-primary',
    info: 'text-status-info',
    warning: 'text-status-warning',
  }[stat.accent] || 'text-brand-text';

  const value =
    stat.kind === 'runTime'
      ? formatRunTime(runTime)
      : stat.kind === 'output'
        ? `${output.toFixed(2)}${stat.unit || ''}`
        : stat.value;

  return (
    <div className="relative bg-brand-panel border border-brand-border rounded-xl p-3 overflow-hidden group">
      <span
        aria-hidden="true"
        className="absolute -inset-px bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      />
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-brand-muted">{stat.label}</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-good opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-status-good" />
        </span>
      </div>
      <div
        className={`text-lg font-semibold tabular-nums tracking-tight transition-colors ${accent}`}
      >
        {value}
      </div>
      <div className="text-[10px] text-brand-muted uppercase tracking-wider mt-0.5">
        {stat.sub}
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-status-good to-transparent w-full"
        style={{ animation: 'stat-scan 2.4s linear infinite' }}
      />
      <style>{`
        @keyframes stat-scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default function LiveProcessPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_TEMPLATES.map((s) => (
          <LiveStat key={s.label} stat={s} />
        ))}
      </div>

      <LiveChart />
    </div>
  );
}