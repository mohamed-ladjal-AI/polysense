import { useEffect, useRef, useState } from 'react';
import Card from '../ui/Card';
import StatusDot from '../ui/StatusDot';
import Icon from '../ui/Icon';
import useInView from '../../hooks/useInView';
import { gauges } from '../../data/dashboard';

const statusBg = {
  good: 'bg-status-good/10 text-status-good border-status-good/30',
  warning: 'bg-status-warning/10 text-status-warning border-status-warning/30',
  danger: 'bg-status-danger/10 text-status-danger border-status-danger/30',
  info: 'bg-status-info/10 text-status-info border-status-info/30',
};

const statusLabelMap = {
  good: 'Normal',
  warning: 'Watch',
  danger: 'Critical',
  info: 'Info',
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function useCountUp(target, { duration = 1400, active = true, decimals = 0 }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setValue(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setValue(target);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, active]);

  if (decimals === 0) return Math.round(value);
  return Number(value.toFixed(decimals));
}

function GaugeChart({ dasharray, colorClass }) {
  return (
    <svg
      className="w-full h-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden="true"
    >
      <path
        className="text-brand-border/40"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        strokeDasharray="100, 100"
        strokeWidth="3"
      />
      <path
        className={colorClass}
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        fill="none"
        stroke="currentColor"
        strokeDasharray={`${dasharray}, 100`}
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function AnimatedGauge({ targetDasharray, colorClass, active }) {
  const [dasharray, setDasharray] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    cancelAnimationFrame(rafRef.current);
    const start = performance.now();
    const duration = 1400;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setDasharray(targetDasharray * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
      else setDasharray(targetDasharray);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetDasharray, active]);

  return <GaugeChart dasharray={dasharray} colorClass={colorClass} />;
}

function VariableCard({ g, inView }) {
  const decimals = Math.abs(g.value) < 10 && g.unit !== 'rpm' ? 2 : 0;
  const value = useCountUp(g.value, { duration: 1400, active: inView, decimals });

  return (
    <div className="group relative rounded-lg border border-brand-border/60 bg-brand-dark/40 p-3 hover:border-brand-border transition-colors overflow-hidden">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="text-sm font-medium text-brand-text truncate">
            {g.label}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-brand-muted">
            {g.sublabel}
          </div>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium transition-colors ${statusBg[g.status]}`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping ${
                g.status === 'good'
                  ? 'bg-status-good'
                  : g.status === 'warning'
                    ? 'bg-status-warning'
                    : 'bg-status-danger'
              }`}
              style={{ animationDuration: '3s' }}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                g.status === 'good'
                  ? 'bg-status-good'
                  : g.status === 'warning'
                    ? 'bg-status-warning'
                    : 'bg-status-danger'
              }`}
            />
          </span>
          {statusLabelMap[g.status]}
        </span>
      </div>

      <div className="relative w-20 h-20 mx-auto my-1">
        <AnimatedGauge
          targetDasharray={g.dasharray}
          colorClass={g.color}
          active={inView}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-lg font-bold leading-none tabular-nums ${g.color} transition-colors duration-500`}
          >
            {value}
          </span>
          <span className="text-[10px] text-brand-muted mt-0.5">{g.unit}</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-brand-muted mt-2 px-0.5">
        <span>{g.min}</span>
        <span className="flex items-center gap-1 text-brand-muted/80">
          <Icon name="info" className="w-3 h-3" />
          <span>Target {g.target}</span>
        </span>
        <span>{g.max}</span>
      </div>
    </div>
  );
}

function VariableCardWithObserver({ g }) {
  const [ref, inView] = useInView({ threshold: 0.25, once: true });
  return (
    <div ref={ref}>
      <VariableCard g={g} inView={inView} />
    </div>
  );
}

export default function KeyVariables() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm">
          KEY PROCESS VARIABLES
          <span className="text-brand-muted font-normal text-xs"> (Now)</span>
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-brand-muted">
          <span className="flex items-center gap-1">
            <StatusDot color="good" className="w-1.5 h-1.5" /> Normal
          </span>
          <span className="flex items-center gap-1">
            <StatusDot color="warning" className="w-1.5 h-1.5" /> Watch
          </span>
          <span className="flex items-center gap-1 hidden sm:flex">
            <StatusDot color="danger" className="w-1.5 h-1.5" /> Critical
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gauges.map((g) => (
          <VariableCardWithObserver key={g.id} g={g} />
        ))}
      </div>
    </Card>
  );
}