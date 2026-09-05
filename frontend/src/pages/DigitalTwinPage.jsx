import React, { useState, useEffect } from 'react';
import { runSimulation, fetchLocations } from '../services/api';
import { Cpu, Play, RefreshCw, ArrowRight, ShieldCheck, Thermometer, TreePine, Sun, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DigitalTwinPage() {
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState('loc_central');

  // Sliders
  const [treeCover, setTreeCover] = useState(25);
  const [albedo, setAlbedo] = useState(40);
  const [coolRoofs, setCoolRoofs] = useState(50);
  const [waterFeatures, setWaterFeatures] = useState(true);
  const [builtReduction, setBuiltReduction] = useState(10);

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) setLocations(locs.data);
    }
    init();
  }, []);

  const executeSimulation = async () => {
    setLoading(true);
    const params = {
      treeCoverIncreasePct: treeCover,
      albedoIncreasePct: albedo,
      coolRoofCoveragePct: coolRoofs,
      waterFeatureAddition: waterFeatures,
      builtUpReductionPct: builtReduction
    };
    const res = await runSimulation(selectedId, params);
    if (res && res.result) {
      setSimResult(res.result);
    }
    setLoading(false);
  };

  useEffect(() => {
    executeSimulation();
  }, [selectedId]);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            PROTOTYPE SCENARIO SIMULATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            Digital Twin — "What-If" Cooling Simulator
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Interactive microclimate scenario simulation modeling tree canopy expansion, cool roof deployment, and surface albedo shifts prior to capital expenditure in <strong>Kanpur Nagar</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Column */}
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-[#071A2B] uppercase tracking-wider">Intervention Parameters</span>
            <Cpu className="w-4 h-4 text-[#1479D1]" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#071A2B] block">Target Kanpur Ward:</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] w-full font-bold"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name} ({loc.riskLevel})</option>
              ))}
            </select>
          </div>

          {/* Slider 1: Tree Canopy */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Urban Tree Canopy Cover:</span>
              <span className="text-emerald-600 font-mono font-bold">+{treeCover}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={treeCover}
              onChange={(e) => setTreeCover(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Slider 2: Albedo */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Surface Reflectance (Albedo):</span>
              <span className="text-[#FF9F43] font-mono font-bold">+{albedo}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={albedo}
              onChange={(e) => setAlbedo(Number(e.target.value))}
              className="w-full accent-[#FF7A18]"
            />
          </div>

          {/* Slider 3: Cool Roofs */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600">Cool Roof Coverage:</span>
              <span className="text-[#1479D1] font-mono font-bold">{coolRoofs}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={coolRoofs}
              onChange={(e) => setCoolRoofs(Number(e.target.value))}
              className="w-full accent-[#1479D1]"
            />
          </div>

          {/* Toggle: Water Features */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">Water Misting / Evaporative Kund:</span>
            <button
              onClick={() => setWaterFeatures(!waterFeatures)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                waterFeatures ? 'bg-[#1479D1] text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {waterFeatures ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Run Button */}
          <button
            onClick={executeSimulation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1479D1] to-[#28B8F2] hover:from-[#1062a8] hover:to-[#229ece] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Play className={`w-4 h-4 fill-white ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Running Scenario Simulation...' : 'Run Scenario Simulation'}</span>
          </button>
        </div>

        {/* Results Column */}
        {simResult && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Hero Delta Summary Card */}
            <div className="bg-gradient-to-br from-[#071A2B] to-[#0B2942] text-white p-6 rounded-2xl border border-[#1479D1]/30 shadow-xl space-y-4">
              <span className="text-xs font-mono text-[#28B8F2] font-bold uppercase tracking-widest block">
                Simulated Outcome vs Baseline
              </span>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-[#071A2B]/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">LST Reduction</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">-{simResult.deltas.lstReduction}°C</span>
                </div>

                <div className="bg-[#071A2B]/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">Risk Score Drop</span>
                  <span className="text-2xl font-extrabold text-[#28B8F2] font-mono">-{simResult.deltas.riskScoreDelta} pts</span>
                </div>

                <div className="bg-[#071A2B]/80 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-slate-400 text-xs block">Citizens Benefited</span>
                  <span className="text-2xl font-extrabold text-[#FF9F43] font-mono">{simResult.deltas.populationBenefitedEstimate.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Before vs After Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Baseline Card */}
              <div className="glass-card p-5 space-y-3 bg-[#F7FAFC] border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Baseline</span>
                  <span className="badge-critical font-mono">
                    {simResult.baseline.riskScore}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Surface Temp (LST)</span>
                    <span className="font-mono font-bold text-red-600">{simResult.baseline.lst}°C</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Air Temp</span>
                    <span className="font-mono font-bold text-amber-600">{simResult.baseline.airTemperature}°C</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">NDVI Canopy</span>
                    <span className="font-mono text-slate-700">{simResult.baseline.ndvi}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Albedo Index</span>
                    <span className="font-mono text-slate-700">{simResult.baseline.albedo}</span>
                  </div>
                </div>
              </div>

              {/* Simulated Card */}
              <div className="glass-card p-5 space-y-3 bg-white border-2 border-emerald-400 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Simulated Intervention</span>
                  <span className="badge-low font-mono">
                    {simResult.simulated.riskScore}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Simulated LST</span>
                    <span className="font-mono font-bold text-emerald-600">{simResult.simulated.lst}°C</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Simulated Air Temp</span>
                    <span className="font-mono font-bold text-emerald-600">{simResult.simulated.airTemperature}°C</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Simulated NDVI</span>
                    <span className="font-mono font-bold text-emerald-600">{simResult.simulated.ndvi}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Simulated Albedo</span>
                    <span className="font-mono font-bold text-emerald-600">{simResult.simulated.albedo}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3.5 rounded-xl bg-[#EAF6FF] text-xs text-[#071A2B] border border-[#1479D1]/30 flex items-center justify-between">
              <span>Ready to implement these findings? Submit a community proposal or log work.</span>
              <Link to="/citizen-action" className="text-xs font-bold text-[#FF7A18] hover:underline flex items-center gap-1">
                <span>Citizen Action Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
