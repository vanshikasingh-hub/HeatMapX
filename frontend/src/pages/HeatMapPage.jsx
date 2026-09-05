import React, { useState } from 'react';
import MapView from '../components/map/MapView';
import { Flame, Info, Filter, MapPin, Sparkles, Layers } from 'lucide-react';

export default function HeatMapPage() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#071A2B]">
      
      {/* Top Filter Bar */}
      <div className="bg-[#071A2B] border-b border-[#1479D1]/30 px-4 py-2.5 flex items-center justify-between gap-4 z-20 text-xs shrink-0 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-extrabold text-white">
            <Flame className="w-4 h-4 text-[#FF7A18] animate-pulse" />
            <span>Kanpur Nagar Thermal GIS Workspace</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline text-[11px]">
            Click any ward polygon to open spatial inspector · Toggle 12 environmental & community layers
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#28B8F2]" />
            <span>Kanpur: 26.4499° N, 80.3319° E</span>
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
