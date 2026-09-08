import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LayerControl from './LayerControl';
import MapLegend from './MapLegend';
import AreaAnalysisPanel from '../analysis/AreaAnalysisPanel';
import ErrorBoundary from '../common/ErrorBoundary';
import { fetchHeatmapGeoJSON } from '../../services/api';
import { useArea } from '../../context/AreaContext';
import { RefreshCw, MapPin, AlertTriangle } from 'lucide-react';

// Fix for default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Citizen Action Icon
const citizenActionIcon = L.divIcon({
  className: 'custom-citizen-icon',
  html: `<div style="background: #10b981; border: 2px solid white; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); font-size: 14px;">🌱</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// Color scale calculator: Blue (Safe) -> Green (Low) -> Yellow (Moderate) -> Orange (High) -> Red (Critical)
function getLayerColor(feature, layerType) {
  const p = feature?.properties || {};
  
  if (layerType === 'risk') {
    const s = p.riskScore ?? 50;
    if (s >= 85) return '#ef4444'; // Critical - Red
    if (s >= 70) return '#f97316'; // Very High - Vivid Orange
    if (s >= 50) return '#fb923c'; // High - Warm Orange
    if (s >= 30) return '#eab308'; // Moderate - Yellow
    if (s >= 15) return '#10b981'; // Low - Green
    return '#3b82f6';              // Safe / Cool - Blue
  }

  if (layerType === 'lst') {
    const t = p.lst ?? 38;
    if (t >= 43.0) return '#ef4444'; // Extreme Surface Heat - Red
    if (t >= 40.0) return '#f97316'; // High - Orange
    if (t >= 37.0) return '#eab308'; // Moderate - Yellow
    if (t >= 34.0) return '#10b981'; // Low - Green
    return '#3b82f6';                // Cool Surface - Blue
  }

  if (layerType === 'ndvi') {
    const v = p.ndvi ?? 0.2;
    if (v >= 0.60) return '#10b981'; // High vegetation canopy
    if (v >= 0.40) return '#34d399';
    if (v >= 0.25) return '#f59e0b';
    if (v >= 0.15) return '#FF7A18';
    return '#ef4444';                // Low vegetation
  }

  if (layerType === 'ndbi') {
    const b = p.ndbi ?? 0.4;
    if (b >= 0.70) return '#ef4444'; // Ultra dense built
    if (b >= 0.55) return '#FF7A18';
    if (b >= 0.35) return '#FF9F43';
    if (b >= 0.20) return '#28B8F2';
    return '#06b6d4';
  }

  if (layerType === 'dem') {
    const e = p.elevation ?? 126;
    if (e >= 132) return '#38bdf8';
    if (e >= 128) return '#0284c7';
    if (e >= 124) return '#0369a1';
    return '#0c4a6e';
  }

  if (layerType === 'smi') {
    const s = p.smi ?? 0.3;
    if (s >= 0.50) return '#06b6d4';
    if (s >= 0.30) return '#28B8F2';
    if (s >= 0.20) return '#f59e0b';
    return '#ef4444';
  }

  if (layerType === 'albedo') {
    const a = p.albedo ?? 0.15;
    if (a >= 0.22) return '#06b6d4';
    if (a >= 0.16) return '#f59e0b';
    if (a >= 0.12) return '#FF7A18';
    return '#ef4444';
  }

  if (layerType === 'pop') {
    const d = p.populationDensity ?? 15000;
    if (d >= 30000) return '#ef4444';
    if (d >= 20000) return '#FF7A18';
    if (d >= 10000) return '#FF9F43';
    return '#28B8F2';
  }

  if (layerType === 'vuln') {
    const v = p.vulnerability ?? 50;
    if (v >= 75) return '#ef4444';
    if (v >= 50) return '#FF7A18';
    if (v >= 30) return '#f59e0b';
    return '#06b6d4';
  }

  if (layerType === 'anth') {
    const ah = p.anthropogenicHeatProxy ?? 50;
    if (ah >= 80) return '#ef4444';
    if (ah >= 60) return '#FF7A18';
    if (ah >= 40) return '#FF9F43';
    return '#06b6d4';
  }

  return '#FF7A18';
}

function MapViewController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ onSelectArea, fullScreen = false }) {
  const { currentArea, setAreaById, locationSource } = useArea();
  const [geoData, setGeoData] = useState(null);
  const [activeLayer, setActiveLayer] = useState('risk');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Centered on current active area, fallback to Kanpur Nagar central coordinates
  const kanpurCenter = [26.4499, 80.3319];
  const activeCenter = (currentArea && currentArea.latitude && currentArea.longitude)
    ? [currentArea.latitude, currentArea.longitude]
    : kanpurCenter;

  useEffect(() => {
    loadGeoData();
  }, []);

  const loadGeoData = async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const data = await fetchHeatmapGeoJSON();
      if (data && data.features) {
        setGeoData(data);
      } else {
        throw new Error("Invalid GeoJSON data received from server");
      }
    } catch (err) {
      console.error("Failed to load GeoJSON in MapView:", err);
      setLoadError(err.message || "Failed to load spatial map layers");
    } finally {
      setLoading(false);
    }
  };

  const onEachFeature = (feature, layer) => {
    const p = feature?.properties || {};

    // Road network styling & binding
    if (p.featureType === 'road') {
      layer.bindTooltip(`<strong>${p.name || 'Road Corridor'}</strong><br/><span style="color:#94a3b8;">${p.type || 'Primary Road'}</span>`, { sticky: true });
      return;
    }

    // Citizen Action Points
    if (p.featureType === 'citizen_action') {
      layer.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #f8fafc; padding: 4px; max-width: 220px;">
          <div style="font-weight: 800; font-size: 13px; color: #10b981;">🌱 ${p.title || 'Climate Action'}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">${p.actionType || 'Intervention'} | ${p.date || 'Recent'}</div>
          <p style="margin: 6px 0; font-size: 11px; line-height: 1.3;">${p.description || ''}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #334155; padding-top: 4px; font-size: 10px;">
            <span style="color: #38bdf8;">By: ${p.citizenName || 'Verified Citizen'}</span>
            <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 6px; border-radius: 4px; font-weight: bold;">+${p.impactPoints || 25} Pts</span>
          </div>
        </div>
      `);
      return;
    }

    // Zone Polygons: Bind interactive tooltip
    const isCurrent = currentArea && (p.id === currentArea.id || feature.id === currentArea.id || p.name?.toLowerCase() === currentArea.name?.toLowerCase());
    const displayRisk = isCurrent && currentArea.riskScore !== undefined ? currentArea.riskScore : (p.riskScore ?? 28);
    const displayLevel = isCurrent && currentArea.riskLevel ? currentArea.riskLevel : (p.riskLevel || 'Low');
    const displayAir = isCurrent && currentArea.airTemperature !== undefined ? currentArea.airTemperature : (p.airTemperature ?? 28.0);
    const displayDelta = isCurrent && currentArea.deltaT !== undefined ? currentArea.deltaT : (p.deltaT ?? Number((p.lst - displayAir).toFixed(1)));
    const riskColor = displayRisk >= 75 ? '#ef4444' : displayRisk >= 50 ? '#FF7A18' : '#28B8F2';

    layer.bindTooltip(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 4px; color: #f1f5f9;">
        <strong style="color: #ffffff; font-size: 13px;">${p.name || 'Kanpur Ward'}</strong><br/>
        <span style="color: #94a3b8; font-size: 11px;">${p.wardName || 'Kanpur Nagar'}</span><br/>
        <div style="margin-top: 4px; font-weight: 800; color: ${riskColor};">
          Heat Risk: ${displayRisk}/100 (${displayLevel})
        </div>
        <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">
          Surface (LST): <strong style="color: #ef4444;">${p.lst ?? '--'}°C</strong> | Air: <strong style="color: #38bdf8;">${displayAir ?? '--'}°C</strong> (ΔT: ${Number(displayDelta) > 0 ? '+' : ''}${displayDelta}°C)
        </div>
      </div>
    `, { sticky: true, opacity: 0.95 });

    // Click handler for area selection
    layer.on({
      click: () => {
        setSelectedFeature(feature);
        const targetId = feature.id || p.id;
        if (targetId) {
          setAreaById(targetId);
        }
        if (onSelectArea) {
          onSelectArea(p);
        }
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3.5,
          color: '#ffffff',
          dashArray: '',
          fillOpacity: 0.85
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(getFeatureStyle(feature));
      }
    });
  };

  const getFeatureStyle = (feature) => {
    const p = feature?.properties || {};

    // Road styling
    if (p.featureType === 'road') {
      return {
        color: activeLayer === 'roads' ? '#FF7A18' : '#64748b',
        weight: activeLayer === 'roads' ? 4 : 2,
        opacity: activeLayer === 'roads' ? 0.9 : 0.45,
        dashArray: activeLayer === 'roads' ? '' : '4, 4'
      };
    }

    // Zone polygon styling
    const fillColor = getLayerColor(feature, activeLayer);
    const isSelected = selectedFeature && selectedFeature.id === feature.id;
    const isCurrentContext = currentArea && (
      feature.id === currentArea.id || 
      p.id === currentArea.id || 
      p.name?.toLowerCase() === currentArea.name?.toLowerCase()
    );

    return {
      fillColor,
      weight: isCurrentContext ? 4 : isSelected ? 3.5 : 1.5,
      opacity: 1,
      color: isCurrentContext ? '#38bdf8' : isSelected ? '#ffffff' : '#0B2942',
      fillOpacity: isCurrentContext ? 0.85 : activeLayer === 'roads' ? 0.2 : 0.70
    };
  };

  // Safe filtering of features based on layer
  const filteredFeatures = (geoData?.features || []).filter(f => {
    if (!f || !f.properties) return false;
    if (activeLayer === 'actions') {
      return f.properties.featureType === 'citizen_action' || f.properties.featureType === 'zone';
    }
    if (activeLayer === 'roads') {
      return true;
    }
    return f.properties.featureType === 'zone' || f.properties.featureType === 'road';
  });

  const citizenActionMarkers = (geoData?.features || []).filter(f => 
    f?.properties?.featureType === 'citizen_action' && 
    Array.isArray(f?.geometry?.coordinates) && 
    f.geometry.coordinates.length >= 2
  );

  return (
    <ErrorBoundary title="Geospatial Map Renderer">
      <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-50 ${
        fullScreen ? 'h-[calc(100vh-140px)]' : 'h-[620px]'
      }`}>
        
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2.5 bg-white/92 backdrop-blur-xl px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-lg text-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF7A18] animate-ping" />
            <span className="font-extrabold text-xs tracking-wide text-slate-900">Kanpur Thermal GIS</span>
          </div>
          <span className="text-[10px] text-[#0284c7] font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
            EPSG:4326
          </span>
          <button
            onClick={loadGeoData}
            className="ml-2 text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Refresh Geospatial Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF7A18]' : ''}`} />
          </button>
        </div>

        {/* Error notification overlay */}
        {loadError && (
          <div className="absolute top-16 left-4 z-[1000] bg-red-950/90 border border-red-500/50 text-red-200 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 shadow-2xl backdrop-blur-xl">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{loadError}</span>
            <button onClick={loadGeoData} className="underline ml-2 font-bold hover:text-white">Retry</button>
          </div>
        )}

        {/* Layer Control Drawer Top-Right */}
        <div className="absolute top-4 right-4 z-[1000]">
          <LayerControl activeLayer={activeLayer} onSelectLayer={setActiveLayer} />
        </div>

        {/* Map Legend Bottom-Left */}
        <div className="absolute bottom-6 left-4 z-[1000]">
          <MapLegend activeLayer={activeLayer} />
        </div>

        {/* Area Analysis Drawer (Right side overlay when selected) */}
        {selectedFeature && (
          <div className="absolute bottom-6 right-4 z-[1000] max-w-sm w-full">
            <AreaAnalysisPanel 
              location={selectedFeature.properties} 
              onClose={() => setSelectedFeature(null)} 
            />
          </div>
        )}

        {/* Leaflet Map Canvas */}
        <MapContainer
          center={activeCenter}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <MapViewController center={activeCenter} zoom={currentArea ? 13 : 12} />
          
          {/* OpenStreetMap Base Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* GeoJSON Spatial Zones & Roads */}
          {filteredFeatures.length > 0 && (
            <GeoJSON
              key={`geojson-${activeLayer}-${filteredFeatures.length}-${selectedFeature?.id || 'none'}-${currentArea?.id || 'none'}`}
              data={{
                type: "FeatureCollection",
                features: filteredFeatures.filter(f => f?.geometry?.type !== 'Point')
              }}
              style={getFeatureStyle}
              onEachFeature={onEachFeature}
            />
          )}

          {/* Active Area Centroid Pin */}
          {currentArea && currentArea.latitude && currentArea.longitude && (
            <Marker
              position={[currentArea.latitude, currentArea.longitude]}
              icon={L.divIcon({
                className: 'custom-area-pin',
                html: `<div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
                  <div style="background: #FF7A18; border: 2.5px solid white; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(255,122,24,0.7); font-size: 16px;">📍</div>
                  <div style="background: rgba(7,26,43,0.95); border: 1px solid #FF7A18; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
                    ${currentArea.name}
                  </div>
                </div>`,
                iconSize: [100, 56],
                iconAnchor: [50, 28]
              })}
            >
              <Popup>
                <div className="text-xs p-1 text-slate-100">
                  <div className="font-extrabold text-[#FF7A18] text-sm">📍 {currentArea.name}</div>
                  <div className="text-slate-400 text-[11px]">{currentArea.wardName || 'Kanpur Nagar'}</div>
                  <div className="mt-1.5 text-slate-200">
                    LST: <strong className="text-red-400">{currentArea.lst}°C</strong> | Air: <strong className="text-cyan-400">{currentArea.airTemperature}°C</strong>
                  </div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    Risk Score: <strong>{currentArea.riskScore}/100</strong> ({currentArea.riskLevel})
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {locationSource === 'detected' ? '📍 Your Current Location' : 'Selected Kanpur Ward'}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Citizen Action Spatial Points */}
          {(activeLayer === 'actions' || activeLayer === 'risk') && citizenActionMarkers.map(marker => (
            <Marker
              key={`marker-${marker.id || Math.random()}`}
              position={[marker.geometry.coordinates[1], marker.geometry.coordinates[0]]} // [lat, lng]
              icon={citizenActionIcon}
            >
              <Popup>
                <div className="text-xs p-1 text-slate-100">
                  <div className="font-extrabold text-[#10b981] text-sm">🌱 {marker.properties?.title || 'Climate Action'}</div>
                  <div className="text-slate-400 text-[11px]">{marker.properties?.actionType || 'Intervention'}</div>
                  <p className="my-1 text-slate-200">{marker.properties?.description || ''}</p>
                  <div className="text-[10px] text-[#28B8F2] font-mono mt-1">
                    Location: {marker.properties?.location || 'Kanpur Nagar'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>
    </ErrorBoundary>
  );
}
