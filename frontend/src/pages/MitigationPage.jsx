import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRecommendations, fetchLocations, fetchHeatmapGeoJSON } from '../services/api';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';
import { 
  Lightbulb, 
  TreePine, 
  Sun, 
  Droplets, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Sparkles,
  MapPin,
  Layers,
  Building2,
  Filter,
  Flame,
  Zap,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MitigationPage() {
  const { currentArea, setAreaById } = useArea();
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState(currentArea?.id || 'loc_barra');
  const [recommendations, setRecommendations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentArea?.id && currentArea.id !== selectedId) {
      setSelectedId(currentArea.id);
    }
  }, [currentArea?.id]);

  useEffect(() => {
    async function init() {
      const [locs, mapGeo] = await Promise.all([
        fetchLocations().catch(() => null),
        fetchHeatmapGeoJSON().catch(() => null)
      ]);
      if (locs && locs.data) setLocations(locs.data);
      if (mapGeo && mapGeo.features) setGeoData(mapGeo);
    }
    init();
  }, []);

  useEffect(() => {
    async function loadRecs() {
      setLoading(true);
      const res = await fetchRecommendations(selectedId);
      if (res && res.recommendations) setRecommendations(res.recommendations);
      setLoading(false);
    }
    loadRecs();
  }, [selectedId]);

  const categories = ['All', 'Cool Surface', 'Green Infrastructure', 'Hydrological Cooling', 'Public Health / Equity', 'Ecosystem Restoration'];

  const filteredRecs = selectedCategory === 'All'
    ? recommendations
    : recommendations.filter(r => r.category === selectedCategory);

  const selectedZone = (currentArea && currentArea.id === selectedId) 
    ? currentArea 
    : (locations.find(l => l.id === selectedId) || currentArea || { name: 'Kanpur Central', lst: 37.8, riskScore: 36, ndbi: 0.76, ndvi: 0.09 });

  // Styling for Kanpur ward polygons on Mitigation map
  const getFeatureStyle = (feature) => {
    const isSelected = feature.id === selectedId || feature.properties?.id === selectedId;
    const p = feature.properties || {};
    const risk = p.riskScore || 50;
    
    return {
      fillColor: isSelected ? '#FF7A18' : risk >= 75 ? '#ef4444' : risk >= 50 ? '#f97316' : '#38bdf8',
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#1e293b',
      fillOpacity: isSelected ? 0.85 : 0.45
    };
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.featureType === 'road') return;

    const p = feature.properties || {};
    layer.bindTooltip(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 4px; color: #f1f5f9;">
        <strong style="color: #ffffff;">${p.name || 'Kanpur Ward'}</strong><br/>
        <span style="color: #FF7A18; font-weight: bold;">Heat Risk: ${p.riskScore || 50}/100</span><br/>
        <span style="color: #94a3b8; font-size: 11px;">Click to load AI cooling mitigations</span>
      </div>
    `, { sticky: true });

    layer.on({
      click: () => {
        const targetId = feature.id || p.id;
        if (targetId) {
          setSelectedId(targetId);
          setAreaById(targetId);
        }
      }
    });
  };

  const zoneFeatures = (geoData?.features || []).filter(f => f?.properties?.featureType === 'zone');

  return (
    <ErrorBoundary title="Mitigation Advisor">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900 animate-fadeIn">
        
        {/* Header Section */}
        <div className="space-y-3 border-b border-slate-200/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5 shadow-sm">
              <Lightbulb className="w-3.5 h-3.5 text-[#FF7A18]" />
              AI MITIGATION ADVISOR • KANPUR NAGAR
            </span>
            <span className="bg-emerald-500/10 text-emerald-700 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-200 font-bold shadow-sm">
              RULES ENGINE & SPATIAL STRATEGIES
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
            Cooling Intelligence — <span className="heat-text-gradient">Targeted Interventions</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Data-driven urban cooling interventions matched to specific <strong>Kanpur Nagar</strong> ward heat hazard levels, built-up density (NDBI), tree canopy deficits (NDVI), and demographic exposure.
          </p>
        </div>

        {/* Selected Ward Heat Drivers Breakdown */}
        <div className="cinematic-card p-5 space-y-4 bg-white/85 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF7A18]">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Local Heat Drivers: <span className="text-[#ea580c]">{selectedZone.name}</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">Microclimatic telemetry governing cooling recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Switch Ward:</span>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setAreaById(e.target.value);
                }}
                className="bg-white border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-bold shadow-sm"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-white text-slate-900">
                    {loc.name} ({loc.riskScore ? `${loc.riskScore}/100` : loc.riskLevel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Land Surface Temp</span>
                <MetricInfoTooltip metricKey="lst" />
              </div>
              <div className="text-xl font-black text-red-600 font-mono">
                {selectedZone.lst ? `${selectedZone.lst}°C` : '41.2°C'}
              </div>
              <div className="text-[10px] text-red-600/80 font-medium">Thermal skin emission</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Composite Risk</span>
                <MetricInfoTooltip metricKey="risk" />
              </div>
              <div className="text-xl font-black text-[#ea580c] font-mono">
                {selectedZone.riskScore || 75}/100
              </div>
              <div className="text-[10px] text-[#ea580c]/80 font-medium">{selectedZone.riskLevel || 'High'} Hazard</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Built-up Density (NDBI)</span>
                <MetricInfoTooltip metricKey="ndbi" />
              </div>
              <div className="text-xl font-black text-amber-700 font-mono">
                {selectedZone.ndbi || 0.62}
              </div>
              <div className="text-[10px] text-amber-700/80 font-medium">High thermal mass</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Vegetation Deficit (NDVI)</span>
                <MetricInfoTooltip metricKey="ndvi" />
              </div>
              <div className="text-xl font-black text-cyan-700 font-mono">
                {selectedZone.ndvi || 0.18}
              </div>
              <div className="text-[10px] text-cyan-700/80 font-medium">Low evaporative cooling</div>
            </div>
          </div>
        </div>

        {/* Interactive Ward Selection Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-[#FF7A18]" />
              <span>Interactive Ward Selector: Click any ward to view tailored cooling solutions</span>
            </div>
            <span className="text-xs font-bold text-[#ea580c] font-mono bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
              Target Ward: {selectedZone.name}
            </span>
          </div>

          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white">
            <MapContainer
              center={[26.4499, 80.3319]}
              zoom={12}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {zoneFeatures.length > 0 && (
                <GeoJSON
                  key={`mitigation-geojson-${selectedId}`}
                  data={{ type: "FeatureCollection", features: zoneFeatures }}
                  style={getFeatureStyle}
                  onEachFeature={onEachFeature}
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="cinematic-card-subtle p-3 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar bg-white/80 border border-slate-200/80">
          <span className="text-slate-500 font-bold px-2 flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#FF7A18]" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-md'
                  : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecs.map((rec, idx) => (
            <div 
              key={idx} 
              className="cinematic-card p-6 space-y-5 flex flex-col justify-between hover:border-orange-300 transition-all shadow-sm bg-white/85 border border-slate-200/80 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                    {rec.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    rec.priority === 'Critical' 
                      ? 'bg-red-50 border-red-200 text-red-700' 
                      : 'bg-orange-50 border-orange-200 text-[#ea580c]'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#ea580c] transition-colors">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {rec.description}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200/80 text-xs">
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-medium">
                      <TrendingDown className="w-3 h-3 text-emerald-600" />
                      Expected Cooling Impact
                    </span>
                    <strong className="text-emerald-700 font-mono font-bold text-xs">{rec.expectedImpact}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                    <span className="text-slate-500 block text-[10px] flex items-center gap-1 font-medium">
                      <Zap className="w-3 h-3 text-amber-600" />
                      Implementation Feasibility
                    </span>
                    <strong className="text-slate-800 font-mono font-bold text-xs">{rec.cost || rec.difficulty || 'Medium'}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Target: <strong className="text-slate-900 font-bold">{rec.suitableArea || selectedZone.name}</strong>
                  </span>
                  <Link
                    to="/digital-twin"
                    className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1.5 transition-colors group-hover:translate-x-1"
                  >
                    <span>Simulate in 3D Twin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </ErrorBoundary>
  );
}
