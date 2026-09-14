import { useState, useMemo } from 'react';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

const GLOBAL_SHAP_FEATURES = [
  { name: 'T_masse (Melt Temp)', weight: 38.2, color: 'bg-red-500', note: 'Primary thermal trigger (>188°C accelerates HCl release)' },
  { name: 'Couple_vis (Motor Torque)', weight: 26.4, color: 'bg-amber-500', note: 'Indicates melt viscosity & gelation resistance' },
  { name: 'P_masse (Melt Pressure)', weight: 18.1, color: 'bg-blue-500', note: 'Fluctuations signal feed inconsistency or die backpressure' },
  { name: 'n_vis (Screw Speed)', weight: 10.8, color: 'bg-emerald-500', note: 'Drives shear rate and friction heating in metering zone' },
  { name: 'Vide (Degassing Vacuum)', weight: 6.5, color: 'bg-teal-400', note: 'Volatiles extraction prevents trapped gaseous void defects' },
];

export default function AIPredictionsPage() {
  // Interactive What-If Simulator state
  const [simTMasse, setSimTMasse] = useState(188.0);
  const [simScrewSpeed, setSimScrewSpeed] = useState(33);
  const [simTorque, setSimTorque] = useState(71);
  const [simVacuum, setSimVacuum] = useState(0.82);

  // Compute simulated risk index using an empirical approximation of the XGBoost decision boundary
  const simRisk = useMemo(() => {
    // Baseline risk around 15%
    let risk = 15;
    // T_masse sensitivity: sharply rises above 187°C
    if (simTMasse > 185) {
      risk += Math.pow((simTMasse - 185) * 1.8, 1.4) * 3.5;
    } else {
      risk -= (185 - simTMasse) * 1.5;
    }
    // Torque sensitivity: rises as it approaches 95%
    if (simTorque > 70) {
      risk += (simTorque - 70) * 0.9;
    }
    // Screw speed sensitivity: high screw speed creates shear heat
    if (simScrewSpeed > 32) {
      risk += (simScrewSpeed - 32) * 1.8;
    } else {
      risk -= (32 - simScrewSpeed) * 0.8;
    }
    // Vacuum degassing: low vacuum increases risk
    if (simVacuum < 0.80) {
      risk += (0.80 - simVacuum) * 35;
    } else {
      risk -= (simVacuum - 0.80) * 15;
    }
    return Math.max(2, Math.min(99, Math.round(risk)));
  }, [simTMasse, simScrewSpeed, simTorque, simVacuum]);

  const simStatus = simRisk >= 50 ? 'AT RISK' : simRisk >= 35 ? 'ELEVATED' : 'NORMAL';
  const statusColor = simRisk >= 50 ? 'text-status-danger' : simRisk >= 35 ? 'text-status-warning' : 'text-status-good';
  const statusBg = simRisk >= 50 ? 'bg-status-danger/10 border-status-danger/30' : simRisk >= 35 ? 'bg-status-warning/10 border-status-warning/30' : 'bg-status-good/10 border-status-good/30';

  return (
    <div className="space-y-5">
      {/* Top Header & Model Status Banner */}
      <div className="bg-brand-panel border border-brand-border rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-brand-primary border border-blue-500/20">
                <Icon name="ai-predictions" className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                AI Degradation Predictor & Soft-Sensor Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
                XGBoost v1.4-tuned
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Real-time thermal degradation soft-sensor trained on KraussMaffei KMD 90-36 extrusion telemetry. Predicting defect probability <code className="text-brand-text">P(défaut)</code> prior to physical yellowing.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-xs">
              <span className="w-2 h-2 rounded-full bg-status-good animate-pulse" />
              <span className="text-brand-muted">Latency:</span>
              <span className="font-mono text-brand-text font-medium">28 ms</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-xs">
              <span className="text-brand-muted">F1-Score:</span>
              <span className="font-mono text-status-good font-semibold">0.942</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-xs">
              <span className="text-brand-muted">ROC-AUC:</span>
              <span className="font-mono text-blue-400 font-semibold">0.981</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Prediction Horizon & SHAP Importance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Predictive Horizon (2 cols on xl) */}
        <Card className="xl:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-semibold text-white">45-Minute Predictive Horizon</h2>
                <p className="text-xs text-brand-muted">
                  Projected degradation risk trajectory under continuous operational conditions
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2.5 h-0.5 bg-purple-500 rounded" /> Risk %
                </span>
                <span className="flex items-center gap-1 text-red-400">
                  <span className="w-2.5 h-0.5 bg-red-500 rounded" /> T_masse
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="w-2.5 h-0.5 bg-amber-500 rounded" /> Torque
                </span>
              </div>
            </div>

            {/* Projection SVG Chart */}
            <div className="relative h-56 w-full bg-brand-dark/60 rounded-lg p-3 border border-brand-border/60">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="30" x2="700" y2="30" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="80" x2="700" y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="0" y1="130" x2="700" y2="130" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Critical Threshold Line at 50% (y = 80) */}
                <line x1="0" y1="80" x2="700" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
                <text x="690" y="75" fill="#ef4444" fontSize="10" textAnchor="end" fontWeight="600">Defect Limit (50%)</text>

                {/* Vertical Divider: Current Time vs Forecast */}
                <line x1="280" y1="10" x2="280" y2="165" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" />
                <rect x="235" y="6" width="90" height="18" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                <text x="280" y="19" fill="#93c5fd" fontSize="9.5" textAnchor="middle" fontWeight="bold">NOW (10:24)</text>

                {/* Historical + Projected Paths */}
                {/* Risk Curve: start 15 -> 23 now -> up to 48 at 45m */}
                <path
                  d="M 0,150 Q 140,145 280,135 T 420,110 T 560,95 T 700,75"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                />
                {/* T_masse Curve */}
                <path
                  d="M 0,110 Q 140,105 280,100 T 420,85 T 560,75 T 700,65"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
                {/* Torque Curve */}
                <path
                  d="M 0,90 Q 140,85 280,80 T 420,70 T 560,60 T 700,55"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                {/* Active marker at NOW */}
                <circle cx="280" cy="135" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                <text x="280" y="155" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">23%</text>

                {/* Marker at +30 min */}
                <circle cx="560" cy="95" r="4" fill="#f59e0b" />
                <text x="560" y="112" fill="#fcd34d" fontSize="9.5" textAnchor="middle">+30m: 41%</text>

                {/* Marker at +45 min */}
                <circle cx="700" cy="75" r="4" fill="#ef4444" />
                <text x="670" y="93" fill="#f87171" fontSize="9.5" textAnchor="end">+45m: 54%</text>
              </svg>

              {/* Chart timeline axis labels */}
              <div className="flex justify-between text-[10px] text-brand-muted mt-2 px-1">
                <span>10:00 (-24m)</span>
                <span>10:10 (-14m)</span>
                <span className="text-blue-400 font-semibold">10:24 (Live)</span>
                <span>10:39 (+15m)</span>
                <span>10:54 (+30m)</span>
                <span className="text-amber-400">11:09 (+45m)</span>
              </div>
            </div>
          </div>

          {/* Forecast Interpretation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-brand-border">
            <div className="p-2.5 rounded-lg bg-brand-dark border border-brand-border/60">
              <span className="text-[10px] text-brand-muted uppercase tracking-wider block">In 15 min (+15m)</span>
              <span className="text-base font-bold text-status-good">31% Risk</span>
              <span className="text-[11px] text-brand-muted block mt-0.5">Status: Normal · T_masse ~189°C</span>
            </div>
            <div className="p-2.5 rounded-lg bg-brand-dark border border-amber-500/30">
              <span className="text-[10px] text-brand-muted uppercase tracking-wider block">In 30 min (+30m)</span>
              <span className="text-base font-bold text-status-warning">41% Risk</span>
              <span className="text-[11px] text-amber-400/90 block mt-0.5">Warning: Approaching 50% trigger</span>
            </div>
            <div className="p-2.5 rounded-lg bg-brand-dark border border-red-500/30">
              <span className="text-[10px] text-brand-muted uppercase tracking-wider block">In 45 min (+45m)</span>
              <span className="text-base font-bold text-status-danger">54% Risk</span>
              <span className="text-[11px] text-red-400/90 block mt-0.5">Critical: Threshold breach predicted</span>
            </div>
          </div>
        </Card>

        {/* Global SHAP Feature Importance */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">SHAP Feature Importance</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-brand-dark border border-brand-border text-brand-muted">
                TreeSHAP (N=10,000)
              </span>
            </div>
            <p className="text-xs text-brand-muted mb-4">
              Relative impact of each operational parameter on the XGBoost degradation prediction model.
            </p>

            <div className="space-y-3.5">
              {GLOBAL_SHAP_FEATURES.map((feat) => (
                <div key={feat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white">{feat.name}</span>
                    <span className="font-mono text-brand-muted">{feat.weight}%</span>
                  </div>
                  <div className="w-full bg-brand-dark h-2 rounded-full overflow-hidden border border-brand-border/40">
                    <div
                      className={`h-full rounded-full ${feat.color}`}
                      style={{ width: `${feat.weight}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-brand-muted/80 leading-tight">
                    {feat.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-950/20 border border-blue-800/40 text-[11px] text-blue-300">
            <span className="font-semibold text-blue-200">Thesis Note:</span> Melt temperature (T_masse) and screw torque (Couple_vis) account for over 64% of total predictive power due to the exothermic shear sensitivity of rigid PVC.
          </div>
        </Card>
      </div>

      {/* Interactive What-If Simulator */}
      <Card className="border-blue-900/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-5 pb-3 border-b border-brand-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400">
                <Icon name="sliders" className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white">
                Interactive "What-If" Operating Parameter Sandbox
              </h2>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              Adjust simulated machine setpoints to evaluate the immediate impact on P(défaut) before applying changes on the KMD 90-36 extruder.
            </p>
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setSimTMasse(188.0);
              setSimScrewSpeed(33);
              setSimTorque(71);
              setSimVacuum(0.82);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border hover:border-brand-primary text-xs text-brand-muted hover:text-white transition-colors"
          >
            <Icon name="refresh" className="w-3.5 h-3.5" />
            Reset to Live Values
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls: 4 Sliders (2 cols) */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Slider 1: T_masse */}
            <div className="p-3.5 rounded-xl bg-brand-dark border border-brand-border/80 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Melt Temp (T_masse)</label>
                <span className="font-mono text-sm font-bold text-red-400">
                  {simTMasse.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="175"
                max="195"
                step="0.2"
                value={simTMasse}
                onChange={(e) => setSimTMasse(parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted">
                <span>175°C (Min)</span>
                <span className="text-red-500 font-semibold">Limit: 190°C</span>
                <span>195°C (Crit)</span>
              </div>
            </div>

            {/* Slider 2: Screw Speed */}
            <div className="p-3.5 rounded-xl bg-brand-dark border border-brand-border/80 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Screw Speed (n_vis)</label>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {simScrewSpeed} rpm
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                step="1"
                value={simScrewSpeed}
                onChange={(e) => setSimScrewSpeed(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted">
                <span>20 rpm</span>
                <span>Opt: 28-32 rpm</span>
                <span>45 rpm</span>
              </div>
            </div>

            {/* Slider 3: Torque Load */}
            <div className="p-3.5 rounded-xl bg-brand-dark border border-brand-border/80 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Motor Torque Load</label>
                <span className="font-mono text-sm font-bold text-amber-400">
                  {simTorque}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="98"
                step="1"
                value={simTorque}
                onChange={(e) => setSimTorque(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted">
                <span>50%</span>
                <span className="text-amber-500 font-semibold">Alarm: 95%</span>
                <span>98%</span>
              </div>
            </div>

            {/* Slider 4: Vacuum Degassing */}
            <div className="p-3.5 rounded-xl bg-brand-dark border border-brand-border/80 space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-white">Vacuum Degassing (Vide)</label>
                <span className="font-mono text-sm font-bold text-teal-400">
                  {simVacuum.toFixed(2)} mbar
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.95"
                step="0.01"
                value={simVacuum}
                onChange={(e) => setSimVacuum(parseFloat(e.target.value))}
                className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted">
                <span>0.50 mbar (Weak)</span>
                <span>Target: 0.85 mbar</span>
                <span>0.95 mbar</span>
              </div>
            </div>
          </div>

          {/* Simulation Result Output Card */}
          <div className="p-4 rounded-xl bg-brand-dark border border-brand-border flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-brand-muted uppercase tracking-wider block mb-1">
                Simulated AI Prediction
              </span>
              <div className="flex items-baseline gap-3 mb-2">
                <span className={`text-3xl font-black font-mono tracking-tight ${statusColor}`}>
                  {simRisk}%
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBg} ${statusColor}`}>
                  {simStatus}
                </span>
              </div>

              {/* Progress visual */}
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    simRisk >= 50 ? 'bg-status-danger' : simRisk >= 35 ? 'bg-status-warning' : 'bg-status-good'
                  }`}
                  style={{ width: `${simRisk}%` }}
                />
              </div>

              <div className="text-xs text-brand-muted space-y-1.5">
                <div className="flex justify-between">
                  <span>Threshold Cutoff:</span>
                  <span className="font-mono text-brand-text">50.0%</span>
                </div>
                <div className="flex justify-between">
                  <span>Delta vs Live:</span>
                  <span className={`font-mono font-semibold ${simRisk > 23 ? 'text-status-danger' : 'text-status-good'}`}>
                    {simRisk >= 23 ? `+${simRisk - 23}%` : `${simRisk - 23}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Prescriptive Recommendation based on simulation */}
            <div className="mt-4 pt-3 border-t border-brand-border/60">
              <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider block mb-1">
                Prescriptive Recommendation:
              </span>
              <p className="text-xs text-brand-text">
                {simRisk >= 50
                  ? '⚠️ High defect probability! Reduce screw speed to 28 rpm and reduce Zone 5 temperature to halt premature dehydrochlorination.'
                  : simRisk >= 35
                  ? '⚡ Elevated shear risk. Keep torque below 80% and verify stabilizer dosing.'
                  : '✅ Stable operational envelope. Optimal throughput with zero thermal degradation predicted.'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
