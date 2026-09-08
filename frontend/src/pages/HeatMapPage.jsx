import React, { useState } from 'react';
import MapView from '../components/map/MapView';
import { Flame, MapPin, Sparkles, Crosshair, Layers } from 'lucide-react';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';

export default function HeatMapPage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const { currentArea, openAreaSelector, locationSource } = useArea();

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#f0f9ff]">
      
      {/* Top Filter & Context Bar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between gap-4 z-20 text-xs shrink-0 text-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-black text-slate-900 tracking-wide">
            <Flame className="w-4 h-4 text-[#FF7A18] animate-pulse" />
            <span className="font-heading">KANPUR THERMAL MAP</span>
            <span className="text-[10px] bg-orange-50 text-[#ea580c] border border-orange-200 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
              12 Wards
            </span>
          </div>
          <span className="text-slate-300 hidden md:inline">|</span>
          <span className="text-slate-500 hidden lg:inline text-[11px] font-medium">
            Click any neighborhood polygon to inspect localized heat telemetry
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Area Badge */}
          {currentArea && (
            <button
              onClick={openAreaSelector}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#ea580c] hover:bg-orange-100 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              title="Change focused Kanpur Ward"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>📍 {currentArea.name}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">({currentArea.riskScore}/100)</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 text-slate-600 font-mono text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>26.4499° N, 80.3319° E</span>
          </div>
        </div>
      </div>

      {/* Main Geospatial Map View */}
      <div className="flex-1 relative">
        <MapView
          fullScreen={true}
          onSelectArea={(feature) => setSelectedArea(feature)}
        />
      </div>

    </div>
  );
}
