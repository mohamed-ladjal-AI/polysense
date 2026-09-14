export const navigation = [
  { id: 'dashboard', label: 'Dashboard', href: '#', active: true },
  { id: 'live-process', label: 'Live Process', href: '#' },
  { id: 'ai-predictions', label: 'AI Predictions', href: '#' },
  { id: 'alerts', label: 'Alerts & Recommendations', href: '#' },
  { id: 'history', label: 'History & Reports', href: '#' },
  { id: 'settings', label: 'Settings', href: '#' },
];

export const lineInfo = {
  id: 'LINE 01',
  status: 'ONLINE',
  fields: [
    { label: 'Extruder', value: 'KMD 90-36' },
    { label: 'Product', value: 'PVC rigide (tubes / profilés)' },
    { label: 'Operator', value: 'Admin' },
    { label: 'Shift', value: 'Day Shift' },
  ],
};

export const headerLineOptions = ['LINE 01 - KraussMaffei KMD 90-36'];

// Only real XGBoost model outputs: P(defaut) → Degradation Risk Index + binary label
export const metrics = [
  {
    id: 'degradation-risk',
    label: 'Degradation Risk Index',
    value: 23,
    unit: '%',
    status: 'good',
    statusLabel: 'Low Risk',
    sparkPoints: '0,18 20,15 40,16 60,10 80,12 100,8',
    hasSpark: true,
    hasBadge: true,
  },
  {
    id: 'process-status',
    label: 'Process Status',
    value: 'NORMAL',
    status: 'good',
    statusLabel: 'No Defect Detected',
    isText: true,
    hasSpark: false,
    hasBadge: true,
    badgeIcon: 'shield',
  },
  {
    id: 'p-defaut',
    label: 'P(defaut)',
    value: 23,
    unit: '%',
    status: 'good',
    statusLabel: 'XGBoost Raw Score',
    sparkPoints: '0,15 20,16 40,14 60,15 80,12 100,10',
    hasSpark: true,
    hasBadge: true,
  },
  {
    id: 'torque-load',
    label: 'Motor Torque Load',
    value: 71,
    unit: '%',
    status: 'warning',
    statusLabel: 'Watch — 95% rule',
    hasSpark: false,
    hasBadge: true,
    badgeIcon: 'bolt',
  },
  {
    id: 'melt-temp',
    label: 'Melt Temp (T_masse)',
    value: 188,
    unit: '°C',
    status: 'warning',
    statusLabel: 'Near Limit (190°C)',
    sparkPoints: '0,10 20,11 40,10 60,12 80,11 100,13',
    hasSpark: true,
    hasBadge: true,
  },
];

export const chartLegend = [
  { label: 'T_masse (°C)', color: 'bg-red-500' },
  { label: 'P_masse (bar)', color: 'bg-blue-500' },
  { label: 'Torque (%)', color: 'bg-yellow-500' },
  { label: 'Vacuum (mbar)', color: 'bg-teal-500' },
  { label: 'Risk Index (%)', color: 'bg-purple-500' },
];

export const chartSeries = [
  { id: 'temp', color: '#ef4444', points: '0,50 100,60 200,45 300,55 400,65 500,70 600,55 700,60 800,50 900,55 1000,60' },
  { id: 'torque', color: '#eab308', points: '0,150 100,140 200,160 300,150 400,165 500,145 600,155 700,140 800,150 900,140 1000,150' },
  { id: 'pressure', color: '#3b82f6', points: '0,180 100,175 200,185 300,190 400,180 500,185 600,180 700,185 800,175 900,180 1000,185' },
  { id: 'vacuum', color: '#14b8a6', points: '0,230 100,235 200,225 300,230 400,235 500,225 600,230 700,225 800,235 900,230 1000,230' },
  { id: 'gas', color: '#a855f7', points: '0,270 100,272 200,268 300,270 400,271 500,269 600,270 700,268 800,271 900,269 1000,270' },
];

export const yAxisLeft = ['200 °C', '160 °C', '120 °C', '80 °C', '40 °C', '0 °C'];
export const yAxisRight = [
  '100 %  80 bar',
  '75 %   60 bar',
  '50 %   40 bar',
  '25 %   20 bar',
  '0 %    0 bar',
  '-25 %  -20 bar',
  '-50 %  -40 bar',
];
export const xAxisLabels = ['09:55', '10:00', '10:05', '10:10', '10:15', '10:20', '10:24'];

// Predictions: only what the XGBoost model can infer — Risk Index trend + Torque + T_masse
export const predictions = [
  {
    id: 'risk',
    icon: 'bolt',
    name: 'Degradation Risk Index',
    nowLabel: 'Now: 23%',
    futureLabel: 'In 30 min',
    futureValue: 41,
    futureUnit: '%',
    direction: 'up',
    status: 'warning',
    segments: [
      { width: 23, color: 'bg-status-good' },
      { width: 18, color: 'bg-status-warning opacity-50', borderLeft: true },
    ],
  },
  {
    id: 'torque',
    icon: 'bolt',
    name: 'Motor Torque Load',
    nowLabel: 'Now: 71%',
    futureLabel: 'In 30 min',
    futureValue: 84,
    futureUnit: '%',
    direction: 'up',
    status: 'warning',
    segments: [
      { width: 71, color: 'bg-status-good' },
      { width: 13, color: 'bg-status-warning opacity-50', borderLeft: true },
    ],
  },
  {
    id: 'tmasse',
    icon: 'alert',
    name: 'Melt Temp — T_masse',
    nowLabel: 'Now: 188°C',
    futureLabel: 'In 30 min',
    futureValue: 191,
    futureUnit: '°C',
    direction: 'diagonal-up',
    status: 'danger',
    segments: [
      { width: 75, color: 'bg-brand-primary' },
      { width: 10, color: 'bg-status-danger opacity-50', borderLeft: true },
    ],
  },
  {
    id: 'pressure',
    icon: 'flask',
    name: 'Melt Pressure — P_masse',
    nowLabel: 'Now: 245 bar',
    futureLabel: 'In 30 min',
    futureValue: 268,
    futureUnit: ' bar',
    direction: 'diagonal-up',
    status: 'warning',
    segments: [
      { width: 49, color: 'bg-status-good' },
      { width: 5, color: 'bg-status-warning opacity-50', borderLeft: true },
    ],
  },
  {
    id: 'label',
    icon: 'shield',
    name: 'Model Label (XGBoost)',
    nowLabel: 'Now: NORMAL',
    futureLabel: 'In 30 min',
    futureValue: 'AT RISK',
    futureUnit: '',
    direction: 'diagonal-down',
    status: 'warning',
    segments: [
      { width: 77, color: 'bg-status-good' },
      { width: 23, color: 'bg-status-warning opacity-50', borderLeft: true, negativeMargin: 23 },
    ],
  },
];

export const aiRecommendation = {
  actions: ['Reduce screw speed by 8%', 'Increase vacuum level by 10%'],
  effects: ['Lower degradation risk', 'Improve product stability'],
};

// Gauges: the 6 actual sensor variables used as model features
export const gauges = [
  {
    id: 'tmasse',
    label: 'T_masse',
    sublabel: 'Melt Temp',
    value: 188,
    unit: '°C',
    max: 210,
    min: 150,
    dasharray: 63,
    status: 'warning',
    color: 'text-status-warning',
    target: '185 °C',
  },
  {
    id: 'pmasse',
    label: 'P_masse',
    sublabel: 'Melt Pressure',
    value: 245,
    unit: 'bar',
    max: 350,
    min: 100,
    dasharray: 58,
    status: 'good',
    color: 'text-brand-primary',
    target: '240 bar',
  },
  {
    id: 'torque',
    label: 'Couple_vis',
    sublabel: 'Motor Torque',
    value: 71,
    unit: '%',
    max: 100,
    min: 0,
    dasharray: 71,
    status: 'warning',
    color: 'text-status-warning',
    target: '< 80 %',
  },
  {
    id: 'nvis',
    label: 'n_vis',
    sublabel: 'Screw Speed',
    value: 33,
    unit: 'rpm',
    max: 70,
    min: 0,
    dasharray: 47,
    status: 'good',
    color: 'text-status-good',
    target: '30 rpm',
  },
  {
    id: 'vide',
    label: 'Vide',
    sublabel: 'Degassing Vacuum',
    value: 0.82,
    unit: 'mbar',
    max: 1,
    min: 0,
    dasharray: 82,
    status: 'good',
    color: 'text-teal-400',
    target: '0.85 mbar',
  },
  {
    id: 'risk-idx',
    label: 'Risk Index',
    sublabel: 'P(defaut)×100',
    value: 23,
    unit: '%',
    max: 100,
    min: 0,
    dasharray: 23,
    status: 'good',
    color: 'text-purple-400',
    target: '< 50 %',
  },
];

export const alerts = [
  {
    id: 'alert-1',
    severity: 'warning',
    icon: 'triangle',
    title: 'Degradation Risk Rising',
    time: '10:23:15',
    description: 'P(defaut) trending from 23% → 41% over last 15 min. Model label may flip to AT RISK.',
    severityLabel: 'Medium',
  },
  {
    id: 'alert-2',
    severity: 'danger',
    icon: 'triangle',
    title: 'T_masse Approaching Limit',
    time: '10:22:47',
    description: 'Melt temperature at 188°C — threshold for thermal degradation is 190°C (KMD 90-36 manual).',
    severityLabel: 'High',
  },
  {
    id: 'alert-3',
    severity: 'warning',
    icon: 'triangle',
    title: 'Torque Load Elevated',
    time: '10:18:30',
    description: 'Motor torque at 71% — sustained load above 95% for 15 min triggers automatic shutdown.',
    severityLabel: 'Medium',
  },
  {
    id: 'alert-4',
    severity: 'info',
    icon: 'info',
    title: 'Pressure Fluctuation Detected',
    time: '10:10:05',
    description: 'P_masse fluctuation rate exceeded ±10 bar. Check feeder dosing consistency.',
    severityLabel: 'Low',
  },
];

export const quickSummary = {
  riskValue: 23,
  riskDasharray: 23,
  stats: [
    { label: 'Production Run Time', value: '05:42:17' },
    { label: 'Good Material', value: '4.82 t' },
    { label: 'Rejected / Scrapped', value: '0.46 t (8.1%)', danger: true },
    { label: 'Degradation Events (label=1)', value: '3' },
    { label: 'Corrective Actions Taken', value: '5' },
  ],
};

export const footerStatus = [
  { label: 'XGBoost soft-sensor (thesis prototype)' },
  { label: 'Backend: FastAPI on :8000' },
  { label: 'See /model-info for F1, version, features' },
];

export const footerLinks = [
  { id: 'support', label: 'Support', icon: 'help' },
  { id: 'docs', label: 'Documentation', icon: 'doc' },
];