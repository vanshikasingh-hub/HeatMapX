import React, { useState, useEffect } from 'react';
import { fetchForecast, fetchLocations } from '../services/api';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';
import { 
  getRiskBadgeClasses, 
  getRiskColor 
} from '../utils/kanpurMetrics';
import { 
  Thermometer, 
  Calendar, 
  MapPin, 
  Droplets,
  Flame,
  ArrowUpRight,
  Sun,
  ChevronDown,
  Umbrella
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function ForecastPage() {
  const { currentArea, setAreaById, allAreas } = useArea();
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState(currentArea?.id || 'loc_barra');
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync with global AreaContext if it changes externally
  useEffect(() => {
    if (currentArea?.id && currentArea.id !== selectedId) {
      setSelectedId(currentArea.id);
    }
  }, [currentArea?.id]);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) {
        setLocations(locs.data);
      } else if (allAreas && allAreas.length > 0) {
        setLocations(allAreas);
      }
    }
    init();
  }, [allAreas]);

  useEffect(() => {
    async function loadForecast() {
      setLoading(true);
      const zone = (locations.length > 0 ? locations : allAreas).find(l => l.id === selectedId) || currentArea;
      const res = await fetchForecast(selectedId, zone?.latitude, zone?.longitude);
      if (res && res.forecast) setForecastData(res.forecast);
      setLoading(false);
    }
    loadForecast();
  }, [selectedId, locations, allAreas, currentArea]);

  const selectedZone = (locations.length > 0 ? locations : allAreas).find(l => l.id === selectedId) || currentArea || { name: 'Kidwai Nagar' };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn select-none text-slate-900">
      
      {/* Header Section */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-3 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-[#FF7A18]" />
            7-DAY PREDICTIVE OUTLOOK
          </span>
          <span className="bg-cyan-500/10 text-[#0284c7] font-mono text-xs px-3 py-1 rounded-full border border-cyan-500/25 font-bold flex items-center gap-1 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
            {selectedZone.name}
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-sans">
          {selectedZone.name} <span className="heat-text-gradient">Heat & Weather Forecast</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
          Daily microclimate projections showing forecasted air temperatures, perceived heat index, and heat stress levels specifically calculated for <strong>{selectedZone.name}, Kanpur Nagar</strong>.
        </p>
      </div>

      {/* Ward Selector Bar */}
      <div className="cinematic-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-orange-200/80 bg-white/85 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-[#FF7A18]" />
          <span>Active Forecast Ward:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setAreaById(e.target.value);
            }}
            className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-bold w-full sm:w-80 cursor-pointer shadow-sm"
          >
            {(locations.length > 0 ? locations : allAreas).map(loc => (
              <option key={loc.id} value={loc.id} className="bg-white text-slate-900">
                {loc.name} ({loc.riskScore ? `${loc.riskScore}/100` : loc.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Forecast Line Chart Card */}
      <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white/85">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF7A18]" />
            <span className="text-xs text-[#ea580c] font-black uppercase tracking-widest">
              Temperature & Risk Trajectory for {selectedZone.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MetricInfoTooltip metric="AIR_TEMP" />
            <MetricInfoTooltip metric="FEELS_LIKE" />
            <MetricInfoTooltip metric="HEAT_RISK" />
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          {loading ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-400 font-mono">
              Loading 7-day forecast for {selectedZone.name}...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15, 23, 42, 0.07)" />
                <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[25, 95]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#e2e8f0', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: '#0f172a',
                    boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.12)'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '14px', color: '#334155' }} />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Air Temp (°C)" 
                  stroke="#0284c7" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#0284c7' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="heatIndex" 
                  name="Feels Like (°C)" 
                  stroke="#d97706" 
                  strokeWidth={2.5} 
                  dot={{ r: 3.5, fill: '#d97706' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="riskScore" 
                  name="Heat Risk (0-100)" 
                  stroke="#ef4444" 
                  strokeWidth={2.5} 
                  strokeDasharray="4 4"
                  dot={{ r: 3.5, fill: '#ef4444' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 7-Day Day-by-Day Forecast Cards */}
      <div className="space-y-3">
        <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#FF7A18]" />
          <span>7-Day Daily Heat Outlook for {selectedZone.name}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {forecastData.map((day, idx) => (
            <div 
              key={idx} 
              className={`cinematic-card p-4 space-y-3 border-t-4 transition-all shadow-sm ${
                idx === 0 
                  ? 'border-t-[#FF7A18] bg-orange-50/90 ring-1 ring-orange-300' 
                  : 'border-t-slate-300 bg-white/80 hover:bg-white/95'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black ${idx === 0 ? 'text-[#ea580c]' : 'text-slate-800'}`}>
                  {day.dayLabel}
                </span>
                {idx === 0 && (
                  <span className="text-[9px] bg-[#FF7A18] text-white px-1.5 py-0.5 rounded font-extrabold shadow-sm">
                    TODAY
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">{day.temperature}</span>
                  <span className="text-xs text-slate-500 font-semibold">°C</span>
                </div>
                <div className="text-[11px] text-amber-700 font-bold">
                  Feels like {day.heatIndex}°C
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px]">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Droplets className="w-3 h-3 text-cyan-600" />
                    <span>Humidity:</span>
                  </span>
                  <span className="font-mono font-semibold">{day.humidity}%</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Flame className="w-3 h-3 text-[#FF7A18]" />
                    <span>Risk:</span>
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${getRiskBadgeClasses(day.riskScore)}`}>
                    {day.riskLevel}
                  </span>
                </div>

                {day.uvMax && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Peak UV:</span>
                    </span>
                    <span className="font-mono font-semibold text-purple-800">{day.uvMax}</span>
                  </div>
                )}

                {day.precipProbability !== undefined && day.precipProbability !== null && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Umbrella className="w-3 h-3 text-sky-600" />
                      <span>Rain Prob:</span>
                    </span>
                    <span className="font-mono font-semibold text-sky-700">{day.precipProbability}%</span>
                  </div>
                )}
              </div>

              {day.riskReason && (
                <div className="text-[10px] text-slate-500 leading-snug pt-1 border-t border-slate-200/60">
                  {day.riskReason}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
