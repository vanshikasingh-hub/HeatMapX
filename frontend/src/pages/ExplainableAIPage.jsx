import React, { useState, useEffect } from 'react';
import { fetchLocations, fetchLocationById } from '../services/api';
import { Activity, Sparkles, BarChart2, Info, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function ExplainableAIPage() {
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState('loc_central');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) {
        setLocations(locs.data);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function loadDetails() {
      if (!selectedId) return;
      setLoading(true);
      const res = await fetchLocationById(selectedId);
      if (res && res.data) {
        setDetails(res.data);
      }
      setLoading(false);
    }
    loadDetails();
  }, [selectedId]);

  const drivers = details?.explainability?.drivers || [
    { factor: "High Built-Up Density (NDBI)", percentage: 36 },
    { factor: "High Surface Temp (LST)", percentage: 29 },
    { factor: "Low Vegetation Cover (NDVI)", percentage: 18 },
    { factor: "Low Soil Moisture (SMI)", percentage: 11 },
    { factor: "Low Surface Albedo", percentage: 6 }
  ];

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF7A18]/10 text-[#FF7A18] font-mono text-xs px-2.5 py-0.5 rounded border border-[#FF7A18]/20 font-bold">
            RULE-BASED EXPLAINABILITY PROTOTYPE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            "Why Is This Area Hot?" — Explainable AI (XAI)
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Dynamic factor attribution engine decomposing Kanpur Nagar's thermal risk scores into transparent, physics-based drivers.
        </p>
      </div>

      {/* Ward Selector Bar */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#071A2B] block">Select Kanpur Nagar Ward / Zone for Analysis:</label>
          <p className="text-[11px] text-slate-500">Choose any monitored zone to inspect its ranked thermal drivers.</p>
        </div>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] font-bold w-full sm:w-80"
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name} ({loc.riskLevel} - Score {loc.riskScore})
            </option>
          ))}
        </select>
      </div>

      {/* Main Analysis Cards */}
      {details && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart Column */}
          <div className="lg:col-span-2 glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#FF7A18] uppercase tracking-widest font-bold">
                  Driver Attribution Breakdown
                </span>
                <h3 className="text-xl font-extrabold text-[#071A2B] mt-0.5">{details.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
                details.risk.score >= 80 ? 'bg-red-100 text-red-700' : 'bg-[#FF7A18]/10 text-[#FF7A18]'
              }`}>
                Risk Score {details.risk.score}/100 ({details.risk.level})
              </span>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={drivers} margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                  <XAxis type="number" stroke="#64748b" fontSize={10} domain={[0, 50]} unit="%" />
                  <YAxis type="category" dataKey="factor" stroke="#1e293b" fontSize={11} width={180} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-[#0B2942] text-white p-2.5 rounded-lg border border-[#1479D1]/40 text-xs shadow-xl">
                            <strong className="block text-[#FF9F43]">{d.factor}</strong>
                            <span>Contribution: <strong>{d.percentage}%</strong></span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 6, 6, 0]}>
                    {drivers.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#FF7A18' : index === 1 ? '#ef4444' : index === 2 ? '#10b981' : '#28B8F2'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Plain Language Explanation Box */}
            <div className="p-4 rounded-xl bg-[#EAF6FF] border border-[#1479D1]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#1479D1]">
                <Sparkles className="w-4 h-4 text-[#FF7A18]" />
                <span>Automated Causal Synthesis</span>
              </div>
              <p className="text-xs text-[#071A2B] leading-relaxed">
                {details.explainability.explanation}
              </p>
              <span className="text-[10px] text-slate-400 block pt-1">
                Note: Generated via HeatMapX Prototype Rule-Based Explainability Engine. Architecture is structured to plug into fine-tuned climate LLMs or SHAP/LIME ML explainers in future phases.
              </span>
            </div>
          </div>

          {/* Physical Values Column */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="font-extrabold text-sm text-[#071A2B] border-b border-slate-100 pb-2">
              Underlying Zone Metrics
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">Land Surface Temp (LST):</span>
                <strong className="text-red-600 font-mono">{details.physics.lst}°C</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">Air Temperature:</span>
                <strong className="text-amber-600 font-mono">{details.physics.airTemperature}°C</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">Delta T Differential:</span>
                <strong className="text-[#1479D1] font-mono">+{details.physics.deltaT}°C</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">NDBI (Built-up):</span>
                <strong className="text-orange-600 font-mono">{details.physics.ndbi}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">NDVI (Canopy):</span>
                <strong className="text-emerald-600 font-mono">{details.physics.ndvi}</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">Population Density:</span>
                <strong className="text-[#071A2B] font-mono">{details.demographics.populationDensity} / km²</strong>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F7FAFC]">
                <span className="text-slate-500">Vulnerability Score:</span>
                <strong className="text-purple-600 font-mono">{details.demographics.vulnerabilityScore} / 100</strong>
              </div>
            </div>

            {/* Quick Link to AI Mitigation */}
            <div className="pt-2">
              <a
                href={`/mitigation?location=${details.id}`}
                className="w-full bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] hover:from-[#ff6f00] hover:to-[#ff8f24] text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <span>View AI Cooling Recommendations</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
