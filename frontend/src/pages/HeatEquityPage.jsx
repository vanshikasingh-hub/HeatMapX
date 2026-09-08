import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchHeatEquity, fetchHeatmapGeoJSON } from '../services/api';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';
import { 
  Scale, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  MapPin, 
  HeartHandshake, 
  Building2,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeatEquityPage() {
  const { currentArea, setAreaById } = useArea();
  const [ranking, setRanking] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(currentArea?.id || 'loc_barra');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentArea?.id && currentArea.id !== selectedWardId) {
      setSelectedWardId(currentArea.id);
    }
  }, [currentArea?.id]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [res, mapGeo] = await Promise.all([
        fetchHeatEquity().catch(() => null),
        fetchHeatmapGeoJSON().catch(() => null)
      ]);
      if (res && res.ranking) {
        setRanking(res.ranking);
        if (!currentArea?.id && res.ranking.length > 0) {
          setSelectedWardId(res.ranking[0].id);
        }
      }
      if (mapGeo && mapGeo.features) {
        setGeoData(mapGeo);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedWard = ranking.find(r => r.id === selectedWardId) || ranking[0];

  // Helper to color polygon by equity priority score
  const getEquityColor = (score = 50) => {
    if (score >= 120) return '#a855f7'; // Bright Purple - Urgent Equity Need
    if (score >= 95) return '#9333ea';  // Purple
    if (score >= 70) return '#FF7A18';  // Vibrant Orange
    if (score >= 45) return '#f59e0b';  // Amber
    return '#38bdf8';                   // Electric Cyan
  };

  const getFeatureStyle = (feature) => {
    const isSelected = feature.id === selectedWardId || feature.properties?.id === selectedWardId;
    const p = feature.properties || {};
    const rankItem = ranking.find(r => r.id === feature.id || r.id === p.id);
    const score = rankItem ? rankItem.equityPriorityScore : p.riskScore || 50;

    return {
      fillColor: getEquityColor(score),
      weight: isSelected ? 3.5 : 1.2,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#1e293b',
      fillOpacity: isSelected ? 0.90 : 0.60
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.featureType === 'road') return;

    const rankItem = ranking.find(r => r.id === feature.id);
    const p = feature.properties || {};
    const score = rankItem ? rankItem.equityPriorityScore : 80;
    const rank = rankItem ? rankItem.equityPriorityRank : 'Top';

    layer.bindTooltip(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 4px; color: #f1f5f9;">
        <strong style="color: #ffffff;">${p.name || 'Kanpur Ward'}</strong><br/>
        <span style="color: #c084fc; font-weight: bold;">Equity Priority: #${rank} (${score} pts)</span><br/>
        <span style="color: #94a3b8; font-size: 11px;">Click to inspect equity breakdown</span>
      </div>
    `, { sticky: true });

    layer.on({
      click: () => {
        const targetId = feature.id || p.id;
        if (targetId) {
          setSelectedWardId(targetId);
          setAreaById(targetId);
        }
      }
    });
  };

  const zoneFeatures = (geoData?.features || []).filter(f => f?.properties?.featureType === 'zone');

  return (
    <ErrorBoundary title="Heat Equity Matrix">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900 animate-fadeIn">
        
        {/* Header Section */}
        <div className="space-y-3 border-b border-slate-200/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-purple-500/10 text-purple-700 font-mono text-xs px-2.5 py-1 rounded-full border border-purple-200 font-bold flex items-center gap-1.5 shadow-sm">
              <Scale className="w-3.5 h-3.5 text-purple-600" />
              CLIMATE JUSTICE & EQUITY MODEL • KANPUR NAGAR
            </span>
            <span className="bg-orange-500/10 text-[#ea580c] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-200 font-bold shadow-sm">
              MUNICIPAL FUND ALLOCATION DIRECTIVE
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
            Heat Equity & Vulnerability — <span className="heat-text-gradient">Climate Justice</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Prioritizing municipal cooling investments by multiplying physical heat hazard by population exposure density and socio-demographic vulnerability across <strong>Kanpur Nagar</strong> wards.
          </p>
        </div>

        {/* Citizen-Focused Equity Summary */}
        <div className="cinematic-card p-5 sm:p-6 space-y-3 border border-purple-200/80 bg-white/85 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Priority Cooling Zones & Vulnerable Communities
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold">
                Neighborhood Need
              </span>
              <MetricInfoTooltip metric="HEAT_EQUITY" />
            </div>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl font-medium">
            HeatMapX identifies neighborhoods where residents face the greatest heat challenges due to high population density, unshaded streets, and limited access to cooling. This ensures municipal cooling centers, drinking water kiosks, and shade tree plantations are deployed where citizens need them most.
          </p>
        </div>

        {/* MAP & EQUITY DEEP-DIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Interactive Choropleth Map */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 font-heading">
                <MapPin className="w-4 h-4 text-purple-600" />
                <span>Kanpur Nagar Equity Choropleth Map</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Click any ward to inspect demographic equity metrics</span>
            </div>

            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white">
              <MapContainer
                center={[26.4499, 80.3319]}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {zoneFeatures.length > 0 && (
                  <GeoJSON
                    key={`equity-geojson-${selectedWardId}-${ranking.length}`}
                    data={{ type: "FeatureCollection", features: zoneFeatures }}
                    style={getFeatureStyle}
                    onEachFeature={onEachFeature}
                  />
                )}
              </MapContainer>

              {/* Equity Legend Floating Bottom-Left */}
              <div className="absolute bottom-4 left-4 z-[1000] bg-white/92 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-200/90 text-slate-800 text-xs space-y-1.5 shadow-xl">
                <strong className="block text-[11px] text-purple-950 font-black font-heading">Equity Priority Level</strong>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#a855f7]" />
                  <span className="text-slate-700 font-medium">Immediate Intervention (&gt;120 pts)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#9333ea]" />
                  <span className="text-slate-700 font-medium">High Equity Need (95-120)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#FF7A18]" />
                  <span className="text-slate-700 font-medium">Moderate Priority (70-95)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]" />
                  <span className="text-slate-700 font-medium">Standard Benchmark (&lt;70)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Ward Equity Deep-Dive Card */}
          {selectedWard && (
            <div className="cinematic-card p-6 space-y-4 border border-purple-200/80 bg-white/85 shadow-sm flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <span className="text-xs font-mono text-purple-700 font-bold uppercase tracking-wider">
                    Ward Equity Inspector
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 font-mono">
                    Rank #{selectedWard.equityPriorityRank}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedWard.name}</h3>
                  <span className="text-xs text-slate-500 font-medium">{selectedWard.wardName}</span>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                  <span className="text-[10px] text-purple-700 font-bold block uppercase tracking-wider">
                    Equity Priority Score
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-purple-700 font-mono">
                      {selectedWard.equityPriorityScore}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {selectedWard.recommendedPriority}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <span>Population Density:</span>
                      <MetricInfoTooltip metricKey="exposure" />
                    </span>
                    <strong className="font-mono text-slate-900">{selectedWard.populationDensity.toLocaleString()} /km²</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <span>Social Vulnerability Index:</span>
                      <MetricInfoTooltip metricKey="vulnerability" />
                    </span>
                    <strong className="font-mono text-purple-700 font-bold">{selectedWard.vulnerabilityScore} / 100</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 flex items-center gap-1 font-medium">
                      <span>Peak Land Surface Temp:</span>
                      <MetricInfoTooltip metricKey="lst" />
                    </span>
                    <strong className="font-mono text-red-600 font-bold">{selectedWard.lst}°C</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Recommended Policy:</span>
                    <strong className="font-mono text-emerald-700 font-bold">Priority Cool Roof Subsidy</strong>
                  </div>
                </div>
              </div>

              <Link
                to="/mitigation"
                className="w-full bg-gradient-to-r from-purple-600 to-[#FF7A18] hover:from-purple-500 hover:to-[#FFA726] text-white font-black py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(147,51,234,0.25)]"
              >
                <span>Deploy Cooling Interventions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

        </div>

        {/* Equity Priority Table */}
        <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white/85">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Kanpur Nagar Ward Equity Priority Ranking
            </h3>
            <span className="text-xs font-mono bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold">
              12 Monitored Zones
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200/90 font-bold">
                <tr>
                  <th className="p-3.5">Rank</th>
                  <th className="p-3.5">Ward Name</th>
                  <th className="p-3.5">
                    <span className="flex items-center gap-1">
                      <span>Equity Score</span>
                      <MetricInfoTooltip metricKey="heatEquity" />
                    </span>
                  </th>
                  <th className="p-3.5">
                    <span className="flex items-center gap-1">
                      <span>LST (°C)</span>
                      <MetricInfoTooltip metricKey="lst" />
                    </span>
                  </th>
                  <th className="p-3.5">Population Density</th>
                  <th className="p-3.5">
                    <span className="flex items-center gap-1">
                      <span>Vulnerability</span>
                      <MetricInfoTooltip metricKey="vulnerability" />
                    </span>
                  </th>
                  <th className="p-3.5">Intervention Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {ranking.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => {
                      setSelectedWardId(row.id);
                      setAreaById(row.id);
                    }}
                    className={`cursor-pointer transition-colors ${
                      row.id === selectedWardId ? 'bg-purple-50/80 font-semibold text-slate-900' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <td className="p-3.5 font-mono font-black text-[#ea580c]">#{row.equityPriorityRank}</td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {row.name} <span className="text-slate-500 font-normal">({row.wardName})</span>
                    </td>
                    <td className="p-3.5 font-mono font-black text-purple-700 text-sm">{row.equityPriorityScore}</td>
                    <td className="p-3.5 font-mono font-bold text-red-600">{row.lst}°C</td>
                    <td className="p-3.5 font-mono text-slate-600">{row.populationDensity.toLocaleString()} /km²</td>
                    <td className="p-3.5 font-mono font-bold text-[#0284c7]">{row.vulnerabilityScore}/100</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        row.equityPriorityScore > 120 ? 'bg-purple-100 text-purple-800 border-purple-300' :
                        row.equityPriorityScore > 90 ? 'bg-red-100 text-red-800 border-red-300' : 'bg-orange-100 text-[#ea580c] border-orange-300'
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
    </ErrorBoundary>
  );
}
