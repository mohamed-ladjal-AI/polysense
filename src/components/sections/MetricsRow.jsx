import { useMemo, useState, useEffect } from 'react';
import Card from '../ui/Card';
import StatusDot from '../ui/StatusDot';
import { metrics } from '../../data/dashboard';

const METRIC_BOUNDS = {
  'degradation-risk': [15, 35],
  'p-defaut': [15, 35],
  'torque-load': [60, 85],
  'melt-temp': [183, 193],
  'process-status': [0, 100],
};

function buildSparkPath(points, range, height = 24) {
  const [min, max] = range;
  const stepX = 100 / (points.length - 1);
  return points
    .map((v, i) => {
      const x = i * stepX;
      const ratio = Math.min(1, Math.max(0, (v - min) / (max - min)));
      const y = height - ratio * (height - 4) - 2;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function useLiveMetric(bounds, length = 24) {
  const [series, setSeries] = useState(() => {
    const [min, max] = bounds;
    return Array.from({ length }, () => min + (max - min) * (0.5 + 0.3 * Math.sin(Math.random() * 6)));
  });
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1];
        const [min, max] = bounds;
        const drift = (Math.random() - 0.5) * (max - min) * 0.08;
        const pull = (min + (max - min) * 0.5 - last) * 0.08;
        const next = Math.min(max, Math.max(min, last + drift + pull));
        return [...prev.slice(1), next];
      });
    }, 1400);
    return () => clearInterval(id);
  }, [bounds]);
  return series;
}

function LiveSparkline({ bounds, colorClass }) {
  const series = useLiveMetric(bounds);
  const path = useMemo(() => buildSparkPath(series, bounds), [series, bounds]);
  return (
    <svg
      className={`w-full h-6 ml-auto ${colorClass}`}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 100 24"
      aria-hidden="true"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'all 1.4s ease-in-out' }}
      />
    </svg>
  );
}

function MetricCard({ metric }) {
  const bounds = METRIC_BOUNDS[metric.id];
  const [display, setDisplay] = useState(metric.value);
  const valueColor = {
    good: 'text-status-good',
    warning: 'text-status-warning',
    danger: 'text-status-danger',
    info: 'text-status-info',
  }[metric.status];

  useEffect(() => {
    if (metric.isText) return undefined;
    const id = setInterval(() => {
      const [min, max] = bounds;
      const drift = (Math.random() - 0.5) * (max - min) * 0.08;
      const pull = (min + (max - min) * 0.5 - display) * 0.08;
      setDisplay((cur) => {
        const next = cur + drift + pull;
        const rounded = Math.round(next);
        return Math.min(max, Math.max(min, rounded));
      });
    }, 1400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metric.isText]);

  return (
    <Card className="flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
          {metric.label}
        </span>
        <StatusDot color={metric.status} className="w-1.5 h-1.5 mt-1" />
      </div>

      <div className="flex items-end gap-1 mb-2">
        {metric.isText ? (
          <span className={`text-2xl font-bold mt-1 ${valueColor}`}>{metric.value}</span>
        ) : (
          <>
            <span className={`text-3xl font-bold tabular-nums ${valueColor}`}>
              {display}
            </span>
            <span
              className={`text-xs ${metric.unit === '%' ? 'text-sm' : 'text-xs'} text-brand-muted mb-1`}
            >
              {metric.unit}
            </span>
          </>
        )}
      </div>

      {metric.hasSpark && bounds && (
        <div className="flex items-center gap-2 text-xs">
          <StatusDot color={metric.status} />
          <span className="text-brand-muted">{metric.statusLabel}</span>
          <LiveSparkline
            bounds={bounds}
            colorClass={
              metric.status === 'good'
                ? 'text-status-good'
                : metric.status === 'warning'
                  ? 'text-status-warning'
                  : 'text-status-info'
            }
          />
        </div>
      )}

      {!metric.hasSpark && metric.hasBadge && (
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <StatusDot color={metric.status} />
            <span className="text-brand-muted">{metric.statusLabel}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function MetricsRow() {
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4"
    >
      {metrics.map((m) => (
        <MetricCard key={m.id} metric={m} />
      ))}
    </section>
  );
}