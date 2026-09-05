import React, { useState, useEffect } from 'react';
import { fetchForecast, fetchLocations } from '../services/api';
import { TrendingUp, Thermometer, Calendar, ShieldAlert, AlertTriangle, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function ForecastPage() {
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState('loc_central');
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const locs = await fetchLocations();
      if (locs && locs.data) setLocations(locs.data);
    }
    init();
  }, []);

  useEffect(() => {
    async function loadForecast() {
      setLoading(true);
      const res = await fetchForecast(selectedId);
      if (res && res.forecast) setForecastData(res.forecast);
      setLoading(false);
    }
    loadForecast();
  }, [selectedId]);

  return (
    <div className="space-y-8 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            PROTOTYPE FORECAST MODEL
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            7-Day Heat Risk Forecast
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Predictive microclimate modeling forecasting thermal risk scores, heat index, and expected hotspot severity for <strong>Kanpur Nagar</strong>.
        </p>
      </div>

      {/* Location Filter Bar */}
      <div className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#071A2B]">
          <Calendar className="w-4 h-4 text-[#FF7A18]" />
          <span>Select Kanpur Forecast Ward:</span>
        </div>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="bg-[#F7FAFC] border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#071A2B] focus:outline-none focus:ring-2 focus:ring-[#1479D1] font-bold w-full sm:w-80"
        >
          {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      {/* Forecast Line Chart Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-[#FF7A18] font-bold uppercase tracking-widest">
            7-Day Thermal Risk & Temperature Trend
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Demo Forecast Model (Simulated)
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[20, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0B2942', 
                  borderColor: 'rgba(20,121,209,0.3)', 
                  borderRadius: '10px', 
                  fontSize: '11px',
                  color: '#ffffff'
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="riskScore" name="Heat Risk Score (0-100)" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="temperature" name="Air Temp (°C)" stroke="#FF7A18" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="heatIndex" name="Heat Index (°C)" stroke="#28B8F2" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Forecast Table */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-[#071A2B] uppercase tracking-wider">
          Day-by-Day Forecast Breakdown
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EAF6FF] text-[#071A2B] border-b border-slate-200 font-bold">
              <tr>
                <th className="p-3">Day</th>
                <th className="p-3">Date</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Air Temp</th>
                <th className="p-3">Humidity</th>
                <th className="p-3">Heat Index</th>
                <th className="p-3">Hotspot Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {forecastData.map((f, idx) => (
                <tr key={idx} className="hover:bg-[#F7FAFC] transition-colors">
                  <td className="p-3 font-bold text-[#071A2B]">{f.dayLabel}</td>
                  <td className="p-3 font-mono text-slate-500">{f.date}</td>
                  <td className="p-3 font-mono font-bold text-red-600">{f.riskScore}/100</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.riskScore >= 80 ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {f.riskLevel}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-600">{f.temperature}°C</td>
                  <td className="p-3 font-mono text-slate-500">{f.humidity}%</td>
                  <td className="p-3 font-mono font-bold text-[#1479D1]">{f.heatIndex}°C</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF7A18]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{f.hotspotIntensity}</span>
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
