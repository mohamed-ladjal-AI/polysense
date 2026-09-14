import { useState } from 'react';
import Card from '../components/ui/Card';
import Icon from '../components/ui/Icon';

const HISTORICAL_EVENTS = [
  {
    id: 'EVT-20260910-01',
    time: '10:22 - 10:27',
    duration: '5 min',
    peakRisk: 41,
    trigger: 'T_masse peak (188.6 °C)',
    actionTaken: 'Screw speed lowered to 28 rpm; Zone 5 trimmed -2°C',
    operator: 'Admin',
    outcome: 'Degradation aborted. T_masse returned to 186.2°C.',
    status: 'prevented',
  },
  {
    id: 'EVT-20260910-02',
    time: '09:40 - 09:48',
    duration: '8 min',
    peakRisk: 38,
    trigger: 'Vacuum loss (0.68 mbar)',
    actionTaken: 'Filter mesh purged; vacuum restored to 0.82 mbar',
    operator: 'Admin',
    outcome: 'Gaseous voids eliminated. Surface finish nominal.',
    status: 'resolved',
  },
  {
    id: 'EVT-20260910-03',
    time: '08:15 - 08:24',
    duration: '9 min',
    peakRisk: 52,
    trigger: 'Torque surge (82%) & melt pressure spike (285 bar)',
    actionTaken: 'Dosing feeder rate trimmed -8% for 4 minutes',
    operator: 'Technician B',
    outcome: 'Torque returned to 70%. Scrapped purge prevented.',
    status: 'prevented',
  },
  {
    id: 'EVT-20260910-04',
    time: '06:45 - 06:58',
    duration: '13 min',
    peakRisk: 64,
    trigger: 'Startup thermal overshoot (T_masse reached 189.8 °C)',
    actionTaken: 'Cooling blowers forced on Zone 4 & 5; purge cycle run',
    operator: 'Shift Lead',
    outcome: '0.12 t purged. Stable processing restored at 07:05.',
    status: 'purged',
  },
];

export default function HistoryPage() {
  const [selectedShift, setSelectedShift] = useState('day');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportPDF = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Report Action Bar */}
      <div className="bg-brand-panel border border-brand-border rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Icon name="history" className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-white">
                History & Shift Production Reports
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-dark border border-brand-border text-brand-muted">
                Line 01 · KraussMaffei KMD 90-36
              </span>
            </div>
            <p className="text-xs text-brand-muted">
              Traceability audit log, historical degradation intervention records, and automated quality shift reporting.
            </p>
          </div>

          {/* Controls: Shift Picker & Export Button */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value)}
              className="bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-xs text-brand-text focus:outline-none focus:border-brand-primary"
            >
              <option value="day">Day Shift (06:00 - 14:00) — Today</option>
              <option value="night">Night Shift (22:00 - 06:00) — Yesterday</option>
              <option value="afternoon">Afternoon Shift (14:00 - 22:00) — Yesterday</option>
              <option value="week">Past 7 Days Aggregate</option>
            </select>

            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-colors"
            >
              <Icon name="download" className="w-3.5 h-3.5" />
              {downloadSuccess ? 'Generating Shift PDF...' : 'Export Shift Report (PDF)'}
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
            <Icon name="check" className="w-4 h-4 text-emerald-400" />
            Shift Report PDF compiled successfully: <code>Report_Line01_ShiftDay_20260910.pdf</code>
          </div>
        )}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-brand-panel border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Total Output</span>
          <div className="text-2xl font-bold text-white mt-1">4.82 t</div>
          <span className="text-[11px] text-brand-muted block mt-0.5">PVC Rigide Grade A</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-panel border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Scrap Prevented</span>
          <div className="text-2xl font-bold text-status-good mt-1">0.46 t</div>
          <span className="text-[11px] text-status-good block mt-0.5">Est. €1,240 saved</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-panel border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Extruder OEE</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">94.6%</div>
          <span className="text-[11px] text-brand-muted block mt-0.5">Uptime: 5h 42m</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-panel border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Interventions</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">5</div>
          <span className="text-[11px] text-brand-muted block mt-0.5">100% Resolved</span>
        </div>
        <div className="p-4 rounded-xl bg-brand-panel border border-brand-border">
          <span className="text-[10px] text-brand-muted uppercase tracking-wider block">AI Inferences</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">18,420</div>
          <span className="text-[11px] text-brand-muted block mt-0.5">1 Hz sampling</span>
        </div>
      </div>

      {/* Visual Shift Quality Timeline */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white">Shift Quality & Degradation Timeline</h2>
            <p className="text-xs text-brand-muted">
              Chronological process classification across the current 8-hour production shift
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-status-good">
              <span className="w-2.5 h-2.5 rounded-full bg-status-good" /> Normal (92.4%)
            </span>
            <span className="flex items-center gap-1 text-status-warning">
              <span className="w-2.5 h-2.5 rounded-full bg-status-warning" /> Warning (5.1%)
            </span>
            <span className="flex items-center gap-1 text-status-danger">
              <span className="w-2.5 h-2.5 rounded-full bg-status-danger" /> Degraded / Purge (2.5%)
            </span>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="h-6 w-full rounded-lg bg-slate-800 overflow-hidden flex border border-brand-border">
          <div className="h-full bg-status-danger w-[2.5%]" title="06:45 Startup overshoot" />
          <div className="h-full bg-status-good w-[17.5%]" title="07:00 - 08:15 Nominal" />
          <div className="h-full bg-status-warning w-[3.5%]" title="08:15 Torque surge" />
          <div className="h-full bg-status-good w-[16.5%]" title="08:24 - 09:40 Nominal" />
          <div className="h-full bg-status-warning w-[2.0%]" title="09:40 Vacuum fluctuation" />
          <div className="h-full bg-status-good w-[12.0%]" title="09:48 - 10:20 Nominal" />
          <div className="h-full bg-status-warning w-[1.5%]" title="10:22 T_masse alert" />
          <div className="h-full bg-status-good w-[44.5%]" title="10:27 onwards" />
        </div>

        <div className="flex justify-between text-[10px] text-brand-muted mt-1.5">
          <span>06:00</span>
          <span>07:30</span>
          <span>09:00</span>
          <span>10:30</span>
          <span>12:00</span>
          <span>13:30</span>
          <span>14:00 (Shift End)</span>
        </div>
      </Card>

      {/* Historical Events Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Degradation Event Records & Interventions</h2>
            <p className="text-xs text-brand-muted">
              Soft-sensor trigger audit trail with operator actions and quality outcomes
            </p>
          </div>
          <span className="text-xs text-brand-muted">
            Displaying 4 logged events for today's shift
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Time & Duration</th>
                <th className="py-2.5 px-3">Peak P(défaut)</th>
                <th className="py-2.5 px-3">Primary Trigger</th>
                <th className="py-2.5 px-3">Operator Action</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-brand-text">
              {HISTORICAL_EVENTS.map((evt) => (
                <tr key={evt.id} className="hover:bg-brand-dark/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-blue-400">
                    {evt.id}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-white block">{evt.time}</span>
                    <span className="text-[10px] text-brand-muted">{evt.duration}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono font-bold ${
                        evt.peakRisk >= 50
                          ? 'text-status-danger'
                          : evt.peakRisk >= 35
                          ? 'text-status-warning'
                          : 'text-status-good'
                      }`}
                    >
                      {evt.peakRisk}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200">
                    {evt.trigger}
                  </td>
                  <td className="py-3 px-3 text-brand-muted max-w-xs">
                    {evt.actionTaken}
                    <span className="block text-[10px] text-brand-muted mt-0.5">By: {evt.operator}</span>
                  </td>
                  <td className="py-3 px-3 text-brand-muted max-w-xs">
                    {evt.outcome}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        evt.status === 'prevented'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/60'
                          : evt.status === 'resolved'
                          ? 'bg-blue-950/60 text-blue-300 border border-blue-700/60'
                          : 'bg-amber-950/60 text-amber-300 border border-amber-700/60'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Shift Compliance & Sign-Off Summary Card */}
      <Card className="border-slate-800 bg-brand-dark/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">
              Shift Quality Compliance Certification
            </span>
            <h3 className="text-sm font-bold text-white">
              ISO 9001:2015 Extrusion Line Quality Compliance · Batch #PVC-2026-09A
            </h3>
            <p className="text-xs text-brand-muted">
              Zero continuous dehydrochlorination events logged. Degradation risk remained within acceptable cumulative exposure envelope.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-brand-muted border-t md:border-t-0 md:border-l border-brand-border pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="block text-[10px] uppercase text-brand-muted">Operator</span>
              <span className="font-semibold text-white">Admin (ID: OP-412)</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-brand-muted">Supervisor</span>
              <span className="font-semibold text-white">Yasser B. (Shift Lead)</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] uppercase text-brand-muted">Audit Stamp</span>
              <span className="font-mono text-status-good font-bold">VERIFIED ✓</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
