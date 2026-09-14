import { useState } from 'react';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

export default function SettingsPage() {
  const [lineModel, setLineModel] = useState('kmd90');
  const [formulation, setFormulation] = useState('rigid-pvc-grade-a');
  const [tempLimit, setTempLimit] = useState(190.0);
  const [torqueWarn, setTorqueWarn] = useState(80);
  const [torqueCritTime, setTorqueCritTime] = useState(15);
  const [vacuumWarn, setVacuumWarn] = useState(0.70);
  const [aiThreshold, setAiThreshold] = useState(0.50);
  const [smoothingWindow, setSmoothingWindow] = useState('30');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoRecommendations, setAutoRecommendations] = useState(true);
  const [opcEndpoint, setOpcEndpoint] = useState('opc.tcp://192.168.1.100:4840');
  const [apiEndpoint, setApiEndpoint] = useState('http://127.0.0.1:8000');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-brand-panel border border-brand-border rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-brand-primary border border-blue-500/20">
                <Icon name="settings" className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                System & Extrusion Line Settings
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-status-good" />
                OPC-UA Synchronized
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Configure machine safety limits, XGBoost inference parameters, raw material specifications, and communication channels.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-colors"
            >
              <Icon name="check" className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
            <Icon name="check" className="w-4 h-4 text-emerald-400" />
            Configuration parameters saved successfully and pushed to Sentinel soft-sensor daemon!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: Machine & Formulation Profile */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Icon name="dashboard" className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">
              Extruder & Material Profile
            </h2>
          </div>
          <p className="text-xs text-brand-muted mb-4">
            Mechanical specifications of the monitored twin-screw extrusion line.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-brand-text mb-1">
                Extruder Model Reference
              </label>
              <select
                value={lineModel}
                onChange={(e) => setLineModel(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-brand-text focus:outline-none focus:border-brand-primary"
              >
                <option value="kmd90">KraussMaffei KMD 90-36 (Counter-rotating Twin-Screw, 36 L/D)</option>
                <option value="kmd75">KraussMaffei KMD 75-32 (Twin-Screw, 32 L/D)</option>
                <option value="kmd114">KraussMaffei KMD 114-36 (Heavy Output Twin-Screw)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-brand-text mb-1">
                Active Resin & Formulation
              </label>
              <select
                value={formulation}
                onChange={(e) => setFormulation(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-brand-text focus:outline-none focus:border-brand-primary"
              >
                <option value="rigid-pvc-grade-a">Rigid PVC Pipe & Profile — Grade A (Ca/Zn Stabilizer, 15 phr CaCO3)</option>
                <option value="rigid-pvc-tin">Rigid PVC — Tin Stabilized (High Clarity)</option>
                <option value="rigid-pvc-foam">Rigid PVC Foam Core formulation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-medium text-brand-text mb-1">
                  Nominal Output Target
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="320"
                    className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
                  />
                  <span className="absolute right-3 top-2 text-brand-muted">kg/h</span>
                </div>
              </div>
              <div>
                <label className="block font-medium text-brand-text mb-1">
                  Target Melt Temp (T_masse)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    defaultValue="185.0"
                    step="0.5"
                    className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
                  />
                  <span className="absolute right-3 top-2 text-brand-muted">°C</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Safety Thresholds & Alarm Rules */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <Icon name="alertTriangle" className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">
              Safety Limits & Interlock Rules
            </h2>
          </div>
          <p className="text-xs text-brand-muted mb-4">
            Industrial limits configured according to the KraussMaffei KMD manual and resin specs.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-brand-text">
                  Thermal Degradation Limit (T_masse)
                </label>
                <span className="font-mono font-bold text-red-400">{tempLimit.toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="185.0"
                max="195.0"
                step="0.2"
                value={tempLimit}
                onChange={(e) => setTempLimit(parseFloat(e.target.value))}
                className="w-full accent-red-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-brand-muted block mt-0.5">
                Exceeding this value triggers automatic high-shear warning and cooling actuation.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-brand-text mb-1">
                  Torque Warning Limit
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={torqueWarn}
                    onChange={(e) => setTorqueWarn(parseInt(e.target.value, 10))}
                    className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
                  />
                  <span className="absolute right-3 top-2 text-brand-muted">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-brand-text mb-1">
                  95% Overload Shutdown
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={torqueCritTime}
                    onChange={(e) => setTorqueCritTime(parseInt(e.target.value, 10))}
                    className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
                  />
                  <span className="absolute right-3 top-2 text-brand-muted">min</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-brand-text">
                  Degassing Vacuum Warning Threshold
                </label>
                <span className="font-mono font-bold text-teal-400">{vacuumWarn.toFixed(2)} mbar</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="0.85"
                step="0.01"
                value={vacuumWarn}
                onChange={(e) => setVacuumWarn(parseFloat(e.target.value))}
                className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Card 3: AI Inference & Hyperparameters */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-purple-500/20 text-purple-400">
              <Icon name="ai-predictions" className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">
              AI Soft-Sensor Hyperparameters
            </h2>
          </div>
          <p className="text-xs text-brand-muted mb-4">
            Fine-tune XGBoost inference sensitivity, temporal filtering, and decision thresholds.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-brand-text">
                  Binary Classification Cutoff Threshold [P(défaut)]
                </label>
                <span className="font-mono font-bold text-purple-400">{aiThreshold.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.30"
                max="0.70"
                step="0.02"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(parseFloat(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted mt-0.5">
                <span>0.30 (Sensitive)</span>
                <span className="font-semibold text-brand-text">Nominal: 0.50</span>
                <span>0.70 (Conservative)</span>
              </div>
            </div>

            <div>
              <label className="block font-medium text-brand-text mb-1">
                Telemetry Smoothing Window
              </label>
              <select
                value={smoothingWindow}
                onChange={(e) => setSmoothingWindow(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2.5 text-brand-text focus:outline-none focus:border-brand-primary"
              >
                <option value="10">10 seconds — Ultra-responsive (raw fluctuations visible)</option>
                <option value="30">30 seconds — Recommended (Moving average noise rejection)</option>
                <option value="60">60 seconds — Heavy damping (long-term drift only)</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-border">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRecommendations}
                  onChange={(e) => setAutoRecommendations(e.target.checked)}
                  className="rounded border-brand-border text-brand-primary focus:ring-0 w-4 h-4 bg-brand-dark"
                />
                <span className="text-brand-text">
                  Automatically generate prescriptive adjustments when Risk Index &gt; 35%
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="rounded border-brand-border text-brand-primary focus:ring-0 w-4 h-4 bg-brand-dark"
                />
                <span className="text-brand-text">
                  Audible factory alarm buzzer for critical temperature breaches
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Card 4: Connectivity & Hardware Integration */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1 rounded bg-teal-500/20 text-teal-400">
              <Icon name="bolt" className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">
              Industrial Connectivity & SCADA
            </h2>
          </div>
          <p className="text-xs text-brand-muted mb-4">
            Industrial communication interfaces linking PolySense to PLC registers and backend services.
          </p>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-brand-text">
                  OPC-UA Server Endpoint
                </label>
                <span className="text-[10px] font-mono text-status-good font-semibold">
                  CONNECTED · 4ms ping
                </span>
              </div>
              <input
                type="text"
                value={opcEndpoint}
                onChange={(e) => setOpcEndpoint(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium text-brand-text">
                  Soft-Sensor FastAPI Backend URL
                </label>
                <span className="text-[10px] font-mono text-blue-400 font-semibold">
                  PORT :8000
                </span>
              </div>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full bg-brand-dark border border-brand-border rounded-lg p-2 text-brand-text font-mono focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="p-3 rounded-lg bg-brand-dark border border-brand-border text-[11px] text-brand-muted space-y-1">
              <div className="flex justify-between">
                <span>SCADA Protocol:</span>
                <span className="text-white font-mono">OPC-UA Binary / TCP</span>
              </div>
              <div className="flex justify-between">
                <span>Security Policy:</span>
                <span className="text-white font-mono">Basic256Sha256 - Sign & Encrypt</span>
              </div>
              <div className="flex justify-between">
                <span>PLC Node ID (Melt Temp):</span>
                <span className="text-white font-mono">ns=2;s=Extruder.Zones.T_masse</span>
              </div>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
