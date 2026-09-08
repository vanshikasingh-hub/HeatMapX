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

  // Turn-by-turn guidance with thermal warnings
  const steps = [
    {
      instruction: `Depart from ${origin.name}`,
      distanceMeters: 400,
      shadeLevel: "Low",
      temperature: `${(origin.metrics.lst * 0.95).toFixed(1)}°C`,
      thermalWarning: "Direct solar glare on asphalt — recommend UV umbrella or cap."
    },
    {
      instruction: "Turn right onto tree-lined avenue toward Green Belt",
      distanceMeters: 850,
      shadeLevel: "High (Canopy Cover)",
      temperature: "32.4°C",
      thermalWarning: "Favorable microclimate under neem canopy (-4.2°C ambient reduction)."
    },
    {
      instruction: "Pass Municipal Hydration Point / Public Water ATM",
      distanceMeters: 550,
      shadeLevel: "Moderate",
      temperature: "34.1°C",
      thermalWarning: "Refill drinking water here; free chilled municipal kiosk available."
    },
    {
      instruction: "Traverse shaded park promenade walkway",
      distanceMeters: 900,
      shadeLevel: "Very High",
      temperature: "31.0°C",
      thermalWarning: "Optimal thermal comfort segment — cool misting active 11am-4pm."
    },
    {
      instruction: `Arrive at destination: ${destination.name}`,
      distanceMeters: 300,
      shadeLevel: "Moderate",
      temperature: `${(destination.metrics.lst * 0.92).toFixed(1)}°C`,
      thermalWarning: "Destination reached. Cool shelter and rest benches available."
    }
  ];

  // Heat & elevation profile along route
  const profile = [
    { distanceKm: 0.0, elevation: 126, heatScore: 84, shadePct: 15 },
    { distanceKm: 0.8, elevation: 127, heatScore: 68, shadePct: 45 },
    { distanceKm: 1.6, elevation: 128, heatScore: 42, shadePct: 82 },
    { distanceKm: 2.4, elevation: 129, heatScore: 35, shadePct: 90 },
    { distanceKm: 3.2, elevation: 128, heatScore: 48, shadePct: 70 },
    { distanceKm: 4.0, elevation: 127, heatScore: 55, shadePct: 50 },
    { distanceKm: 4.8, elevation: 126, heatScore: 50, shadePct: 60 }
  ];

  // Municipal hydration points
  const waterStops = [
    {
      id: "ws_1",
      name: "Civil Lines Municipal Water ATM",
      coords: [startLat + (endLat - startLat) * 0.35 + 0.002, startLng + (endLng - startLng) * 0.30],
      type: "Cold RO Drinking Water Kiosk (Free)",
      active: true
    },
    {
      id: "ws_2",
      name: "Nana Rao Park Shade Pavilion",
      coords: [startLat + (endLat - startLat) * 0.65 + 0.004, startLng + (endLng - startLng) * 0.60 - 0.003],
      type: "Tree Canopy & Evaporative Misting Rest Stop",
      active: true
    }
  ];

  return {
    origin: { id: origin.id, name: origin.name, coords: [origin.latitude, origin.longitude] },
    destination: { id: destination.id, name: destination.name, coords: [destination.latitude, destination.longitude] },
    shortestRoute: {
      id: "route_fastest",
      name: "Fastest Direct Route",
      distanceKm: shortestDistanceKm,
      estimatedWalkTimeMins: Math.round(shortestDistanceKm * 13),
      avgThermalRisk: avgPathRiskDirect,
      thermalExposureIndex: shortestThermalExposureIndex,
      shadePercentage: 22,
      waterStopsCount: 1,
      color: "#ef4444",
      description: "Direct road network via high-traffic urban corridors. High solar exposure.",
      waypoints: shortestWaypoints
    },
    coolRoute: {
      id: "route_coolest",
      name: "Heat-Aware Cool Route",
      distanceKm: coolRouteDistanceKm,
      estimatedWalkTimeMins: Math.round(coolRouteDistanceKm * 15),
      avgThermalRisk: avgPathRiskCool,
      thermalExposureIndex: coolThermalExposureIndex,
      shadePercentage: 78,
      waterStopsCount: 2,
      color: "#10b981",
      description: "Prioritizes tree canopy avenues, park pathways, and covered walkways.",
      thermalStressReductionPct: Math.round(((shortestThermalExposureIndex - coolThermalExposureIndex) / shortestThermalExposureIndex) * 100),
      waypoints: coolWaypoints
    },
    balancedRoute: {
      id: "route_balanced",
      name: "Balanced Route",
      distanceKm: balancedDistanceKm,
      estimatedWalkTimeMins: Math.round(balancedDistanceKm * 14),
      avgThermalRisk: balancedRisk,
      thermalExposureIndex: balancedThermalExposureIndex,
      shadePercentage: 54,
      waterStopsCount: 2,
      color: "#28B8F2",
      description: "Equitable tradeoff between walking detour and shade protection.",
      thermalStressReductionPct: Math.round(((shortestThermalExposureIndex - balancedThermalExposureIndex) / shortestThermalExposureIndex) * 100),
      waypoints: balancedWaypoints
    },
    steps,
    profile,
    waterStops
  };
}

module.exports = {
  calculateRiskScore,
  getHeatDrivers,
  runDigitalTwinSimulation,
  calculateCoolRoute
};
