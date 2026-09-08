import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoutes, fetchLocations } from '../services/api';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';
import { 
  Navigation, 
  MapPin, 
  Footprints, 
  Flame, 
  TreePine, 
  Clock, 
  ArrowRight, 
  ArrowUpDown, 
  ShieldCheck, 
  Sparkles,
  Droplets,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingDown,
  Compass
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons for Origin, Destination and Water Stops
const originIcon = L.divIcon({
  className: 'route-origin-icon',
  html: `<div style="background: #38bdf8; border: 2.5px solid white; color: #06090e; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 0 14px rgba(56,189,248,0.7);">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const destIcon = L.divIcon({
  className: 'route-dest-icon',
  html: `<div style="background: #ef4444; border: 2.5px solid white; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 0 14px rgba(239,68,68,0.7);">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const waterIcon = L.divIcon({
  className: 'route-water-icon',
  html: `<div style="background: #0284c7; border: 2px solid white; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);">💧</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

function MapViewController({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

export default function CoolRoutesPage() {
  const { currentArea } = useArea();
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState(currentArea?.id || 'loc_barra');
  const [destination, setDestination] = useState('loc_allen_zoo');
  const [routeData, setRouteData] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState('cool'); // 'cool', 'shortest', 'balanced'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentArea?.id && currentArea.id !== destination) {
      setOrigin(currentArea.id);
    }
  }, [currentArea?.id]);

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

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Select active route object
  const currentRoute = routeData ? (
    activeRouteType === 'cool' ? routeData.coolRoute :
    activeRouteType === 'shortest' ? routeData.shortestRoute :
    routeData.balancedRoute || routeData.coolRoute
  ) : null;

  // Waypoints bounds for map auto-fit
  const waypoints = currentRoute?.waypoints || [];
  const mapBounds = waypoints.length > 0 ? waypoints : [[26.4499, 80.3319], [26.4715, 80.3470]];

  return (
    <ErrorBoundary title="Cool Route Planner">
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 text-slate-900 animate-fadeIn">
        
        {/* Header Section */}
        <div className="space-y-3 border-b border-slate-200/80 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5 shadow-sm">
              <Navigation className="w-3.5 h-3.5 text-[#FF7A18]" />
              THERMAL NAVIGATION • KANPUR NAGAR
            </span>
            <span className="bg-emerald-500/10 text-emerald-700 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-200 font-bold shadow-sm">
              CANOPY & SHADE OPTIMIZED
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
            Cool Route Navigation — <span className="heat-text-gradient">Pedestrian Heat Shield</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Thermal-weighted routing algorithm navigating outdoor pedestrians, students, and gig workers through tree-lined avenues, green parks, and shaded sidewalks in <strong>Kanpur Nagar</strong>.
          </p>
        </div>

        {/* Navigation Selector Card */}
        <div className="cinematic-card p-6 space-y-5 shadow-sm bg-white/85 border border-slate-200/80">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Origin Input */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[10px] font-mono font-black shadow-sm">A</span>
                <span>Starting Point (Origin):</span>
                {origin === currentArea?.id && (
                  <span className="text-[10px] text-[#ea580c] bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded font-bold">📍 Your Location</span>
                )}
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full font-bold truncate shadow-sm cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-white text-slate-900">{loc.name}</option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center py-1">
              <button
                onClick={handleSwap}
                className="p-3 rounded-full bg-slate-50 hover:bg-orange-50 hover:border-orange-200 text-slate-600 hover:text-slate-900 transition-all shadow-sm border border-slate-200 cursor-pointer"
                title="Swap Origin and Destination"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Destination Input */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-mono font-black shadow-sm">B</span>
                <span>Destination Ward:</span>
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full font-bold truncate shadow-sm cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className="bg-white text-slate-900">{loc.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Route Mode Switcher Tabs */}
          {routeData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              
              {/* Coolest Option */}
              <button
                onClick={() => setActiveRouteType('cool')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeRouteType === 'cool'
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5 text-emerald-700">
                    <TreePine className="w-4 h-4" />
                    <span>🌿 Coolest Route</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    -{routeData.coolRoute.thermalStressReductionPct || 38}% Heat
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2 text-xs">
                  <strong className="text-base font-black text-slate-900 font-mono">{routeData.coolRoute.distanceKm} km</strong>
                  <span className="text-slate-500 font-mono">~{routeData.coolRoute.estimatedWalkTimeMins} mins</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium block mt-1">
                  {routeData.coolRoute.shadePercentage || 78}% tree shade canopy
                </span>
              </button>

              {/* Balanced Option */}
              <button
                onClick={() => setActiveRouteType('balanced')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeRouteType === 'balanced'
                    ? 'bg-cyan-50 border-cyan-300 text-slate-900 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5 text-[#0284c7]">
                    <Sparkles className="w-4 h-4" />
                    <span>⚖️ Balanced Route</span>
                  </span>
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-300 font-bold px-2 py-0.5 rounded-full">
                    Optimal Tradeoff
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2 text-xs">
                  <strong className="text-base font-black text-slate-900 font-mono">{routeData.balancedRoute?.distanceKm || '3.6'} km</strong>
                  <span className="text-slate-500 font-mono">~{routeData.balancedRoute?.estimatedWalkTimeMins || '34'} mins</span>
                </div>
                <span className="text-[11px] text-cyan-700 font-medium block mt-1">
                  {routeData.balancedRoute?.shadePercentage || 54}% shade protection
                </span>
              </button>

              {/* Fastest Option */}
              <button
                onClick={() => setActiveRouteType('shortest')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  activeRouteType === 'shortest'
                    ? 'bg-red-50 border-red-300 text-slate-900 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black flex items-center gap-1.5 text-red-600">
                    <Clock className="w-4 h-4" />
                    <span>⚡ Fastest Direct</span>
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded-full">
                    High Heat Stress
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline gap-2 text-xs">
                  <strong className="text-base font-black text-slate-900 font-mono">{routeData.shortestRoute.distanceKm} km</strong>
                  <span className="text-slate-500 font-mono">~{routeData.shortestRoute.estimatedWalkTimeMins} mins</span>
                </div>
                <span className="text-[11px] text-red-700 font-medium block mt-1">
                  Unshaded asphalt corridors
                </span>
              </button>

            </div>
          )}
        </div>

        {/* MAP & ROUTE TELEMETRY GRID */}
        {routeData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Interactive Leaflet Route Map Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white">
                
                {/* Floating Map Legend */}
                <div className="absolute top-4 left-4 z-[1000] bg-white/92 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-200/90 text-slate-800 text-xs flex items-center gap-3 shadow-lg">
                  <span className="flex items-center gap-2 font-black text-slate-900">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: currentRoute?.color || '#10b981' }} 
                    />
                    <span>{currentRoute?.name || 'Selected Route'}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono border-l border-slate-200 pl-2">
                    {currentRoute?.distanceKm} km
                  </span>
                </div>

                <MapContainer
                  center={[26.4499, 80.3319]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-full"
                >
                  <MapViewController bounds={mapBounds} />
                  
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Draw Colored Route Polyline */}
                  {waypoints.length > 0 && (
                    <Polyline
                      positions={waypoints}
                      pathOptions={{
                        color: currentRoute?.color || '#10b981',
                        weight: 6,
                        opacity: 0.95,
                        lineCap: 'round',
                        lineJoin: 'round'
                      }}
                    />
                  )}

                  {/* Origin Marker */}
                  {waypoints.length > 0 && (
                    <Marker position={waypoints[0]} icon={originIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-slate-900 p-1">
                          📍 Origin: {routeData.origin?.name}
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Destination Marker */}
                  {waypoints.length > 1 && (
                    <Marker position={waypoints[waypoints.length - 1]} icon={destIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-slate-900 p-1">
                          🏁 Destination: {routeData.destination?.name}
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Water Stops along path */}
                  {(routeData.waterStops || []).map((ws) => (
                    <Marker key={ws.id} position={ws.coords} icon={waterIcon}>
                      <Popup>
                        <div className="text-xs p-1 text-slate-900">
                          <strong className="block text-[#0284c7]">💧 {ws.name}</strong>
                          <span className="text-[11px] text-slate-500 block mt-1 font-medium">{ws.type}</span>
                          <span className="text-[10px] text-emerald-700 font-bold block mt-1">● Free Municipal Kiosk Active</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Thermal Profile Chart along route */}
              <div className="cinematic-card p-5 space-y-3 bg-white/85 border border-slate-200/80 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[#FF7A18]" />
                    Microclimate Heat Exposure Along Route Profile
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-mono">Distance vs Thermal Stress</span>
                    <MetricInfoTooltip metricKey="exposure" />
                  </div>
                </div>

                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={routeData.profile || []}>
                      <defs>
                        <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="distanceKm" unit=" km" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[20, 100]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white text-slate-900 p-2.5 rounded-xl text-xs shadow-xl border border-slate-200 space-y-1">
                                <strong className="text-slate-800">At {d.distanceKm} km</strong>
                                <div className="text-red-600 font-mono font-bold">Heat Stress: {d.heatScore}/100</div>
                                <div className="text-emerald-700 font-mono font-bold">Canopy Shade: {d.shadePct}%</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area type="monotone" dataKey="heatScore" stroke="#FF7A18" fillOpacity={1} fill="url(#heatGradient)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Col: Step-by-Step Directions with Thermal Advisories */}
            <div className="cinematic-card p-5 space-y-4 flex flex-col justify-between bg-white/85 border border-slate-200/80 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#0284c7]" />
                    Turn-by-Turn Guidance
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                    Thermal Warnings Active
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 text-xs">
                  {(routeData.steps || []).map((step, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:border-orange-300 transition-all space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <strong className="text-slate-900 text-xs leading-snug">{step.instruction}</strong>
                        <span className="font-mono text-[10px] text-slate-500 shrink-0">{step.distanceMeters}m</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="text-emerald-700 font-bold">Shade: {step.shadeLevel}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-700 font-bold">{step.temperature}</span>
                      </div>

                      {step.thermalWarning && (
                        <div className="text-[10px] bg-amber-50 text-amber-800 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{step.thermalWarning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Scientific Integrity Disclaimer */}
              <div className="pt-3 border-t border-slate-200/80 text-[10px] text-slate-500 leading-tight space-y-1">
                <div className="flex items-center gap-1 font-bold text-slate-700">
                  <Info className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>Prototype Disclaimer</span>
                </div>
                <p>
                  Thermal exposure indices and shaded route optimizations are generated via satellite proxy metrics and urban morphology heuristics for Kanpur Nagar. Not validated physiological clinical advice.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}
