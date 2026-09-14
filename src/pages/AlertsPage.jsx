import { useState } from 'react';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

const INITIAL_ALERTS = [
  {
    id: 'ALR-T-190',
    severity: 'critical',
    title: 'T_masse Approaching Thermal Degradation Limit',
    variable: 'T_masse (Melt Temp)',
    currentVal: '188.6 °C',
    threshold: '190.0 °C',
    time: '10:22:47',
    elapsed: '2m ago',
    rootCause: 'Excessive shear dissipation at 33 rpm compounded by high melt viscosity in the metering zone.',
    recommendation: 'Reduce screw speed (n_vis) from 33 rpm to 28 rpm; trim Zone 5 heating setpoint by 2°C.',
    status: 'active',
  },
  {
    id: 'ALR-TRQ-95',
    severity: 'warning',
    title: 'Motor Torque Load Elevated (>70%)',
    variable: 'Couple_vis (Torque)',
    currentVal: '71 %',
    threshold: '80 % (Warn) / 95 % (Alarm)',
    time: '10:18:30',
    elapsed: '6m ago',
    rootCause: 'Slightly high resin feed rate or cold raw material pellets entering the feed section.',
    recommendation: 'Monitor motor current. If torque exceeds 80%, reduce dosing feeder by 5%. Sustained >95% for 15 min triggers safety stop.',
    status: 'active',
  },
  {
    id: 'ALR-PRIS-XGB',
    severity: 'warning',
    title: 'XGBoost P(défaut) 15-Minute Upward Drift',
    variable: 'P(défaut) Risk Index',
    currentVal: '23 % → 41 % proj.',
    threshold: '50 % Risk Limit',
    time: '10:23:15',
    elapsed: '1m ago',
    rootCause: 'Combined upward drift of melt temperature and motor torque pushing soft-sensor confidence towards AT RISK.',
    recommendation: 'Apply preventative cooling trim on barrel Zone 4 & 5 to stabilize temperature curve.',
    status: 'active',
  },
  {
    id: 'ALR-P-FLUC',
    severity: 'info',
    title: 'Melt Pressure Fluctuation Rate Peak',
    variable: 'P_masse (Pressure)',
    currentVal: '245 ± 12 bar',
    threshold: '±10 bar / min',
    time: '10:10:05',
    elapsed: '14m ago',
    rootCause: 'Minor dosing variation in gravitational hopper feed.',
    recommendation: 'Check gravimetric hopper level and verify PVC dry-blend flowability.',
    status: 'active',
  },
  {
    id: 'ALR-VAC-075',
    severity: 'resolved',
    title: 'Vacuum Degassing Pressure Restored',
    variable: 'Vide (Degassing)',
    currentVal: '0.82 mbar',
    threshold: '< 0.70 mbar',
    time: '09:44:12',
    elapsed: '40m ago',
    rootCause: 'Filter mesh partially clogged by volatile plasticizer condensates.',
    recommendation: 'Filter purged automatically by operator. Vacuum restored to nominal 0.82 mbar.',
    status: 'resolved',
  },
  {
    id: 'ALR-ZN2-180',
    severity: 'resolved',
    title: 'Barrel Zone 2 Temperature Deviation',
    variable: 'Zone 2 Temp',
    currentVal: '180.1 °C',
    threshold: '±5 °C of 180 °C',
    time: '09:12:00',
    elapsed: '1h 12m ago',
    rootCause: 'Thermal lag during shift startup heating.',
    recommendation: 'PID autotune stabilized Zone 2 to target 180°C.',
    status: 'resolved',
  },
];

const PREVENTATIVE_ACTIONS = [
  {
    id: 'act-1',
    priority: 'HIGH PRIORITY',
    priorityColor: 'text-red-400 bg-red-950/40 border-red-800/40',
    action: 'Reduce Screw Speed to 28 rpm',
    effect: 'Cuts mechanical shear heating. Lowers melt temperature by ~2.5°C within 6 minutes.',
    confidence: '94% model confidence',
  },
  {
    id: 'act-2',
    priority: 'RECOMMENDED',
    priorityColor: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    action: 'Increase Degassing Chamber Vacuum to 0.88 mbar',
    effect: 'Accelerates extraction of nascent volatile HCl gas traces before yellowing occurs.',
    confidence: '89% model confidence',
  },
  {
    id: 'act-3',
    priority: 'ADVISORY',
    priorityColor: 'text-blue-400 bg-blue-950/40 border-blue-800/40',
    action: 'Check Ca/Zn Heat Stabilizer Batch Log',
    effect: 'Confirm thermal stabilization package batch formulation complies with Grade A rigid PVC specs.',
    confidence: 'Historical correlation',
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [appliedAction, setAppliedAction] = useState(null);

  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'active' && a.status !== 'active') return false;
    if (filter === 'critical' && a.severity !== 'critical') return false;
    if (filter === 'warning' && a.severity !== 'warning') return false;
    if (filter === 'resolved' && a.status !== 'resolved') return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.variable.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status === 'active').length;

  return (
    <div className="space-y-5">
      {/* Top Banner & KPI Strip */}
      <div className="bg-brand-panel border border-brand-border rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Icon name="alerts" className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Alerts & Preventative Recommendations
              </h1>
              {criticalCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-950/80 text-red-400 border border-red-700/60 animate-pulse">
                  {criticalCount} Critical
                </span>
              )}
            </div>
            <p className="text-xs text-brand-muted">
              Continuous monitoring of thermal degradation indicators, shear limits, and KMD 90-36 twin-screw operating thresholds.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-border text-center">
              <span className="text-[10px] text-brand-muted uppercase block">Active Alerts</span>
              <span className="text-lg font-bold text-amber-400">{activeCount}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-border text-center">
              <span className="text-[10px] text-brand-muted uppercase block">Stoppages Prevented</span>
              <span className="text-lg font-bold text-status-good">4</span>
            </div>
            <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-border text-center">
              <span className="text-[10px] text-brand-muted uppercase block">Avg. Response Time</span>
              <span className="text-lg font-bold text-blue-400">1m 14s</span>
            </div>
            <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-border text-center">
              <span className="text-[10px] text-brand-muted uppercase block">Sentinel Status</span>
              <span className="text-xs font-bold text-status-good flex items-center justify-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-status-good" /> ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout: Alerts feed (2 cols) + Recommendations panel (1 col) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Alerts Feed */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-brand-panel border border-brand-border rounded-xl">
            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: `All (${alerts.length})` },
                { id: 'active', label: `Active (${activeCount})` },
                { id: 'critical', label: 'Critical' },
                { id: 'warning', label: 'Warnings' },
                { id: 'resolved', label: 'Resolved' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                      : 'text-brand-muted hover:text-white hover:bg-brand-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Search alerts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Alert Cards */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <div className="p-8 text-center bg-brand-panel border border-brand-border rounded-xl text-brand-muted text-xs">
                No alerts match the selected filter.
              </div>
            ) : (
              filteredAlerts.map((alert) => {
                const isCritical = alert.severity === 'critical';
                const isWarning = alert.severity === 'warning';
                const isResolved = alert.status === 'resolved';
                const isAck = alert.status === 'acknowledged';

                const borderClass = isResolved
                  ? 'border-brand-border opacity-70'
                  : isCritical
                  ? 'border-red-500/50 bg-red-950/10'
                  : isWarning
                  ? 'border-amber-500/50 bg-amber-950/10'
                  : 'border-blue-500/40 bg-blue-950/10';

                return (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl border ${borderClass} bg-brand-panel transition-all duration-200`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-start gap-3">
                        <span
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isCritical
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : isWarning
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : isResolved
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          <Icon
                            name={isCritical || isWarning ? 'alertTriangle' : isResolved ? 'check' : 'info'}
                            className="w-4 h-4"
                          />
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-semibold text-brand-muted">
                              {alert.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-red-900/60 text-red-300 border border-red-700/60'
                                  : isWarning
                                  ? 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                                  : isResolved
                                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/60'
                                  : 'bg-blue-900/60 text-blue-300 border border-blue-700/60'
                              }`}
                            >
                              {alert.severity}
                            </span>
                            {isAck && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                Acknowledged
                              </span>
                            )}
                          </div>
                          <h2 className="text-sm font-bold text-white mt-1">
                            {alert.title}
                          </h2>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-xs">
                        <span className="font-mono text-white font-medium block">{alert.time}</span>
                        <span className="text-[10px] text-brand-muted block">{alert.elapsed}</span>
                      </div>
                    </div>

                    {/* Sensor details row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2.5 p-2.5 rounded-lg bg-brand-dark/80 border border-brand-border/60 text-xs">
                      <div>
                        <span className="text-brand-muted">Variable: </span>
                        <span className="font-medium text-white">{alert.variable}</span>
                      </div>
                      <div>
                        <span className="text-brand-muted">Reading: </span>
                        <span className="font-mono font-bold text-red-400">{alert.currentVal}</span>
                        <span className="text-[10px] text-brand-muted ml-2">(Limit: {alert.threshold})</span>
                      </div>
                    </div>

                    {/* Root cause and action */}
                    <div className="space-y-1 text-xs text-brand-muted mb-3">
                      <div>
                        <span className="font-semibold text-brand-text">Root Cause: </span>
                        <span>{alert.rootCause}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-brand-primary">AI Action: </span>
                        <span className="text-slate-200">{alert.recommendation}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {alert.status === 'active' && (
                      <div className="flex items-center gap-2 pt-2 border-t border-brand-border/60">
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-brand-dark hover:bg-brand-border border border-brand-border text-xs text-brand-text transition-colors"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => {
                            setAppliedAction(alert.id);
                            setTimeout(() => setAppliedAction(null), 3000);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                        >
                          {appliedAction === alert.id ? 'Fix Applied!' : 'Apply Recommended Fix'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: AI Preventative Recommendations & Threshold Matrix */}
        <div className="space-y-5">
          {/* Preventative Recommendations */}
          <Card className="border-blue-900/40">
            <div className="flex items-center gap-2 mb-3">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400">
                <Icon name="lightbulb" className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">AI Preventative Actions</h2>
            </div>
            <p className="text-xs text-brand-muted mb-4">
              Real-time prescriptive optimizations to maintain production within safe rheological limits.
            </p>

            <div className="space-y-3.5">
              {PREVENTATIVE_ACTIONS.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3 rounded-lg bg-brand-dark border border-brand-border hover:border-blue-700/60 transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${rec.priorityColor}`}>
                      {rec.priority}
                    </span>
                    <span className="text-[10px] text-brand-muted font-mono">{rec.confidence}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-1">{rec.action}</h3>
                  <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">{rec.effect}</p>
                  <button
                    onClick={() => {
                      setAppliedAction(rec.id);
                      setTimeout(() => setAppliedAction(null), 3000);
                    }}
                    className="w-full mt-2.5 py-1.5 rounded bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 text-[11px] font-medium text-blue-200 transition-colors"
                  >
                    {appliedAction === rec.id ? '✓ Executed & Logged' : 'Execute Recommendation'}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Safety Threshold Matrix */}
          <Card>
            <h2 className="text-base font-semibold text-white mb-2">Threshold Matrix</h2>
            <p className="text-xs text-brand-muted mb-3">
              Active alarm triggers for KraussMaffei KMD 90-36 twin-screw line.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-brand-border text-brand-muted text-[10px] uppercase">
                    <th className="py-2">Variable</th>
                    <th className="py-2">Warning</th>
                    <th className="py-2">Critical</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60 text-brand-text">
                  <tr>
                    <td className="py-2 font-medium">T_masse</td>
                    <td className="py-2 text-amber-400 font-mono">187.0 °C</td>
                    <td className="py-2 text-red-400 font-mono">190.0 °C</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Torque</td>
                    <td className="py-2 text-amber-400 font-mono">80 %</td>
                    <td className="py-2 text-red-400 font-mono">95 % (15m)</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">P_masse</td>
                    <td className="py-2 text-amber-400 font-mono">270 bar</td>
                    <td className="py-2 text-red-400 font-mono">310 bar</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">Vide (Vacuum)</td>
                    <td className="py-2 text-amber-400 font-mono">&lt; 0.75 mbar</td>
                    <td className="py-2 text-red-400 font-mono">&lt; 0.65 mbar</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-medium">P(défaut)</td>
                    <td className="py-2 text-amber-400 font-mono">&gt; 35 %</td>
                    <td className="py-2 text-red-400 font-mono">&gt; 50 %</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
