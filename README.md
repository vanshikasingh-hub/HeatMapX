# HeatMapX — Urban Heat Intelligence Ecosystem

> **More Than a Heat Map — A Complete Urban Heat Intelligence Ecosystem**  
> Primary Demonstration City: **Kanpur Nagar, Uttar Pradesh, India**

---

## 1. Executive Summary

**HeatMapX** is a geospatial AI and climate intelligence platform designed to detect urban heat hotspots, explain their physical and anthropogenic drivers, forecast future thermal stress, recommend localized cooling interventions, simulate scenarios via a **3D Procedural Digital Twin**, evaluate heat equity, provide heat-aware **Cool Route Navigation**, and mobilize grassroots community participation through the **Citizen Climate Action** ecosystem.

Inspired by Earth Observation frameworks (ISRO, NASA, ESA), HeatMapX combines thermal infrared satellite observations, multi-spectral vegetation and built-up indices, thermodynamic physics, and demographic vulnerability into a unified, actionable decision-support platform.

---

## 2. Platform Architecture & Capabilities

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
      3D Digital Twin Procedural "What-If" Simulation
                           ↓
         Safe Cool Route Pedestrian Navigation
                           ↓
             Heat Equity Prioritization Model
                           ↓
       TEE-Ready Security & Differential Privacy Layer
                           ↓
             Citizen Climate Action Center
```

---

## 3. Key Modules & Innovations

### 🏙️ 3D Digital Twin Simulator (`/digital-twin`)
- **Procedural 3D City Engine**: Powered by Three.js, renders procedural building blocks, urban density heights, and thermal colormaps for Kanpur Nagar.
- **Interactive Physics Sliders**:
  - *Tree Canopy Cover (+0% to +50%)*: Dynamically spawns up to 80 procedural 3D trees across streets and parks.
  - *High-Albedo Cool Roofs (0% to 100%)*: Interactively applies reflective cool roof coatings to building rooftops.
  - *Surface Reflectance (Albedo)*: Shifts pavement reflectance from dark asphalt to bright reflective concrete.
  - *Water Misting Kiosks*: Simulates evaporative cooling near public transit nodes.
- **Outcome Metrics**: Displays real-time Before vs. After physics calculations: $\Delta\text{LST}$ reduction, composite risk score drop, and citizens benefited.

### 🧭 Safe Cool Route Navigation (`/cool-routes`)
- **Google Maps-Style Navigation**: Origin & destination selectors with instant Swap capability across all Kanpur monitored wards.
- **Multi-Route Mode Comparison**:
  - 🌿 **Coolest Route** (Emerald green, -38% heat stress, 78% tree shade canopy)
  - ⚖️ **Balanced Route** (Cyan, optimal tradeoff between detour distance and canopy protection)
  - ⚡ **Fastest Direct Route** (Red, shortest road network path, high thermal solar exposure)
- **Interactive Leaflet Route Map**: Renders colored route polylines, start/end markers, and municipal drinking water ATMs.
- **Elevation & Heat Exposure Profile**: Recharts area chart plotting thermal hazard vs. canopy shade along the route distance.
- **Turn-by-Turn Guidance**: Detailed directions with thermal cautions (*"Direct solar glare on asphalt — recommend UV umbrella or cap"*).

### ⚖️ Heat Equity & Vulnerability Matrix (`/heat-equity`)
- **Kanpur Equity Choropleth Map**: Ward polygons colored by municipal equity intervention priority.
- **Formula**:
  $$\text{Equity Priority Index} = (\text{Hazard} \times 0.40) + (\text{Population Density Factor} \times 3.5) + (\text{Vulnerability Score} \times 0.35)$$
- **Ward Equity Inspector**: Explains why high-density or vulnerable wards (e.g. Sisamau Bazaar, Kanpur Central) receive top funding priority over unpopulated industrial zones.

### 🔒 TEE-Ready Security & Differential Privacy (`/security`)
- **Confidential Computing Architecture**: Memory isolation boundary isolating sensitive demographic joins and proprietary microclimate risk models.
- **Live Remote Attestation Simulator**: Cryptographically measures runtime integrity via SHA-256 and validates PCR registers (PCR0, PCR1, PCR2).
- **Differential Privacy ($\epsilon = 0.5$)**: Laplace noise mechanism offsets citizen household coordinates to preserve residential privacy while maintaining ward-level GIS fidelity.

### 🔑 Role-Based Access & Quick Demo Sign-In (`/login`)
One-click judge evaluation logins:
1. **Municipal Heat Officer**: Dr. Alok Verma (*Kanpur Municipal Corporation*)
2. **Geospatial Climate Analyst**: Neha Srivastava (*IIT Kanpur Climate Lab*)
3. **Citizen Climate Champion**: Ramesh Chandra (*Sisamau Bazaar*)

---

## 4. Technology Stack

### Frontend
- **Framework**: React 18 + Vite 5
- **Routing**: React Router DOM v6
- **3D Graphics**: Three.js (WebGL procedural city block renderer)
- **Geospatial Mapping**: Leaflet v1.9 + React-Leaflet v4
- **Charts**: Recharts v2.12
- **Icons**: Lucide React
- **Styling**: Tailored CSS tokens + Tailwind CSS (Deep Navy `#071A2B`, Spatial Blue `#1479D1`, Tech Cyan `#28B8F2`, Thermal Orange `#FF7A18`)

### Backend
- **Runtime**: Node.js + Express.js
- **Cryptography**: Node.js native `crypto` (AES-256-GCM, SHA-256 attestation, `crypto.scryptSync` password hashing)
- **Data Engine**: Seeded GeoJSON & metrics service for Kanpur Nagar with optional MongoDB Atlas connection.

---

## 5. Quick Start & Local Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Start the Backend API Server
```bash
cd backend
npm install
node server.js
```
*The backend starts at `http://localhost:5000`.*

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*The frontend starts at `http://localhost:5173`.*

### 3. Production Build Validation
```bash
cd frontend
npm run build
```
*Transformed 2,362 modules cleanly into optimized production bundle in `dist/`.*

---

## 6. Monitored Zones in Kanpur Nagar

| Zone ID | Ward Name | Primary Feature | Baseline LST | Risk Score |
|---|---|---|---|---|
| `loc_central` | Ward 24 - Collectorganj / Station Core | Commercial transit bottleneck, low albedo | 44.8°C | 88 (Critical) |
| `loc_naveen` | Ward 18 - Civil Lines South / Mall Road | Dense commercial high-street | 43.6°C | 78 (High) |
| `loc_sisamau` | Ward 14 - Sisamau Bazaar | High density (36k/km²), vulnerable roofs | 44.2°C | 86 (Critical) |
| `loc_govind` | Ward 08 - Govind Nagar Commercial | Residential & retail mix | 42.1°C | 71 (High) |
| `loc_panki` | Ward 11 - Panki Industrial Area | Factory sheds, high thermal emission | 45.4°C | 82 (Critical) |
| `loc_jajmau` | Ward 29 - Jajmau Tannery Belt | Riverfront industrial cluster | 43.9°C | 76 (High) |
| `loc_swaroop` | Ward 04 - Swaroop Nagar Residential | Tree-lined residential streets | 37.8°C | 46 (Moderate) |
| `loc_iitk` | Ward 01 - IIT Kanpur & Kalyanpur | Canopy oasis, institutional campus | 33.5°C | 22 (Very Low) |
| `loc_allen_zoo` | Ward 16 - Allen Forest / Zoo Perimeter | Urban botanical reserve and lake | 31.8°C | 18 (Very Low) |
| `loc_barra` | Ward 32 - Barra Commercial Sector | South Kanpur urban sprawl | 42.8°C | 74 (High) |
| `loc_kidwai` | Ward 06 - Kidwai Nagar Central | High-density planned residential | 40.5°C | 62 (High) |
| `loc_cantt` | Ward 21 - Cantonment Green Belt | Protected military green buffer | 34.2°C | 26 (Low) |

---

## 7. Scientific Guardrails & Prototype Honesty

HeatMapX maintains rigorous scientific transparency:
- **Heuristic Proxies**: Composite risk scores, forecast projections, and Digital Twin deltas represent prototype decision support models calibrated for Kanpur Nagar. They do not claim certified medical risk forecasts.
- **TEE Simulation**: In this demonstration deployment, cryptographic memory enclaves and remote attestation are simulated using Node.js native AES-256-GCM and SHA-256 measurement registers. The architecture is engineered so hardware enclaves (Intel SGX, AWS Nitro Enclaves) can run the model directly with zero application code changes.
- **Multi-City Scaling**: Kanpur Nagar is the primary demonstration city. An isolated Varanasi prototype dataset is included in `backend/src/services/varanasiGeoData.js` to illustrate schema portability across the Indo-Gangetic plain.
