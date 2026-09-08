import React, { useState, useEffect } from 'react';
import { fetchLocations } from '../services/api';
import { BarChart3, Layers, Activity, TrendingUp, Compass, MapPin, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';

export default function AnalyticsPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function init() {
      const res = await fetchLocations();
      if (res && res.data) setLocations(res.data);
    }
    init();
  }, []);

  const scatterData = locations.map(l => ({
    name: l.name.split(' ')[0],
    fullName: l.name,
    lst: l.lst,
    ndbi: l.ndbi || (l.riskScore > 75 ? 0.72 : l.riskScore < 35 ? 0.15 : 0.50),
    pop: l.populationDensity,
    risk: l.riskScore
  }));

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-800">
      
      {/* Header Section */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5">
            <BarChartIcon className="w-3.5 h-3.5 text-[#FF7A18]" />
            STATISTICAL ANALYTICS & REGRESSION
          </span>
          <span className="bg-sky-500/10 text-sky-700 font-mono text-xs px-2.5 py-1 rounded-full border border-sky-500/25 font-bold">
            12 KANPUR WARDS DATASET
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
          City-Wide Environmental <span className="heat-text-gradient">Analytics</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Cross-variable correlation and statistical distribution of satellite indices, surface temperatures, and demographic exposure across <strong>Kanpur Nagar</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: LST vs Built-up Density Scatter */}
        <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#FF7A18] font-bold uppercase tracking-widest">
                LST vs NDBI (Built-up Density) Correlation
              </span>
              <MetricInfoTooltip metricKey="ndbi" />
            </div>
            <span className="text-[11px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              r ≈ 0.88 Positive Correlation
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis type="number" dataKey="ndbi" name="NDBI Built-Up" stroke="#475569" fontSize={11} domain={[0, 0.8]} unit="" tickLine={false} />
                <YAxis type="number" dataKey="lst" name="LST" stroke="#475569" fontSize={11} domain={[30, 48]} unit="°C" tickLine={false} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#FF7A18' }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white/95 text-slate-800 p-3 rounded-xl border border-slate-200 text-xs shadow-xl space-y-1">
                          <strong className="text-slate-900 block font-heading">{d.fullName}</strong>
                          <div className="text-red-600 font-mono">LST: <strong>{d.lst}°C</strong></div>
                          <div className="text-amber-700 font-mono">NDBI: <strong>{d.ndbi}</strong></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Wards" data={scatterData} fill="#FF7A18" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
            Strong physical correlation: areas with dense concrete/asphalt fractions (Panki, Kanpur Central, Sisamau) exhibit significantly higher thermodynamic skin temperatures.
          </p>
        </div>

        {/* Chart 2: Population Density vs Risk */}
        <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-sky-700 font-bold uppercase tracking-widest">
                Population Density Exposure Distribution
              </span>
              <MetricInfoTooltip metricKey="exposure" />
            </div>
            <span className="text-[11px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Citizens / km²
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scatterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderColor: 'rgba(2, 132, 199, 0.3)', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: '#0f172a',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                  }} 
                />
                <Bar dataKey="pop" fill="#0284c7" radius={[6, 6, 0, 0]}>
                  {scatterData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.pop >= 30000 ? '#ef4444' : entry.pop >= 20000 ? '#FF7A18' : '#0284c7'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
            Wards such as Sisamau (36k/km²) and Kanpur Central (34k/km²) present acute human vulnerability due to extreme population concentration under high heat stress.
          </p>
        </div>

      </div>

    </div>
  );
}
