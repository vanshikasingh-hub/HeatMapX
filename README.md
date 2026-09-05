# HeatMapX — Urban Heat Intelligence Ecosystem

> **More Than a Heat Map — A Complete Urban Heat Intelligence Ecosystem**

Primary Demonstration City: **Kanpur Nagar, Uttar Pradesh, India**

---

## 1. Executive Summary

**HeatMapX** is a production-quality, responsive geospatial AI and climate intelligence platform designed to detect urban heat hotspots, explain their physical and anthropogenic drivers, forecast future thermal stress, recommend localized cooling interventions, simulate scenarios via a prototype **Digital Twin**, evaluate heat equity, and mobilize grassroots community participation through the **Citizen Climate Action** ecosystem.

Inspired by Earth Observation frameworks (ISRO, NASA, ESA), HeatMapX combines thermal infrared satellite observations, multi-spectral vegetation and built-up indices, meteorological physics, and demographic vulnerability into a unified, actionable decision-support platform.

---

## 2. Core Problem & Solution

### The Urban Heat Problem in Kanpur Nagar
During North India's pre-monsoon summer peaks (May–June), land surface temperatures (LST) across Kanpur's dense commercial hubs (Kanpur Central, Ghanta Ghar, Sisamau) and industrial manufacturing clusters (Panki, Jajmau) consistently exceed **44°C to 46°C**.
- **Impervious Concrete Canyons**: High built-up density (NDBI > 0.70) traps shortwave solar radiation during daylight and radiates sensible heat throughout the night.
- **Asymmetric Vulnerability**: Informal settlements with corrugated tin roofs, outdoor street vendors, and manual laborers suffer acute heat stress with minimal access to air-conditioned refuges.
- **Data Blindspots**: Traditional single-station ambient thermometers report only macro air temperature, failing to detect localized surface hotspots.

### The HeatMapX Solution
1. **Multi-Spectral Satellite Fusion**: Derives Land Surface Temperature (LST), Normalized Difference Vegetation Index (NDVI), Normalized Difference Built-up Index (NDBI), Soil Moisture Index (SMI), and Surface Albedo ($\alpha$).
2. **Microclimate Physics Layer**: Quantifies the thermodynamic skin differential $\Delta T = \text{LST} - T_{\text{air}}$ and human Heat Index.
3. **Composite Risk Modeling**: Formulates composite risk as $\text{Risk} = (\text{Hazard} \times 0.50) + (\text{Exposure} \times 0.25) + (\text{Vulnerability} \times 0.25)$.
4. **Explainable AI (XAI)**: Decomposes ward thermal stress into ranked, percentage-attributed drivers.
5. **AI Mitigation Advisor**: Provides costed cooling recommendations (cool roofs, urban tree canopy, permeable pavers, hydration hubs).
6. **Digital Twin "What-If" Simulator**: Evaluates temperature and risk reductions before capital is spent.
7. **Citizen Climate Action**: Empowers residents to submit verified tree plantings, cool roof coatings, and rooftop gardens, earning digital badges and awards.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js (v18.2) + Vite 5
- **Routing**: React Router DOM (v6.22)
- **Geospatial Mapping**: Leaflet (v1.9.4) + React-Leaflet (v4.2.1)
- **Data Visualizations**: Recharts (v2.12)
- **Icons**: Lucide Icons
- **Design System & Styling**: Tailored Vanilla CSS + Tailwind CSS with Blue + Orange hybrid palette:
  - Deep Navy: `#071A2B`
  - Dark Blue: `#0B2942`
  - Primary Blue: `#1479D1`
  - Electric Cyan: `#28B8F2`
  - Vibrant Orange: `#FF7A18`
  - Warm Orange: `#FF9F43`
  - Soft White: `#F7FAFC`

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js (v4.19)
- **Security**: Helmet, CORS, Express JSON parser
- **Logging**: Morgan
- **Database (Optional / Atlas Ready)**: MongoDB + Mongoose with seamless fallback to in-memory seeded Kanpur GeoJSON & Citizen Action store.

---

## 4. Architecture & Data Pipeline

```text
Satellite & Environmental Data (LST, NDVI, NDBI, SMI, Albedo)
                           ↓
               Heat Detection & Hotspots
                           ↓
           Microclimate Physics Layer (Delta T)
                           ↓
                    AI Heat Risk Model
                           ↓
             Explainable AI (Ranked Drivers)
                           ↓
             AI Mitigation Recommendations
                           ↓
           Digital Twin "What-If" Simulation
                           ↓
            Citizen Climate Action Center
                           ↓
           Spatial Impact Markers on Heat Map
```

---

## 5. Folder Structure

```
HBTU Hackathon/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── heatmapController.js    # Kanpur GIS, forecast, physics, simulation
│   │   │   └── citizenController.js    # Citizen actions, profile, badges, awards, leaderboard
│   │   ├── models/
│   │   │   ├── CitizenAction.js        # Mongoose schema for citizen submissions
│   │   │   ├── Badge.js                # Digital achievement badges schema
│   │   │   ├── Award.js                # Civic honor awards schema
│   │   │   ├── User.js                 # User profile with gamification stats
│   │   │   ├── Location.js             # Geospatial ward location schema
│   │   │   └── HeatRisk.js             # Risk metrics schema
│   │   ├── routes/
│   │   │   └── apiRoutes.js            # Consolidated REST endpoints
│   │   └── services/
│   │       ├── kanpurGeoData.js        # 12 Kanpur wards, roads, hotspots, mitigations
│   │       ├── riskModelService.js     # Physics, composite risk, simulation, cool route graph
│   │       └── citizenService.js       # In-memory store, badge logic, leaderboard engine
│   ├── package.json
│   └── server.js                       # Express server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── analysis/               # AreaAnalysisPanel
│   │   │   ├── common/                 # DemoBanner
│   │   │   ├── layout/                 # Navbar, Footer
│   │   │   └── map/                    # MapView, LayerControl, MapLegend
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Hero, visual storytelling, Kanpur demo
│   │   │   ├── DashboardPage.jsx       # KPIs, Core MVP/Phase 2/Future tabs, charts
│   │   │   ├── HeatMapPage.jsx         # Full-screen GIS workspace
│   │   │   ├── PhysicsPage.jsx         # LST vs Air Temp (Delta T), interactive sandbox
│   │   │   ├── ExplainableAIPage.jsx   # Rule-based explainability prototype
│   │   │   ├── ForecastPage.jsx        # 7-day thermal risk forecast
│   │   │   ├── MitigationPage.jsx      # AI Mitigation Advisor cards
│   │   │   ├── DigitalTwinPage.jsx     # "What-If" scenario sliders, before/after deltas
│   │   │   ├── CoolRoutesPage.jsx      # Thermal-weighted route comparison
│   │   │   ├── HeatEquityPage.jsx      # Heat equity priority matrix
│   │   │   ├── AnalyticsPage.jsx       # Scatter correlation & exposure charts
│   │   │   ├── CitizenActionPage.jsx   # Action submission, badges, awards, leaderboard
│   │   │   └── AboutPage.jsx           # Methodology, pipeline, TEE architecture
│   │   ├── services/
│   │   │   └── api.js                  # Frontend API adapters with offline fallbacks
│   │   ├── App.jsx                     # Router mounting 13 pages
│   │   ├── index.css                   # Blue + Orange design tokens & overrides
│   │   └── main.jsx                    # React entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 6. REST API Endpoints

### Geospatial & Heat Intelligence
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and demonstration city status |
| `GET` | `/api/heatmap` | GeoJSON FeatureCollection (wards, roads, citizen points) |
| `GET` | `/api/locations` | List of monitored Kanpur zones with risk metrics |
| `GET` | `/api/location/:id` | Detailed ward breakdown (LST, Delta T, drivers, mitigations) |
| `GET` | `/api/forecast` | 7-day thermal risk and temperature trajectory |
| `GET` | `/api/environmental-factors`| Aggregated Kanpur citywide statistics |
| `GET` | `/api/recommendations` | AI Mitigation Advisor intervention catalog |
| `POST` | `/api/simulation` | Digital Twin "What-If" scenario simulation |
| `GET` | `/api/routes` | Heat-aware cool pedestrian routing |
| `GET` | `/api/equity` | Heat equity and climate justice rankings |

### Citizen Climate Action & Gamification
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/citizen/actions` | Retrieve verified citizen climate actions |
| `POST` | `/api/citizen/actions` | Submit a new citizen climate mitigation action |
| `GET` | `/api/citizen/profile` | Logged-in citizen impact summary and points |
| `GET` | `/api/citizen/badges` | Digital achievement badges and progress |
| `GET` | `/api/citizen/awards` | Digital civic honor awards and certificates |
| `GET` | `/api/leaderboard` | Individual and neighborhood cool rankings |

---

## 7. Installation & Running Locally

### Prerequisites
- Node.js (v18 or v20 recommended)
- npm (v9 or v10)

### 1. Start Backend Server
```bash
cd backend
npm install
node server.js
```
The REST API server will run at: `http://localhost:5000`

### 2. Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The Vite development server will open at: `http://localhost:5173`

### 3. Production Build Validation
```bash
cd frontend
npm run build
```

---

## 8. Scientific Honesty & Demonstration Notice

> [!NOTE]
> **DEMO MODE**: HeatMapX is currently operating in demonstration mode using simulated/sample data for **Kanpur Nagar, Uttar Pradesh, India**.
> - Live satellite feeds (ISRO Bhuvan, MOSDAC, Landsat), real-time IMD weather stations, and census registries can be connected via the backend data adapter architecture.
> - Terminology used: **Prototype**, **Demo model**, **Simulated data**, **AI-assisted**, **Estimated risk**, **Scenario simulation**.
> - TEE Architecture: The platform is **TEE-ready** (Trusted Execution Environment) for sensitive demographic and infrastructure processing in confidential enclaves, but does not claim to run in hardware TEE during this prototype phase.

---

## 9. Contributors & Acknowledgments
Built for **HBTU Hackathon** showcasing how cutting-edge geospatial AI, thermal physics, and citizen mobilization can safeguard Indian cities from the growing threat of extreme urban heat.
