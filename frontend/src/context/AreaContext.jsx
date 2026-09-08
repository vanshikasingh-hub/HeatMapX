import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchLocations, fetchEnvironmentalFactors, fetchWeather } from '../services/api';
import { getRiskHumanReason, getRiskActionAdvice } from '../utils/kanpurMetrics';

const AreaContext = createContext(null);

// Canonical Fallback Areas with Kanpur Nagar Wards, geometries, and physical metrics
export const CANONICAL_AREAS = [
  {
    id: "loc_barra",
    name: "Kidwai Nagar",
    fullName: "Kidwai Nagar & Barra Corridor",
    wardName: "Ward 49 - Barra South & Kidwai Nagar",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4250,
    longitude: 80.3220,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3120, 26.4320],
        [80.3320, 26.4320],
        [80.3330, 26.4180],
        [80.3130, 26.4180],
        [80.3120, 26.4320]
      ]]
    },
    lst: 34.4,
    airTemperature: 28.0,
    deltaT: 6.4,
    humidity: 62,
    heatIndex: 30.8,
    ndvi: 0.24,
    ndbi: 0.58,
    smi: 0.24,
    albedo: 0.18,
    elevation: 125,
    populationDensity: 24000,
    vulnerabilityScore: 52,
    anthropogenicHeatProxy: 60,
    riskScore: 28,
    riskLevel: "Low",
    topDriver: "High Built-Up Density & Paved Road Heat Storage"
  },
  {
    id: "loc_civil_lines",
    name: "Civil Lines",
    fullName: "Civil Lines & Phool Bagh",
    wardName: "Ward 14 - Civil Lines North",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4760,
    longitude: 80.3540,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3470, 26.4820],
        [80.3610, 26.4820],
        [80.3620, 26.4700],
        [80.3480, 26.4700],
        [80.3470, 26.4820]
      ]]
    },
    lst: 32.8,
    airTemperature: 27.6,
    deltaT: 5.2,
    humidity: 64,
    heatIndex: 30.2,
    ndvi: 0.38,
    ndbi: 0.42,
    smi: 0.32,
    albedo: 0.21,
    elevation: 127,
    populationDensity: 14000,
    vulnerabilityScore: 35,
    anthropogenicHeatProxy: 44,
    riskScore: 24,
    riskLevel: "Very Low",
    topDriver: "Moderate Traffic & Commercial Pavement"
  },
  {
    id: "loc_central",
    name: "Kanpur Central",
    fullName: "Kanpur Central & Ghanta Ghar",
    wardName: "Ward 24 - Collectorganj / Station Core",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4542,
    longitude: 80.3508,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3440, 26.4590],
        [80.3580, 26.4590],
        [80.3590, 26.4490],
        [80.3450, 26.4490],
        [80.3440, 26.4590]
      ]]
    },
    lst: 37.8,
    airTemperature: 29.2,
    deltaT: 8.6,
    humidity: 65,
    heatIndex: 33.4,
    ndvi: 0.09,
    ndbi: 0.76,
    smi: 0.14,
    albedo: 0.11,
    elevation: 126,
    populationDensity: 34000,
    vulnerabilityScore: 82,
    anthropogenicHeatProxy: 88,
    riskScore: 36,
    riskLevel: "Moderate",
    topDriver: "Dense Tin Railway Sheds & Low Albedo Asphalt"
  },
  {
    id: "loc_sisamau",
    name: "Sisamau Bazaar",
    fullName: "Sisamau & P. Road Bazaar",
    wardName: "Ward 31 - Sisamau Central",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4632,
    longitude: 80.3285,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3210, 26.4680],
        [80.3360, 26.4680],
        [80.3370, 26.4580],
        [80.3220, 26.4580],
        [80.3210, 26.4680]
      ]]
    },
    lst: 36.9,
    airTemperature: 28.9,
    deltaT: 8.0,
    humidity: 66,
    heatIndex: 32.8,
    ndvi: 0.11,
    ndbi: 0.74,
    smi: 0.17,
    albedo: 0.12,
    elevation: 125,
    populationDensity: 36000,
    vulnerabilityScore: 88,
    anthropogenicHeatProxy: 80,
    riskScore: 38,
    riskLevel: "Moderate",
    topDriver: "Extreme Population Density & Tin Roof Overcrowding"
  },
  {
    id: "loc_swaroop",
    name: "Swaroop Nagar",
    fullName: "Swaroop Nagar & Motijheel",
    wardName: "Ward 12 - Swaroop Nagar Residential",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4815,
    longitude: 80.3210,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3120, 26.4880],
        [80.3290, 26.4880],
        [80.3300, 26.4750],
        [80.3130, 26.4750],
        [80.3120, 26.4880]
      ]]
    },
    lst: 33.5,
    airTemperature: 27.8,
    deltaT: 5.7,
    humidity: 63,
    heatIndex: 30.6,
    ndvi: 0.35,
    ndbi: 0.44,
    smi: 0.28,
    albedo: 0.20,
    elevation: 128,
    populationDensity: 18500,
    vulnerabilityScore: 42,
    anthropogenicHeatProxy: 46,
    riskScore: 25,
    riskLevel: "Very Low",
    topDriver: "Motijheel Water Body & Roadside Tree Canopy"
  },
  {
    id: "loc_naveen",
    name: "Naveen Market",
    fullName: "Naveen Market & The Mall Road",
    wardName: "Ward 18 - Civil Lines South / Mall Road",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4715,
    longitude: 80.3470,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3400, 26.4760],
        [80.3540, 26.4760],
        [80.3550, 26.4670],
        [80.3410, 26.4670],
        [80.3400, 26.4760]
      ]]
    },
    lst: 36.6,
    airTemperature: 28.8,
    deltaT: 7.8,
    humidity: 64,
    heatIndex: 32.5,
    ndvi: 0.12,
    ndbi: 0.72,
    smi: 0.16,
    albedo: 0.13,
    elevation: 128,
    populationDensity: 31500,
    vulnerabilityScore: 76,
    anthropogenicHeatProxy: 84,
    riskScore: 35,
    riskLevel: "Moderate",
    topDriver: "Commercial Urban Canyon & Low Albedo Roads"
  },
  {
    id: "loc_govind_nagar",
    name: "Govind Nagar",
    fullName: "Govind Nagar & Fazalganj",
    wardName: "Ward 38 - Fazalganj Workshop Belt",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4420,
    longitude: 80.3015,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2930, 26.4490],
        [80.3100, 26.4490],
        [80.3110, 26.4350],
        [80.2940, 26.4350],
        [80.2930, 26.4490]
      ]]
    },
    lst: 35.9,
    airTemperature: 28.4,
    deltaT: 7.5,
    humidity: 63,
    heatIndex: 31.8,
    ndvi: 0.15,
    ndbi: 0.66,
    smi: 0.19,
    albedo: 0.15,
    elevation: 126,
    populationDensity: 27500,
    vulnerabilityScore: 71,
    anthropogenicHeatProxy: 74,
    riskScore: 32,
    riskLevel: "Moderate",
    topDriver: "Automotive Workshops & Low Reflective Roofs"
  },
  {
    id: "loc_panki",
    name: "Panki Industrial",
    fullName: "Panki Industrial Area & Power Cluster",
    wardName: "Ward 42 - Panki Industrial Sector",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4780,
    longitude: 80.2350,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2210, 26.4860],
        [80.2450, 26.4860],
        [80.2460, 26.4700],
        [80.2220, 26.4700],
        [80.2210, 26.4860]
      ]]
    },
    lst: 38.2,
    airTemperature: 29.4,
    deltaT: 8.8,
    humidity: 61,
    heatIndex: 33.6,
    ndvi: 0.08,
    ndbi: 0.78,
    smi: 0.12,
    albedo: 0.10,
    elevation: 130,
    populationDensity: 11200,
    vulnerabilityScore: 68,
    anthropogenicHeatProxy: 94,
    riskScore: 35,
    riskLevel: "Moderate",
    topDriver: "Power Plant Emission & Metal Sheet Industrial Roofs"
  },
  {
    id: "loc_jajmau",
    name: "Jajmau",
    fullName: "Jajmau Leather & Tannery Cluster",
    wardName: "Ward 55 - Jajmau Tannery Belt",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4320,
    longitude: 80.3980,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3840, 26.4410],
        [80.4110, 26.4410],
        [80.4120, 26.4230],
        [80.3850, 26.4230],
        [80.3840, 26.4410]
      ]]
    },
    lst: 36.7,
    airTemperature: 28.5,
    deltaT: 8.2,
    humidity: 68,
    heatIndex: 32.5,
    ndvi: 0.14,
    ndbi: 0.70,
    smi: 0.22,
    albedo: 0.12,
    elevation: 122,
    populationDensity: 29000,
    vulnerabilityScore: 85,
    anthropogenicHeatProxy: 82,
    riskScore: 36,
    riskLevel: "Moderate",
    topDriver: "Tannery Emission & Impervious Riverbank Soils"
  },
  {
    id: "loc_allen_zoo",
    name: "Allen Forest Zoo",
    fullName: "Allen Forest Zoo & Nawabganj Greens",
    wardName: "Ward 08 - Zoo Perimeter & Forest Reserve",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4950,
    longitude: 80.2980,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2870, 26.5030],
        [80.3090, 26.5030],
        [80.3100, 26.4870],
        [80.2880, 26.4870],
        [80.2870, 26.5030]
      ]]
    },
    lst: 31.8,
    airTemperature: 27.0,
    deltaT: 4.8,
    humidity: 66,
    heatIndex: 29.5,
    ndvi: 0.74,
    ndbi: 0.08,
    smi: 0.52,
    albedo: 0.22,
    elevation: 129,
    populationDensity: 4200,
    vulnerabilityScore: 18,
    anthropogenicHeatProxy: 16,
    riskScore: 16,
    riskLevel: "Very Low",
    topDriver: "Botanical Canopy & Lake Evaporative Cooling"
  },
  {
    id: "loc_armapur",
    name: "Armapur & Kakadeo",
    fullName: "Armapur Estate & Kakadeo",
    wardName: "Ward 29 - Armapur Defense Greens",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.4710,
    longitude: 80.2580,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2480, 26.4780],
        [80.2680, 26.4780],
        [80.2690, 26.4640],
        [80.2490, 26.4640],
        [80.2480, 26.4780]
      ]]
    },
    lst: 31.5,
    airTemperature: 27.2,
    deltaT: 4.3,
    humidity: 62,
    heatIndex: 29.8,
    ndvi: 0.48,
    ndbi: 0.32,
    smi: 0.36,
    albedo: 0.22,
    elevation: 128,
    populationDensity: 9800,
    vulnerabilityScore: 29,
    anthropogenicHeatProxy: 32,
    riskScore: 20,
    riskLevel: "Very Low",
    topDriver: "Planned Defense Green Buffer"
  },
  {
    id: "loc_ganga_barrage",
    name: "Ganga Barrage",
    fullName: "Ganga Barrage & Azad Nagar",
    wardName: "Ward 05 - Azad Nagar / Barrage Marg",
    city: "Kanpur Nagar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    latitude: 26.5180,
    longitude: 80.3150,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3040, 26.5260],
        [80.3260, 26.5260],
        [80.3270, 26.5100],
        [80.3050, 26.5100],
        [80.3040, 26.5260]
      ]]
    },
    lst: 30.9,
    airTemperature: 26.9,
    deltaT: 4.0,
    humidity: 70,
    heatIndex: 29.6,
    ndvi: 0.32,
    ndbi: 0.22,
    smi: 0.58,
    albedo: 0.23,
    elevation: 121,
    populationDensity: 6500,
    vulnerabilityScore: 45,
    anthropogenicHeatProxy: 36,
    riskScore: 22,
    riskLevel: "Very Low",
    topDriver: "River Water Thermal Sinks & Evaporative Breezes"
  }
];

// Point-in-polygon ray casting algorithm (coordinates: [lng, lat])
function isPointInPolygon(point, polygonCoordinates) {
  const [lng, lat] = point;
  let inside = false;
  for (let i = 0, j = polygonCoordinates.length - 1; i < polygonCoordinates.length; j = i++) {
    const xi = polygonCoordinates[i][0], yi = polygonCoordinates[i][1];
    const xj = polygonCoordinates[j][0], yj = polygonCoordinates[j][1];
    const intersect = ((yi > lat) !== (yj > lat)) &&
      (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Nearest centroid fallback
function getNearestArea(lat, lng, areas) {
  let nearest = areas[0];
  let minDistanceSq = Infinity;
  for (const area of areas) {
    const dLat = area.latitude - lat;
    const dLng = (area.longitude - lng) * Math.cos(lat * Math.PI / 180);
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      nearest = area;
    }
  }
  return nearest;
}

export function AreaProvider({ children }) {
  const [allAreas, setAllAreas] = useState(CANONICAL_AREAS);
  
  // Default to Kidwai Nagar as the prime showcase area
  const [currentAreaId, setCurrentAreaId] = useState(() => {
    return localStorage.getItem('heatmapx_active_area_id') || 'loc_barra';
  });

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('heatmapx_user_coords');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userAreaId, setUserAreaId] = useState(() => {
    return localStorage.getItem('heatmapx_user_area_id') || null;
  });

  const [locationStatus, setLocationStatus] = useState(() => {
    return localStorage.getItem('heatmapx_loc_perm_status') || 'prompt'; // 'prompt', 'granted', 'denied', 'unsupported'
  });

  const [locationSource, setLocationSource] = useState(() => {
    return localStorage.getItem('heatmapx_loc_source') || 'manual'; // 'detected' | 'manual'
  });

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Check if initial permission modal should show
  useEffect(() => {
    const permPromptShown = localStorage.getItem('heatmapx_loc_prompt_shown');
    if (!permPromptShown && locationStatus === 'prompt') {
      setIsPromptOpen(true);
    }
  }, [locationStatus]);

  // Load backend locations if available, merging with canonical schema
  useEffect(() => {
    async function loadAreas() {
      try {
        const res = await fetchLocations();
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const merged = CANONICAL_AREAS.map(canon => {
            const remote = res.data.find(r => r.id === canon.id || r.id === `loc_${canon.id}`);
            if (!remote) return canon;
            const deltaT = remote.deltaT ?? Number((remote.lst - remote.airTemperature).toFixed(1));
            return {
              ...canon,
              lst: remote.lst ?? canon.lst,
              airTemperature: remote.airTemperature ?? canon.airTemperature,
              deltaT,
              riskScore: remote.riskScore ?? canon.riskScore,
              riskLevel: remote.riskLevel ?? canon.riskLevel,
              ndvi: remote.ndvi ?? canon.ndvi,
              ndbi: remote.ndbi ?? canon.ndbi,
              albedo: remote.albedo ?? canon.albedo,
              smi: remote.smi ?? canon.smi
            };
          });
          setAllAreas(merged);
        }
      } catch (err) {
        console.warn("Using canonical offline Kanpur areas dataset");
      }
    }
    loadAreas();
  }, []);

  // Base area for currently selected ID
  const activeBaseArea = React.useMemo(() => {
    return allAreas.find(a => a.id === currentAreaId) || allAreas[0];
  }, [allAreas, currentAreaId]);

  // Fetch live weather dynamically whenever the active area changes (or every 10 mins)
  useEffect(() => {
    let isMounted = true;
    async function loadLiveWeather() {
      if (!activeBaseArea?.latitude || !activeBaseArea?.longitude) return;
      setWeatherLoading(true);
      try {
        const data = await fetchWeather(activeBaseArea.latitude, activeBaseArea.longitude);
        if (!isMounted) return;
        if (data && data.isLive) {
          setWeatherData(data);
          setWeatherError(null);
        } else {
          setWeatherData(null);
          setWeatherError(data?.error || "Live weather data temporarily unavailable");
        }
      } catch (err) {
        if (!isMounted) return;
        setWeatherData(null);
        setWeatherError("Live weather data temporarily unavailable");
      } finally {
        if (isMounted) setWeatherLoading(false);
      }
    }

    loadLiveWeather();
    const interval = setInterval(loadLiveWeather, 600000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeBaseArea?.latitude, activeBaseArea?.longitude, currentAreaId]);

  // Helper to determine day/night fallback in IST if live data is offline
  const fallbackIsDay = React.useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utc + (3600000 * 5.5));
    const hour = istTime.getHours();
    return hour >= 6 && hour < 19;
  }, []);

  // Update active area in allAreas when live weather is received
  useEffect(() => {
    if (!weatherData || !weatherData.isLive) return;
    setAllAreas(prev => prev.map(a => {
      if (a.id === currentAreaId) {
        const airTemp = weatherData.airTemperature;
        const feelsLike = weatherData.feelsLike;
        const deltaT = Number((a.lst - airTemp).toFixed(1));
        const isDay = weatherData.isDay !== undefined ? weatherData.isDay : fallbackIsDay;
        const windSpeed = Number(weatherData.windSpeed ?? 8);

        let hazard = Math.min(100, Math.max(10, ((airTemp - 20) / 25) * 60 + ((feelsLike - 20) / 25) * 40));
        if (!isDay) hazard *= 0.85;
        if (windSpeed > 15) hazard = Math.max(0, hazard - 4);
        else if (windSpeed < 3 && hazard > 25) hazard = Math.min(100, hazard + 3);

        const exposure = (a.populationDensity / 40000) * 100;
        let dynamicRisk = Math.round(hazard * 0.50 + exposure * 0.25 + a.vulnerabilityScore * 0.25);
        if (airTemp < 29.0 && feelsLike < 34.0) dynamicRisk = Math.min(dynamicRisk, 28);
        else if (airTemp < 32.0 && feelsLike < 37.0) dynamicRisk = Math.min(dynamicRisk, 48);

        let dynamicLevel = "Low";
        if (dynamicRisk >= 85) dynamicLevel = "Critical";
        else if (dynamicRisk >= 70) dynamicLevel = "Very High";
        else if (dynamicRisk >= 50) dynamicLevel = "High";
        else if (dynamicRisk >= 30) dynamicLevel = "Moderate";
        else dynamicLevel = "Very Low";

        const currentUv = isDay ? Number((weatherData.uvIndex ?? 0).toFixed(1)) : 0;
        const peakUv = Number((weatherData.peakUvIndex ?? 7.0).toFixed(1));
        const riskReason = getRiskHumanReason(dynamicRisk, airTemp, weatherData.humidity, isDay);
        const riskAdvice = getRiskActionAdvice(dynamicRisk, isDay);

        return {
          ...a,
          airTemperature: airTemp,
          feelsLike: feelsLike,
          heatIndex: feelsLike,
          dewPoint: weatherData.dewPoint,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          cloudCover: weatherData.cloudCover,
          precipitation: weatherData.precipitation,
          precipitationProbability: weatherData.precipitationProbability,
          windSpeed: weatherData.windSpeed,
          windDirection: weatherData.windDirection,
          windGusts: weatherData.windGusts,
          weatherCode: weatherData.weatherCode,
          condition: weatherData.condition,
          isDay,
          uvIndex: currentUv,
          peakUvIndex: peakUv,
          sunrise: weatherData.sunrise,
          sunset: weatherData.sunset,
          weatherSource: weatherData.source || "Open-Meteo Live API",
          isLiveWeather: true,
          deltaT,
          riskScore: dynamicRisk,
          riskLevel: dynamicLevel,
          riskReason,
          riskAdvice,
          timestamp: weatherData.timestamp || new Date().toISOString()
        };
      }
      return a;
    }));
  }, [weatherData, currentAreaId, fallbackIsDay]);

  // Compute city reference averages
  const citySummary = React.useMemo(() => {
    const count = allAreas.length || 1;
    const medianRisk = 35; // Kanpur seasonal median benchmark
    const avgLst = Number((allAreas.reduce((sum, a) => sum + a.lst, 0) / count).toFixed(1));
    const avgAirTemp = Number((allAreas.reduce((sum, a) => sum + a.airTemperature, 0) / count).toFixed(1));
    const avgNdvi = Number((allAreas.reduce((sum, a) => sum + (a.ndvi || 0.25), 0) / count).toFixed(2));
    const avgNdbi = Number((allAreas.reduce((sum, a) => sum + (a.ndbi || 0.55), 0) / count).toFixed(2));
    return {
      medianRisk,
      avgLst,
      avgAirTemp,
      avgNdvi,
      avgNdbi,
      totalWards: count
    };
  }, [allAreas]);

  // Current active area object (combines base area attributes with live weather)
  const currentArea = React.useMemo(() => {
    const base = allAreas.find(a => a.id === currentAreaId) || allAreas[0];
    if (!base) return base;
    if (weatherData && weatherData.isLive) {
      const airTemp = weatherData.airTemperature;
      const feelsLike = weatherData.feelsLike;
      const deltaT = Number((base.lst - airTemp).toFixed(1));
      const isDay = weatherData.isDay !== undefined ? weatherData.isDay : fallbackIsDay;
      const windSpeed = Number(weatherData.windSpeed ?? 8);

      let hazard = Math.min(100, Math.max(10, ((airTemp - 20) / 25) * 60 + ((feelsLike - 20) / 25) * 40));
      if (!isDay) hazard *= 0.85;
      if (windSpeed > 15) hazard = Math.max(0, hazard - 4);
      else if (windSpeed < 3 && hazard > 25) hazard = Math.min(100, hazard + 3);

      const exposure = (base.populationDensity / 40000) * 100;
      let dynamicRisk = Math.round(hazard * 0.50 + exposure * 0.25 + base.vulnerabilityScore * 0.25);
      if (airTemp < 29.0 && feelsLike < 34.0) dynamicRisk = Math.min(dynamicRisk, 28);
      else if (airTemp < 32.0 && feelsLike < 37.0) dynamicRisk = Math.min(dynamicRisk, 48);

      let dynamicLevel = "Low";
      if (dynamicRisk >= 85) dynamicLevel = "Critical";
      else if (dynamicRisk >= 70) dynamicLevel = "Very High";
      else if (dynamicRisk >= 50) dynamicLevel = "High";
      else if (dynamicRisk >= 30) dynamicLevel = "Moderate";
      else dynamicLevel = "Very Low";

      const currentUv = isDay ? Number((weatherData.uvIndex ?? 0).toFixed(1)) : 0;
      const peakUv = Number((weatherData.peakUvIndex ?? 7.0).toFixed(1));
      const riskReason = getRiskHumanReason(dynamicRisk, airTemp, weatherData.humidity, isDay);
      const riskAdvice = getRiskActionAdvice(dynamicRisk, isDay);

      return {
        ...base,
        airTemperature: airTemp,
        feelsLike: feelsLike,
        heatIndex: feelsLike,
        dewPoint: weatherData.dewPoint,
        humidity: weatherData.humidity,
        pressure: weatherData.pressure,
        cloudCover: weatherData.cloudCover,
        precipitation: weatherData.precipitation,
        precipitationProbability: weatherData.precipitationProbability,
        windSpeed: weatherData.windSpeed,
        windDirection: weatherData.windDirection,
        windGusts: weatherData.windGusts,
        weatherCode: weatherData.weatherCode,
        condition: weatherData.condition,
        isDay,
        uvIndex: currentUv,
        peakUvIndex: peakUv,
        sunrise: weatherData.sunrise,
        sunset: weatherData.sunset,
        weatherSource: weatherData.source || "Open-Meteo Live API",
        isLiveWeather: true,
        deltaT,
        riskScore: dynamicRisk,
        riskLevel: dynamicLevel,
        riskReason,
        riskAdvice,
        timestamp: weatherData.timestamp || new Date().toISOString()
      };
    }
    const isDay = fallbackIsDay;
    const currentUv = isDay ? 4.5 : 0;
    const fallbackRisk = base.riskScore || 25;
    return {
      ...base,
      isDay,
      uvIndex: currentUv,
      peakUvIndex: 6.5,
      riskReason: getRiskHumanReason(fallbackRisk, base.airTemperature, base.humidity, isDay),
      riskAdvice: getRiskActionAdvice(fallbackRisk, isDay),
      isLiveWeather: false,
      weatherError: weatherError || (weatherLoading ? "Fetching live weather..." : "Live weather data temporarily unavailable")
    };
  }, [allAreas, currentAreaId, weatherData, weatherError, weatherLoading, fallbackIsDay]);

  // User's detected area object
  const userArea = React.useMemo(() => {
    if (!userAreaId) return null;
    return allAreas.find(a => a.id === userAreaId) || null;
  }, [allAreas, userAreaId]);

  // Switch active area by ID
  const setAreaById = (id) => {
    const match = allAreas.find(a => a.id === id);
    if (match) {
      setCurrentAreaId(match.id);
      setLocationSource(match.id === userAreaId ? 'detected' : 'manual');
      localStorage.setItem('heatmapx_active_area_id', match.id);
      localStorage.setItem('heatmapx_loc_source', match.id === userAreaId ? 'detected' : 'manual');
    }
  };

  // Identify matching area from latitude / longitude coordinates
  const identifyAreaFromCoordinates = (lat, lng) => {
    // 1. First try point-in-polygon matching
    for (const area of allAreas) {
      if (area.geometry && area.geometry.coordinates && area.geometry.coordinates[0]) {
        if (isPointInPolygon([lng, lat], area.geometry.coordinates[0])) {
          return area;
        }
      }
    }
    // 2. Fallback: find nearest area centroid in Kanpur
    return getNearestArea(lat, lng, allAreas);
  };

  // Request browser geolocation permission and detect area
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      localStorage.setItem('heatmapx_loc_perm_status', 'unsupported');
      setIsPromptOpen(false);
      return Promise.reject(new Error("Geolocation not supported"));
    }

    setIsDetectingLocation(true);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = { latitude, longitude };
          
          setUserLocation(coords);
          setLocationStatus('granted');
          localStorage.setItem('heatmapx_user_coords', JSON.stringify(coords));
          localStorage.setItem('heatmapx_loc_perm_status', 'granted');
          localStorage.setItem('heatmapx_loc_prompt_shown', 'true');

          // Match area
          const matchedArea = identifyAreaFromCoordinates(latitude, longitude);
          setUserAreaId(matchedArea.id);
          setCurrentAreaId(matchedArea.id);
          setLocationSource('detected');

          localStorage.setItem('heatmapx_user_area_id', matchedArea.id);
          localStorage.setItem('heatmapx_active_area_id', matchedArea.id);
          localStorage.setItem('heatmapx_loc_source', 'detected');

          setIsDetectingLocation(false);
          setIsPromptOpen(false);
          resolve(matchedArea);
        },
        (error) => {
          console.warn("Geolocation permission denied or timed out:", error.message);
          setLocationStatus('denied');
          localStorage.setItem('heatmapx_loc_perm_status', 'denied');
          localStorage.setItem('heatmapx_loc_prompt_shown', 'true');
          setIsDetectingLocation(false);
          setIsPromptOpen(false);
          // Keep manual area (default Kidwai Nagar)
          resolve(currentArea);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  };

  // Restore context to user's detected location
  const resetToMyLocation = () => {
    if (userAreaId) {
      setAreaById(userAreaId);
      setLocationSource('detected');
    } else {
      requestUserLocation();
    }
  };

  const dismissLocationPrompt = () => {
    setIsPromptOpen(false);
    localStorage.setItem('heatmapx_loc_prompt_shown', 'true');
  };

  return (
    <AreaContext.Provider value={{
      allAreas,
      currentArea,
      currentAreaId,
      weatherData,
      weatherLoading,
      weatherError,
      isLiveWeather: Boolean(weatherData?.isLive),
      userLocation,
      userArea,
      userAreaId,
      locationStatus,
      locationSource,
      isPromptOpen,
      isSelectorOpen,
      isDetectingLocation,
      citySummary,
      setAreaById,
      requestUserLocation,
      resetToMyLocation,
      dismissLocationPrompt,
      openAreaSelector: () => setIsSelectorOpen(true),
      closeAreaSelector: () => setIsSelectorOpen(false),
      openLocationPrompt: () => setIsPromptOpen(true)
    }}>
      {children}
    </AreaContext.Provider>
  );
}

export function useArea() {
  const context = useContext(AreaContext);
  if (!context) {
    throw new Error('useArea must be used within an AreaProvider');
  }
  return context;
}
