# -*- coding: utf-8 -*-
"""api.py — Backend FastAPI pour le prototype PolySense.

Endpoints :
  GET /                  : message d'accueil + pointeur vers /docs
  GET /healthz           : health-check
  GET /model-info        : métadonnées du modèle (F1, features, version)
  GET /predict           : infère à partir de l'état *courant* du dataset
                           synthétique (la simulation est en pause sur le
                           dernier pas du régime simulé)
  POST /predict          : variante POST pour permettre l'envoi d'un état
                           procédé en JSON (utilisé par la démo live)

Le backend sert le modèle XGBoost entraîné par save_model.py. Les
valeurs de features renvoyées par /predict proviennent du dataset
synthétique figé — il ne s'agit PAS d'un raccordement à une extrudeuse
réelle, c'est une preuve de concept du pipeline ML+UI.

Lancer :
  uvicorn api:app --reload --port 8000
"""

import json
import os
import sys
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Permettre l'import de trainer.py qui est dans le projet thèse.
# Par défaut, on cherche le dossier `anis/` à côté de `polysense/`
# (structure de travail actuelle). Sinon, positionnez la variable
# d'environnement `POLYSENSE_ANIS_DIR` (chemin absolu).
HERE = os.path.dirname(os.path.abspath(__file__))
_env_dir = os.environ.get("POLYSENSE_ANIS_DIR")
if _env_dir:
    ANIS_DIR = _env_dir
else:
    ANIS_DIR = os.path.normpath(os.path.join(HERE, "..", "anis"))
if not os.path.isdir(ANIS_DIR):
    raise RuntimeError(
        f"Dossier anis/ introuvable : {ANIS_DIR}. "
        f"Définir POLYSENSE_ANIS_DIR ou placer api.py à côté de anis/."
    )
if ANIS_DIR not in sys.path:
    sys.path.insert(0, ANIS_DIR)

from trainer import (  # noqa: E402
    CONFIG,
    FEATURE_COLS,
    generate_dataset,
    build_features,
)

ART_DIR = os.path.join(HERE, "model_artifacts")
MODEL_PATH = os.path.join(ART_DIR, "xgb_model.joblib")
FEATURES_PATH = os.path.join(ART_DIR, "feature_columns.json")
INFO_PATH = os.path.join(ART_DIR, "model_info.json")

# Charge artefacts au démarrage (échec rapide si manquants)
if not all(os.path.exists(p) for p in (MODEL_PATH, FEATURES_PATH, INFO_PATH)):
    raise RuntimeError(
        f"Artefacts manquants dans {ART_DIR}. Lancer `python "
        f"{os.path.join(ANIS_DIR, 'save_model.py')}` d'abord."
    )
MODEL = joblib.load(MODEL_PATH)
with open(FEATURES_PATH, "r", encoding="utf-8") as f:
    FEATURE_COLS = json.load(f)
with open(INFO_PATH, "r", encoding="utf-8") as f:
    MODEL_INFO = json.load(f)

# Pré-calcule le dataset synthétique *une fois* pour servir les prédictions
# (les défauts sont volontairement injectés en fin de simulation, donc la
# dernière fenêtre temporelle est la plus "intéressante" à montrer).
_df_cache = None


def get_synthetic_dataframe() -> pd.DataFrame:
    global _df_cache
    if _df_cache is None:
        df = generate_dataset(CONFIG)
        df = build_features(df, CONFIG)
        _df_cache = df
    return _df_cache


class PredictRequest(BaseModel):
    """État procédé optionnel. Si non fourni, le backend utilise la dernière
    ligne du dataset synthétique. Tous les champs sont optionnels ; les
    manquants sont remplacés par les valeurs courantes de la simulation."""

    n_vis: Optional[float] = None
    n_dosage: Optional[float] = None
    debit_masse: Optional[float] = None
    T_four_Z1: Optional[float] = None
    T_four_Z5: Optional[float] = None
    vide_four: Optional[float] = None
    couple_vis_pct: Optional[float] = None
    P_masse: Optional[float] = None
    T_masse: Optional[float] = None


app = FastAPI(
    title="PolySense Analytics API",
    version=MODEL_INFO.get("version", "0.0.0"),
    description=(
        "Backend du prototype PolySense Analytics. Sert le modèle XGBoost "
        "entraîné sur données synthétiques ancrées au manuel constructeur "
        "KMD 90-36. Démo : les features sont prises du dernier pas simulé."
    ),
)

# CORS large pour dev local (Vite :5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "service": "PolySense Analytics API",
        "version": MODEL_INFO.get("version"),
        "docs": "/docs",
        "endpoints": ["/healthz", "/model-info", "/predict", "/predict (POST)"],
    }


@app.get("/healthz")
def healthz():
    return {"status": "ok", "model_loaded": True}


@app.get("/model-info")
def model_info():
    return MODEL_INFO


def _build_features_dict(override: Optional[PredictRequest] = None) -> dict:
    """Construit un dict {feature: value} pour une prédiction.

    Si `override` est fourni, ses champs remplacent les valeurs courantes.
    """
    df = get_synthetic_dataframe()
    last = df.iloc[-1]
    base = {col: float(last[col]) for col in FEATURE_COLS}
    if override is not None:
        for k, v in override.dict(exclude_none=True).items():
            if k in base and v is not None:
                base[k] = float(v)
    return base


def _derive_softsensor_outputs(features: dict, p_defaut: float) -> dict:
    """Dérive les indicateurs UI (Quality / Degradation / Yellowing / Stability
    / HCl risk) à partir de la proba de défaut et des features clés.

    Heuristique simple et documentée :
      - Quality /100     = (1 - p_defaut) * 100
      - Degradation /100 = clamp((T_masse - 180) / 30 * 100, 0, 100)
                           (180 °C = début zone dégrad., 210 °C = 100)
      - Yellowing /%     = max(0, (T_masse - 175) * 2)  (heuristique)
      - Stability        = 'GOOD' si p_defaut < 0.3, 'FAIR' si < 0.6, 'POOR' sinon
      - HCl risk /%      = clamp((T_masse - 185) * 5, 0, 100)
    """
    t_masse = features.get("T_masse", 0.0)
    t_z5 = features.get("T_four_Z5", 0.0)
    fluct_p = features.get("fluctuation_P_masse", 0.0)
    couple = features.get("couple_vis_pct", 0.0)

    def clamp(x, lo, hi):
        return max(lo, min(hi, x))

    quality = round((1.0 - p_defaut) * 100, 1)
    degradation = round(clamp((t_masse - 180) / 30 * 100, 0, 100), 1)
    yellowing = round(clamp((t_masse - 175) * 2, 0, 100), 1)
    stability = "GOOD" if p_defaut < 0.3 else "FAIR" if p_defaut < 0.6 else "POOR"
    hcl = round(clamp((t_masse - 185) * 5, 0, 100), 1)

    # Recommandations (règles simples, lisibles)
    recos = []
    if t_masse > 188:
        recos.append({
            "action": f"Reduce T_masse by ~{int(t_masse-185)} °C (above 190 °C degradation risk)",
            "effect": "Lower degradation and HCl risk",
        })
    if fluct_p > 3:
        recos.append({
            "action": "Check dosing stability (pressure fluctuation > 3 bar)",
            "effect": "Reduce process instability",
        })
    if couple > 90:
        recos.append({
            "action": f"Reduce screw speed by ~{int((couple-90)/2)} %",
            "effect": "Avoid torque overload (95 %/15 min trip)",
        })
    if not recos:
        recos.append({
            "action": "Maintain current setpoints",
            "effect": "Process within nominal window",
        })

    return {
        "quality_score": quality,
        "degradation_score": degradation,
        "yellowing_risk_pct": yellowing,
        "stability": stability,
        "hcl_risk_pct": hcl,
        "recommendations": recos,
        "t_masse": t_masse,
        "t_z5": t_z5,
        "fluct_p_masse": round(fluct_p, 2),
        "couple_vis_pct": couple,
    }


@app.get("/predict")
def predict_get():
    df = get_synthetic_dataframe()
    features = _build_features_dict(None)
    row = pd.DataFrame([features], columns=FEATURE_COLS)
    p_defaut = float(MODEL.predict_proba(row)[0, 1])
    label = int(MODEL.predict(row)[0])
    out = _derive_softsensor_outputs(features, p_defaut)
    out["p_defaut"] = round(p_defaut, 4)
    out["label"] = label
    out["source"] = "synthetic_last_row"
    out["timestamp"] = str(df["timestamp"].iloc[-1])
    return out


@app.post("/predict")
def predict_post(req: PredictRequest):
    df = get_synthetic_dataframe()
    features = _build_features_dict(req)
    row = pd.DataFrame([features], columns=FEATURE_COLS)
    p_defaut = float(MODEL.predict_proba(row)[0, 1])
    label = int(MODEL.predict(row)[0])
    out = _derive_softsensor_outputs(features, p_defaut)
    out["p_defaut"] = round(p_defaut, 4)
    out["label"] = label
    out["source"] = "user_provided" if any(v is not None for v in req.dict().values()) else "synthetic_last_row"
    return out


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
