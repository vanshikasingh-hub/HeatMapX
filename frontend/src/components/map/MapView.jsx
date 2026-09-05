import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import LayerControl from './LayerControl';
import MapLegend from './MapLegend';
import AreaAnalysisPanel from '../analysis/AreaAnalysisPanel';
import { fetchHeatmapGeoJSON } from '../../services/api';
import { Layers, Maximize2, RefreshCw, Sparkles, MapPin } from 'lucide-react';

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

// Color ramp calculator with Cool Blue -> Cyan -> Yellow -> Orange -> Red progression
function getLayerColor(feature, layerType) {
  const p = feature.properties;
  
  if (layerType === 'risk') {
    const s = p.riskScore || 50;
    if (s >= 80) return '#ef4444';      // Critical - Red
    if (s >= 70) return '#FF7A18';      // Very High - Vibrant Orange
    if (s >= 55) return '#FF9F43';      // High - Warm Orange
    if (s >= 40) return '#f59e0b';      // Moderate - Amber / Yellow
    if (s >= 25) return '#28B8F2';      // Low - Electric Cyan
    return '#06b6d4';                   // Very Low - Cool Blue
  }

  if (layerType === 'lst') {
    const t = p.lst || 38;
    if (t >= 44.0) return '#ef4444';
    if (t >= 41.0) return '#FF7A18';
    if (t >= 38.0) return '#FF9F43';
    if (t >= 35.0) return '#f59e0b';
    if (t >= 32.0) return '#28B8F2';
    return '#06b6d4';
  }

  if (layerType === 'ndvi') {
    const v = p.ndvi || 0.2;
    if (v >= 0.60) return '#10b981'; // High vegetation canopy
    if (v >= 0.40) return '#34d399';
    if (v >= 0.25) return '#f59e0b';
    if (v >= 0.15) return '#FF7A18';
    return '#ef4444';                // Low vegetation
  }

  if (layerType === 'ndbi') {
    const b = p.ndbi || 0.4;
    if (b >= 0.70) return '#ef4444'; // Ultra dense built
    if (b >= 0.55) return '#FF7A18';
    if (b >= 0.35) return '#FF9F43';
    if (b >= 0.20) return '#28B8F2';
    return '#06b6d4';
  }

  if (layerType === 'dem') {
    const e = p.elevation || 126;
    if (e >= 132) return '#38bdf8';
    if (e >= 128) return '#0284c7';
    if (e >= 124) return '#0369a1';
    return '#0c4a6e';
  }

  if (layerType === 'smi') {
    const s = p.smi || 0.3;
    if (s >= 0.50) return '#06b6d4';
    if (s >= 0.30) return '#28B8F2';
    if (s >= 0.20) return '#f59e0b';
    return '#ef4444';
  }

  if (layerType === 'albedo') {
    const a = p.albedo || 0.15;
    if (a >= 0.22) return '#06b6d4';
    if (a >= 0.16) return '#f59e0b';
    if (a >= 0.12) return '#FF7A18';
    return '#ef4444';
  }

  if (layerType === 'pop') {
    const d = p.populationDensity || 15000;
    if (d >= 30000) return '#ef4444';
    if (d >= 20000) return '#FF7A18';
    if (d >= 10000) return '#FF9F43';
    return '#28B8F2';
  }

  if (layerType === 'vuln') {
    const v = p.vulnerability || 50;
    if (v >= 75) return '#ef4444';
    if (v >= 50) return '#FF7A18';
    if (v >= 30) return '#f59e0b';
    return '#06b6d4';
  }

  if (layerType === 'anth') {
    const ah = p.anthropogenicHeatProxy || 50;
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
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ onSelectArea, fullScreen = false }) {
  const [geoData, setGeoData] = useState(null);
  const [activeLayer, setActiveLayer] = useState('risk');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(true);

  // Centered on Kanpur Nagar, Uttar Pradesh, India
  const kanpurCenter = [26.4499, 80.3319];

  useEffect(() => {
    loadGeoData();
  }, []);

  const loadGeoData = async () => {
    setLoading(true);
    const data = await fetchHeatmapGeoJSON();
    setGeoData(data);
    setLoading(false);
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties;

    // Road network styling & binding
    if (p.featureType === 'road') {
      layer.bindTooltip(`<strong>${p.name}</strong><br/><span style="color:#94a3b8;">${p.type}</span>`, { sticky: true });
      return;
    }

    // Citizen Action Points
    if (p.featureType === 'citizen_action') {
      layer.bindPopup(`
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #f8fafc; padding: 4px; max-width: 220px;">
          <div style="font-weight: 800; font-size: 13px; color: #10b981;">🌱 ${p.title}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-top: 2px;">${p.actionType} | ${p.date}</div>
          <p style="margin: 6px 0; font-size: 11px; line-height: 1.3;">${p.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #334155; padding-top: 4px; font-size: 10px;">
            <span style="color: #38bdf8;">By: ${p.citizenName}</span>
            <span style="background: rgba(16,185,129,0.2); color: #34d399; padding: 2px 6px; border-radius: 4px; font-weight: bold;">+${p.impactPoints} Pts</span>
          </div>
        </div>
      `);
      return;
    }

    // Zone Polygons: Bind interactive tooltip
    layer.bindTooltip(`
      <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; padding: 4px; color: #f1f5f9;">
        <strong style="color: #ffffff; font-size: 13px;">${p.name}</strong><br/>
        <span style="color: #94a3b8; font-size: 11px;">${p.wardName}</span><br/>
        <div style="margin-top: 4px; font-weight: 800; color: ${p.riskScore >= 75 ? '#ef4444' : p.riskScore >= 50 ? '#FF7A18' : '#28B8F2'};">
          Heat Risk: ${p.riskScore}/100 (${p.riskLevel})
        </div>
        <div style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">
          LST: <strong style="color: #ef4444;">${p.lst}°C</strong> | Air Temp: <strong style="color: #38bdf8;">${p.airTemperature}°C</strong> (ΔT: +${p.deltaT}°C)
        </div>
      </div>
    `, { sticky: true, opacity: 0.95 });

    // Click handler for area selection
    layer.on({
      click: () => {
        setSelectedFeature(feature);
        if (onSelectArea) {
          onSelectArea(p);
        }
      },
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3,
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
    const p = feature.properties;

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

    return {
      fillColor,
      weight: isSelected ? 3.5 : 1.5,
      opacity: 1,
      color: isSelected ? '#ffffff' : '#0B2942',
      fillOpacity: activeLayer === 'roads' ? 0.2 : 0.70
    };
  };

  // Filter features based on layer if needed
  const filteredFeatures = geoData?.features?.filter(f => {
    if (activeLayer === 'actions') {
      return f.properties.featureType === 'citizen_action' || f.properties.featureType === 'zone';
    }
    if (activeLayer === 'roads') {
      return true;
    }
    return f.properties.featureType === 'zone' || f.properties.featureType === 'road';
  });

  const citizenActionMarkers = geoData?.features?.filter(f => f.properties.featureType === 'citizen_action') || [];

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#1479D1]/30 shadow-2xl bg-[#071A2B] ${
      fullScreen ? 'h-[calc(100vh-140px)]' : 'h-[620px]'
    }`}>
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-[#071A2B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#1479D1]/30 shadow-lg text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A18] animate-ping" />
          <span className="font-extrabold text-xs tracking-wide">Kanpur Nagar Thermal GIS</span>
        </div>
        <span className="text-[10px] text-[#28B8F2] font-mono bg-[#1479D1]/20 px-1.5 py-0.5 rounded border border-[#28B8F2]/30">
          EPSG:4326
        </span>
        <button
          onClick={loadGeoData}
          className="ml-2 text-slate-300 hover:text-white p-1 rounded transition-colors"
          title="Refresh Geospatial Feed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#28B8F2]' : ''}`} />
        </button>
      </div>

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
        center={kanpurCenter}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapViewController center={kanpurCenter} zoom={12} />
        
        {/* OpenStreetMap Base Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* GeoJSON Spatial Zones & Roads */}
        {filteredFeatures && (
          <GeoJSON
            key={`${activeLayer}-${filteredFeatures.length}-${selectedFeature ? selectedFeature.id : 'none'}`}
            data={{
              type: "FeatureCollection",
              features: filteredFeatures.filter(f => f.geometry.type !== 'Point')
            }}
            style={getFeatureStyle}
            onEachFeature={onEachFeature}
          />
        )}

        {/* Citizen Action Spatial Points */}
        {(activeLayer === 'actions' || activeLayer === 'risk') && citizenActionMarkers.map(marker => (
          <Marker
            key={marker.id}
            position={[marker.geometry.coordinates[1], marker.geometry.coordinates[0]]} // [lat, lng]
            icon={citizenActionIcon}
          >
            <Popup>
              <div className="text-xs p-1 text-slate-100">
                <div className="font-extrabold text-[#10b981] text-sm">🌱 {marker.properties.title}</div>
                <div className="text-slate-400 text-[11px]">{marker.properties.actionType}</div>
                <p className="my-1 text-slate-200">{marker.properties.description}</p>
                <div className="text-[10px] text-[#28B8F2] font-mono mt-1">
                  Location: {marker.properties.location}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

    </div>
  );
}
