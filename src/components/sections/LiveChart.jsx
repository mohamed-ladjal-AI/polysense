import { useEffect, useMemo, useState } from 'react';
import useLiveSeries from '../../hooks/useLiveSeries';

const SERIES_META = [
  { id: 'temp', label: 'Temperature', unit: '°C', color: '#ef4444', bounds: [150, 200], threshold: [180, 195] },
  { id: 'pressure', label: 'Pressure', unit: 'bar', color: '#3b82f6', bounds: [35, 50] },
  { id: 'torque', label: 'Torque', unit: '%', color: '#eab308', bounds: [55, 85] },
  { id: 'vacuum', label: 'Vacuum', unit: 'bar', color: '#14b8a6', bounds: [-0.95, -0.7] },
  { id: 'gas', label: 'HCl Gas', unit: 'ppm', color: '#a855f7', bounds: [0.05, 0.3] },
];

const VIEW_W = 1000;
const VIEW_H = 300;

function buildPath(points, range) {
  if (!points.length) return '';
  const [min, max] = range;
  const stepX = VIEW_W / (points.length - 1);
  return points
    .map((v, i) => {
      const x = i * stepX;
      const ratio = Math.min(1, Math.max(0, (v - min) / (max - min)));
      const y = VIEW_H - ratio * VIEW_H;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function buildAreaPath(points, range) {
  if (!points.length) return '';
  const [min, max] = range;
  const stepX = VIEW_W / (points.length - 1);
  const coords = points.map((v, i) => {
    const x = i * stepX;
    const ratio = Math.min(1, Math.max(0, (v - min) / (max - min)));
    const y = VIEW_H - ratio * VIEW_H;
    return [x, y];
  });
  const start = `M${coords[0][0].toFixed(2)},${VIEW_H}`;
  const line = coords
    .map(([x, y], i) => `${i === 0 ? 'L' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');
  const end = `L${coords[coords.length - 1][0].toFixed(2)},${VIEW_H} Z`;
  return `${start} ${line} ${end}`;
}

function formatVal(v, unit) {
  if (typeof v !== 'number') return v;
  if (unit === '°C' || unit === '%') return `${Math.round(v)}${unit}`;
  if (unit === 'bar') return `${v.toFixed(2)} ${unit}`;
  if (unit === 'ppm') return `${v.toFixed(2)} ${unit}`;
  return `${v.toFixed(1)} ${unit}`;
}

export default function LiveChart() {
  const bounds = useMemo(() => SERIES_META.map((s) => s.bounds), []);
  const series = useLiveSeries({ length: 60, interval: 1000, bounds });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const latest = series[series.length - 1] || [];

  return (
    <div className="bg-brand-panel border border-brand-border rounded-xl p-4 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0, transparent calc(100% - 1px), #fff 100%)',
          backgroundSize: '40px 100%',
          animation: 'live-sweep 4s linear infinite',
        }}
      />
      <style>{`
        @keyframes live-sweep {
          from { background-position: -40px 0; }
          to { background-position: 100vw 0; }
        }
      `}</style>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="font-semibold text-sm flex items-center gap-2">
            LIVE PROCESS TRENDS
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-good opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-good" />
            </span>
          </h2>
          <p className="text-xs text-brand-muted">
            Streaming data · updates every ~1s · uptime {Math.floor(tick / 2)}s
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-status-good/10 text-status-good border border-status-good/30 font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-good opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-good" />
            </span>
            STREAMING
          </span>
          <span className="text-brand-muted hidden sm:inline">60s window</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {SERIES_META.map((s, idx) => {
          const val = latest[idx];
          const isCritical = val !== undefined && s.threshold && (val > s.threshold[1] || val < s.threshold[0]);
          return (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border bg-brand-dark/40 ${
                isCritical ? 'border-status-danger/40 animate-pulse' : 'border-brand-border/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-[10px] uppercase tracking-wider text-brand-muted">
                {s.label}
              </span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: s.color }}>
                {val !== undefined ? formatVal(val, s.unit) : '—'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative h-64 rounded overflow-hidden border border-brand-border/40 bg-brand-dark/30">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-t border-brand-border/40 w-full" />
          ))}
        </div>

        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          aria-label="Live process chart"
        >
          <defs>
            {SERIES_META.map((s) => (
              <linearGradient
                key={s.id}
                id={`grad-${s.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
            <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
          </defs>

          {SERIES_META.map((s, idx) => {
            const data = series.map((p) => p[idx]);
            const path = buildPath(data, s.bounds);
            const area = buildAreaPath(data, s.bounds);
            const lastY =
              VIEW_H -
              Math.min(
                1,
                Math.max(0, (data[data.length - 1] - s.bounds[0]) / (s.bounds[1] - s.bounds[0]))
              ) *
                VIEW_H;

            return (
              <g key={s.id}>
                <path
                  d={area}
                  fill={`url(#grad-${s.id})`}
                  style={{ transition: 'all 1s ease-in-out' }}
                />
                <path
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'all 1s ease-in-out', filter: `drop-shadow(0 0 4px ${s.color}66)` }}
                />
                <circle
                  cx={VIEW_W - 2}
                  cy={lastY}
                  r="3"
                  fill={s.color}
                  style={{ filter: `drop-shadow(0 0 6px ${s.color})` }}
                >
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          <line
            x1={VIEW_W - 2}
            y1={0}
            x2={VIEW_W - 2}
            y2={VIEW_H}
            stroke="#22c55e"
            strokeOpacity="0.4"
            strokeDasharray="4 4"
          />

          {series.map((_, i) => {
            if (i % 10 !== 0) return null;
            const x = (i / (series.length - 1)) * VIEW_W;
            return (
              <line
                key={i}
                x1={x}
                y1={0}
                x2={x}
                y2={VIEW_H}
                stroke="#334155"
                strokeOpacity="0.4"
                strokeDasharray="2 4"
              />
            );
          })}
        </svg>

        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-24 pointer-events-none"
          style={{
            right: 0,
            background:
              'linear-gradient(90deg, transparent, rgba(34,197,94,0.06) 50%, rgba(34,197,94,0.18))',
            boxShadow: 'inset 8px 0 16px -8px rgba(34,197,94,0.4)',
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-[10px] text-brand-muted">
        <span>-60s</span>
        <span className="hidden sm:inline">latest sample: {new Date().toLocaleTimeString()}</span>
        <span>now</span>
      </div>
    </div>
  );
}