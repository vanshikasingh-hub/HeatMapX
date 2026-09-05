import React, { useState } from 'react';
import { Thermometer, Sun, TreePine, Building2, Droplets, Mountain, Activity, Info, Zap, Sparkles } from 'lucide-react';

export default function PhysicsPage() {
  const [calcLst, setCalcLst] = useState(44.8);
  const [calcAir, setCalcAir] = useState(39.1);

  const deltaT = Number((calcLst - calcAir).toFixed(1));

  return (
    <div className="space-y-10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Page Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            PHYSICS-INFORMED AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">Microclimate Physics Layer</h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Bridging satellite thermal infrared observations (LST), meteorological air temperatures (T_air), and urban boundary-layer surface energy balance physics for <strong>Kanpur Nagar</strong>.
        </p>
      </div>

      {/* Hero Formula Banner - Deep Navy & Electric Cyan */}
      <div className="p-6 rounded-2xl border border-[#1479D1]/30 bg-gradient-to-br from-[#071A2B] to-[#0B2942] text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#28B8F2] font-bold uppercase tracking-widest">
              Thermal Radiance Physics
            </span>
            <h3 className="text-xl font-extrabold text-white">
              Land Surface Temp (LST) vs Ambient Air Temp (T_air)
            </h3>
          </div>
          <div className="bg-[#071A2B] border border-[#28B8F2]/40 px-5 py-2.5 rounded-xl text-[#28B8F2] font-mono text-base font-bold shadow-lg">
            ΔT = LST − T_air
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Satellite sensor LST measures thermodynamic skin temperature of urban surfaces (asphalt on GT Road, corrugated tin roofs in Sisamau, concrete terraces in Barra), while ambient air temperature (T_air) represents atmospheric conditions 2 meters above ground. In unshaded impervious industrial nodes like Panki, ΔT routinely exceeds <strong>+5.5°C to +7.0°C</strong>.
        </p>
      </div>

      {/* Interactive Delta T Sandbox */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[#071A2B] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF7A18]" />
              <span>Interactive Surface Heat Accumulation Calculator</span>
            </h3>
            <p className="text-xs text-slate-500">Test surface temperature vs ambient air temperature differentials</p>
          </div>
          <span className="text-xs font-mono bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full">
            Surface Trap: +{deltaT}°C
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#071A2B]">Land Surface Temperature (LST):</span>
              <span className="font-mono font-bold text-red-600">{calcLst}°C</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="50" 
              step="0.1" 
              value={calcLst} 
              onChange={(e) => setCalcLst(parseFloat(e.target.value))}
              className="w-full accent-[#FF7A18]"
            />
            <span className="text-[10px] text-slate-400 block">Kanpur Range: 31.8°C (Allen Forest) to 45.2°C (Panki)</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#071A2B]">Ambient Air Temperature (T_air):</span>
              <span className="font-mono font-bold text-[#1479D1]">{calcAir}°C</span>
            </div>
            <input 
              type="range" 
              min="28" 
              max="45" 
              step="0.1" 
              value={calcAir} 
              onChange={(e) => setCalcAir(parseFloat(e.target.value))}
              className="w-full accent-[#1479D1]"
            />
            <span className="text-[10px] text-slate-400 block">Atmospheric dry-bulb observation (2m above ground)</span>
          </div>
        </div>
      </div>

      {/* Physics Factor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Delta T Differential */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-red-500">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <Thermometer className="w-5 h-5" />
            <span>1. Delta T (ΔT) Differential</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            High positive ΔT indicates extreme sensible heat flux where dark asphalt and concrete absorb shortwave solar radiation during daylight and re-radiate infrared energy well past midnight.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            Kanpur Avg Delta T: <strong className="text-red-600">+2.4°C (Citywide) to +6.8°C (Central)</strong>
          </div>
        </div>

        {/* 2. Humidity & Heat Index */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-[#FF9F43]">
          <div className="flex items-center gap-2 text-[#FF9F43] font-bold text-sm">
            <Sun className="w-5 h-5" />
            <span>2. Humidity & Heat Index</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Combines ambient dry-bulb air temperature with relative humidity to calculate human apparent temperature (Heat Index). High vapor along the Ganges River restricts sweat evaporation.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            Heat Index Model: <strong className="text-[#FF7A18]">Rothfusz Multi-Term Equation</strong>
          </div>
        </div>

        {/* 3. NDVI & Evapotranspiration */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <TreePine className="w-5 h-5" />
            <span>3. NDVI & Latent Heat Flux</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vegetation foliage absorbs solar radiation for photosynthesis and releases water vapor through stomatal transpiration, cooling ambient microclimates by converting sensible into latent heat.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            Kanpur Cool Island: <strong className="text-emerald-700">Allen Forest Zoo (NDVI: 0.74, LST: 31.8°C)</strong>
          </div>
        </div>

        {/* 4. NDBI & Thermal Mass */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Building2 className="w-5 h-5" />
            <span>4. NDBI & Impervious Thermal Mass</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built-up concrete and asphalt possess high thermal mass and zero percolation. High NDBI traps heat inside narrow street canyons and impedes nocturnal cooling airflow.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            High Density Node: <strong className="text-amber-700">Kanpur Central (NDBI: 0.76)</strong>
          </div>
        </div>

        {/* 5. Soil Moisture Index */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-cyan-500">
          <div className="flex items-center gap-2 text-cyan-700 font-bold text-sm">
            <Droplets className="w-5 h-5" />
            <span>5. Soil Moisture Index (SMI)</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Surface soil moisture controls evaporative cooling efficiency. Desiccated urban dirt and paved lots have near-zero moisture, channeling all incident sunlight into severe surface heat.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            Water Buffer: <strong className="text-cyan-700">Ganga Barrage (SMI: 0.58)</strong>
          </div>
        </div>

        {/* 6. Surface Albedo & Reflectance */}
        <div className="glass-card p-5 space-y-3 border-t-4 border-t-yellow-500">
          <div className="flex items-center gap-2 text-yellow-600 font-bold text-sm">
            <Sun className="w-5 h-5" />
            <span>6. Surface Albedo & SRI</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Albedo denotes fraction of incoming shortwave solar energy reflected by roofs and roads. Low albedo (&lt; 0.15) surfaces absorb &gt; 85% of solar radiation. Cool roofs (SRI &gt; 80) bounce heat back to space.
          </p>
          <div className="bg-[#EAF6FF] p-3 rounded-xl text-[11px] text-[#071A2B] font-mono border border-[#1479D1]/20">
            Cooling Target: <strong className="text-yellow-700">Albedo &gt; 0.35 via reflective coatings</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
