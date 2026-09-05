import React, { useEffect, useState } from 'react';
import MapView from '../components/map/MapView';
import { fetchEnvironmentalFactors, fetchLocations } from '../services/api';
import { 
  Flame, 
  Thermometer, 
  TreePine, 
  AlertTriangle, 
  Activity, 
  Layers, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Cpu,
  Building2,
  Users,
  Compass,
  MapPin,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [locations, setLocations] = useState([]);
  const [activeTab, setActiveTab] = useState('mvp'); // 'mvp', 'phase2', 'future'

  useEffect(() => {
    async function loadData() {
      const factors = await fetchEnvironmentalFactors();
      if (factors && factors.summary) setSummary(factors.summary);

      const locs = await fetchLocations();
      if (locs && locs.data) setLocations(locs.data);
    }
    loadData();
  }, []);

  const criticalHotspots = locations.filter(l => l.riskScore >= 80).length;

  const chartData = locations.map(l => ({
    name: l.name.split(' ')[0],
    fullName: l.name,
    risk: l.riskScore,
    lst: l.lst,
    air: l.airTemperature
  }));

  return (
    <div className="space-y-8 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header & Stage Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
              Heat Intelligence Dashboard
            </h1>
            <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
              Kanpur Nagar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time urban heat risk indicators, thermal satellite proxy indices, and cooling decision support.
          </p>
        </div>

        {/* Development Stage Nav Pills */}
        <div className="flex items-center gap-1.5 bg-[#0B2942] p-1.5 rounded-xl border border-[#1479D1]/30 text-xs shadow-md">
          <button
            onClick={() => setActiveTab('mvp')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mvp'
                ? 'bg-[#FF7A18] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>CORE MVP</span>
          </button>

          <button
            onClick={() => setActiveTab('phase2')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'phase2'
                ? 'bg-[#1479D1] text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>PHASE 2</span>
          </button>

          <button
            onClick={() => setActiveTab('future')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'future'
                ? 'bg-[#28B8F2] text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>FUTURE VISION</span>
          </button>
        </div>
      </div>

      {/* Feature Stage Banners */}
      {activeTab === 'mvp' && (
        <div className="bg-[#EAF6FF] border border-[#1479D1]/30 rounded-xl p-3.5 text-xs text-[#071A2B] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF7A18] text-white font-extrabold px-2 py-0.5 rounded text-[10px]">CORE MVP ACTIVE</span>
            <span>Hotspot Detection, Transparent Heat Risk Scoring, 7-Day Forecasting, and AI Mitigation Advisor for Kanpur Nagar.</span>
          </div>
          <span className="text-[#1479D1] font-bold text-[11px] hidden sm:inline">Production Ready</span>
        </div>
      )}

      {activeTab === 'phase2' && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3.5 text-xs text-cyan-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#28B8F2] text-slate-900 font-extrabold px-2 py-0.5 rounded text-[10px]">PHASE 2</span>
            <span>Microclimate Physics Layer (Delta T), Digital Twin Scenario Simulator, Dynamic Rule-Based Explainable AI, and TEE Security Ready.</span>
          </div>
          <span className="text-cyan-700 font-bold text-[11px] hidden sm:inline">Prototype Available</span>
        </div>
      )}

      {activeTab === 'future' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 text-xs text-purple-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">FUTURE VISION</span>
            <span>Cool Route Pedestrian Planner, Heat Equity Index, Citizen Climate Gamification, and ISRO Bhuvan / IMD Data Pipeline.</span>
          </div>
          <span className="text-purple-700 font-bold text-[11px] hidden sm:inline">Evolving Architecture</span>
        </div>
      )}

      {/* UPGRADED KPI CARDS - Blue + Orange Visual Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Surface Temp */}
        <div className="glass-card p-4 space-y-2 border-t-4 border-t-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Surface Temp (LST)</span>
            <Thermometer className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#071A2B] font-mono">
              {summary ? `${summary.avgLst}°C` : '39.2°C'}
            </span>
            <span className="text-[10px] text-red-600 font-semibold font-mono">
              ΔT +{summary ? summary.avgDeltaT : '2.4'}°C
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block">Kanpur Citywide Average LST</span>
        </div>

        {/* Heat Risk */}
        <div className="glass-card p-4 space-y-2 border-t-4 border-t-[#FF7A18]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peak Heat Risk</span>
            <Flame className="w-4 h-4 text-[#FF7A18]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#FF7A18] font-mono">88 / 100</span>
            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold">CRITICAL</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Kanpur Central / Sisamau Core</span>
        </div>

        {/* Vegetation NDVI */}
        <div className="glass-card p-4 space-y-2 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Vegetation (NDVI)</span>
            <TreePine className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#071A2B] font-mono">
              {summary ? summary.avgNdvi : '0.30'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Allen Forest: 0.74</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Canopy cooling index</span>
        </div>

        {/* Urban Density NDBI */}
        <div className="glass-card p-4 space-y-2 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Built-Up Density</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#071A2B] font-mono">
              {summary ? summary.avgNdbi : '0.50'}
            </span>
            <span className="text-[10px] text-amber-600 font-semibold">High Impervious</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Concrete thermal storage</span>
        </div>

        {/* Hotspots & Exposure */}
        <div className="glass-card p-4 space-y-2 border-t-4 border-t-[#1479D1]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Critical Hotspots</span>
            <ShieldAlert className="w-4 h-4 text-[#1479D1]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#1479D1] font-mono">
              {criticalHotspots || 4}
            </span>
            <span className="text-[10px] text-slate-500">Wards at risk</span>
          </div>
          <span className="text-[11px] text-slate-500 block">Over 110,000 citizens exposed</span>
        </div>

      </div>

      {/* MAP SECTION - Centerpiece */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-[#071A2B] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#FF7A18]" />
              <span>Kanpur Nagar Interactive Geospatial Map</span>
            </h2>
            <p className="text-xs text-slate-500">Click any ward polygon to open the Area Inspector</p>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-[#1479D1] hover:underline flex items-center gap-1"
          >
            <span>Full GIS Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <MapView />
      </div>

      {/* CHARTS & WARD RANKINGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Distribution Chart */}
        <div className="glass-card p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#071A2B]">Heat Risk Score Across Kanpur Wards</h3>
              <p className="text-[11px] text-slate-500">Comparison of composite risk score (0-100) per monitored zone</p>
            </div>
            <span className="text-[10px] font-mono bg-[#1479D1]/10 text-[#1479D1] px-2 py-0.5 rounded font-bold">
              12 Wards
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} angle={-35} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0B2942] text-white p-2.5 rounded-lg border border-[#1479D1]/40 text-xs shadow-xl">
                          <strong className="block text-slate-100">{data.fullName}</strong>
                          <span className="text-[#FF7A18] font-bold">Risk Score: {data.risk}/100</span><br />
                          <span className="text-red-400">LST: {data.lst}°C</span> | <span className="text-[#28B8F2]">Air: {data.air}°C</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.risk >= 80 ? '#ef4444' : entry.risk >= 65 ? '#FF7A18' : entry.risk >= 45 ? '#FF9F43' : entry.risk >= 25 ? '#28B8F2' : '#06b6d4'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Intervention Ward Leaderboard */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <h3 className="font-extrabold text-sm text-[#071A2B]">Priority Cooling Interventions</h3>
            <p className="text-[11px] text-slate-500">Ranked by combined thermal hazard & population vulnerability</p>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
            {locations.slice(0, 6).map((loc, idx) => (
              <div 
                key={loc.id} 
                className="p-2.5 rounded-xl border border-slate-100 bg-[#F7FAFC] flex items-center justify-between hover:border-[#1479D1]/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx < 2 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div>
                    <strong className="block text-[#071A2B] text-xs truncate max-w-[130px]">{loc.name}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">LST {loc.lst}°C</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-[#FF7A18] font-mono">{loc.riskScore}/100</span>
                  <span className="block text-[9px] text-slate-400">{loc.riskLevel}</span>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/mitigation"
            className="w-full bg-[#1479D1] hover:bg-[#1062a8] text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <span>Open AI Mitigation Advisor</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
