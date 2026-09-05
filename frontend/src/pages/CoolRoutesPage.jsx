import React, { useState, useEffect } from 'react';
import { fetchRoutes, fetchLocations } from '../services/api';
import { Navigation, MapPin, Footprints, Flame, TreePine, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function CoolRoutesPage() {
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState('loc_central');
  const [destination, setDestination] = useState('loc_allen_zoo');
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) setLocations(locs.data);
    }
    init();
  }, []);

  const calculateRoute = async () => {
    setLoading(true);
    const res = await fetchRoutes(origin, destination);
    if (res && res.route) setRouteData(res.route);
    setLoading(false);
  };

  useEffect(() => {
    calculateRoute();
  }, [origin, destination]);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            PROTOTYPE HEAT-AWARE ROUTING
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            Cool Pedestrian Route Planner
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Prototype thermal-weighted routing algorithm in <strong>Kanpur Nagar</strong>: balances geographical distance against cumulative thermal radiation exposure (Route Cost = Distance + Thermal Stress Weight). Note: not validated physiological clinical exposure.
        </p>
      </div>

      {/* Origin / Destination Selection */}
      <div className="glass-card p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#071A2B] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF7A18]" />
            <span>Select Starting Location (Origin):</span>
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] w-full font-bold"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#071A2B] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Select Destination:</span>
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] w-full font-bold"
          >
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      {routeData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Direct Shortest Route */}
          <div className="glass-card p-6 space-y-4 border-t-4 border-t-red-500">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Direct Shortest Route</span>
              <span className="badge-critical">High Thermal Stress</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{routeData.shortestRoute.description}</p>
            
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#F7FAFC] p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] block">Walking Distance</span>
                <span className="text-lg font-bold text-[#071A2B] font-mono">{routeData.shortestRoute.distanceKm} km</span>
              </div>

              <div className="bg-[#F7FAFC] p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] block">Est. Walking Time</span>
                <span className="text-lg font-bold text-[#071A2B] font-mono">{routeData.shortestRoute.estimatedWalkTimeMins} mins</span>
              </div>

              <div className="bg-[#F7FAFC] p-3 rounded-xl border border-slate-100 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Thermal Exposure Index</span>
                  <span className="text-slate-600 text-[11px]">Unshaded asphalt corridors</span>
                </div>
                <span className="text-xl font-extrabold text-red-600 font-mono">
                  {routeData.shortestRoute.thermalExposureIndex} pts
                </span>
              </div>
            </div>
          </div>

          {/* Cool Heat-Aware Route */}
          <div className="glass-card p-6 space-y-4 border-2 border-emerald-500 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Heat-Aware Cool Route</span>
              </div>
              <span className="badge-low">38% Less Thermal Stress</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{routeData.coolRoute.description}</p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#F7FAFC] p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] block">Walking Distance</span>
                <span className="text-lg font-bold text-[#071A2B] font-mono">{routeData.coolRoute.distanceKm} km</span>
                <span className="text-[10px] text-slate-400 block">+0.9 km detour</span>
              </div>

              <div className="bg-[#F7FAFC] p-3 rounded-xl border border-slate-100">
                <span className="text-slate-500 text-[10px] block">Est. Walking Time</span>
                <span className="text-lg font-bold text-[#071A2B] font-mono">{routeData.coolRoute.estimatedWalkTimeMins} mins</span>
                <span className="text-[10px] text-slate-400 block">+12 mins</span>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-emerald-800 text-[10px] font-bold block">Thermal Exposure Index</span>
                  <span className="text-emerald-700 text-[11px]">Shaded canopy & river breezes</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-600 font-mono">
                  {routeData.coolRoute.thermalExposureIndex} pts
                </span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
