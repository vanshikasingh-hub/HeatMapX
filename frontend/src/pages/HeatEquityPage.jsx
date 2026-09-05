import React, { useState, useEffect } from 'react';
import { fetchHeatEquity } from '../services/api';
import { Scale, Users, ShieldAlert, AlertTriangle, ArrowRight, Award, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeatEquityPage() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEquity() {
      setLoading(true);
      const res = await fetchHeatEquity();
      if (res && res.ranking) setRanking(res.ranking);
      setLoading(false);
    }
    loadEquity();
  }, []);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-purple-100 text-purple-800 font-mono text-xs px-2.5 py-0.5 rounded border border-purple-200 font-bold">
            CLIMATE JUSTICE & EQUITY MODEL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            Heat Equity & Vulnerability Matrix
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Prioritizing municipal cooling investments by multiplying physical heat hazard by population exposure density and demographic/structural vulnerability across <strong>Kanpur Nagar</strong> wards.
        </p>
      </div>

      {/* Formula Card */}
      <div className="p-6 rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-[#EAF6FF] space-y-3 shadow-xs">
        <span className="text-xs font-mono text-purple-900 font-bold uppercase tracking-widest block">
          Heat Equity Intervention Priority Formula
        </span>
        <div className="text-sm font-mono text-[#071A2B] font-extrabold bg-white p-3 rounded-xl border border-purple-200 inline-block shadow-xs">
          Equity Priority Index = (Hazard × 0.40) + (Population Density Factor × 3.5) + (Vulnerability Score × 0.35)
        </div>
        <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
          High-density or structurally vulnerable wards (e.g. Sisamau, Kanpur Central) receive top intervention priority even if unpopulated heavy industrial clusters register slightly higher raw surface temperatures.
        </p>
      </div>

      {/* Equity Priority Table */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#071A2B] uppercase tracking-wider">
            Kanpur Nagar Ward Equity Priority Ranking
          </h3>
          <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded font-bold">
            Ranked by Need
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EAF6FF] text-[#071A2B] border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Ward Name</th>
                <th className="p-3">Equity Priority Score</th>
                <th className="p-3">LST (°C)</th>
                <th className="p-3">Population Density</th>
                <th className="p-3">Vulnerability</th>
                <th className="p-3">Intervention Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {ranking.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F7FAFC] transition-colors">
                  <td className="p-3 font-mono font-extrabold text-[#FF7A18]">#{row.equityPriorityRank}</td>
                  <td className="p-3 font-bold text-[#071A2B]">{row.name} <span className="text-slate-400 font-normal">({row.wardName})</span></td>
                  <td className="p-3 font-mono font-extrabold text-purple-700 text-sm">{row.equityPriorityScore}</td>
                  <td className="p-3 font-mono font-bold text-red-600">{row.lst}°C</td>
                  <td className="p-3 font-mono text-slate-600">{row.populationDensity.toLocaleString()} /km²</td>
                  <td className="p-3 font-mono font-bold text-[#1479D1]">{row.vulnerabilityScore}/100</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      idx < 2 ? 'bg-red-100 text-red-700' : idx < 5 ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {row.recommendedPriority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
