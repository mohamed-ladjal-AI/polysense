import { useEffect, useState } from 'react';

const ZONES = [
  { id: 'z1', name: 'Zone 1', temp: 165, target: 165, status: 'good' },
  { id: 'z2', name: 'Zone 2', temp: 178, target: 180, status: 'warning' },
  { id: 'z3', name: 'Zone 3', temp: 182, target: 180, status: 'good' },
  { id: 'z4', name: 'Zone 4', temp: 188, target: 185, status: 'good' },
  { id: 'z5', name: 'Zone 5', temp: 195, target: 190, status: 'warning' },
];

const statusColors = {
  good: { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)' },
  warning: { stroke: '#eab308', glow: 'rgba(234,179,8,0.4)' },
  danger: { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)' },
};

function ZoneBlock({ zone, x }) {
  const c = statusColors[zone.status];
  return (
    <g>
      <rect
        x={x}
        y={60}
        width={64}
        height={90}
        rx={6}
        fill="#1e293b"
        stroke={c.stroke}
        strokeOpacity="0.6"
        strokeWidth="1.5"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.4;1;0.4"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </rect>
      <text
        x={x + 32}
        y={82}
        textAnchor="middle"
        fontSize="10"
        fill="#94a3b8"
        fontWeight="600"
      >
        {zone.name.toUpperCase()}
      </text>
      <text
        x={x + 32}
        y={108}
        textAnchor="middle"
        fontSize="16"
        fill={c.stroke}
        fontWeight="700"
      >
        {zone.temp}°
      </text>
      <text
        x={x + 32}
        y={128}
        textAnchor="middle"
        fontSize="9"
        fill="#64748b"
      >
        tgt {zone.target}°
      </text>
      <text
        x={x + 32}
        y={143}
        textAnchor="middle"
        fontSize="8"
        fill={c.stroke}
      >
        ● {zone.status.toUpperCase()}
      </text>
    </g>
  );
}

function AnimatedStat({ value, suffix = '', color }) {
  return (
    <div>
      <div className="text-xs text-brand-muted">{value.label}</div>
      <div
        className={`text-lg font-bold tabular-nums tracking-tight ${color}`}
      >
        {value.current}
        <span className="text-xs font-medium text-brand-muted ml-0.5">
          {suffix}
        </span>
      </div>
    </div>
  );
}

export default function MachineDiagram() {
  const [screwRotation, setScrewRotation] = useState(0);
  const [flowOffset, setFlowOffset] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tickInt = setInterval(() => setTick((t) => t + 1), 1000);
    const loop = (now) => {
      const t = (now - start) / 1000;
      setScrewRotation((t * 60) % 360);
      setFlowOffset((t * 80) % 40);
      setPulse((Math.sin(t * 2) + 1) / 2);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(tickInt);
    };
  }, []);

  const screwRpm = (85 + Math.sin(tick / 3) * 2).toFixed(0);
  const throughput = (142 + Math.sin(tick / 4) * 3 + (tick % 3) * 0.4).toFixed(0);
  const meltTemp = (195 + Math.sin(tick / 5) * 1.5).toFixed(0);
  const lineSpeed = (28 + Math.sin(tick / 2) * 0.6).toFixed(1);

  return (
    <div className="bg-brand-panel border border-brand-border rounded-xl p-4 overflow-hidden relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #3b82f6 0%, transparent 30%), radial-gradient(circle at 80% 70%, #22c55e 0%, transparent 30%)',
        }}
      />

      <div className="relative w-full" style={{ aspectRatio: '6 / 2.5' }}>
        <svg
          viewBox="0 0 600 250"
          className="w-full h-full"
          aria-label="Extrusion machine schematic"
        >
          <defs>
            <linearGradient id="hopper-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="flow-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0" />
              <stop offset="50%" stopColor="#22c55e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="die-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="vac-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* HOPPER */}
          <g>
            <polygon
              points="20,30 80,30 100,90 0,90"
              fill="url(#hopper-fill)"
              stroke="#3b82f6"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <polygon
              points="20,30 80,30 100,90 0,90"
              fill="url(#hopper-fill)"
              opacity={0.6 + pulse * 0.3}
            />
            <text x="40" y="60" fontSize="9" fill="#94a3b8" textAnchor="middle">
              HOPPER
            </text>
            <text x="40" y="76" fontSize="8" fill="#64748b" textAnchor="middle">
              PVC
            </text>
            {/* Level indicator */}
            <rect x="62" y="55" width="10" height="32" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
            <rect
              x="62"
              y={55 + 32 * (1 - (0.7 + pulse * 0.15))}
              width="10"
              height={32 * (0.7 + pulse * 0.15)}
              fill="#3b82f6"
              opacity="0.7"
            />
          </g>

          {/* FEED THROAT */}
          <line x1="100" y1="120" x2="115" y2="120" stroke="#334155" strokeWidth="2" />
          <line x1="115" y1="115" x2="115" y2="125" stroke="#3b82f6" strokeWidth="2">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
          </line>

          {/* BARREL */}
          <rect
            x="115"
            y="105"
            width="380"
            height="30"
            rx="4"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* SCREW */}
          <g style={{ transformOrigin: '305px 120px' }} transform={`rotate(${screwRotation} 305 120)`}>
            <line x1="115" y1="120" x2="495" y2="120" stroke="#475569" strokeWidth="3" />
            {Array.from({ length: 24 }).map((_, i) => {
              const x = 115 + i * 16;
              return (
                <g key={i}>
                  <line
                    x1={x}
                    y1={114}
                    x2={x + 8}
                    y2={126}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={x}
                    y1={126}
                    x2={x + 8}
                    y2={114}
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
          </g>

          {/* ZONES */}
          {ZONES.map((z, i) => (
            <ZoneBlock key={z.id} zone={z} x={130 + i * 72} />
          ))}

          {/* FLOW PARTICLES */}
          <g>
            {Array.from({ length: 12 }).map((_, p) => {
              const baseX = 130 - flowOffset * 4 + p * 32;
              const opacity = Math.max(0, 0.9 - Math.abs(baseX - 305) / 280);
              return (
                <g key={p}>
                  <circle
                    cx={baseX}
                    cy={120}
                    r={2.5}
                    fill="#22c55e"
                    opacity={opacity}
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="opacity"
                      values={`0;${opacity};0`}
                      dur="2s"
                      begin={`${(p * 0.16).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle
                    cx={baseX}
                    cy={120}
                    r={5}
                    fill="#22c55e"
                    opacity={opacity * 0.4}
                  >
                    <animate
                      attributeName="r"
                      values="3;8;3"
                      dur="2s"
                      begin={`${(p * 0.16).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;0.3;0"
                      dur="2s"
                      begin={`${(p * 0.16).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </g>

          {/* VACUUM PORT */}
          <g>
            <line x1="280" y1="105" x2="280" y2="80" stroke="#14b8a6" strokeWidth="1.5" />
            <circle cx="280" cy="74" r="6" fill="#0f172a" stroke="#14b8a6" strokeWidth="1.5">
              <animate attributeName="r" values="6;9;6" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="280" cy="74" r="14" fill="url(#vac-glow)">
              <animate attributeName="r" values="10;18;10" dur="1.8s" repeatCount="indefinite" />
            </circle>
            <text x="280" y="55" fontSize="8" fill="#14b8a6" textAnchor="middle">
              VAC
            </text>
          </g>

          {/* DIE */}
          <g>
            <polygon
              points="495,95 495,145 540,150 540,90"
              fill="#0f172a"
              stroke="#ef4444"
              strokeWidth="1.5"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-opacity"
                values="0.5;1;0.5"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </polygon>
            <circle cx="517" cy="120" r="14" fill="url(#die-glow)">
              <animate
                attributeName="r"
                values="12;18;12"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <text x="517" y="170" fontSize="9" fill="#ef4444" textAnchor="middle" fontWeight="600">
              DIE
            </text>
          </g>

          {/* OUTPUT CABLE */}
          <g>
            <path
              d="M540 120 Q 555 120, 565 120 Q 580 120, 590 120 L 600 120"
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dasharray"
                values="0 10;10 10;0 10"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* COOLING BATH */}
          <g>
            <rect
              x="20"
              y="180"
              width="560"
              height="35"
              rx="4"
              fill="#0f172a"
              stroke="#3b82f6"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <path
              d="M20 188 Q 60 184, 100 188 T 180 188 T 260 188 T 340 188 T 420 188 T 500 188 T 580 188"
              fill="none"
              stroke="#3b82f6"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            >
              <animate
                attributeName="d"
                values="M20 188 Q 60 184, 100 188 T 180 188 T 260 188 T 340 188 T 420 188 T 500 188 T 580 188;M20 192 Q 60 188, 100 192 T 180 192 T 260 192 T 340 192 T 420 192 T 500 192 T 580 192;M20 188 Q 60 184, 100 188 T 180 188 T 260 188 T 340 188 T 420 188 T 500 188 T 580 188"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <text x="300" y="205" fontSize="9" fill="#3b82f6" textAnchor="middle" fontWeight="600">
              COOLING BATH
            </text>
            <text x="300" y="218" fontSize="8" fill="#64748b" textAnchor="middle">
              Water · 22°C
            </text>
          </g>

          {/* PULLER / SPOOLER */}
          <g>
            <circle cx="540" cy="197" r="14" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="540" cy="197" r="6" fill="#334155" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 540 197"
              to="360 540 197"
              dur="4s"
              repeatCount="indefinite"
            />
          </g>

          {/* SCANNING RING */}
          <g aria-hidden="true">
            <circle
              cx="305"
              cy="120"
              r="30"
              fill="none"
              stroke="#22c55e"
              strokeOpacity="0.6"
              strokeWidth="1"
              strokeDasharray="4 6"
            >
              <animateTransform
                attributeName="transform"
                type="translate"
                from="0 0"
                to="200 0"
                dur="3.2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur="3.2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-brand-border/50 relative">
        <div className="text-center relative">
          <div className="text-xs text-brand-muted">Screw RPM</div>
          <div className="text-lg font-bold text-status-good tabular-nums">
            {screwRpm}
            <span className="text-[10px] text-brand-muted ml-0.5">rpm</span>
          </div>
        </div>
        <div className="text-center relative">
          <div className="text-xs text-brand-muted">Throughput</div>
          <div className="text-lg font-bold text-brand-primary tabular-nums">
            {throughput}
            <span className="text-[10px] text-brand-muted ml-0.5">kg/h</span>
          </div>
        </div>
        <div className="text-center relative">
          <div className="text-xs text-brand-muted">Melt Temp</div>
          <div className="text-lg font-bold text-status-warning tabular-nums">
            {meltTemp}
            <span className="text-[10px] text-brand-muted ml-0.5">°C</span>
          </div>
        </div>
        <div className="text-center relative">
          <div className="text-xs text-brand-muted">Line Speed</div>
          <div className="text-lg font-bold text-status-good tabular-nums">
            {lineSpeed}
            <span className="text-[10px] text-brand-muted ml-0.5">m/min</span>
          </div>
        </div>
      </div>
    </div>
  );
}