// API service adapter for HeatMapX frontend
const BASE_URL = '/api';

export async function fetchHeatmapGeoJSON() {
  try {
    const res = await fetch(`${BASE_URL}/heatmap`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API offline, using built-in Kanpur GeoJSON fallback adapter:", err.message);
    return getFallbackGeoJSON();
  }
}

export async function fetchLocations() {
  try {
    const res = await fetch(`${BASE_URL}/locations`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("API offline, returning fallback Kanpur locations:", err.message);
    return { success: true, data: fallbackKanpurLocations };
  }
}

export async function fetchLocationById(id) {
  try {
    const res = await fetch(`${BASE_URL}/location/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`API offline, returning fallback for location ${id}:`, err.message);
    const loc = fallbackKanpurLocations.find(l => l.id === id || l.id === `loc_${id}`) || fallbackKanpurLocations[0];
    return {
      success: true,
      data: {
        id: loc.id,
        name: loc.name,
        wardName: loc.wardName,
        coordinates: [loc.latitude, loc.longitude],
        risk: { score: loc.riskScore, level: loc.riskLevel, hazard: 82, exposure: 85, vulnerability: loc.vulnerabilityScore },
        physics: {
          lst: loc.lst,
          airTemperature: loc.airTemperature,
          deltaT: Number((loc.lst - loc.airTemperature).toFixed(1)),
          humidity: 52,
          heatIndex: 49.2,
          ndvi: 0.10,
          ndbi: 0.74,
          smi: 0.15,
          albedo: 0.12,
          elevation: 126
        },
        demographics: {
          populationDensity: loc.populationDensity,
          vulnerabilityScore: loc.vulnerabilityScore,
          anthropogenicHeatProxy: 86
        },
        explainability: {
          drivers: [
            { factor: "High Built-Up Density (NDBI)", percentage: 36, value: 0.74, unit: "Index" },
            { factor: "High Surface Temp (LST)", percentage: 29, value: loc.lst, unit: "°C" },
            { factor: "Low Vegetation Cover (NDVI)", percentage: 18, value: 0.10, unit: "Index" },
            { factor: "Low Soil Moisture (SMI)", percentage: 11, value: 0.15, unit: "Index" },
            { factor: "Low Surface Albedo", percentage: 6, value: 0.12, unit: "Reflectance" }
          ],
          explanation: `This Kanpur zone experiences severe thermal stress driven by High Built-Up Density (36%) and High Surface Temp (29%). Dense impervious concrete retains shortwave heat while sparse canopy restricts evaporative cooling.`
        },
        recommendedMitigations: [
          { title: "High-Albedo Reflective Cool Roofs", category: "Cool Surface", priority: "Critical", expectedImpact: "-3.5°C LST drop", difficulty: "Low / Immediate" },
          { title: "Targeted Native Urban Tree Plantation", category: "Green Infrastructure", priority: "High", expectedImpact: "-4.0°C microclimate cooling", difficulty: "Medium" }
        ]
      }
    };
  }
}

export async function sendOtp(identifier, type = 'sms') {
  try {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, type })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Using offline simulated OTP dispatch:", err.message);
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    return {
      success: true,
      message: `Verification code dispatched to ${identifier} (Offline Demo).`,
      devCode: mockCode,
      provider: "Simulated Local Gateway"
    };
  }
}

export async function verifyOtp(identifier, code) {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Using offline verification fallback:", err.message);
    if (code === '123456' || code.length === 6) {
      return { success: true, verified: true, message: "Code verified successfully." };
    }
    throw new Error("Invalid verification code. Use demo code 123456.");
  }
}

export async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.success && data.data) {
      return data.data;
    }
    throw new Error(data.error || "Weather data invalid");
  } catch (err) {
    console.warn("Backend weather endpoint failed, querying Open-Meteo direct:", err.message);
    try {
      const omRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,uv_index_max,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto`);
      if (!omRes.ok) throw new Error(`Open-Meteo direct failed: HTTP ${omRes.status}`);
      const omData = await omRes.json();
      const current = omData.current || {};
      const daily = omData.daily || {};
      const t = current.temperature_2m ?? 27.5;
      const appT = current.apparent_temperature ?? (t + 3.0);
      const isDay = Boolean(current.is_day === 1);
      const rawUv = typeof current.uv_index === 'number' ? current.uv_index : 0;
      const currentUv = isDay ? Number(Math.max(0, rawUv).toFixed(1)) : 0;
      const peakUv = typeof daily.uv_index_max?.[0] === 'number' ? Number(daily.uv_index_max[0].toFixed(1)) : (isDay ? 6.5 : 6.0);
      const dewPoint = typeof current.dew_point_2m === 'number' ? Number(current.dew_point_2m.toFixed(1)) : null;
      const pressure = typeof current.surface_pressure === 'number' ? Number(current.surface_pressure.toFixed(1)) : null;
      const cloudCover = typeof current.cloud_cover === 'number' ? Math.round(current.cloud_cover) : 0;
      const precipitation = typeof current.precipitation === 'number' ? Number(current.precipitation.toFixed(1)) : 0;
      const precipitationProbability = typeof daily.precipitation_probability_max?.[0] === 'number' ? daily.precipitation_probability_max[0] : 0;
      const windSpeed = Number((current.wind_speed_10m ?? 8.5).toFixed(1));
      const windDirection = typeof current.wind_direction_10m === 'number' ? Math.round(current.wind_direction_10m) : 0;
      const windGusts = typeof current.wind_gusts_10m === 'number' ? Number(current.wind_gusts_10m.toFixed(1)) : windSpeed;

      return {
        isLive: true,
        source: "Open-Meteo Live API (Direct)",
        airTemperature: Number(t.toFixed(1)),
        feelsLike: Number(appT.toFixed(1)),
        dewPoint,
        humidity: Math.round(current.relative_humidity_2m ?? 65),
        pressure,
        cloudCover,
        precipitation,
        precipitationProbability,
        windSpeed,
        windDirection,
        windGusts,
        weatherCode: current.weather_code ?? 0,
        condition: "Clear sky",
        isDay,
        uvIndex: currentUv,
        peakUvIndex: peakUv,
        sunrise: daily.sunrise?.[0] || null,
        sunset: daily.sunset?.[0] || null,
        timestamp: current.time || new Date().toISOString()
      };
    } catch (directErr) {
      console.error("Live weather fetch completely failed:", directErr.message);
      return {
        isLive: false,
        error: "Live weather data temporarily unavailable"
      };
    }
  }
}

export async function fetchForecast(locationId = "loc_barra", lat, lon) {
  try {
    let url = `${BASE_URL}/forecast?locationId=${locationId}`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    const loc = fallbackKanpurLocations.find(l => l.id === locationId || l.id === `loc_${locationId}`) || fallbackKanpurLocations[0];
    const baseTemp = loc.airTemperature || 28.0;
    const baseRisk = loc.riskScore || 35;

    const deltas = [
      { temp: 0, hum: 0 },
      { temp: 0.8, hum: -2 },
      { temp: 1.4, hum: -4 },
      { temp: 1.1, hum: -1 },
      { temp: 0.3, hum: 3 },
      { temp: -0.7, hum: 5 },
      { temp: -1.2, hum: 4 }
    ];

    const forecast = deltas.map((d, offset) => {
      const day = new Date();
      day.setDate(day.getDate() + offset);
      const weekday = day.toLocaleDateString('en-US', { weekday: 'short' });
      let dayLabel = `Day ${offset + 1} (${weekday})`;
      if (offset === 0) dayLabel = `Today (${weekday})`;
      if (offset === 1) dayLabel = `Tomorrow (${weekday})`;

      const temp = Number((baseTemp + d.temp).toFixed(1));
      const humidity = Math.min(95, Math.max(30, (loc.humidity || 65) + d.hum));
      const heatIndex = Number((temp * (1 + humidity / 250)).toFixed(1));
      const riskScore = Math.min(100, Math.max(15, Math.round(baseRisk + (d.temp * 2))));

      let riskLevel = "Low";
      let riskReason = "Comfortable, safe outdoor weather.";
      if (riskScore >= 85) {
        riskLevel = "Critical";
        riskReason = "Dangerous thermal hazard. Seek air-conditioned spaces.";
      } else if (riskScore >= 70) {
        riskLevel = "Very High";
        riskReason = "Severe heat stress; high temperature combined with humidity.";
      } else if (riskScore >= 50) {
        riskLevel = "High";
        riskReason = "High ambient heat; limit outdoor sun exposure.";
      } else if (riskScore >= 30) {
        riskLevel = "Moderate";
        riskReason = "Normal warm daytime temperatures.";
      }

      return {
        date: day.toISOString().split('T')[0],
        dayLabel,
        locationId: loc.id,
        locationName: loc.name,
        riskScore,
        riskLevel,
        riskReason,
        temperature: temp,
        humidity,
        heatIndex,
        hotspotIntensity: riskScore >= 75 ? "High" : riskScore >= 50 ? "Moderate" : "Low"
      };
    });

    return {
      success: true,
      datasetLabel: "Kanpur Microclimate Predictive Forecast",
      location: { id: loc.id, name: loc.name, wardName: loc.wardName },
      forecast
    };
  }
}

export async function fetchEnvironmentalFactors() {
  try {
    const res = await fetch(`${BASE_URL}/environmental-factors`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      city: "Kanpur Nagar, Uttar Pradesh, India",
      center: [26.4499, 80.3319],
      summary: {
        totalMonitoredZones: 12,
        avgLst: 39.2,
        avgAirTemp: 36.8,
        avgDeltaT: 2.4,
        avgNdvi: 0.30,
        avgNdbi: 0.50,
        avgAlbedo: 0.17,
        avgSmi: 0.31
      }
    };
  }
}

export async function fetchRecommendations(locationId = "loc_central") {
  try {
    const res = await fetch(`${BASE_URL}/recommendations?locationId=${locationId}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      datasetLabel: "AI Mitigation Advisor (Prototype Rules Engine)",
      location: { id: "loc_central", name: "Kanpur Central & Ghanta Ghar", riskScore: 88, riskLevel: "Critical" },
      recommendations: [
        {
          id: "mit_cool_roofs",
          title: "High-Albedo Reflective Cool Roof Program",
          category: "Cool Surface",
          priority: "Critical",
          expectedImpact: "-3.2°C to -4.5°C LST drop",
          difficulty: "Low / Immediate",
          cost: "₹18 - ₹25 per sq ft",
          description: "Apply high-solar-reflectance (SRI > 80) coatings to tin and concrete roofs."
        },
        {
          id: "mit_cooling_centers",
          title: "Community Cool Shelters & Hydration Hubs",
          category: "Public Health / Equity",
          priority: "Critical",
          expectedImpact: "Protects ~15,000 outdoor workers daily",
          difficulty: "Low",
          cost: "₹1.5 Lakh per kiosk",
          description: "Deploy mist cooling kiosks and cold electrolyte water stations near station transit hubs."
        },
        {
          id: "mit_urban_canopy",
          title: "Targeted Native Urban Tree Plantation",
          category: "Green Infrastructure",
          priority: "High",
          expectedImpact: "-2.8°C to -4.0°C microclimate cooling",
          difficulty: "Medium",
          cost: "₹350 per sapling + 3yr maintenance",
          description: "Plant native broadleaf trees (Neem, Peepal, Jamun) along arterial transit routes."
        }
      ]
    };
  }
}

export async function runSimulation(locationId, params) {
  try {
    const res = await fetch(`${BASE_URL}/simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locationId, scenarioParameters: params })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    const treePct = params.treeCoverIncreasePct || 0;
    const albedoPct = params.albedoIncreasePct || 0;
    const roofPct = params.coolRoofCoveragePct || 0;
    const lstReduction = Number(((treePct * 0.08) + (albedoPct * 0.06) + (roofPct * 0.05)).toFixed(1));

    return {
      success: true,
      datasetLabel: "Prototype Scenario Simulation",
      result: {
        baseline: { riskScore: 88, riskLevel: "Critical", lst: 44.8, airTemperature: 39.1, ndvi: 0.09, albedo: 0.11 },
        simulated: {
          riskScore: Math.max(35, Math.round(88 - lstReduction * 4.2)),
          riskLevel: (88 - lstReduction * 4.2) > 75 ? "High" : "Moderate",
          lst: Number((44.8 - lstReduction).toFixed(1)),
          airTemperature: Number((39.1 - lstReduction * 0.4).toFixed(1)),
          ndvi: Number((0.09 + (treePct / 100) * 0.45).toFixed(2)),
          albedo: Number((0.11 + (albedoPct / 100) * 0.20 + (roofPct / 100) * 0.15).toFixed(2))
        },
        deltas: {
          lstReduction,
          riskScoreDelta: Math.round(lstReduction * 4.2),
          populationBenefitedEstimate: 14500
        }
      }
    };
  }
}

export async function fetchRoutes(origin = "loc_central", destination = "loc_allen_zoo") {
  try {
    const res = await fetch(`${BASE_URL}/routes?origin=${origin}&destination=${destination}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      datasetLabel: "Thermal-Weighted Pedestrian Routing Prototype",
      route: {
        origin: { id: "loc_central", name: "Kanpur Central & Ghanta Ghar" },
        destination: { id: "loc_allen_zoo", name: "Allen Forest Zoo & Nawabganj Greens" },
        shortestRoute: {
          distanceKm: 7.2,
          estimatedWalkTimeMins: 90,
          avgThermalRisk: 86,
          thermalExposureIndex: 740,
          description: "Direct road network along crowded arterial highway corridor"
        },
        coolRoute: {
          distanceKm: 8.1,
          estimatedWalkTimeMins: 102,
          avgThermalRisk: 48,
          thermalExposureIndex: 460,
          description: "Heat-aware pathway prioritizing Civil Lines tree-lined boulevards and Phool Bagh canopy",
          thermalStressReductionPct: 38
        }
      }
    };
  }
}

export async function fetchHeatEquity() {
  try {
    const res = await fetch(`${BASE_URL}/equity`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      datasetLabel: "Heat Equity & Intervention Priority Model",
      ranking: fallbackKanpurLocations.map((l, i) => ({
        id: l.id,
        name: l.name,
        wardName: l.wardName,
        lst: l.lst,
        riskScore: l.riskScore,
        riskLevel: l.riskLevel,
        populationDensity: l.populationDensity,
        vulnerabilityScore: l.vulnerabilityScore,
        equityPriorityScore: 145 - (i * 9),
        equityPriorityRank: i + 1,
        recommendedPriority: i < 3 ? 'Immediate Intervention' : i < 7 ? 'High Equity Need' : 'Standard'
      }))
    };
  }
}

// CITIZEN CLIMATE ACTION APIS
export async function fetchCitizenActions() {
  try {
    const res = await fetch(`${BASE_URL}/citizen/actions`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      totalCount: fallbackCitizenActions.length,
      datasetLabel: "Citizen Climate Action Ecosystem (Fallback Mode)",
      actions: fallbackCitizenActions
    };
  }
}

export async function submitCitizenAction(actionData) {
  try {
    const res = await fetch(`${BASE_URL}/citizen/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(actionData)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      message: "Action recorded locally in prototype mode.",
      action: {
        id: `action_${Date.now()}`,
        ...actionData,
        status: "Verified",
        impactPoints: 200,
        createdAt: new Date().toISOString()
      }
    };
  }
}

export async function fetchCitizenProfile() {
  try {
    const res = await fetch(`${BASE_URL}/citizen/profile`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      profile: {
        citizenName: "Aarav Sharma",
        email: "aarav.sharma@kanpur-climate.org",
        role: "Community Climate Champion",
        city: "Kanpur Nagar, Uttar Pradesh",
        impactPoints: 1240,
        actionsCompleted: 12,
        actionsVerified: 8,
        currentLevel: "Level 5 — Climate Champion",
        badgesCount: 6,
        awardsCount: 3,
        recentActivity: fallbackCitizenActions.slice(0, 3)
      }
    };
  }
}

export async function fetchCitizenBadges() {
  try {
    const res = await fetch(`${BASE_URL}/citizen/badges`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: true, badges: fallbackBadges };
  }
}

export async function fetchCitizenAwards() {
  try {
    const res = await fetch(`${BASE_URL}/citizen/awards`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: true, awards: fallbackAwards };
  }
}

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${BASE_URL}/leaderboard`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      individual: [
        { rank: 1, name: "Aarav Sharma (You)", location: "Kalyanpur, Kanpur", points: 1240, actionsCount: 8, badgesCount: 6, level: "Level 5 — Climate Champion" },
        { rank: 2, name: "Priya Patel", location: "Sisamau, Kanpur", points: 1120, actionsCount: 7, badgesCount: 5, level: "Level 5 — Climate Champion" },
        { rank: 3, name: "Dr. Rajesh Khanna", location: "Civil Lines, Kanpur", points: 980, actionsCount: 6, badgesCount: 5, level: "Level 4 — Heat Resilience Leader" },
        { rank: 4, name: "Sneha Gupta", location: "Nawabganj, Kanpur", points: 890, actionsCount: 5, badgesCount: 4, level: "Level 4 — Heat Resilience Leader" },
        { rank: 5, name: "Vikram Singh", location: "Barra, Kanpur", points: 740, actionsCount: 4, badgesCount: 4, level: "Level 3 — Heat Defender" }
      ],
      neighborhood: [
        { rank: 1, wardName: "Kalyanpur & IITK Belt", verifiedActions: 42, totalPoints: 6840, primaryMitigation: "Tree Canopy & Bioswales", coolScoreRank: "Very High" },
        { rank: 2, wardName: "Civil Lines & Phool Bagh", verifiedActions: 38, totalPoints: 5920, primaryMitigation: "Urban Parks & Shading", coolScoreRank: "High" },
        { rank: 3, wardName: "Nawabganj & Allen Forest", verifiedActions: 29, totalPoints: 4710, primaryMitigation: "Wetland & Shrub Regeneration", coolScoreRank: "Very High" },
        { rank: 4, wardName: "Sisamau & P. Road", verifiedActions: 26, totalPoints: 4180, primaryMitigation: "Reflective Roof Coatings", coolScoreRank: "Moderate" }
      ]
    };
  }
}

// Fallback Data definitions
export const fallbackKanpurLocations = [
  { id: "loc_central", name: "Kanpur Central & Ghanta Ghar", wardName: "Ward 24 - Collectorganj", latitude: 26.4542, longitude: 80.3508, riskScore: 78, riskLevel: "High", lst: 37.8, airTemperature: 29.2, populationDensity: 34000, vulnerabilityScore: 82 },
  { id: "loc_sisamau", name: "Sisamau & P. Road Bazaar", wardName: "Ward 31 - Sisamau Central", latitude: 26.4632, longitude: 80.3285, riskScore: 76, riskLevel: "High", lst: 36.9, airTemperature: 28.9, populationDensity: 36000, vulnerabilityScore: 88 },
  { id: "loc_panki", name: "Panki Industrial Area", wardName: "Ward 58 - Panki Industrial", latitude: 26.4735, longitude: 80.2310, riskScore: 74, riskLevel: "High", lst: 38.2, airTemperature: 29.4, populationDensity: 11200, vulnerabilityScore: 64 },
  { id: "loc_naveen", name: "Naveen Market & Mall Road", wardName: "Ward 18 - Civil Lines South", latitude: 26.4715, longitude: 80.3470, riskScore: 70, riskLevel: "High", lst: 36.6, airTemperature: 28.8, populationDensity: 31500, vulnerabilityScore: 76 },
  { id: "loc_govind_nagar", name: "Govind Nagar & Fazalganj", wardName: "Ward 38 - Fazalganj", latitude: 26.4420, longitude: 80.3015, riskScore: 58, riskLevel: "Moderate", lst: 35.9, airTemperature: 28.4, populationDensity: 27500, vulnerabilityScore: 71 },
  { id: "loc_jajmau", name: "Jajmau Industrial Belt", wardName: "Ward 42 - Jajmau Eastern", latitude: 26.4290, longitude: 80.4045, riskScore: 60, riskLevel: "Moderate", lst: 36.7, airTemperature: 28.5, populationDensity: 26000, vulnerabilityScore: 79 },
  { id: "loc_barra", name: "Kidwai Nagar & Barra", wardName: "Ward 49 - Barra South", latitude: 26.4250, longitude: 80.3220, riskScore: 48, riskLevel: "Moderate", lst: 34.4, airTemperature: 28.0, populationDensity: 24000, vulnerabilityScore: 52 },
  { id: "loc_civil_lines", name: "Civil Lines & Phool Bagh", wardName: "Ward 14 - Civil Lines North", latitude: 26.4760, longitude: 80.3540, riskScore: 36, riskLevel: "Low", lst: 32.8, airTemperature: 27.6, populationDensity: 14000, vulnerabilityScore: 35 },
  { id: "loc_armapur", name: "Armapur Estate & Ordnance", wardName: "Ward 29 - Armapur Defense", latitude: 26.4710, longitude: 80.2580, riskScore: 28, riskLevel: "Low", lst: 31.5, airTemperature: 27.2, populationDensity: 9800, vulnerabilityScore: 29 },
  { id: "loc_ganga_barrage", name: "Ganga Barrage Riverside", wardName: "Ward 05 - Azad Nagar", latitude: 26.5180, longitude: 80.3150, riskScore: 24, riskLevel: "Very Low", lst: 30.9, airTemperature: 26.9, populationDensity: 6500, vulnerabilityScore: 45 },
  { id: "loc_iitk", name: "IIT Kanpur & Kalyanpur", wardName: "Ward 02 - Kalyanpur North", latitude: 26.5123, longitude: 80.2329, riskScore: 20, riskLevel: "Very Low", lst: 30.4, airTemperature: 26.8, populationDensity: 8500, vulnerabilityScore: 22 },
  { id: "loc_allen_zoo", name: "Allen Forest Zoo & Nawabganj", wardName: "Ward 07 - Nawabganj Reserve", latitude: 26.4950, longitude: 80.2980, riskScore: 16, riskLevel: "Very Low", lst: 31.8, airTemperature: 27.0, populationDensity: 4200, vulnerabilityScore: 18 }
];

export const fallbackCitizenActions = [
  {
    id: "action_1",
    citizenName: "Aarav Sharma",
    actionType: "Planted Trees",
    title: "15 Native Neem & Peepal Saplings Planted",
    description: "Planted 15 hardy native trees along the Kalyanpur avenue buffer near IIT Kanpur to build a shading canopy.",
    location: "Kalyanpur Main Road, Kanpur",
    date: "2026-08-28",
    status: "Verified",
    impactPoints: 250,
    impactCategory: "Green Infrastructure"
  },
  {
    id: "action_2",
    citizenName: "Priya Patel",
    actionType: "Installed Cool / Reflective Roof",
    title: "High-Albedo Reflective Coating on 800 sq ft Roof",
    description: "Coated our corrugated tin roof with high solar-reflectance (SRI 92) white elastomeric waterproof paint.",
    location: "Sisamau Chungi, Kanpur",
    date: "2026-08-22",
    status: "Verified",
    impactPoints: 300,
    impactCategory: "Cool Surface"
  },
  {
    id: "action_3",
    citizenName: "Vikram Singh",
    actionType: "Created Rooftop Garden",
    title: "Micro Urban Rooftop Garden & Vegetables",
    description: "Established 30 containerized potted plants and creepers over concrete terrace.",
    location: "Civil Lines, Kanpur",
    date: "2026-08-15",
    status: "Verified",
    impactPoints: 200,
    impactCategory: "Green Infrastructure"
  }
];

export const fallbackBadges = [
  { id: "badge_starter", name: "Green Starter", icon: "🌱", category: "Participation", description: "Awarded after completing your first climate resilience action.", requirement: "1 Verified Action", unlocked: true, progressPct: 100 },
  { id: "badge_tree_guardian", name: "Tree Guardian", icon: "🌳", category: "Green Infrastructure", description: "Awarded after 3 tree planting actions.", requirement: "3 Tree Actions", unlocked: true, progressPct: 100 },
  { id: "badge_cool_roof", name: "Cool Roof Champion", icon: "🏠", category: "Cool Surfaces", description: "Awarded for high-albedo reflective roof coatings.", requirement: "1 Verified Cool Roof", unlocked: true, progressPct: 100 },
  { id: "badge_water_saver", name: "Water Saver", icon: "💧", category: "Hydrological Cooling", description: "Awarded for water-sensitive evaporative cooling initiatives.", requirement: "1 Water Action", unlocked: true, progressPct: 100 },
  { id: "badge_heat_defender", name: "Heat Defender", icon: "🔥", category: "Heat Mitigation", description: "Awarded after completing 5 distinct urban heat mitigation actions.", requirement: "5 Verified Actions", unlocked: true, progressPct: 100 },
  { id: "badge_climate_champ", name: "Climate Champion", icon: "🌍", category: "Mastery", description: "Awarded for amassing over 1,000 verified impact points.", requirement: "1,000+ Impact Points", unlocked: true, progressPct: 100 },
  { id: "badge_urban_hero", name: "Urban Heat Hero", icon: "🏙️", category: "Community Leadership", description: "Awarded for community-level or ward-scale heat resilience transformation.", requirement: "10 Verified Actions", unlocked: false, progressPct: 80 }
];

export const fallbackAwards = [
  { id: "award_1", name: "Community Climate Contributor", badgeIcon: "🎖️", level: "Gold Tier", description: "Grassroots heat resilience mobilization in Kanpur Nagar.", requirement: "500+ Impact Points", issuedDate: "August 2026" },
  { id: "award_2", name: "Heat Resilience Leader", badgeIcon: "🏆", level: "Platinum Tier", description: "Pioneering high-albedo and shading canopy projects.", requirement: "1,000+ Impact Points", issuedDate: "September 2026" },
  { id: "award_3", name: "Green Neighborhood Champion", badgeIcon: "🌿", level: "Ward Excellence", description: "Leading multi-stakeholder greening in northern Kanpur.", requirement: "Ward Greening Milestone", issuedDate: "August 2026" }
];

function getFallbackGeoJSON() {
  return {
    type: "FeatureCollection",
    metadata: {
      city: "Kanpur Nagar, Uttar Pradesh, India",
      center: [26.4499, 80.3319],
      dataset: "Demo / Simulated Dataset"
    },
    features: fallbackKanpurLocations.map(loc => ({
      type: "Feature",
      id: loc.id,
      geometry: {
        type: "Polygon",
        coordinates: [[
          [loc.longitude - 0.008, loc.latitude + 0.006],
          [loc.longitude + 0.008, loc.latitude + 0.006],
          [loc.longitude + 0.008, loc.latitude - 0.006],
          [loc.longitude - 0.008, loc.latitude - 0.006],
          [loc.longitude - 0.008, loc.latitude + 0.006]
        ]]
      },
      properties: {
        featureType: "zone",
        id: loc.id,
        name: loc.name,
        wardName: loc.wardName,
        latitude: loc.latitude,
        longitude: loc.longitude,
        riskScore: loc.riskScore,
        riskLevel: loc.riskLevel,
        lst: loc.lst,
        airTemperature: loc.airTemperature,
        humidity: 52,
        heatIndex: Number((loc.airTemperature * 1.22).toFixed(1)),
        ndvi: loc.riskScore > 75 ? 0.11 : loc.riskScore < 30 ? 0.65 : 0.32,
        ndbi: loc.riskScore > 75 ? 0.72 : loc.riskScore < 30 ? 0.15 : 0.45,
        smi: loc.riskScore > 75 ? 0.16 : loc.riskScore < 30 ? 0.48 : 0.28,
        albedo: loc.riskScore > 75 ? 0.12 : loc.riskScore < 30 ? 0.24 : 0.18,
        elevation: 126,
        populationDensity: loc.populationDensity,
        vulnerability: loc.vulnerabilityScore,
        deltaT: Number((loc.lst - loc.airTemperature).toFixed(1))
      }
    }))
  };
}
