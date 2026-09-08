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
    { id: 'risk', label: 'Heat Risk Score', icon: Flame, badge: 'Composite', color: 'text-[#FF7A18]' },
    { id: 'lst', label: 'Land Surface Temp (LST)', icon: Thermometer, badge: 'Thermal Skin', color: 'text-red-400' },
    { id: 'ndvi', label: 'Vegetation Canopy (NDVI)', icon: TreePine, badge: 'Canopy Density', color: 'text-emerald-400' },
    { id: 'ndbi', label: 'Built-up Density (NDBI)', icon: Building2, badge: 'Impervious', color: 'text-amber-400' },
    { id: 'pop', label: 'Population Exposure', icon: Users, badge: 'Density / km²', color: 'text-purple-400' },
    { id: 'vuln', label: 'Socio-Demographic Vulnerability', icon: ShieldAlert, badge: 'Vulnerability', color: 'text-rose-400' },
    { id: 'smi', label: 'Soil Moisture Index (SMI)', icon: Droplet, badge: 'Latent Cooling', color: 'text-cyan-400' },
    { id: 'albedo', label: 'Surface Reflectance (Albedo)', icon: Sun, badge: 'Solar Albedo', color: 'text-yellow-400' },
    { id: 'dem', label: 'Elevation (DEM)', icon: Mountain, badge: 'Meters ASL', color: 'text-sky-400' },
    { id: 'anth', label: 'Anthropogenic Heat Proxy', icon: Car, badge: 'Traffic / HVAC', color: 'text-orange-400' },
    { id: 'roads', label: 'Arterial Road Network', icon: Route, badge: 'Corridors', color: 'text-zinc-400' },
    { id: 'actions', label: '🌱 Citizen Cooling Actions', icon: Sparkles, badge: 'Verified Interventions', color: 'text-emerald-400', highlight: true }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-xl p-3 rounded-2xl border border-orange-200/90 shadow-xl max-w-xs text-xs text-slate-800">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
        <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FF7A18]" />
          <span>Active Layer</span>
        </span>
        <span className="text-[10px] bg-orange-50 text-[#ea580c] font-mono px-2 py-0.5 rounded-full border border-orange-200 font-bold">
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
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all text-left cursor-pointer ${
                isActive
                  ? l.highlight 
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white font-bold shadow-heat-glow-sm'
                  : l.highlight
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-medium'
                    : 'hover:bg-slate-100 text-slate-700 font-medium'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : l.color}`} />
                <span className="text-[11px] truncate max-w-[150px]">{l.label}</span>
              </div>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                isActive ? 'bg-black/20 text-white' : 'text-zinc-500 bg-white/[0.02]'
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
