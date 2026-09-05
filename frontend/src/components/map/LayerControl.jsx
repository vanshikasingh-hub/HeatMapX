import React from 'react';
import { 
  Flame, 
  Thermometer, 
  TreePine, 
  Building2, 
  Mountain, 
  Droplet, 
  Sun, 
  Users, 
  ShieldAlert, 
  Route, 
  Car,
  Sparkles
} from 'lucide-react';

export default function LayerControl({ activeLayer, onSelectLayer }) {
  const layers = [
    { id: 'risk', label: 'Heat Risk (Composite)', icon: Flame, badge: '0-100 Score', color: 'text-[#FF7A18]' },
    { id: 'lst', label: 'Land Surface Temp (LST)', icon: Thermometer, badge: '°C Thermal', color: 'text-red-500' },
    { id: 'ndvi', label: 'Vegetation Index (NDVI)', icon: TreePine, badge: '-1 to +1', color: 'text-emerald-500' },
    { id: 'ndbi', label: 'Built-up Index (NDBI)', icon: Building2, badge: 'Impervious', color: 'text-amber-500' },
    { id: 'dem', label: 'Elevation (DEM)', icon: Mountain, badge: 'Meters', color: 'text-cyan-500' },
    { id: 'smi', label: 'Soil Moisture (SMI)', icon: Droplet, badge: 'Moisture', color: 'text-blue-500' },
    { id: 'albedo', label: 'Surface Albedo', icon: Sun, badge: 'Reflectance', color: 'text-yellow-500' },
    { id: 'pop', label: 'Population Exposure', icon: Users, badge: 'Density', color: 'text-purple-500' },
    { id: 'vuln', label: 'Social Vulnerability', icon: ShieldAlert, badge: 'Vulnerability', color: 'text-rose-500' },
    { id: 'anth', label: 'Anthropogenic Heat', icon: Car, badge: 'Traffic & Grid', color: 'text-orange-400' },
    { id: 'roads', label: 'Arterial Road Network', icon: Route, badge: 'Corridors', color: 'text-slate-400' },
    { id: 'actions', label: '🌱 Citizen Actions', icon: Sparkles, badge: 'Community', color: 'text-emerald-400', highlight: true }
  ];

  return (
    <div className="bg-[#0B2942]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1479D1]/30 shadow-xl max-w-xs text-xs text-white">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700/60">
        <span className="font-extrabold uppercase text-[11px] tracking-wider text-[#28B8F2] flex items-center gap-1.5">
          <span>Geospatial Layers</span>
        </span>
        <span className="text-[10px] bg-[#1479D1]/30 text-white font-mono px-1.5 py-0.5 rounded">
          {layers.length} Layers
        </span>
      </div>

      <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
        {layers.map((l) => {
          const Icon = l.icon;
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => onSelectLayer(l.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all text-left ${
                isActive
                  ? l.highlight 
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-[#1479D1] text-white font-bold shadow-md'
                  : l.highlight
                    ? 'text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30'
                    : 'hover:bg-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : l.color}`} />
                <span className="truncate max-w-[130px]">{l.label}</span>
              </div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {l.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
