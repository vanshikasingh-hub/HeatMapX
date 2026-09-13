const { kanpurZones } = require('./kanpurGeoData');

/**
 * Calculates normalized composite heat risk score (0 - 100)
 * Gated by real thermal conditions (Air Temperature, Heat Index, LST) so comfortable
 * weather is NEVER marked Critical or High.
 */
function calculateRiskScore(metrics = {}) {
  const airTemp = typeof metrics.airTemperature === 'number' ? metrics.airTemperature : 28.0;
  const heatIndex = typeof metrics.heatIndex === 'number' 
    ? metrics.heatIndex 
    : (typeof metrics.feelsLike === 'number' ? metrics.feelsLike : airTemp);
  const lst = typeof metrics.lst === 'number' ? metrics.lst : (airTemp + 4.5);
  const isDay = metrics.isDay !== undefined ? Boolean(metrics.isDay) : true;
  const windSpeed = typeof metrics.windSpeed === 'number' ? metrics.windSpeed : 8.0;

  // 1. Primary Thermal Hazard Score (0 - 100)
  // Below 28°C: minimal hazard; 32°C: moderate; 38°C: high; 42°C+: critical
  const airHazard = Math.min(100, Math.max(0, ((airTemp - 26) / 16) * 100));
  const heatIndexHazard = Math.min(100, Math.max(0, ((heatIndex - 28) / 18) * 100));
  const lstHazard = Math.min(100, Math.max(0, ((lst - 30) / 18) * 100));

  // Weighted thermal hazard (Air temp and feels-like dominate human experience)
  let thermalHazard = (airHazard * 0.45) + (heatIndexHazard * 0.35) + (lstHazard * 0.20);

  // At night, direct solar irradiance is absent; thermal stress is purely convective/radiative
  if (!isDay) {
    thermalHazard *= 0.85;
  }

  // Wind moderation: strong breezes (>15 km/h) alleviate heat; stagnant air (<3 km/h) exacerbates heat
  if (windSpeed > 15) {
    thermalHazard = Math.max(0, thermalHazard - 4);
  } else if (windSpeed < 3 && thermalHazard > 25) {
    thermalHazard = Math.min(100, thermalHazard + 3);
  }

  // Environmental modifiers (canopy, built-up, soil moisture)
  const normNdbi = Math.min(100, Math.max(0, (((metrics.ndbi ?? 0.5) - (-0.2)) / 1.0) * 100));
  const normNdviInverted = Math.min(100, Math.max(0, ((0.7 - (metrics.ndvi ?? 0.25)) / 0.7) * 100));
  const normSmiInverted = Math.min(100, Math.max(0, ((0.6 - (metrics.smi ?? 0.25)) / 0.6) * 100));
  const envModifier = (normNdbi * 0.4) + (normNdviInverted * 0.35) + (normSmiInverted * 0.25);

  // Demographic exposure & vulnerability
  const normPop = Math.min(100, Math.max(0, (((metrics.populationDensity || 15000) - 2000) / 33000) * 100));
  const normVuln = Math.min(100, Math.max(0, metrics.vulnerabilityScore || 50));
  const demographicFactor = (normPop * 0.5) + (normVuln * 0.5);

  // Core Physical Principle: If there is no thermal heat hazard, risk cannot be high!
  // Demographics and built-up factors act as amplifiers WHEN heat is present.
  let score;
  if (thermalHazard < 15) {
    // Completely comfortable / cool conditions
    score = Math.round(thermalHazard * 1.1);
  } else if (thermalHazard < 35) {
    // Mild / warm conditions
    score = Math.round((thermalHazard * 0.70) + (envModifier * 0.15) + (demographicFactor * 0.15));
  } else {
    // Significant to severe heat conditions
    score = Math.round((thermalHazard * 0.60) + (envModifier * 0.20) + (demographicFactor * 0.20));
  }

  // Physical Sanity Guardrails:
  // If actual air temperature is comfortable (<29°C) and feels-like < 34°C, heat risk cannot be High or Critical
  if (airTemp < 29.0 && heatIndex < 34.0) {
    score = Math.min(28, score);
  } else if (airTemp < 32.0 && heatIndex < 37.0) {
    score = Math.min(48, score);
  }

  score = Math.min(100, Math.max(0, score));

  // Standardized Citizen Risk Levels
  let level = 'Low';
  let reason = '';
  let advice = '';

  if (score >= 85) {
    level = 'Critical';
    if (!isDay) {
      reason = 'Critical nocturnal heat retention with high humidity restricting indoor cooling.';
      advice = 'Ensure active mechanical cooling or high-speed cross-ventilation; stay hydrated overnight.';
    } else {
      reason = 'Dangerous surface heat and extreme ambient temperatures create critical heat stress.';
      advice = 'Stay indoors in shaded or cooled environments; avoid direct afternoon sun exposure.';
    }
  } else if (score >= 70) {
    level = 'Very High';
    if (!isDay) {
      reason = 'Elevated nighttime thermal stress; heat trapped in dense concrete and asphalt surfaces.';
      advice = 'Keep sleeping quarters ventilated; avoid strenuous outdoor activity; drink water before sleeping.';
    } else {
      reason = 'Severe heat stress driven by elevated air temperature and high solar radiation.';
      advice = 'Minimize prolonged outdoor activity; drink water frequently and rest in shade.';
    }
  } else if (score >= 50) {
    level = 'High';
    if (!isDay) {
      reason = 'Warm nocturnal temperatures with elevated humidity slowing natural body cooling.';
      advice = 'Keep windows open for natural cross-ventilation; maintain adequate hydration through the night.';
    } else {
      reason = 'High air temperature combined with elevated humidity is increasing heat stress.';
      advice = 'Stay hydrated and seek shade during peak sunlight hours (12 PM – 4 PM).';
    }
  } else if (score >= 30) {
    level = 'Moderate';
    if (!isDay) {
      reason = 'Mild nocturnal warmth; surface heat dissipating gradually into the night sky.';
      advice = 'Comfortable evening/night routines; safe for outdoor walks and night travel.';
    } else {
      reason = 'Moderate daytime warmth; direct sunlight is warming unshaded paved surfaces.';
      advice = 'Normal daily routines permitted; carry water and wear sun protection when traveling.';
    }
  } else {
    level = 'Low';
    if (!isDay) {
      reason = 'Pleasant nighttime ambient weather with minimal nocturnal heat retention.';
      advice = 'Safe and comfortable outdoor evening conditions for all citizens.';
    } else {
      reason = 'Comfortable ambient weather with minimal heat stress across the neighborhood.';
      advice = 'Safe outdoor conditions for citizens of all age groups.';
    }
  }

  return { 
    score, 
    level, 
    reason, 
    advice, 
    hazard: Math.round(thermalHazard), 
    exposure: Math.round(normPop), 
    vulnerability: Math.round(normVuln) 
  };
}

/**
 * Calculates driver breakdown percentages for explainable AI module
 */
function getHeatDrivers(metrics) {
  const normLst = Math.min(100, Math.max(0, ((metrics.lst - 30) / 18) * 100));
  const normNdbi = Math.min(100, Math.max(0, ((metrics.ndbi - (-0.2)) / 1.0) * 100));
  const normNdviInverted = Math.min(100, Math.max(0, ((0.7 - metrics.ndvi) / 0.7) * 100));
  const normSmiInverted = Math.min(100, Math.max(0, ((0.6 - metrics.smi) / 0.6) * 100));
  const normAlbedoInverted = Math.min(100, Math.max(0, ((0.30 - metrics.albedo) / 0.25) * 100));
  const normAnth = metrics.anthropogenicHeatProxy || 40;

  const rawDrivers = [
    { factor: "High Built-Up Density (NDBI)", weight: normNdbi * 0.35, value: metrics.ndbi, unit: "Index" },
    { factor: "High Surface Temp (LST)", weight: normLst * 0.30, value: metrics.lst, unit: "°C" },
    { factor: "Low Vegetation Cover (NDVI)", weight: normNdviInverted * 0.18, value: metrics.ndvi, unit: "Index" },
    { factor: "Low Soil Moisture (SMI)", weight: normSmiInverted * 0.08, value: metrics.smi, unit: "Index" },
    { factor: "Anthropogenic / Exhaust Heat", weight: normAnth * 0.05, value: normAnth, unit: "Proxy" },
    { factor: "Low Surface Albedo", weight: normAlbedoInverted * 0.04, value: metrics.albedo, unit: "Reflectance" }
  ];

  const totalWeight = rawDrivers.reduce((acc, curr) => acc + curr.weight, 0) || 1;

  const drivers = rawDrivers.map(d => ({
    factor: d.factor,
    percentage: Math.round((d.weight / totalWeight) * 100),
    value: d.value,
    unit: d.unit
  })).sort((a, b) => b.percentage - a.percentage);

  // Generate dynamic text explanation
  const top1 = drivers[0];
  const top2 = drivers[1];
  const explanation = `This zone experiences elevated thermal stress primarily due to ${top1.factor.toLowerCase()} (${top1.percentage}%) and ${top2.factor.toLowerCase()} (${top2.percentage}%). High built-up fraction traps shortwave solar energy while sparse vegetation restricts latent heat flux.`;

  return { drivers, explanation };
}

/**
 * Runs digital twin "What-If" scenario simulation
 */
function runDigitalTwinSimulation(baselineMetrics, params) {
  const { treeCoverIncreasePct = 0, albedoIncreasePct = 0, coolRoofCoveragePct = 0, waterFeatureAddition = false, builtUpReductionPct = 0 } = params;

  const lstDeltaTree = (treeCoverIncreasePct / 10) * 0.8;
  const lstDeltaAlbedo = (albedoIncreasePct / 10) * 0.6;
  const lstDeltaRoof = (coolRoofCoveragePct / 10) * 0.5;
  const lstDeltaBuilt = (builtUpReductionPct / 10) * 0.4;
  const lstDeltaWater = waterFeatureAddition ? 0.9 : 0;

  const totalLstReduction = Number((lstDeltaTree + lstDeltaAlbedo + lstDeltaRoof + lstDeltaBuilt + lstDeltaWater).toFixed(1));
  const simulatedLst = Number(Math.max(28, baselineMetrics.lst - totalLstReduction).toFixed(1));
  
  const simulatedNdvi = Number(Math.min(0.85, baselineMetrics.ndvi + (treeCoverIncreasePct / 100) * 0.45).toFixed(2));
  const simulatedAlbedo = Number(Math.min(0.45, baselineMetrics.albedo + (albedoIncreasePct / 100) * 0.20 + (coolRoofCoveragePct / 100) * 0.15).toFixed(2));
  const simulatedAirTemp = Number(Math.max(26, baselineMetrics.airTemperature - totalLstReduction * 0.4 - (waterFeatureAddition ? 1.1 : 0)).toFixed(1));

  const simulatedMetrics = {
    ...baselineMetrics,
    lst: simulatedLst,
    airTemperature: simulatedAirTemp,
    heatIndex: Number((simulatedAirTemp * 1.18).toFixed(1)),
    ndvi: simulatedNdvi,
    albedo: simulatedAlbedo,
    smi: Number(Math.min(0.8, baselineMetrics.smi + (waterFeatureAddition ? 0.18 : 0) + (treeCoverIncreasePct / 100) * 0.1).toFixed(2))
  };

  const baselineRisk = calculateRiskScore(baselineMetrics);
  const simulatedRisk = calculateRiskScore(simulatedMetrics);

  const riskScoreDelta = baselineRisk.score - simulatedRisk.score;
  const populationBenefitedEstimate = Math.round(baselineMetrics.populationDensity * 0.45 * (1 + (treeCoverIncreasePct / 50)));

  return {
    baseline: {
      riskScore: baselineRisk.score,
      riskLevel: baselineRisk.level,
      lst: baselineMetrics.lst,
      airTemperature: baselineMetrics.airTemperature,
      ndvi: baselineMetrics.ndvi,
      albedo: baselineMetrics.albedo
    },
    simulated: {
      riskScore: simulatedRisk.score,
      riskLevel: simulatedRisk.level,
      lst: simulatedLst,
      airTemperature: simulatedAirTemp,
      ndvi: simulatedNdvi,
      albedo: simulatedAlbedo
    },
    deltas: {
      lstReduction: totalLstReduction,
      riskScoreDelta,
      populationBenefitedEstimate
    }
  };
}

/**
 * Calculates Heat-Aware Route vs Shortest Route
 */
function calculateCoolRoute(originId, destinationId) {
  const origin = kanpurZones.find(z => z.id === originId) || kanpurZones[0];
  const destination = kanpurZones.find(z => z.id === destinationId) || kanpurZones[5]; // IIT Kanpur default destination

  // Calculate Euclidean distance as proxy for distance (in km)
  const dLat = (destination.latitude - origin.latitude) * 111;
  const dLon = (destination.longitude - origin.longitude) * 111 * Math.cos(origin.latitude * Math.PI / 180);
  const directDistanceKm = Number(Math.sqrt(dLat * dLat + dLon * dLon).toFixed(2));

  // Intermediate steps
  const shortestDistanceKm = Number((directDistanceKm * 1.25).toFixed(2));
  const coolRouteDistanceKm = Number((directDistanceKm * 1.38).toFixed(2)); // Slightly longer path through green/shaded zones

  const originRisk = calculateRiskScore(origin.metrics).score;
  const destRisk = calculateRiskScore(destination.metrics).score;
  const avgPathRiskDirect = Math.round((originRisk + destRisk) / 2);
  const avgPathRiskCool = Math.max(22, Math.round(avgPathRiskDirect * 0.58)); // 42% thermal risk reduction

  const shortestThermalExposureIndex = Math.round(shortestDistanceKm * avgPathRiskDirect * 1.2);
  const coolThermalExposureIndex = Math.round(coolRouteDistanceKm * avgPathRiskCool * 1.2);
  const balancedDistanceKm = Number(((shortestDistanceKm + coolRouteDistanceKm) / 2).toFixed(2));
  const balancedRisk = Math.round((avgPathRiskDirect + avgPathRiskCool) / 2);
  const balancedThermalExposureIndex = Math.round(balancedDistanceKm * balancedRisk * 1.2);

  // Generate intermediate waypoint coordinates for map polylines
  const startLat = origin.latitude;
  const startLng = origin.longitude;
  const endLat = destination.latitude;
  const endLng = destination.longitude;

  // Direct route waypoints (straight line with slight street offsets)
  const shortestWaypoints = [
    [startLat, startLng],
    [startLat + (endLat - startLat) * 0.25, startLng + (endLng - startLng) * 0.20 + 0.002],
    [startLat + (endLat - startLat) * 0.50, startLng + (endLng - startLng) * 0.52 - 0.001],
    [startLat + (endLat - startLat) * 0.75, startLng + (endLng - startLng) * 0.78 + 0.002],
    [endLat, endLng]
  ];

  // Cool route waypoints (diverting into parks / shaded canopies)
  const coolWaypoints = [
    [startLat, startLng],
    [startLat + (endLat - startLat) * 0.20 + 0.004, startLng + (endLng - startLng) * 0.15 - 0.005],
    [startLat + (endLat - startLat) * 0.45 + 0.006, startLng + (endLng - startLng) * 0.40 - 0.007],
    [startLat + (endLat - startLat) * 0.70 + 0.005, startLng + (endLng - startLng) * 0.65 - 0.004],
    [startLat + (endLat - startLat) * 0.88 + 0.002, startLng + (endLng - startLng) * 0.85 - 0.002],
    [endLat, endLng]
  ];

  // Balanced route waypoints
  const balancedWaypoints = [
    [startLat, startLng],
    [startLat + (endLat - startLat) * 0.30 + 0.002, startLng + (endLng - startLng) * 0.28 - 0.002],
    [startLat + (endLat - startLat) * 0.60 + 0.003, startLng + (endLng - startLng) * 0.58 - 0.003],
    [startLat + (endLat - startLat) * 0.85 + 0.001, startLng + (endLng - startLng) * 0.82 - 0.001],
    [endLat, endLng]
  ];

  // Calculate Route Score: w1 * Thermal Exposure + w2 * Sun Exposure + w3 * (100 - Shade) + w4 * Walking Cost
  function calcScore(thermalExp, sunExp, shadePct, distKm) {
    const wThermal = 0.35;
    const wSun = 0.25;
    const wShade = 0.25;
    const wWalk = 0.15;
    const normWalk = Math.min(100, Math.max(10, (distKm / 4.0) * 100));
    return Math.round(wThermal * thermalExp + wSun * sunExp + wShade * Math.max(0, 100 - shadePct) + wWalk * normWalk);
  }

  const coolRouteScore = calcScore(coolThermalExposureIndex, 20, 80, coolRouteDistanceKm);
  const balancedRouteScore = calcScore(balancedThermalExposureIndex, 48, 55, balancedDistanceKm);
  const shortestRouteScore = calcScore(shortestThermalExposureIndex, 84, 20, shortestDistanceKm);

  // Per-route Turn-by-Turn Guidance
  const coolSteps = [
    {
      step: 1,
      instruction: `Depart from ${origin.name} via pedestrian sidewalk`,
      maneuver: "start",
      distanceMeters: Math.round(coolRouteDistanceKm * 120),
      shadeLevel: "Moderate (45%)",
      temperature: `${(origin.metrics.airTemperature).toFixed(1)}°C`,
      thermalWarning: "Morning ground heat rising; shaded tree corridor starts in 150 m."
    },
    {
      step: 2,
      instruction: "Turn right into shaded Green Belt Avenue / Tree-Lined Promenade",
      maneuver: "turn-right",
      distanceMeters: Math.round(coolRouteDistanceKm * 240),
      shadeLevel: "High Canopy (85%)",
      temperature: `${(origin.metrics.airTemperature - 2.8).toFixed(1)}°C`,
      thermalWarning: "🌳 Shaded segment active — ambient temperature reduced by ~3.2°C."
    },
    {
      step: 3,
      instruction: "Pass Nana Rao Park / Municipal Hydration & Misting Pavilion",
      maneuver: "straight",
      distanceMeters: Math.round(coolRouteDistanceKm * 280),
      shadeLevel: "Very High (92%)",
      temperature: `${(origin.metrics.airTemperature - 3.4).toFixed(1)}°C`,
      thermalWarning: "💧 Free municipal chilled drinking water kiosk and misting canopy available."
    },
    {
      step: 4,
      instruction: "Turn left along covered sidewalk portico toward destination precinct",
      maneuver: "turn-left",
      distanceMeters: Math.round(coolRouteDistanceKm * 220),
      shadeLevel: "High (78%)",
      temperature: `${(destination.metrics.airTemperature - 2.1).toFixed(1)}°C`,
      thermalWarning: null
    },
    {
      step: 5,
      instruction: `Arrive safely at ${destination.name}`,
      maneuver: "arrival",
      distanceMeters: Math.max(120, Math.round(coolRouteDistanceKm * 140)),
      shadeLevel: "Moderate (65%)",
      temperature: `${(destination.metrics.airTemperature).toFixed(1)}°C`,
      thermalWarning: "🏁 Destination reached with minimal cumulative solar radiation."
    }
  ];

  const balancedSteps = [
    {
      step: 1,
      instruction: `Start from ${origin.name} heading toward collector road`,
      maneuver: "start",
      distanceMeters: Math.round(balancedDistanceKm * 180),
      shadeLevel: "Moderate (50%)",
      temperature: `${(origin.metrics.airTemperature + 0.8).toFixed(1)}°C`,
      thermalWarning: null
    },
    {
      step: 2,
      instruction: "Turn slightly right onto semi-canopied secondary corridor",
      maneuver: "turn-right",
      distanceMeters: Math.round(balancedDistanceKm * 320),
      shadeLevel: "Moderate (60%)",
      temperature: `${(origin.metrics.airTemperature - 1.2).toFixed(1)}°C`,
      thermalWarning: "Balanced shade protection along street tree line."
    },
    {
      step: 3,
      instruction: "Cross signalized junction and continue straight under building awnings",
      maneuver: "straight",
      distanceMeters: Math.round(balancedDistanceKm * 300),
      shadeLevel: "Moderate (52%)",
      temperature: `${(destination.metrics.airTemperature).toFixed(1)}°C`,
      thermalWarning: "⚠ Open intersection crossing ahead (~80 m with direct solar exposure)."
    },
    {
      step: 4,
      instruction: `Enter ${destination.name} precinct`,
      maneuver: "arrival",
      distanceMeters: Math.max(140, Math.round(balancedDistanceKm * 200)),
      shadeLevel: "Moderate (55%)",
      temperature: `${destination.metrics.airTemperature.toFixed(1)}°C`,
      thermalWarning: "🏁 Destination reached. Balanced trade-off between walk time and shade."
    }
  ];

  const shortestSteps = [
    {
      step: 1,
      instruction: `Exit ${origin.name} onto direct arterial highway / main road`,
      maneuver: "start",
      distanceMeters: Math.round(shortestDistanceKm * 250),
      shadeLevel: "Low (20%)",
      temperature: `${(origin.metrics.airTemperature + 2.6).toFixed(1)}°C`,
      thermalWarning: "⚠ High heat exposure ahead — direct sunlight on asphalt corridor."
    },
    {
      step: 2,
      instruction: "Walk straight along unshaded asphalt thoroughfare with heavy traffic",
      maneuver: "straight",
      distanceMeters: Math.round(shortestDistanceKm * 450),
      shadeLevel: "Very Low (15%)",
      temperature: `${(origin.metrics.airTemperature + 3.8).toFixed(1)}°C`,
      thermalWarning: "⚠ Intense thermal stress peak (>42°C radiant heat) — stay hydrated!"
    },
    {
      step: 3,
      instruction: `Turn into destination access gates at ${destination.name}`,
      maneuver: "arrival",
      distanceMeters: Math.max(150, Math.round(shortestDistanceKm * 300)),
      shadeLevel: "Low (25%)",
      temperature: `${(destination.metrics.airTemperature + 1.5).toFixed(1)}°C`,
      thermalWarning: "🏁 Arrived via fastest route. Total heat dosage was significantly higher."
    }
  ];

  // Per-route microclimate heat profiles
  function makeProfile(distKm, rType, baseT) {
    const pts = 9;
    const step = distKm / (pts - 1);
    const arr = [];
    for (let i = 0; i < pts; i++) {
      const d = Number((i * step).toFixed(2));
      const pos = i / (pts - 1);
      let score, temp, shade, cond;
      if (rType === 'cool') {
        if (pos < 0.2) { score = 46; temp = Number((baseT - 0.5).toFixed(1)); shade = 52; cond = 'Moderate Entryway'; }
        else if (pos <= 0.75) { score = Math.round(26 + Math.sin(pos * Math.PI) * 9); temp = Number((baseT - 3.2).toFixed(1)); shade = 82; cond = 'Cooler Canopy Corridor'; }
        else { score = 38; temp = Number((baseT - 1.8).toFixed(1)); shade = 68; cond = 'Shaded Approach'; }
      } else if (rType === 'balanced') {
        score = Math.round(52 + Math.sin(pos * Math.PI * 2) * 8);
        temp = Number((baseT + Math.sin(pos * 4) * 0.8).toFixed(1));
        shade = 55;
        cond = score > 58 ? 'Moderate Sun Corridor' : 'Partially Shaded Connector';
      } else {
        score = Math.round(76 + Math.sin(pos * Math.PI) * 16);
        temp = Number((baseT + 2.5 + Math.sin(pos * Math.PI) * 1.8).toFixed(1));
        shade = 20;
        cond = score >= 80 ? 'High Heat Stress Peak' : 'Unshaded Roadway';
      }
      arr.push({ distanceKm: d, heatScore: score, temperature: temp, shadePct: shade, segmentCondition: cond });
    }
    return arr;
  }

  const baseTemp = Number(((origin.metrics.airTemperature + destination.metrics.airTemperature) / 2).toFixed(1));
  const coolProfile = makeProfile(coolRouteDistanceKm, 'cool', baseTemp);
  const balancedProfile = makeProfile(balancedDistanceKm, 'balanced', baseTemp);
  const shortestProfile = makeProfile(shortestDistanceKm, 'shortest', baseTemp);

  const waterStops = [
    {
      id: "ws_1",
      name: "Kanpur Nagar Nigam Hydration Kiosk",
      coords: [
        Number((startLat + (endLat - startLat) * 0.35 + 0.0015).toFixed(4)),
        Number((startLng + (endLng - startLng) * 0.35 - 0.001).toFixed(4))
      ],
      type: "Free Chilled RO Drinking Water (Active)",
      active: true
    },
    {
      id: "ws_2",
      name: "Green Belt Misting & Shade Gazebo",
      coords: [
        Number((startLat + (endLat - startLat) * 0.68 + 0.002).toFixed(4)),
        Number((startLng + (endLng - startLng) * 0.68 - 0.0015).toFixed(4))
      ],
      type: "Evaporative Micro-Misting Shelter (-4°C)",
      active: true
    }
  ];

  return {
    origin: { id: origin.id, name: origin.name, coords: [origin.latitude, origin.longitude] },
    destination: { id: destination.id, name: destination.name, coords: [destination.latitude, destination.longitude] },
    shortestRoute: {
      id: "route_fastest",
      type: "shortest",
      name: "⚡ Fastest Direct Route",
      distanceKm: shortestDistanceKm,
      estimatedWalkTimeMins: Math.round(shortestDistanceKm * 13),
      avgThermalRisk: avgPathRiskDirect,
      thermalExposureIndex: shortestThermalExposureIndex,
      shadePercentage: 20,
      routeScore: shortestRouteScore,
      waterStopsCount: 0,
      color: "#ef4444",
      description: "Direct road network via high-traffic urban corridors. High solar exposure.",
      waypoints: shortestWaypoints,
      steps: shortestSteps,
      profile: shortestProfile
    },
    coolRoute: {
      id: "route_coolest",
      type: "cool",
      name: "🌿 Heat-Aware Cool Route",
      distanceKm: coolRouteDistanceKm,
      estimatedWalkTimeMins: Math.round(coolRouteDistanceKm * 14),
      avgThermalRisk: avgPathRiskCool,
      thermalExposureIndex: coolThermalExposureIndex,
      shadePercentage: 80,
      routeScore: coolRouteScore,
      waterStopsCount: 2,
      color: "#10b981",
      description: "Prioritizes tree canopy avenues, park pathways, and covered walkways.",
      thermalStressReductionPct: Math.round(((shortestThermalExposureIndex - coolThermalExposureIndex) / shortestThermalExposureIndex) * 100),
      waypoints: coolWaypoints,
      steps: coolSteps,
      profile: coolProfile
    },
    balancedRoute: {
      id: "route_balanced",
      type: "balanced",
      name: "⚖️ Balanced Route",
      distanceKm: balancedDistanceKm,
      estimatedWalkTimeMins: Math.round(balancedDistanceKm * 13.5),
      avgThermalRisk: balancedRisk,
      thermalExposureIndex: balancedThermalExposureIndex,
      shadePercentage: 55,
      routeScore: balancedRouteScore,
      waterStopsCount: 1,
      color: "#0284c7",
      description: "Equitable tradeoff between walking detour and shade protection.",
      thermalStressReductionPct: Math.round(((shortestThermalExposureIndex - balancedThermalExposureIndex) / shortestThermalExposureIndex) * 100),
      waypoints: balancedWaypoints,
      steps: balancedSteps,
      profile: balancedProfile
    },
    steps: coolSteps,
    profile: coolProfile,
    waterStops
  };
}

module.exports = {
  calculateRiskScore,
  getHeatDrivers,
  runDigitalTwinSimulation,
  calculateCoolRoute
};
