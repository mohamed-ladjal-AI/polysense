import { useEffect, useMemo, useState } from 'react';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import { chartLegend } from '../../data/dashboard';

const SERIES_META = [
  { id: 'temp', label: 'Temperature (°C)', color: '#ef4444', bounds: [150, 200], center: 178 },
  { id: 'pressure', label: 'Pressure (bar)', color: '#3b82f6', bounds: [35, 50], center: 42 },
  { id: 'torque', label: 'Torque (%)', color: '#eab308', bounds: [55, 85], center: 70 },
  { id: 'vacuum', label: 'Vacuum (bar)', color: '#14b8a6', bounds: [-0.95, -0.7], center: -0.82 },
  { id: 'gas', label: 'Gas (ppm)', color: '#a855f7', bounds: [0.05, 0.3], center: 0.14 },
];

const VIEW_W = 1000;
const VIEW_H = 300;
const LENGTH = 80;

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

const yAxisLeft = ['200 °C', '160 °C', '120 °C', '80 °C', '40 °C', '0 °C'];
const yAxisRight = [
  '100 %  80 bar',
  '75 %   60 bar',
  '50 %   40 bar',
  '25 %   20 bar',
  '0 %    0 bar',
  '-25 %  -20 bar',
  '-50 %  -40 bar',
];

function ChartToolbar() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <select
          aria-label="Time range"
          className="appearance-none bg-brand-dark border border-brand-border text-brand-text text-xs rounded pl-2 pr-6 py-1 focus:outline-none"
        >
          <option>Last 30 min</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-muted">
          <Icon name="chevronDown" className="w-3 h-3" />
        </div>
      </div>

      <div className="hidden sm:flex rounded border border-brand-border overflow-hidden">
        <button
          type="button"
          aria-label="Filter"
          className="px-2 py-1 bg-brand-dark hover:bg-brand-border border-r border-brand-border"
        >
          <Icon name="filter" className="w-4 h-4 text-brand-muted" />
        </button>
        <button
          type="button"
          aria-label="More options"
          className="px-2 py-1 bg-brand-dark hover:bg-brand-border"
        >
          <Icon name="dots" className="w-4 h-4 text-brand-muted" />
        </button>
      </div>

      <button
        type="button"
        aria-label="Expand"
        className="px-2 py-1 bg-brand-dark border border-brand-border rounded hover:bg-brand-border"
      >
        <Icon name="expand" className="w-4 h-4 text-brand-muted" />
      </button>
    </div>
  );
}

export default function ProcessTrends() {
  const bounds = useMemo(() => SERIES_META.map((s) => s.bounds), []);

  const [series, setSeries] = useState(() =>
    Array.from({ length: LENGTH }, () =>
      SERIES_META.map((s) => {
        const [min, max] = s.bounds;
        const span = max - min;
        return s.center + (Math.random() - 0.5) * span * 0.02;
      })
    )
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const newPoint = SERIES_META.map((s, idx) => {
          const [min, max] = s.bounds;
          const span = max - min;
          const drift = (Math.random() - 0.5) * span * 0.01;
          const pull = (s.center - last[idx]) * 0.05;
          return Math.min(max, Math.max(min, last[idx] + drift + pull));
        });
        return [...prev.slice(1), newPoint];
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="xl:col-span-2 flex flex-col min-h-[400px]">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h2 className="font-semibold text-sm">
          PROCESS TRENDS
          <span className="text-brand-muted font-normal text-xs"> (Real-time)</span>
        </h2>
        <ChartToolbar />
      </div>

      <div className="flex flex-wrap gap-4 text-xs mb-4">
        {chartLegend.map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${l.color}`} />
            {l.label}
          </div>
        ))}
      </div>

      <div className="flex-1 relative mt-2 ml-10 mr-10 border-l border-b border-brand-border/50 min-h-[260px]">
        <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-brand-muted items-end pr-2 py-2">
          {yAxisLeft.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="absolute -right-10 top-0 bottom-0 flex flex-col justify-between text-[10px] text-brand-muted items-start pl-2 py-2">
          {yAxisRight.map((label, i) => (
            <span key={label} className={i === yAxisRight.length - 1 ? '-mt-4' : ''}>
              {label}
            </span>
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-t border-white w-full" />
          ))}
        </div>

        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          aria-label="Process trends line chart"
        >
          <defs>
            {SERIES_META.map((s) => (
              <linearGradient
                key={s.id}
                id={`pt-grad-${s.id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {SERIES_META.map((s, idx) => {
            const data = series.map((p) => p[idx]);
            const path = buildPath(data, s.bounds);
            const area = buildAreaPath(data, s.bounds);
            return (
              <g key={s.id}>
                <path d={area} fill={`url(#pt-grad-${s.id})`} />
                <path
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: 'd 2s ease-in-out' }}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-brand-muted px-4">
          <span>-30 min</span>
          <span>now</span>
        </div>
      </div>
    </Card>
  );
}