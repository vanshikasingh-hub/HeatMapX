import React, { useState, useEffect, useMemo } from 'react';
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
  Compass,
  Sun,
  Loader2,
  Milestone,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons for Origin, Destination and Water Stops
const originIcon = L.divIcon({
  className: 'route-origin-icon',
  html: `<div style="background: #0284c7; border: 2.5px solid white; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 14px rgba(2,132,199,0.5);">A</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const destIcon = L.divIcon({
  className: 'route-dest-icon',
  html: `<div style="background: #ef4444; border: 2.5px solid white; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 13px; box-shadow: 0 4px 14px rgba(239,68,68,0.5);">B</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const waterIcon = L.divIcon({
  className: 'route-water-icon',
  html: `<div style="background: #0284c7; border: 2px solid white; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">💧</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

function MapViewController({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length >= 2) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
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
  const [activeRouteType, setActiveRouteType] = useState('cool'); // 'cool' | 'balanced' | 'shortest'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Sync origin when current user location changes from global context
  useEffect(() => {
    if (currentArea?.id && currentArea.id !== destination) {
      setOrigin(currentArea.id);
    }
  }, [currentArea?.id]);

  // Load Kanpur wards catalog
  useEffect(() => {
    async function init() {
      try {
        const locs = await fetchLocations();
        if (locs && locs.data && locs.data.length > 0) {
          setLocations(locs.data);
        }
      } catch (err) {
        console.warn("Failed to load locations:", err);
      }
    }
    init();
  }, []);

  // Fetch or calculate routes whenever origin or destination changes
  useEffect(() => {
    let isCancelled = false;

    async function computeRoutes() {
      if (origin === destination) {
        setRouteData(null);
        setErrorMsg("Origin and destination are identical. Please choose two distinct locations to calculate thermal routes.");
        return;
      }

      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetchRoutes(origin, destination);
        if (!isCancelled) {
          if (res && res.route && res.route.coolRoute) {
            setRouteData(res.route);
          } else {
            throw new Error("Unable to calculate route network.");
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Route calculation error:", err);
          setErrorMsg("Could not calculate route network. Please try another origin or destination.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    computeRoutes();

    return () => {
      isCancelled = true;
    };
  }, [origin, destination]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Selected route object
  const currentRoute = useMemo(() => {
    if (!routeData) return null;
    if (activeRouteType === 'cool') return routeData.coolRoute;
    if (activeRouteType === 'shortest') return routeData.shortestRoute;
    return routeData.balancedRoute || routeData.coolRoute;
  }, [routeData, activeRouteType]);

  // Active waypoints and bounds
  const waypoints = currentRoute?.waypoints || [];
  const mapBounds = useMemo(() => {
    if (waypoints.length >= 2) return waypoints;
    return [[26.4499, 80.3319], [26.4715, 80.3470]];
  }, [waypoints]);

  // Maneuver icon helper
  const renderManeuverIcon = (maneuver) => {
    switch (maneuver) {
      case 'start':
        return <Navigation className="w-4 h-4 text-sky-600" />;
      case 'turn-left':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'turn-right':
        return <Compass className="w-4 h-4 text-emerald-600" />;
      case 'arrival':
        return <CheckCircle2 className="w-4 h-4 text-red-500" />;
      default:
        return <Milestone className="w-4 h-4 text-slate-500" />;
    }
  };

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
            <span className="bg-blue-500/10 text-blue-700 font-mono text-xs px-2.5 py-1 rounded-full border border-blue-200 font-bold shadow-sm">
              HYDRATION HUBS CONNECTED
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
            Cool Route Navigation — <span className="heat-text-gradient">Pedestrian Heat Shield</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            Thermal-weighted routing algorithm navigating outdoor pedestrians, students, and gig workers through tree-lined avenues, green parks, and shaded sidewalks in <strong>Kanpur Nagar</strong>.
          </p>
        </div>

        {/* HeatMapX Differentiator Banner */}
        <div className="cinematic-card p-4 bg-gradient-to-r from-emerald-50/90 via-sky-50/70 to-orange-50/60 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-sm">
              <TreePine className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 tracking-wide uppercase text-[11px] block">
                Thermal Comfort Philosophy — Not Just Shortest Distance
              </span>
              <p className="text-slate-600 leading-relaxed">
                Conventional GPS routing minimizes travel time over unshaded asphalt corridors. <strong>HeatMapX Route Planner</strong> optimizes for low thermal exposure, sun avoidance, and tree-canopy shade protection.
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-white/90 border border-emerald-300/80 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="text-[10px] text-slate-500 block font-bold">ROUTE SCORE METRIC</span>
            <span className="text-xs font-mono font-black text-emerald-800">Exposure + Sun + Canopy</span>
          </div>
        </div>

        {/* Origin & Destination Selector Card */}
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

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-2.5 py-6 bg-slate-50/80 rounded-2xl border border-slate-200">
              <Loader2 className="w-5 h-5 text-[#FF7A18] animate-spin" />
              <span className="text-xs font-bold text-slate-700">Calculating thermal-weighted pedestrian routes across Kanpur Nagar...</span>
            </div>
          )}

          {/* Same Origin / Destination Error */}
          {errorMsg && !loading && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 3 Interactive Route Option Cards */}
          {routeData && !loading && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">Select Route Option</span>
                <span>Click any route card to inspect telemetry & guidance</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* 1. Coolest Option */}
                <button
                  onClick={() => setActiveRouteType('cool')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    activeRouteType === 'cool'
                      ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black flex items-center gap-1.5 text-emerald-800">
                      <TreePine className="w-4 h-4 text-emerald-600" />
                      <span>🌿 Coolest Route</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      -{routeData.coolRoute.thermalStressReductionPct || 61}% Heat Stress
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-2.5 text-xs">
                    <strong className="text-lg font-black text-slate-900 font-mono">{routeData.coolRoute.distanceKm} km</strong>
                    <span className="text-slate-500 font-mono">~{routeData.coolRoute.estimatedWalkTimeMins} mins</span>
                    <span 
                      title="HeatMapX Route Score: Normalized composite of thermal exposure, sun glare, lack of canopy shade, and walking cost. Lower is better."
                      className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 cursor-help"
                    >
                      Score: {routeData.coolRoute.routeScore || 32}/100 (Optimal)
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-emerald-700">
                    <span>{routeData.coolRoute.shadePercentage || 80}% canopy protection</span>
                    <span className="text-slate-400 font-mono text-[10px]">💧 {routeData.coolRoute.waterStopsCount || 2} Water Hubs</span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {routeData.coolRoute.description}
                  </p>
                </button>

                {/* 2. Balanced Option */}
                <button
                  onClick={() => setActiveRouteType('balanced')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    activeRouteType === 'balanced'
                      ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-500/20 shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-sky-50/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black flex items-center gap-1.5 text-sky-800">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      <span>⚖️ Balanced Route</span>
                    </span>
                    <span className="text-[10px] bg-sky-100/90 text-sky-800 border border-sky-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      Optimal Tradeoff
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-2.5 text-xs">
                    <strong className="text-lg font-black text-slate-900 font-mono">{routeData.balancedRoute.distanceKm} km</strong>
                    <span className="text-slate-500 font-mono">~{routeData.balancedRoute.estimatedWalkTimeMins} mins</span>
                    <span 
                      title="HeatMapX Route Score: Normalized composite of thermal exposure, sun glare, lack of canopy shade, and walking cost. Lower is better."
                      className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 cursor-help"
                    >
                      Score: {routeData.balancedRoute.routeScore || 51}/100 (Moderate)
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-sky-700">
                    <span>{routeData.balancedRoute.shadePercentage || 55}% canopy protection</span>
                    <span className="text-slate-400 font-mono text-[10px]">💧 {routeData.balancedRoute.waterStopsCount || 1} Water Hub</span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {routeData.balancedRoute.description}
                  </p>
                </button>

                {/* 3. Fastest Option */}
                <button
                  onClick={() => setActiveRouteType('shortest')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    activeRouteType === 'shortest'
                      ? 'bg-red-50/90 border-red-400 ring-2 ring-red-500/20 shadow-md transform -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-red-300 hover:bg-red-50/30 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black flex items-center gap-1.5 text-red-800">
                      <Clock className="w-4 h-4 text-red-600" />
                      <span>⚡ Fastest Direct</span>
                    </span>
                    <span className="text-[10px] bg-red-100/90 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded-full shrink-0">
                      High Heat Stress
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-2.5 text-xs">
                    <strong className="text-lg font-black text-slate-900 font-mono">{routeData.shortestRoute.distanceKm} km</strong>
                    <span className="text-slate-500 font-mono">~{routeData.shortestRoute.estimatedWalkTimeMins} mins</span>
                    <span 
                      title="HeatMapX Route Score: Normalized composite of thermal exposure, sun glare, lack of canopy shade, and walking cost. Lower is better."
                      className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 cursor-help"
                    >
                      Score: {routeData.shortestRoute.routeScore || 78}/100 (High Heat)
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-red-700">
                    <span>{routeData.shortestRoute.shadePercentage || 20}% canopy (unshaded)</span>
                    <span className="text-red-500 font-mono text-[10px]">⚠ Direct Sun</span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {routeData.shortestRoute.description}
                  </p>
                </button>

              </div>
            </div>
          )}
        </div>

        {/* MAP & ROUTE TELEMETRY GRID */}
        {routeData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Interactive Leaflet Route Map Canvas */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full h-[490px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-white">
                
                {/* Floating Map Status Overlay */}
                <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-200/90 text-slate-800 text-xs flex flex-wrap items-center gap-3 shadow-lg">
                  <span className="flex items-center gap-2 font-black text-slate-900">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: currentRoute?.color || '#10b981' }} 
                    />
                    <span>{currentRoute?.name || 'Selected Route'}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono border-l border-slate-200 pl-2">
                    {currentRoute?.distanceKm} km • ~{currentRoute?.estimatedWalkTimeMins}m
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {currentRoute?.shadePercentage}% Tree Shade
                  </span>
                </div>

                {/* Floating Map Route Type Quick Switcher */}
                <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-xl p-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-1 shadow-lg">
                  <button
                    onClick={() => setActiveRouteType('cool')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      activeRouteType === 'cool' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    🌿 Cool
                  </button>
                  <button
                    onClick={() => setActiveRouteType('balanced')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      activeRouteType === 'balanced' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ⚖️ Balanced
                  </button>
                  <button
                    onClick={() => setActiveRouteType('shortest')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      activeRouteType === 'shortest' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ⚡ Fastest
                  </button>
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

                  {/* 1. Secondary Route: Fastest Direct (when not active) */}
                  {activeRouteType !== 'shortest' && routeData.shortestRoute?.waypoints && (
                    <Polyline
                      positions={routeData.shortestRoute.waypoints}
                      pathOptions={{
                        color: '#ef4444',
                        weight: 4,
                        opacity: 0.40,
                        dashArray: '6, 8',
                        lineCap: 'round'
                      }}
                      eventHandlers={{
                        click: () => setActiveRouteType('shortest')
                      }}
                    />
                  )}

                  {/* 2. Secondary Route: Balanced (when not active) */}
                  {activeRouteType !== 'balanced' && routeData.balancedRoute?.waypoints && (
                    <Polyline
                      positions={routeData.balancedRoute.waypoints}
                      pathOptions={{
                        color: '#0284c7',
                        weight: 4,
                        opacity: 0.45,
                        dashArray: '6, 8',
                        lineCap: 'round'
                      }}
                      eventHandlers={{
                        click: () => setActiveRouteType('balanced')
                      }}
                    />
                  )}

                  {/* 3. Secondary Route: Coolest (when not active) */}
                  {activeRouteType !== 'cool' && routeData.coolRoute?.waypoints && (
                    <Polyline
                      positions={routeData.coolRoute.waypoints}
                      pathOptions={{
                        color: '#10b981',
                        weight: 4,
                        opacity: 0.45,
                        dashArray: '6, 8',
                        lineCap: 'round'
                      }}
                      eventHandlers={{
                        click: () => setActiveRouteType('cool')
                      }}
                    />
                  )}

                  {/* Active Selected Route Polyline (Prominently Highlighted) */}
                  {waypoints.length > 0 && (
                    <Polyline
                      positions={waypoints}
                      pathOptions={{
                        color: currentRoute?.color || '#10b981',
                        weight: 7,
                        opacity: 0.96,
                        lineCap: 'round',
                        lineJoin: 'round'
                      }}
                    />
                  )}

                  {/* Origin Marker A */}
                  {waypoints.length > 0 && (
                    <Marker position={waypoints[0]} icon={originIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-slate-900 p-1 space-y-1">
                          <div className="text-sky-600 font-extrabold flex items-center gap-1">
                            <span>📍 Point A (Origin)</span>
                          </div>
                          <div>{routeData.origin?.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{routeData.origin?.wardName}</div>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Destination Marker B */}
                  {waypoints.length > 1 && (
                    <Marker position={waypoints[waypoints.length - 1]} icon={destIcon}>
                      <Popup>
                        <div className="text-xs font-bold text-slate-900 p-1 space-y-1">
                          <div className="text-red-600 font-extrabold flex items-center gap-1">
                            <span>🏁 Point B (Destination)</span>
                          </div>
                          <div>{routeData.destination?.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{routeData.destination?.wardName}</div>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Water Stops & Rest Stations */}
                  {(routeData.waterStops || []).map((ws) => (
                    <Marker key={ws.id} position={ws.coords} icon={waterIcon}>
                      <Popup>
                        <div className="text-xs p-1 text-slate-900 space-y-1">
                          <strong className="block text-[#0284c7]">💧 {ws.name}</strong>
                          <span className="text-[11px] text-slate-600 block font-medium">{ws.type}</span>
                          <span className="text-[10px] text-emerald-700 font-bold block">● Free Municipal Hydration Active</span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Microclimate Heat Exposure Profile Chart */}
              <div className="cinematic-card p-5 space-y-3 bg-white/85 border border-slate-200/80 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[#FF7A18]" />
                    Microclimate Heat Exposure Along Route Profile
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-mono">Selected: {currentRoute?.name}</span>
                    <MetricInfoTooltip metricKey="exposure" />
                  </div>
                </div>

                {/* Legend for heat tiers */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600 pt-1 pb-1 border-b border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Cooler Zone (&lt;45)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    <span>Moderate (45–65)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>High Heat Stress (&gt;65)</span>
                  </span>
                </div>

                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentRoute?.profile || routeData.profile || []}>
                      <defs>
                        <linearGradient id="routeThermalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop 
                            offset="5%" 
                            stopColor={activeRouteType === 'cool' ? '#10b981' : activeRouteType === 'balanced' ? '#0284c7' : '#ef4444'} 
                            stopOpacity={0.75}
                          />
                          <stop 
                            offset="95%" 
                            stopColor={activeRouteType === 'cool' ? '#10b981' : activeRouteType === 'balanced' ? '#0284c7' : '#ef4444'} 
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="distanceKm" unit=" km" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-white text-slate-900 p-3 rounded-xl text-xs shadow-xl border border-slate-200 space-y-1.5 min-w-[200px]">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                                  <strong className="text-slate-900 font-bold">At {d.distanceKm} km</strong>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{d.segmentCondition || 'Corridor'}</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Heat Stress Score:</span>
                                  <span className={`font-mono font-bold ${d.heatScore > 65 ? 'text-red-600' : d.heatScore > 45 ? 'text-sky-600' : 'text-emerald-600'}`}>
                                    {d.heatScore}/100
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Microclimate Temp:</span>
                                  <span className="font-mono font-bold text-slate-800">{d.temperature}°C</span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-slate-500">Tree Canopy Shade:</span>
                                  <span className="font-mono font-bold text-emerald-700">{d.shadePct}%</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="heatScore" 
                        stroke={currentRoute?.color || '#10b981'} 
                        fillOpacity={1} 
                        fill="url(#routeThermalGradient)" 
                        strokeWidth={2.5} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Col: Step-by-Step Directions with Thermal Advisories */}
            <div className="cinematic-card p-5 space-y-4 flex flex-col justify-between bg-white/85 border border-slate-200/80 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#0284c7]" />
                      Turn-by-Turn Guidance
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                      {currentRoute?.name} ({currentRoute?.steps?.length || 0} steps)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200">
                    Thermal Warnings Active
                  </span>
                </div>

                {/* List of Steps */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 text-xs">
                  {((currentRoute?.steps || routeData.steps || [])).map((step, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:border-orange-300 transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200/80 text-slate-700 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {step.step || idx + 1}
                          </span>
                          <strong className="text-slate-900 text-xs leading-snug">
                            {step.instruction}
                          </strong>
                        </div>
                        <span className="font-mono text-[10px] text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0 font-bold">
                          {step.distanceMeters}m
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 pl-7">
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Shade: {step.shadeLevel}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-700 font-bold">
                          Microclimate: {step.temperature}
                        </span>
                      </div>

                      {/* Contextual Thermal Warning if Present */}
                      {step.thermalWarning && (
                        <div className={`text-[10px] p-2.5 rounded-lg border flex items-start gap-2 font-medium ${
                          step.thermalWarning.includes('⚠') 
                            ? 'bg-amber-50 text-amber-900 border-amber-200' 
                            : step.thermalWarning.includes('🌳')
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                            : 'bg-sky-50 text-sky-900 border-sky-200'
                        }`}>
                          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            step.thermalWarning.includes('⚠') ? 'text-amber-600' : 'text-emerald-600'
                          }`} />
                          <span className="leading-tight">{step.thermalWarning}</span>
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
                  <span>Pedestrian Thermal Safety Model</span>
                </div>
                <p>
                  Thermal exposure indices and shaded route paths are computed using Kanpur Nagar urban morphology heuristics, satellite land surface temperature proxies, and local tree canopy surveys.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}
