import React from 'react';
import { X, Flame, Thermometer, ShieldAlert, Users, Layers, Lightbulb, ChevronRight, Activity, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AreaAnalysisPanel({ location, onClose }) {
  if (!location) return null;

  const props = location.properties || location;

  const getRiskBadge = (score) => {
    if (score >= 80) return { label: 'CRITICAL RISK', class: 'bg-red-500 text-white', fill: '#ef4444' };
    if (score >= 70) return { label: 'VERY HIGH RISK', class: 'bg-[#FF7A18] text-white', fill: '#FF7A18' };
    if (score >= 55) return { label: 'HIGH RISK', class: 'bg-[#FF9F43] text-slate-900', fill: '#FF9F43' };
    if (score >= 40) return { label: 'MODERATE RISK', class: 'bg-amber-400 text-slate-950', fill: '#f59e0b' };
    if (score >= 25) return { label: 'LOW RISK', class: 'bg-[#28B8F2] text-slate-950', fill: '#28B8F2' };
    return { label: 'VERY LOW RISK', class: 'bg-[#06b6d4] text-slate-950', fill: '#06b6d4' };
  };

  const badge = getRiskBadge(props.riskScore || 50);

  return (
    <div className="bg-[#071A2B]/95 backdrop-blur-md rounded-2xl border border-[#1479D1]/30 shadow-2xl overflow-hidden text-xs text-white max-h-[560px] flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-3.5 border-b border-slate-700/60 flex items-center justify-between bg-[#0B2942]">
        <div>
          <span className="text-[10px] text-[#28B8F2] uppercase tracking-widest font-extrabold block">
            Kanpur Ward Inspector
          </span>
          <h3 className="text-sm font-extrabold text-white tracking-tight">{props.name || props.wardName}</h3>
          <span className="text-[10px] text-slate-400 font-mono">{props.wardName}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          aria-label="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1">
        
        {/* Heat Risk Score Hero Box */}
        <div className="bg-[#0B2942] border border-[#1479D1]/30 rounded-xl p-3 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[11px] font-medium">Composite Risk Score</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.class}`}>{badge.label}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {props.riskScore || 50}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${props.riskScore || 50}%`, backgroundColor: badge.fill }}
            />
          </div>

          {/* Sub-component metrics */}
          <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-slate-700/60 text-[10px] text-center">
            <div>
              <span className="text-slate-400 block">Hazard</span>
              <span className="font-bold text-[#FF7A18] font-mono">{props.hazardScore || 78}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Exposure</span>
              <span className="font-bold text-[#FF9F43] font-mono">{props.exposureScore || 82}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Vulnerability</span>
              <span className="font-bold text-[#28B8F2] font-mono">{props.vulnerabilityScore || props.vulnerability || 65}</span>
            </div>
          </div>
        </div>

        {/* Thermal & Physics Metrics */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-200 font-bold border-b border-slate-700/60 pb-1">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Thermal & Physics Layer</span>
            </span>
            <Link to="/physics" className="text-[10px] text-[#28B8F2] hover:underline">Physics View</Link>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-[#0B2942]/70 p-2 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px]">Land Surface (LST)</span>
              <span className="text-base font-bold text-red-400 font-mono">{props.lst}°C</span>
            </div>

            <div className="bg-[#0B2942]/70 p-2 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 block text-[10px]">Ambient Air Temp</span>
              <span className="text-base font-bold text-amber-400 font-mono">{props.airTemperature}°C</span>
            </div>

            <div className="bg-[#0B2942]/70 p-2 rounded-lg border border-slate-700/50 col-span-2 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Delta T (LST − T_air)</span>
                <span className="text-slate-300 text-[10px]">Surface Heat Trap</span>
              </div>
              <span className="text-sm font-extrabold text-[#28B8F2] font-mono">
                +{(props.lst - props.airTemperature).toFixed(1)}°C
              </span>
            </div>
          </div>
        </div>

        {/* Environmental Indices Grid */}
        <div className="space-y-1.5">
          <div className="text-slate-200 font-bold border-b border-slate-700/60 pb-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#28B8F2]" />
            <span>Satellite Environmental Indices</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">NDVI</span>
              <span className="font-bold text-emerald-400 font-mono">{props.ndvi}</span>
            </div>
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">NDBI</span>
              <span className="font-bold text-orange-400 font-mono">{props.ndbi}</span>
            </div>
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">Albedo</span>
              <span className="font-bold text-yellow-300 font-mono">{props.albedo}</span>
            </div>
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">SMI</span>
              <span className="font-bold text-cyan-400 font-mono">{props.smi}</span>
            </div>
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">Elevation</span>
              <span className="font-bold text-slate-300 font-mono">{props.elevation || 126}m</span>
            </div>
            <div className="bg-[#0B2942]/70 p-1.5 rounded-lg border border-slate-700/50">
              <span className="text-slate-400 text-[10px] block">Heat Index</span>
              <span className="font-bold text-rose-400 font-mono">{props.heatIndex || 48.5}°C</span>
            </div>
          </div>
        </div>

        {/* Explainable AI Heat Drivers */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-200 font-bold border-b border-slate-700/60 pb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Ranked Heat Drivers</span>
            </span>
            <Link to="/explain" className="text-[10px] text-[#28B8F2] hover:underline">Full XAI</Link>
          </div>

          <div className="bg-[#0B2942]/70 p-2.5 rounded-lg border border-slate-700/50 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-300 font-medium truncate">1. Built-Up Density (NDBI)</span>
              <span className="text-[#FF7A18] font-mono font-bold">34%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#FF7A18] h-full rounded-full" style={{ width: '34%' }} />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-300 font-medium truncate">2. High Surface Temp (LST)</span>
              <span className="text-red-400 font-mono font-bold">29%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-400 h-full rounded-full" style={{ width: '29%' }} />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-300 font-medium truncate">3. Sparse Vegetation Canopy</span>
              <span className="text-emerald-400 font-mono font-bold">18%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: '18%' }} />
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Links */}
        <div className="pt-1 space-y-2">
          <Link
            to={`/digital-twin?location=${props.id}`}
            className="w-full bg-[#1479D1] hover:bg-[#1167b1] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Simulate Cooling in Digital Twin</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to={`/mitigation?location=${props.id}`}
            className="w-full bg-[#FF7A18] hover:bg-[#e0660e] text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>AI Mitigation Advisor</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
