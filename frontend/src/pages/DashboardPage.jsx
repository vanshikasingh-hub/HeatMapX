import React from 'react';
import MapView from '../components/map/MapView';
import ErrorBoundary from '../components/common/ErrorBoundary';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';
import HeroThermalAtmosphere from '../components/common/HeroThermalAtmosphere';
import { useArea } from '../context/AreaContext';
import { 
  getRiskLevel, 
  getRiskColor, 
  getRiskBadgeClasses, 
  getRiskHumanReason, 
  getRiskActionAdvice,
  getUvCategory
} from '../utils/kanpurMetrics';
import { 
  Thermometer, 
  Flame, 
  Wind, 
  Sun, 
  Moon, 
  Droplets, 
  TreePine, 
  Building2, 
  MapPin, 
  Navigation, 
  ChevronDown, 
  ArrowUpRight, 
  Activity, 
  ShieldAlert, 
  Calendar, 
  AlertCircle, 
  Clock, 
  Sparkles,
  Cloud,
  Gauge,
  Umbrella
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardPage() {
  const {
    currentArea,
    allAreas,
    citySummary,
    locationSource,
    userArea,
    openAreaSelector,
    resetToMyLocation,
    setAreaById,
    isLiveWeather,
    weatherLoading,
    weatherError
  } = useArea();

  // Active area values
  const area = currentArea || allAreas[0] || {};
  const areaName = area.name || 'Kidwai Nagar';
  const areaAir = Number(area.airTemperature ?? 28.0).toFixed(1);
  const areaHumidity = area.humidity ?? 65;
  const areaHeatIndex = Number(area.feelsLike ?? area.heatIndex ?? (Number(areaAir) + 2.5)).toFixed(1);
  const areaLst = Number(area.lst ?? 34.4).toFixed(1);
  const areaDeltaT = Number(area.deltaT ?? (areaLst - areaAir)).toFixed(1);
  const areaRisk = area.riskScore ?? 28;
  const areaRiskLevel = area.riskLevel || getRiskLevel(areaRisk);
  const areaNdvi = area.ndvi ?? 0.24;
  const areaNdbi = area.ndbi ?? 0.58;

  // Realistic secondary metrics with day/night awareness
  const areaWindSpeed = area.windSpeed ?? 12; // km/h
  const areaIsDay = area.isDay !== undefined ? area.isDay : false;
  const areaUvIndex = areaIsDay ? Number(area.uvIndex ?? 0).toFixed(1) : 0;
  const areaPeakUv = Number(area.peakUvIndex ?? 7.0).toFixed(1);
  const uvCategory = getUvCategory(areaUvIndex, areaIsDay);

  // Extended microclimate telemetry
  const areaDewPoint = area.dewPoint !== undefined && area.dewPoint !== null ? Number(area.dewPoint).toFixed(1) : null;
  const areaPressure = area.pressure ? Number(area.pressure).toFixed(0) : null;
  const areaCloudCover = area.cloudCover !== undefined ? Math.round(area.cloudCover) : null;
  const areaWindGusts = area.windGusts ? Number(area.windGusts).toFixed(1) : null;
  const areaPrecip = area.precipitation !== undefined ? Number(area.precipitation).toFixed(1) : '0.0';

  // Human-readable reason & advice with day/night awareness
  const riskReason = area.riskReason || getRiskHumanReason(areaRisk, Number(areaAir), areaHumidity, areaIsDay);
  const riskAdvice = area.riskAdvice || getRiskActionAdvice(areaRisk, areaIsDay);

  // City benchmarks
  const cityAvgAirTemp = citySummary?.avgAirTemp ?? 28.2;
  const cityMedianRisk = citySummary?.medianRisk ?? 35;

  // Chart data covering all Kanpur wards with active ward highlighted
  const chartData = (allAreas || []).map((a) => ({
    id: a.id,
    name: (a.name || 'Ward').split(' ')[0],
    fullName: a.name || 'Kanpur Ward',
    risk: a.riskScore || 0,
    air: a.airTemperature || 0,
    lst: a.lst || 0,
    isSelected: a.id === area.id
  }));

  return (
    <ErrorBoundary title="Citizen Heat Intelligence Dashboard">
      <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-800 animate-fadeIn">
        
        {/* ==========================================================================
            1. LOCATION HEADER BAR — Citizen Friendly
            ========================================================================== */}
        <div className="cinematic-card p-4 sm:p-5 border border-slate-200/90 bg-white/80 shadow-md backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Current Area:</span>
              
              {/* Active Ward Button */}
              <button
                onClick={openAreaSelector}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-orange-800 font-black text-sm cursor-pointer transition-all shadow-sm group"
                title="Click to switch your neighborhood in Kanpur Nagar"
              >
                <MapPin className="w-4 h-4 text-[#FF7A18] group-hover:scale-110 transition-transform" />
                <span>📍 {areaName}, Kanpur Nagar</span>
                <ChevronDown className="w-3.5 h-3.5 text-orange-600/80 group-hover:text-orange-700" />
              </button>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                locationSource === 'detected'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                {locationSource === 'detected' ? '📍 GPS Verified' : 'Selected Ward'}
              </span>

              {/* Weather Status Badge */}
              {isLiveWeather ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Weather API
                </span>
              ) : weatherLoading ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                  Fetching Live Weather...
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Live weather data temporarily unavailable
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Live microclimate observations & neighborhood heat advisories.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={openAreaSelector}
              id="change-area-btn"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Change Ward</span>
            </button>

            <button
              onClick={resetToMyLocation}
              id="my-location-btn"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                locationSource === 'detected'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'heat-btn-primary shadow-sm text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{userArea ? 'My GPS Ward' : 'Detect Location'}</span>
            </button>
          </div>
        </div>

        {/* ==========================================================================
            2. PRIMARY HERO SECTION — AIR TEMPERATURE DOMINATES
            ========================================================================== */}
        <div className="cinematic-card p-6 sm:p-8 bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 border border-orange-200/90 shadow-[0_14px_45px_rgba(255,122,24,0.08)] relative overflow-hidden">
          
          {/* Micro-Atmospheric Thermal Convection & Particle Canvas */}
          <HeroThermalAtmosphere temperature={areaAir} />

          {/* Subtle thermal glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF4500]/10 via-[#FF7A18]/08 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: Dominant Air Temperature & Perceived Heat */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[#ea580c] flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-[#ea580c]" />
                  Ambient Air Temperature
                </span>
                <MetricInfoTooltip metric="AIR_TEMP" />
                {isLiveWeather && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Live Open-Meteo
                  </span>
                )}
              </div>

              {/* Huge Dominant Air Temperature Reading */}
              <div className="flex flex-wrap items-baseline gap-4">
                <div className="flex items-baseline">
                  <span className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-slate-900 drop-shadow-sm">
                    {areaAir}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-400 ml-1">°C</span>
                </div>

                {/* Prominent Feels Like */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
                  <span className="text-sm sm:text-base font-bold text-amber-900">
                    Feels like <strong className="font-mono text-slate-900 text-lg sm:text-xl font-black">{areaHeatIndex}°C</strong>
                  </span>
                  <MetricInfoTooltip metric="FEELS_LIKE" />
                </div>
              </div>

              {/* Heat Risk Banner & Human-Readable Reason */}
              <div className="p-4 rounded-2xl bg-white/85 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">Current Heat Risk:</span>
                    <span className={`text-xs font-black px-3 py-0.5 rounded-full border uppercase tracking-wider ${getRiskBadgeClasses(areaRisk)}`}>
                      {areaRiskLevel} Risk ({areaRisk}/100)
                    </span>
                    <MetricInfoTooltip metric="HEAT_RISK" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Kanpur City Avg: {cityAvgAirTemp}°C
                  </span>
                </div>

                {/* Human-Readable Reason */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {riskReason}
                </p>
              </div>
            </div>

            {/* Right Col: Citizen Action & Safety Advisory */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-white/95 to-orange-50/70 border border-orange-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-[#ea580c]" />
                <span>What You Should Know & Do</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {riskAdvice}
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
                <Link
                  to="/cool-routes"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Find Shaded Cool Routes</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/forecast"
                  className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>View 7-Day Forecast</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ==========================================================================
            3. SECONDARY ENVIRONMENTAL METRICS — Compact Responsive Grid
            ========================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          {/* 1: Surface Temperature (LST) */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-[#FF4500]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Surface Temp</span>
                <MetricInfoTooltip metric="LST" />
              </div>
              <Thermometer className="w-3.5 h-3.5 text-[#FF4500]" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{areaLst}</span>
              <span className="text-xs text-slate-500 font-semibold">°C</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Satellite Thermal Skin</div>
          </div>

          {/* 2: Relative Humidity */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-cyan-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Humidity</span>
                <MetricInfoTooltip metric="HUMIDITY" />
              </div>
              <Droplets className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-cyan-700 font-mono">{areaHumidity}</span>
              <span className="text-xs text-slate-500 font-semibold">%</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Moisture Trapping Heat</div>
          </div>

          {/* 3: Surface-Air Difference (Delta T) */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-amber-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Surface–Air ΔT</span>
                <MetricInfoTooltip metric="DELTA_T" />
              </div>
              <Activity className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-700 font-mono">
                {Number(areaDeltaT) > 0 ? `+${areaDeltaT}` : areaDeltaT}
              </span>
              <span className="text-xs text-slate-500 font-semibold">°C</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Pavement Heat Trap</div>
          </div>

          {/* 4: Wind Speed */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Wind Speed</span>
                <MetricInfoTooltip metric="WIND" />
              </div>
              <Wind className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{areaWindSpeed}</span>
              <span className="text-xs text-slate-500 font-semibold">km/h</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Natural Airflow Cooling</div>
          </div>

          {/* 5: UV Radiation Index */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-purple-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                  Current UV
                </span>
                <MetricInfoTooltip metric="UV" />
              </div>
              {areaIsDay ? (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-black text-slate-900 font-mono">{areaUvIndex}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${uvCategory.badgeClass}`}>
                {uvCategory.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {areaIsDay 
                ? `Today's Peak: ${areaPeakUv}` 
                : `Night (0 UV) • Peak: ${areaPeakUv}`}
            </div>
          </div>

          {/* 6: Vegetation & Canopy Cover (NDVI) */}
          <div className="cinematic-card p-4 space-y-2 border-t-2 border-t-emerald-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">Tree Canopy</span>
                <MetricInfoTooltip metric="NDVI" />
              </div>
              <TreePine className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 font-mono">{areaNdvi}</span>
              <span className="text-[10px] font-bold text-emerald-700 ml-1">
                {areaNdvi < 0.25 ? 'Low' : areaNdvi < 0.4 ? 'Moderate' : 'Dense'}
              </span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Satellite Green Baseline</div>
          </div>

        </div>

        {/* ==========================================================================
            3B. ATMOSPHERIC TELEMETRY RIBBON — High-Precision Meteorological Observations
            ========================================================================== */}
        <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Live Telemetry
            </span>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
              Boundary-Layer Microclimate • 2m Atmospheric
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Dew Point */}
            {areaDewPoint && (
              <div className="flex items-center gap-1.5" title="Moisture Condensation Threshold">
                <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                <span className="text-slate-500 text-[11px]">Dew Point:</span>
                <strong className="font-mono text-slate-900 font-bold">{areaDewPoint}°C</strong>
                <MetricInfoTooltip metric="DEW_POINT" />
              </div>
            )}

            {/* Pressure */}
            {areaPressure && (
              <div className="flex items-center gap-1.5" title="Barometric Surface Pressure">
                <Gauge className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-slate-500 text-[11px]">Pressure:</span>
                <strong className="font-mono text-slate-900 font-bold">{areaPressure} hPa</strong>
                <MetricInfoTooltip metric="PRESSURE" />
              </div>
            )}

            {/* Cloud Cover */}
            {areaCloudCover !== null && (
              <div className="flex items-center gap-1.5" title="Sky Cloud Fraction">
                <Cloud className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 text-[11px]">Cloud Cover:</span>
                <strong className="font-mono text-slate-900 font-bold">{areaCloudCover}%</strong>
                <MetricInfoTooltip metric="CLOUD_COVER" />
              </div>
            )}

            {/* Wind Gusts */}
            {areaWindGusts && (
              <div className="flex items-center gap-1.5" title="Peak Transient Wind Burst">
                <Wind className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-slate-500 text-[11px]">Wind Gusts:</span>
                <strong className="font-mono text-slate-900 font-bold">{areaWindGusts} km/h</strong>
                <MetricInfoTooltip metric="WIND_GUST" />
              </div>
            )}

            {/* Precipitation */}
            <div className="flex items-center gap-1.5" title="Live Precipitation Rate">
              <Umbrella className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-slate-500 text-[11px]">Precipitation:</span>
              <strong className="font-mono text-slate-900 font-bold">{areaPrecip} mm</strong>
              <MetricInfoTooltip metric="PRECIPITATION" />
            </div>
          </div>
        </div>

        {/* ==========================================================================
            4. VISUAL CONTEXT — HEAT MAP (5 DISTINCT COLORS)
            ========================================================================== */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#FF7A18]" />
                <span>Kanpur Heat Map — Neighborhood Risk Zones</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200">
                  {areaName}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Click any neighborhood polygon on the map to switch your active location.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/map"
                className="text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Open Full Map Experience</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              </Link>
            </div>
          </div>

          <MapView onSelectArea={(p) => {
            if (p && p.id) {
              setAreaById(p.id);
            }
          }} />
        </div>

        {/* ==========================================================================
            5. PLANNING & COMPARISON SECTION — 7-Day & Ward Comparison
            ========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ward Comparison Chart */}
          <div className="cinematic-card p-5 space-y-4 lg:col-span-2 border border-slate-200">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#ea580c]" />
                  <span>Kanpur Wards Heat Comparison</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Currently viewing <strong className="text-orange-600">{areaName}</strong> ({areaRisk}/100)
                </p>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-35} textAnchor="end" />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white/95 backdrop-blur-xl text-slate-900 p-3 rounded-xl border border-slate-200 text-xs shadow-xl space-y-1">
                            <strong className="text-slate-900 block font-bold">{d.fullName}</strong>
                            <div className="text-orange-600 font-mono font-bold">Heat Risk: {d.risk}/100</div>
                            <div className="text-slate-500 text-[11px]">
                              Air Temp: <span className="text-slate-900 font-bold">{d.air}°C</span> • Surface: <span className="text-red-600 font-bold">{d.lst}°C</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="risk" 
                    radius={[6, 6, 0, 0]}
                    onClick={(entry) => {
                      if (entry && entry.id) setAreaById(entry.id);
                    }}
                    className="cursor-pointer"
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isSelected ? '#FF7A18' : getRiskColor(entry.risk)} 
                        stroke={entry.isSelected ? '#c2410c' : 'none'}
                        strokeWidth={entry.isSelected ? 2 : 0}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Click any bar to switch your active dashboard ward</span>
              <span className="font-mono text-slate-700 font-bold">City Median: {cityMedianRisk}/100</span>
            </div>
          </div>

          {/* Quick Ward Navigation & Actions */}
          <div className="cinematic-card p-5 space-y-4 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div>
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF7A18]" />
                  <span>Explore Heat Features</span>
                </h3>
                <p className="text-[11px] text-slate-500">Targeted tools for {areaName}</p>
              </div>

              <div className="space-y-2 text-xs">
                <Link
                  to="/forecast"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-cyan-400/50 flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <div>
                      <strong className="text-slate-900 block font-bold">7-Day Ward Forecast</strong>
                      <span className="text-[10px] text-slate-500">Weather & heat trajectory</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                </Link>

                <Link
                  to="/digital-twin"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-orange-400/50 flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-[#FF7A18]" />
                    <div>
                      <strong className="text-slate-900 block font-bold">3D Digital Twin Studio</strong>
                      <span className="text-[10px] text-slate-500">Simulate trees & cool roofs</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF7A18] transition-colors" />
                </Link>

                <Link
                  to="/heat-equity"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-purple-400/50 flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Priority Cooling Zones</strong>
                      <span className="text-[10px] text-slate-500">Municipal cooling investment</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </Link>
              </div>
            </div>

            <button
              onClick={openAreaSelector}
              className="w-full py-2.5 px-3 rounded-xl heat-btn-secondary text-xs font-bold text-center cursor-pointer shadow-sm"
            >
              Browse All 12 Kanpur Wards
            </button>
          </div>

        </div>

      </div>
    </ErrorBoundary>
  );
}
