import React from 'react';
import { Info } from 'lucide-react';

export default function MapLegend({ activeLayer }) {
  const getLegendDetails = () => {
    switch (activeLayer) {
      case 'risk':
        return {
          title: 'Composite Heat Risk',
          unit: 'Risk Score (0 - 100)',
          explanation: 'Synthesizes thermal hazard (LST, Heat Index), environmental indices (NDBI, NDVI), population exposure, and structural vulnerability.',
          stops: [
            { label: 'Critical (≥ 80)', color: '#ef4444' },
            { label: 'Very High (70-79)', color: '#FF7A18' },
            { label: 'High (55-69)', color: '#FF9F43' },
            { label: 'Moderate (40-54)', color: '#f59e0b' },
            { label: 'Low (25-39)', color: '#28B8F2' },
            { label: 'Very Low (< 25)', color: '#06b6d4' }
          ]
        };
      case 'lst':
        return {
          title: 'Land Surface Temperature (LST)',
          unit: 'Degrees Celsius (°C)',
          explanation: 'Direct radiative skin temperature of urban rooftops, pavements, and soils captured by thermal satellite sensors.',
          stops: [
            { label: '≥ 44°C (Extreme)', color: '#ef4444' },
            { label: '41°C - 44°C', color: '#FF7A18' },
            { label: '38°C - 41°C', color: '#FF9F43' },
            { label: '35°C - 38°C', color: '#f59e0b' },
            { label: '32°C - 35°C', color: '#28B8F2' },
            { label: '< 32°C (Cool)', color: '#06b6d4' }
          ]
        };
      case 'ndvi':
        return {
          title: 'Normalized Difference Vegetation Index',
          unit: 'Index (-1.0 to +1.0)',
          explanation: 'Canopy density and green vegetation vigor. Higher values reflect dense tree canopy that drives evaporative cooling.',
          stops: [
            { label: '≥ 0.60 (Dense Canopy)', color: '#10b981' },
            { label: '0.40 - 0.59', color: '#34d399' },
            { label: '0.25 - 0.39', color: '#f59e0b' },
            { label: '0.15 - 0.24', color: '#FF9F43' },
            { label: '< 0.15 (Sparse / None)', color: '#ef4444' }
          ]
        };
      case 'ndbi':
        return {
          title: 'Normalized Difference Built-up Index',
          unit: 'Index (-1.0 to +1.0)',
          explanation: 'Fraction of impervious man-made infrastructure, concrete, and metal surfaces that store solar radiation.',
          stops: [
            { label: '≥ 0.70 (Ultra Dense)', color: '#ef4444' },
            { label: '0.55 - 0.69', color: '#FF7A18' },
            { label: '0.35 - 0.54', color: '#FF9F43' },
            { label: '0.20 - 0.34', color: '#28B8F2' },
            { label: '< 0.20 (Pervious)', color: '#06b6d4' }
          ]
        };
      case 'dem':
        return {
          title: 'Digital Elevation Model (DEM)',
          unit: 'Meters Above Sea Level',
          explanation: 'Topographic elevation affecting surface wind ventilation and cold air drainage in the Kanpur plains basin.',
          stops: [
            { label: '≥ 132 m', color: '#38bdf8' },
            { label: '128 - 131 m', color: '#0284c7' },
            { label: '124 - 127 m', color: '#0369a1' },
            { label: '< 124 m (Riverbank)', color: '#0c4a6e' }
          ]
        };
      case 'smi':
        return {
          title: 'Soil Moisture Index (SMI)',
          unit: 'Relative Moisture (0.0 to 1.0)',
          explanation: 'Surface soil and groundwater moisture influencing latent heat exchange and evaporative cooling potential.',
          stops: [
            { label: '≥ 0.50 (High Moisture)', color: '#06b6d4' },
            { label: '0.30 - 0.49', color: '#38bdf8' },
            { label: '0.20 - 0.29', color: '#f59e0b' },
            { label: '< 0.20 (Desiccated)', color: '#ef4444' }
          ]
        };
      case 'albedo':
        return {
          title: 'Surface Albedo / Solar Reflectance',
          unit: 'Reflectance Ratio (0.0 to 1.0)',
          explanation: 'Proportion of incoming solar radiation reflected back to space. Low albedo surfaces heat up rapidly.',
          stops: [
            { label: '≥ 0.22 (High Reflectance)', color: '#06b6d4' },
            { label: '0.16 - 0.21', color: '#f59e0b' },
            { label: '0.12 - 0.15', color: '#FF7A18' },
            { label: '< 0.12 (High Absorption)', color: '#ef4444' }
          ]
        };
      case 'pop':
        return {
          title: 'Population Density Exposure',
          unit: 'Persons per km²',
          explanation: 'Estimated concentration of humans exposed to intense urban thermal heat waves.',
          stops: [
            { label: '≥ 30,000 / km²', color: '#ef4444' },
            { label: '20,000 - 29,999', color: '#FF7A18' },
            { label: '10,000 - 19,999', color: '#FF9F43' },
            { label: '< 10,000 / km²', color: '#28B8F2' }
          ]
        };
      case 'vuln':
        return {
          title: 'Structural & Demographic Vulnerability',
          unit: 'Score (0 - 100)',
          explanation: 'Compounded risk proxy accounting for low-income settlements, uninsulated tin roofs, elderly cohorts, and street labor.',
          stops: [
            { label: '≥ 75 (High Vulnerability)', color: '#ef4444' },
            { label: '50 - 74', color: '#FF7A18' },
            { label: '30 - 49', color: '#f59e0b' },
            { label: '< 30 (Resilient)', color: '#06b6d4' }
          ]
        };
      case 'anth':
        return {
          title: 'Anthropogenic Heat Proxies',
          unit: 'Proxy Intensity (0 - 100)',
          explanation: 'Sensible heat rejected from vehicular traffic jams, air-conditioner compressors, diesel generators, and industrial manufacturing.',
          stops: [
            { label: '≥ 80 (Severe Exhaust)', color: '#ef4444' },
            { label: '60 - 79', color: '#FF7A18' },
            { label: '40 - 59', color: '#FF9F43' },
            { label: '< 40 (Low Heat Exhaust)', color: '#06b6d4' }
          ]
        };
      case 'roads':
        return {
          title: 'Kanpur Arterial Road Corridors',
          unit: 'Highway & Boulevard Networks',
          explanation: 'Main transit spines (GT Road, Mall Road, VIP Road, Kalpi Road) showing vehicular heat corridors.',
          stops: [
            { label: 'National Highway (GT Road)', color: '#FF7A18' },
            { label: 'Commercial Spine (Mall Road)', color: '#28B8F2' },
            { label: 'Scenic River Highway (VIP Road)', color: '#10b981' }
          ]
        };
      case 'actions':
        return {
          title: '🌱 Citizen Climate Actions',
          unit: 'Community Mitigation Markers',
          explanation: 'Grassroots climate actions recorded by Kanpur citizens (tree plantations, cool roofs, rooftop gardens, and cool shelters).',
          stops: [
            { label: 'Verified Community Action', color: '#10b981' },
            { label: 'Under Review / Hotspot Alert', color: '#f59e0b' }
          ]
        };
      default:
        return {
          title: 'Heat Layer',
          unit: 'Value',
          explanation: 'Geospatial environmental indicator.',
          stops: [{ label: 'High', color: '#ef4444' }, { label: 'Low', color: '#06b6d4' }]
        };
    }
  };

  const details = getLegendDetails();

  return (
    <div className="bg-[#0B2942]/95 backdrop-blur-md p-3.5 rounded-xl border border-[#1479D1]/30 shadow-xl max-w-xs text-xs text-white">
      <div className="space-y-1 mb-2.5 pb-2 border-b border-slate-700/60">
        <h4 className="font-bold text-slate-100 flex items-center justify-between">
          <span>{details.title}</span>
          <span className="text-[10px] text-[#28B8F2] font-mono">{details.unit}</span>
        </h4>
        <p className="text-[11px] text-slate-300 leading-snug">
          {details.explanation}
        </p>
      </div>

      <div className="space-y-1.5">
        {details.stops.map((stop, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span 
                className="w-3.5 h-3.5 rounded shadow-sm inline-block border border-black/20" 
                style={{ backgroundColor: stop.color }}
              />
              <span className="text-slate-200">{stop.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
