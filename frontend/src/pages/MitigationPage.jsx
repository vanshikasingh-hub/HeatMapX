import React, { useState, useEffect } from 'react';
import { fetchRecommendations, fetchLocations } from '../services/api';
import { Lightbulb, TreePine, Sun, Droplets, ShieldAlert, CheckCircle2, ArrowRight, Cpu, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MitigationPage() {
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState('loc_central');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) setLocations(locs.data);
    }
    init();
  }, []);

  useEffect(() => {
    async function loadRecs() {
      const res = await fetchRecommendations(selectedId);
      if (res && res.recommendations) setRecommendations(res.recommendations);
    }
    loadRecs();
  }, [selectedId]);

  const categories = ['All', 'Cool Surface', 'Green Infrastructure', 'Hydrological Cooling', 'Public Health / Equity', 'Ecosystem Restoration'];

  const filteredRecs = selectedCategory === 'All'
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            AI-ASSISTED PROTOTYPE RECOMMENDATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            AI Mitigation Advisor
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Tailored, data-driven urban cooling interventions matched to specific <strong>Kanpur Nagar</strong> ward heat risk levels, built-up intensity (NDBI), vegetation deficit (NDVI), and demographic exposure.
        </p>
      </div>

      {/* Ward Selector & Category Filter */}
      <div className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#071A2B]">Target Ward:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] font-bold"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name} ({loc.riskLevel})</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1479D1] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRecs.map((rec, idx) => (
          <div key={idx} className="glass-card p-6 space-y-4 flex flex-col justify-between hover:border-[#1479D1] transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#1479D1] font-bold uppercase tracking-wider">
                  {rec.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rec.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {rec.priority} Priority
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-[#071A2B] tracking-tight">{rec.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-[#F7FAFC]">
                  <span className="text-slate-400 block text-[10px]">Expected Thermal Impact</span>
                  <strong className="text-emerald-600 font-bold">{rec.expectedImpact}</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#F7FAFC]">
                  <span className="text-slate-400 block text-[10px]">Implementation Cost / Effort</span>
                  <strong className="text-[#071A2B] font-bold">{rec.cost || rec.difficulty}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to={`/digital-twin?location=${selectedId}`}
                  className="text-xs font-bold text-[#FF7A18] hover:underline flex items-center gap-1"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Simulate in Digital Twin</span>
                </Link>

                <Link
                  to="/citizen-action"
                  className="bg-[#1479D1] hover:bg-[#1062a8] text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-all"
                >
                  <span>Mobilize Action</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
