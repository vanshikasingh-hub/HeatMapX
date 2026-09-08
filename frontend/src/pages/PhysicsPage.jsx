import React, { useState } from 'react';
import { Thermometer, Sun, TreePine, Building2, Droplets, Mountain, Activity, Info, Zap, Sparkles, Flame } from 'lucide-react';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';

export default function PhysicsPage() {
  const [calcLst, setCalcLst] = useState(44.8);
  const [calcAir, setCalcAir] = useState(39.1);

  const deltaT = Number((calcLst - calcAir).toFixed(1));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-800">
      
      {/* Page Header */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF7A18]" />
            PHYSICS-INFORMED URBAN CLIMATE MODEL
          </span>
          <span className="bg-sky-500/10 text-sky-700 font-mono text-xs px-2.5 py-1 rounded-full border border-sky-500/25 font-bold">
            SURFACE ENERGY BALANCE (ΔT)
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
          Microclimate Physics — <span className="heat-text-gradient">Surface Energy Balance</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Bridging satellite thermal infrared observations (LST), meteorological air temperatures (T_air), and urban boundary-layer surface energy balance physics for <strong>Kanpur Nagar</strong>.
        </p>
      </div>

      {/* Hero Formula Banner */}
      <div className="cinematic-card p-6 border-sky-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-sky-700 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              Thermal Radiance Physics
            </span>
            <h3 className="text-xl font-black text-slate-900 font-heading">
              Land Surface Temp (LST) vs Ambient Air Temp (T_air)
            </h3>
          </div>
          <div className="bg-sky-50 border border-sky-300 px-5 py-3 rounded-2xl text-sky-800 font-mono text-base font-black shadow-inner flex items-center gap-2">
            <span>ΔT = LST − T_air</span>
            <MetricInfoTooltip metricKey="deltaT" />
          </div>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          Satellite sensor LST measures thermodynamic skin temperature of urban surfaces (asphalt on GT Road, corrugated tin roofs in Sisamau, concrete terraces in Barra), while ambient air temperature (T_air) represents atmospheric conditions 2 meters above ground. In unshaded impervious industrial nodes like Panki, ΔT routinely exceeds <strong>+5.5°C to +7.0°C</strong>.
        </p>
      </div>

      {/* Interactive Delta T Sandbox */}
      <div className="cinematic-card p-6 space-y-5 border-orange-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2 font-heading">
              <Zap className="w-4 h-4 text-[#FF7A18]" />
              <span>Interactive Surface Heat Accumulation Calculator</span>
            </h3>
            <p className="text-xs text-slate-600">Test surface temperature vs ambient air temperature differentials</p>
          </div>
          <span className="text-xs font-mono bg-red-100 border border-red-200 text-red-600 font-black px-3.5 py-1 rounded-full self-start sm:self-auto">
            Surface Trap: +{deltaT}°C
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <span>Land Surface Temperature (LST):</span>
                <MetricInfoTooltip metricKey="lst" />
              </span>
              <span className="font-mono font-black text-red-600 text-sm">{calcLst}°C</span>
            </div>
            <input 
              type="range" 
              min="30" 
              max="50" 
              step="0.1" 
              value={calcLst} 
              onChange={(e) => setCalcLst(parseFloat(e.target.value))}
              className="w-full accent-[#FF7A18] bg-slate-200 rounded-lg h-2 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Kanpur Range: 31.8°C (Allen Forest) to 45.2°C (Panki)</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-700">Ambient Air Temperature (T_air):</span>
              <span className="font-mono font-black text-[#0284c7] text-sm">{calcAir}°C</span>
            </div>
            <input 
              type="range" 
              min="28" 
              max="45" 
              step="0.1" 
              value={calcAir} 
              onChange={(e) => setCalcAir(parseFloat(e.target.value))}
              className="w-full accent-[#0284c7] bg-slate-200 rounded-lg h-2 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block">Atmospheric dry-bulb observation (2m above ground)</span>
          </div>
        </div>
      </div>

      {/* Physics Factor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Delta T Differential */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-red-500 shadow-sm">
          <div className="flex items-center justify-between text-red-600 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span className="text-slate-900 font-black">1. Delta T (ΔT) Differential</span>
            </div>
            <MetricInfoTooltip metricKey="deltaT" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            High positive ΔT indicates extreme sensible heat flux where dark asphalt and concrete absorb shortwave solar radiation during daylight and re-radiate infrared energy well past midnight.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            Kanpur Avg Delta T: <strong className="text-red-600">+2.4°C (Citywide) to +6.8°C (Central)</strong>
          </div>
        </div>

        {/* 2. Humidity & Heat Index */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-[#FF9F43] shadow-sm">
          <div className="flex items-center justify-between text-[#d97706] font-bold text-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-[#d97706]" />
              <span className="text-slate-900 font-black">2. Humidity & Heat Index</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Combines ambient dry-bulb air temperature with relative humidity to calculate human apparent temperature (Heat Index). High vapor along the Ganges River restricts sweat evaporation.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            Heat Index Model: <strong className="text-[#FF7A18]">Rothfusz Multi-Term Equation</strong>
          </div>
        </div>

        {/* 3. NDVI & Evapotranspiration */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-emerald-500 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 font-bold text-sm">
            <div className="flex items-center gap-2">
              <TreePine className="w-5 h-5 text-emerald-600" />
              <span className="text-slate-900 font-black">3. NDVI & Latent Heat Flux</span>
            </div>
            <MetricInfoTooltip metricKey="ndvi" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vegetation foliage absorbs solar radiation for photosynthesis and releases water vapor through stomatal transpiration, cooling ambient microclimates by converting sensible into latent heat.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            Kanpur Cool Island: <strong className="text-emerald-700">Allen Forest Zoo (NDVI: 0.74, LST: 31.8°C)</strong>
          </div>
        </div>

        {/* 4. NDBI & Thermal Mass */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-amber-500 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span className="text-slate-900 font-black">4. NDBI & Impervious Mass</span>
            </div>
            <MetricInfoTooltip metricKey="ndbi" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built-up concrete and asphalt possess high thermal mass and zero percolation. High NDBI traps heat inside narrow street canyons and impedes nocturnal cooling airflow.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            High Density Node: <strong className="text-amber-700">Kanpur Central (NDBI: 0.76)</strong>
          </div>
        </div>

        {/* 5. Soil Moisture Index */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-sky-500 shadow-sm">
          <div className="flex items-center justify-between text-sky-700 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <span className="text-slate-900 font-black">5. Soil Moisture Index (SMI)</span>
            </div>
            <MetricInfoTooltip metricKey="smi" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Surface soil moisture controls evaporative cooling efficiency. Desiccated urban dirt and paved lots have near-zero moisture, channeling all incident sunlight into severe surface heat.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            Water Buffer: <strong className="text-sky-700">Ganga Barrage (SMI: 0.58)</strong>
          </div>
        </div>

        {/* 6. Surface Albedo & Reflectance */}
        <div className="cinematic-card p-5 space-y-3.5 border border-slate-200/80 border-t-4 border-t-yellow-500 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 font-bold text-sm">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-600" />
              <span className="text-slate-900 font-black">6. Surface Albedo & SRI</span>
            </div>
            <MetricInfoTooltip metricKey="albedo" />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Albedo denotes fraction of incoming shortwave solar energy reflected by roofs and roads. Low albedo (&lt; 0.15) surfaces absorb &gt; 85% of solar radiation. Cool roofs (SRI &gt; 80) bounce heat back to space.
          </p>
          <div className="bg-slate-50/90 p-3 rounded-xl text-xs text-slate-700 font-mono border border-slate-200">
            Cooling Target: <strong className="text-amber-700">Albedo &gt; 0.35 via reflective coatings</strong>
          </div>
        </div>

      </div>

    </div>
  );
}
