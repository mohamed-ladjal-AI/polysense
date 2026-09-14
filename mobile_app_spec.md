# PolySense Mobile — Product Requirements & Technical Specification
**Version:** 1.0.0  
**Target Platform:** Mobile (iOS & Android — Flutter or React Native)  
**Target Audience:** Factory Owners, Plant Managers, Production Supervisors, Quality Directors  
**Domain:** Industry 4.0 / PVC Extrusion Soft-Sensor Telemetry  

---

## 1. Executive Summary

**PolySense Mobile** is an industrial remote-monitoring and alerting mobile application designed for extrusion plant directors and maintenance supervisors. 

It connects to on-premise PolySense edge servers via secure APIs, providing **real-time visibility** into PVC extrusion lines without requiring physical presence on the factory floor. Its primary mission is to **prevent thermal degradation, reduce scrap material, and eliminate unplanned machine shutdowns** through instant, actionable push alerts.

---

## 2. Core Value Proposition for the User

* **Instant Incident Notification:** Receive critical alerts before PVC polymer burns or generates toxic HCl acid gas.
* **Remote Factory Oversight:** View live operational health (temperatures, pressure, torque, throughput) across multiple extrusion lines from anywhere.
* **One-Tap Operator Dispatch:** Immediately call or dispatch instructions to the on-site machine operator when an anomaly is detected.
* **Scrap & Yield Tracking:** Track material saved and defect trends over weekly and monthly production cycles.

---

## 3. Recommended Technology Stack

| Layer | Recommended Technology | Rationale |
| :--- | :--- | :--- |
| **Mobile Framework** | **Flutter** (Dart) or **React Native** (Expo) | Single codebase for iOS and Android, native performance, rich charting libraries. |
| **State Management** | **Riverpod / BLoC** (Flutter) or **Zustand** (React) | Predictable state handling for high-frequency live telemetry. |
| **Charts & Gauges** | `fl_chart` (Flutter) or `react-native-wagmi-charts` | Smooth, high-performance real-time sensor graphs and radial gauges. |
| **Real-time Protocol** | **WebSockets** (or MQTT / SSE) | Low-latency streaming of sensor data from the factory edge server. |
| **Push Notifications** | **Firebase Cloud Messaging (FCM)** | Reliable delivery of high-priority emergency alerts. |
| **Local Storage** | **Hive / SQLite** | Offline incident caching and user credentials. |

---

## 4. Application Architecture & Screen Breakdown

```
PolySense Mobile
├── 1. Authentication & Plant Selection
├── 2. Factory Overview (Multi-Line Dashboard)
├── 3. Line Detail & Live Digital Twin (Per Machine)
├── 4. Incident & Alert Management Center
├── 5. Scrap & Analytics Reports
└── 6. Settings & Machine Thresholds
```

---

### Screen 1: Factory Overview (Home Dashboard)
* **Plant Status Header:** Plant name, active line count (e.g., "4 of 5 Lines Active"), overall plant health score.
* **Quick Stats Cards:**
  * Total Throughput Today (e.g., `12.4 tonnes / day`)
  * Estimated Scrap Rate (`1.2%` with trend indicator $\downarrow$)
  * Active Warnings / Alerts count.
* **Extrusion Line Cards (List / Grid):**
  Each card represents one machine (e.g., *Line 01 — KraussMaffei KMD 90-36*):
  * Status badge: 🟢 **Normal** | 🟡 **Warning** | 🔴 **Critical** | ⚪ **Offline**
  * Primary metric: Soft-Sensor Degradation Risk index (`0–100%`)
  * Mini sparkline chart of melt pressure ($P_{\text{masse}}$) over the last 30 minutes.
  * Active recipe badge: *PVC-U Rigid Pipe 110mm*.

---

### Screen 2: Machine Detail & Live Telemetry (Digital Twin)
Tapping any line card opens its live operational dashboard:
* **Real-time Gauge — Degradation Risk Index:**
  * Computed by the PolySense XGBoost model.
  * 0–40%: Safe (Green)
  * 41–70%: Caution / Thermal Drift (Yellow)
  * 71–100%: Degradation Threat / Immediate Action (Red)
* **Live Process Parameters Grid:**
  * **Melt Temperature ($T_{\text{masse}}$):** Value in °C vs. setpoint (e.g., `188.4 °C / 185.0 °C`)
  * **Melt Pressure ($P_{\text{masse}}$):** Value in bar + 60-second rolling fluctuation rate.
  * **Motor Load / Torque ($Couple$):** % of nominal rating (tracks KraussMaffei 95%/15min rule).
  * **Screw Speed ($n_{\text{vis}}$):** RPM (e.g., `33.2 RPM`).
  * **Degassing Vacuum ($Vide$):** mbar / % vacuum.
  * **Barrel Zone Temperatures:** Interactive visual diagram of Zones 1 through 8.
* **Historical Time-Series Graph:**
  * Toggleable time range: `15m`, `1h`, `8h`, `24h`.
  * Multi-variable overlay: Melt Temperature vs. Pressure vs. Risk Score.

---

### Screen 3: Push Notifications & Incident Center
* **Alert Feed:** Reverse-chronological list of all trigger events.
* **Alert Severity Levels:**
  * 🔴 **CRITICAL (High Priority Push):**
    * *Example:* "Line 1: Severe Thermal Drift detected ($T_{\text{zone5}} > 192^\circ\text{C}$). Degradation Risk: 89%."
    * Sounds high-priority siren/vibration even in silent mode (via critical alerts permissions).
  * 🟡 **WARNING:**
    * *Example:* "Line 1: Melt pressure pulsation exceeds $\pm 12\text{ bar}$. Check feeder dosing."
  * 🟢 **INFO:**
    * *Example:* "Line 2: Recipe change completed successfully."
* **Incident Action Drawer:**
  * **One-Tap "Call Operator"**: Direct phone call to the line workstation.
  * **"Acknowledge Alert"**: Logs who reviewed the alert.
  * **"Recommended Corrective Actions"**: Built-in troubleshooting guide:
    1. Lower screw speed by 2–3 RPM.
    2. Inspect Zone 5 cooling blower.
    3. Verify stabilizer dosing in dry-blend feeder.

---

### Screen 4: Analytics & Scrap Reduction
* **Material Yield & Scrap Avoidance:** Graph comparing standard baseline scrap vs. PolySense-monitored scrap.
* **Incident Distribution:** Donut chart of defect causes (Thermal Overheat, Pressure Pulsation, Torque Overload).
* **Export Feature:** One-tap export to PDF / CSV for production meetings.

---

### Screen 5: Settings & Configuration
* **Alarm Threshold Sensitivity:** Low, Medium, Strict (adjusts classification threshold $\tau$).
* **Notification Preferences:** Mute non-critical warnings during night shifts.
* **Recipe Presets:** Select active formulation (PVC-U, PVC-C, Foam PVC).

---

## 5. REST & WebSocket API Specification

### A. Live Telemetry WebSocket
* **Endpoint:** `wss://api.polysense.industrial/v1/telemetry/{machine_id}`
* **Payload Format (JSON):**
```json
{
  "timestamp": "2026-09-09T01:30:00Z",
  "machine_id": "KMD90-01",
  "status": "WARNING",
  "prediction": {
    "degradation_risk_pct": 74.2,
    "classification": 1,
    "confidence": 0.88,
    "model_version": "1.0.0-thesis"
  },
  "telemetry": {
    "T_four_Z1": 160.2,
    "T_four_Z2": 165.1,
    "T_four_Z3": 170.0,
    "T_four_Z4": 174.8,
    "T_four_Z5": 191.2,
    "T_masse": 189.5,
    "P_masse": 268.4,
    "couple_vis_pct": 86.3,
    "n_vis": 33.1,
    "vide_mbar": 0.85,
    "fluctuation_P_masse": 14.8
  }
}
```

### B. Push Alert Webhook Payload (FCM)
```json
{
  "to": "/topics/plant_managers_setif",
  "priority": "high",
  "notification": {
    "title": "CRITICAL: PVC Degradation Imminent",
    "body": "Line 01 (KMD 90-36): Thermal surge on Zone 5 (191.2°C). Risk score: 74%.",
    "sound": "industrial_alarm.aiff"
  },
  "data": {
    "machine_id": "KMD90-01",
    "incident_id": "INC-20260909-003",
    "screen": "/machine_detail/KMD90-01"
  }
}
```

---

## 6. UI/UX & Design Guidelines

* **Color Palette:**
  * **Dark Industrial Slate:** `#0F172A` (primary background, glare-free in factory environments)
  * **Card Surface:** `#1E293B`
  * **Safety Green:** `#10B981` (Normal operation)
  * **Warning Amber:** `#F59E0B` (Process drift / Caution)
  * **Critical Red:** `#EF4444` (Degradation / Immediate danger)
  * **Accent Blue:** `#3B82F6` (Brand & telemetry graphs)
* **Typography:** Clean, tabular monospace numbers (`Roboto Mono` or `Inter`) so numbers don't jump when updating at 1 Hz.
* **Touch Targets:** Large, touch-friendly buttons ($\ge 48\text{ px}$) suitable for one-handed operation.

---

## 7. AI Assistant Implementation Prompt (Copy & Paste Ready)

> **Copy this exact prompt when handing this specification to your AI coding assistant:**
>
> *"Build a cross-platform mobile app in Flutter (or React Native) based on the `polysense_mobile_app_spec.md` specification. The app is an industrial IoT remote monitoring tool for plant managers supervising PVC extrusion lines. Implement: (1) A multi-line overview dashboard with status badges and KPIs, (2) A machine detail screen featuring a circular risk gauge (0–100%) and live temperature/pressure telemetry, (3) An incident alert list with severity filters and a direct 'Call Operator' action, (4) Dark industrial UI theme with fl_chart/chart components and mock WebSocket generator simulating 1-second data updates. Use clean architecture and make the code modular and ready for production."*
