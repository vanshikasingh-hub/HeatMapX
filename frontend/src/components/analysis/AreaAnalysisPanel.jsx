import React from 'react';
import { X, Flame, Thermometer, ShieldAlert, Users, Layers, Lightbulb, ChevronRight, Activity, Cpu, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useArea } from '../../context/AreaContext';

export default function AreaAnalysisPanel({ location, onClose }) {
  const { currentArea, setAreaById } = useArea();
  if (!location) return null;

  const props = location.properties || location || {};

  const getRiskBadge = (score = 50) => {
    if (score >= 80) return { label: 'CRITICAL RISK', class: 'bg-red-500 text-white', fill: '#ef4444' };
    if (score >= 70) return { label: 'VERY HIGH RISK', class: 'bg-[#FF7A18] text-white', fill: '#FF7A18' };
    if (score >= 55) return { label: 'HIGH RISK', class: 'bg-[#FF9F43] text-slate-900', fill: '#FF9F43' };
    if (score >= 40) return { label: 'MODERATE RISK', class: 'bg-amber-400 text-slate-950', fill: '#f59e0b' };
    if (score >= 25) return { label: 'LOW RISK', class: 'bg-[#28B8F2] text-slate-950', fill: '#28B8F2' };
    return { label: 'VERY LOW RISK', class: 'bg-[#06b6d4] text-slate-950', fill: '#06b6d4' };
  };

  const isCurrentActive = currentArea && (props.id === currentArea.id || props.id === `loc_${currentArea.id}` || props.name === currentArea.name);
  const riskScore = isCurrentActive ? (currentArea.riskScore ?? props.riskScore ?? 28) : (props.riskScore ?? 28);
  const badge = getRiskBadge(riskScore);
  const lst = props.lst ?? 34.4;
  const airTemp = isCurrentActive ? (currentArea.airTemperature ?? props.airTemperature ?? 28.0) : (props.airTemperature ?? 28.0);
  const deltaT = Number((lst - airTemp).toFixed(1));

  // Dynamic driver breakdown based on actual area characteristics
  const drivers = [
    {
      factor: props.ndbi > 0.6 ? 'High Built-up Density (NDBI)' : 'Impervious Concrete Surfaces',
      contributionPct: props.ndbi > 0.6 ? 36 : 28,
      color: '#FF7A18'
    },
    {
      factor: lst > 42 ? 'Extreme Land Surface Temp (LST)' : 'Solar Radiation Absorption',
      contributionPct: lst > 42 ? 32 : 26,
      color: '#ef4444'
    },
    {
      factor: (props.ndvi || 0.2) < 0.2 ? 'Severe Tree Canopy Deficit' : 'Limited Vegetation Cooling',
      contributionPct: (props.ndvi || 0.2) < 0.2 ? 22 : 18,
      color: '#10b981'
    }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden text-xs text-slate-800 max-h-[580px] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
        <div>
          <span className="text-[10px] text-[#0284c7] uppercase tracking-widest font-extrabold block">
            Kanpur Ward Inspector
          </span>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{props.name || props.wardName || 'Kanpur Ward'}</h3>
          <span className="text-[10px] text-slate-500 font-mono">{props.wardName || 'Kanpur Nagar'}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
        
        {/* Heat Risk Score Hero Box */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 text-[11px] font-bold">Composite Risk Score</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.class}`}>{badge.label}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              {riskScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, riskScore))}%`, backgroundColor: badge.fill }}
            />
          </div>

          {/* Sub-component metrics */}
          <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-200/80 text-[10px] text-center">
            <div>
              <span className="text-slate-500 block">Hazard</span>
              <span className="font-bold text-[#ea580c] font-mono">{props.hazardScore || Math.round(riskScore * 0.95)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Exposure</span>
              <span className="font-bold text-[#d97706] font-mono">{props.exposureScore || Math.round(riskScore * 0.85)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vulnerability</span>
              <span className="font-bold text-[#0284c7] font-mono">{props.vulnerabilityScore || props.vulnerability || 65}</span>
            </div>
          </div>
        </div>

        {/* Thermal & Physics Metrics */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200/80 pb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Thermal & Physics Layer</span>
            </span>
            <Link to="/physics" className="text-[10px] text-[#0284c7] hover:underline font-bold">Physics View</Link>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 block text-[10px]">Surface Temp (LST) • Satellite</span>
              <span className="text-base font-bold text-red-600 font-mono">{lst}°C</span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 block text-[10px]">Air Temp • {isCurrentActive && currentArea?.isLiveWeather ? 'Live API' : 'Atmospheric'}</span>
              <span className="text-base font-bold text-amber-700 font-mono">{airTemp}°C</span>
            </div>

            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 col-span-2 flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">Delta T (LST − T_air)</span>
                <span className="text-slate-600 text-[10px] font-medium">Pavement Heat Storage Trap</span>
              </div>
              <span className="text-sm font-extrabold text-[#0284c7] font-mono">
                {Number(deltaT) > 0 ? `+${deltaT}` : deltaT}°C
              </span>
            </div>
          </div>
        </div>

        {/* Environmental Indices Grid */}
        <div className="space-y-1.5">
          <div className="text-slate-900 font-bold border-b border-slate-200/80 pb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Satellite Environmental Indices</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">NDVI</span>
              <span className="font-bold text-emerald-700 font-mono">{props.ndvi ?? '0.18'}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">NDBI</span>
              <span className="font-bold text-orange-700 font-mono">{props.ndbi ?? '0.62'}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">Albedo</span>
              <span className="font-bold text-amber-700 font-mono">{props.albedo ?? '0.14'}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">SMI</span>
              <span className="font-bold text-cyan-700 font-mono">{props.smi ?? '0.22'}</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">Elevation</span>
              <span className="font-bold text-slate-700 font-mono">{props.elevation || 126}m</span>
            </div>
            <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-200/70">
              <span className="text-slate-500 text-[10px] block font-medium">Heat Index</span>
              <span className="font-bold text-rose-700 font-mono">{props.heatIndex || 48.5}°C</span>
            </div>
          </div>
        </div>

        {/* Explainable AI Heat Drivers */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200/80 pb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Attributed Heat Drivers</span>
            </span>
            <Link to="/explain" className="text-[10px] text-[#0284c7] hover:underline font-bold">Full XAI</Link>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-2 text-xs">
            {drivers.map((d, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-700 font-medium truncate">{idx + 1}. {d.factor}</span>
                  <span className="font-mono font-bold" style={{ color: d.color }}>{d.contributionPct}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.contributionPct * 2}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Navigation Links */}
        <div className="pt-1 space-y-2">
          {props.id && currentArea?.id !== props.id ? (
            <button
              onClick={() => setAreaById(props.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Set as Active Dashboard Ward</span>
            </button>
          ) : props.id ? (
            <div className="w-full bg-blue-50 border border-blue-200 text-blue-800 font-bold py-1.5 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Active Dashboard Ward Context</span>
            </div>
          ) : null}

          <Link
            to="/digital-twin"
            className="w-full bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulate Cooling in 3D Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/mitigation"
            className="w-full bg-[#FF7A18] hover:bg-[#e0660e] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI Mitigation Advisor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
