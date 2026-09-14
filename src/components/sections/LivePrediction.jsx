import { useEffect, useState, useRef } from 'react';
import Card from '../ui/Card';

const API_BASE = import.meta.env.VITE_POLYSENSE_API ?? 'http://127.0.0.1:8000';

/** Exact copy of model_artifacts/model_info.json — used when the backend is down. */
const DEMO_MODEL_INFO = {
  model: 'XGBoostClassifier',
  version: '1.0.0-thesis',
  source: 'anis/trainer.py + save_model.py',
  f1_defaut_test: 0.8521,
  precision_defaut_test: 0.8276,
  rappel_defaut_test: 0.878,
  exactitude_test: 0.8958,
  n_features: 14,
  n_train: 960,
  n_test: 240,
  pct_defaut_test: 34.17,
};

function StatusPill({ status }) {
  const colors = {
    GOOD: 'bg-status-good/20 text-status-good border-status-good/30',
    FAIR: 'bg-status-warning/20 text-status-warning border-status-warning/30',
    POOR: 'bg-status-danger/20 text-status-danger border-status-danger/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors[status] || 'bg-brand-border text-brand-muted border-brand-border'}`}>
      {status}
    </span>
  );
}

function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Mirrors the derivation logic of api.py `_derive_softsensor_outputs` so the
 * demo pipeline renders exactly the same UI fields as the live backend.
 */
function buildDemoPrediction(tick) {
  const tMasse = 184 + 7 * Math.sin(tick / 7) + (Math.random() - 0.5) * 1.6;
  const tZ5 = 175 + 3 * Math.sin(tick / 9) + (Math.random() - 0.5) * 1.0;
  const fluct = 2.4 + 1.4 * Math.sin(tick / 5) + (Math.random() - 0.5) * 0.8;
  const couple = 79 + 7 * Math.sin(tick / 6) + (Math.random() - 0.5) * 2.2;

  const pDefaut = clamp(
    0.2 + (tMasse - 189) * 0.035 + Math.max(0, fluct - 3) * 0.06,
    0.03,
    0.97
  );

  const quality = Math.round((1 - pDefaut) * 100 * 10) / 10;
  const degradation = Math.round(clamp(((tMasse - 180) / 30) * 100, 0, 100) * 10) / 10;
  const yellowing = Math.round(clamp((tMasse - 175) * 2, 0, 100) * 10) / 10;
  const stability = pDefaut < 0.3 ? 'GOOD' : pDefaut < 0.6 ? 'FAIR' : 'POOR';
  const hcl = Math.round(clamp((tMasse - 185) * 5, 0, 100) * 10) / 10;

  const recommendations = [];
  if (tMasse > 188) {
    recommendations.push({
      action: `Reduce T_masse by ~${Math.max(1, Math.round(tMasse - 185))} °C (above 190 °C degradation risk)`,
      effect: 'Lower degradation and HCl risk',
    });
  }
  if (fluct > 3) {
    recommendations.push({
      action: 'Check dosing stability (pressure fluctuation > 3 bar)',
      effect: 'Reduce process instability',
    });
  }
  if (couple > 90) {
    recommendations.push({
      action: `Reduce screw speed by ~${Math.max(1, Math.round((couple - 90) / 2))} %`,
      effect: 'Avoid torque overload (95 %/15 min trip)',
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      action: 'Maintain current setpoints',
      effect: 'Process within nominal window',
    });
  }

  return {
    quality_score: quality,
    degradation_score: degradation,
    yellowing_risk_pct: yellowing,
    stability,
    hcl_risk_pct: hcl,
    recommendations,
    t_masse: Math.round(tMasse * 100) / 100,
    t_z5: Math.round(tZ5 * 100) / 100,
    fluct_p_masse: Math.round(fluct * 100) / 100,
    couple_vis_pct: Math.round(couple * 100) / 100,
    p_defaut: Math.round(pDefaut * 10000) / 10000,
    label: pDefaut >= 0.5 ? 1 : 0,
    source: 'demo_simulated',
    timestamp: new Date().toISOString(),
  };
}

export default function LivePrediction() {
  const [data, setData] = useState(null);
  const [info, setInfo] = useState(null);
  const [mode, setMode] = useState('live');
  const tickRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      // Backend-first: if it answers, use real data. On failure, simulate locally.
      try {
        const [p, i] = await Promise.all([
          fetch(`${API_BASE}/predict`).then((r) => {
            if (!r.ok) throw new Error(`predict: ${r.status}`);
            return r.json();
          }),
          fetch(`${API_BASE}/model-info`).then((r) => r.json()),
        ]);
        if (!cancelled) {
          setData(p);
          setInfo(i);
          setMode('live');
        }
      } catch {
        if (!cancelled) {
          setData(buildDemoPrediction(tickRef.current++));
          setInfo(DEMO_MODEL_INFO);
          setMode('demo');
        }
      }
    };

    tick();
    const id = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Card title="Live model output" subtitle="XGBoost · served by FastAPI backend">
      {mode === 'demo' && (
        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-status-warning/10 border border-status-warning/30">
          <span className="w-2 h-2 rounded-full bg-status-warning animate-pulse shrink-0" />
          <span className="text-[11px] font-semibold text-status-warning">DEMO MODE</span>
          <span className="text-[11px] text-brand-muted">
            Backend unreachable — live output simulated locally.
          </span>
        </div>
      )}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
            <div>
              <div className="text-[10px] text-brand-muted uppercase tracking-wider">Quality</div>
              <div className="text-lg font-semibold tabular-nums">{data.quality_score}</div>
              <div className="text-[10px] text-brand-muted">/100</div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted uppercase tracking-wider">Degradation</div>
              <div className="text-lg font-semibold tabular-nums">{data.degradation_score}</div>
              <div className="text-[10px] text-brand-muted">/100</div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted uppercase tracking-wider">Yellowing</div>
              <div className="text-lg font-semibold tabular-nums">{data.yellowing_risk_pct}%</div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted uppercase tracking-wider">Stability</div>
              <div className="text-lg"><StatusPill status={data.stability} /></div>
            </div>
            <div>
              <div className="text-[10px] text-brand-muted uppercase tracking-wider">HCl</div>
              <div className="text-lg font-semibold tabular-nums">{data.hcl_risk_pct}%</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-brand-muted mb-2">
            <span>P(defaut) = <span className="text-brand-text font-mono">{data.p_defaut}</span></span>
            <span>label = <span className="text-brand-text font-mono">{data.label}</span></span>
            <span>T_masse = <span className="text-brand-text font-mono">{Number(data.t_masse).toFixed(1)} °C</span></span>
            <span>source = <span className="text-brand-text font-mono">{data.source}</span></span>
          </div>
          {data.recommendations && data.recommendations.length > 0 && (
            <div className="border-t border-brand-border pt-2 mt-2">
              <div className="text-[10px] text-brand-muted uppercase tracking-wider mb-1">Recommandation</div>
              {data.recommendations.map((r, i) => (
                <div key={i} className="text-xs">
                  <span className="text-brand-primary font-medium">{r.action}</span>
                  <span className="text-brand-muted"> — {r.effect}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {info && (
        <div className="text-[10px] text-brand-muted mt-3 pt-2 border-t border-brand-border">
          Model <code>{info.model}</code> v{info.version} · F1 test = {info.f1_defaut_test} · trained on {info.n_train} samples
        </div>
      )}
    </Card>
  );
}