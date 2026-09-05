const { kanpurZones } = require('./kanpurGeoData');

/**
 * Calculates normalized composite heat risk score (0 - 100)
 * Uses transparent prototype formula combining Hazard, Exposure, and Vulnerability.
 */
function calculateRiskScore(metrics) {
  // Normalize LST (range 30°C to 48°C -> 0 to 100)
  const normLst = Math.min(100, Math.max(0, ((metrics.lst - 30) / 18) * 100));
  
  // Normalize Heat Index (range 35°C to 52°C -> 0 to 100)
  const normHeatIndex = Math.min(100, Math.max(0, ((metrics.heatIndex - 35) / 17) * 100));
  
  // Normalize NDBI (-0.2 to 0.8 -> 0 to 100)
  const normNdbi = Math.min(100, Math.max(0, ((metrics.ndbi - (-0.2)) / 1.0) * 100));
  
  // Normalize NDVI (inverted: 0.7 to 0.0 -> 0 to 100 heat contribution)
  const normNdvi = Math.min(100, Math.max(0, ((0.7 - metrics.ndvi) / 0.7) * 100));
  
  // Normalize SMI (inverted: 0.6 to 0.0 -> 0 to 100)
  const normSmi = Math.min(100, Math.max(0, ((0.6 - metrics.smi) / 0.6) * 100));

  // Normalize Albedo (inverted: 0.30 to 0.05 -> 0 to 100)
  const normAlbedo = Math.min(100, Math.max(0, ((0.30 - metrics.albedo) / 0.25) * 100));

  // Normalize Population Density (range 2000 to 35000 -> 0 to 100)
  const normPop = Math.min(100, Math.max(0, ((metrics.populationDensity - 2000) / 33000) * 100));

  // Vulnerability score (already 0-100)
  const normVuln = Math.min(100, Math.max(0, metrics.vulnerabilityScore));

  // 1. Hazard Component (50% weight)
  const hazard = (normLst * 0.30) + (normHeatIndex * 0.25) + (normNdbi * 0.20) + (normNdvi * 0.10) + (normSmi * 0.08) + (normAlbedo * 0.07);

  // 2. Exposure Component (25% weight)
  const exposure = normPop;

  // 3. Vulnerability Component (25% weight)
  const vulnerability = normVuln;

  // Final Composite Risk Score
  const score = Math.round((hazard * 0.50) + (exposure * 0.25) + (vulnerability * 0.25));

  let level = 'Very Low';
  if (score >= 80) level = 'Critical';
  else if (score >= 65) level = 'High';
  else if (score >= 45) level = 'Moderate';
  else if (score >= 25) level = 'Low';

  return { score, level, hazard: Math.round(hazard), exposure: Math.round(exposure), vulnerability: Math.round(vulnerability) };
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

  return {
    origin: { id: origin.id, name: origin.name, coords: [origin.latitude, origin.longitude] },
    destination: { id: destination.id, name: destination.name, coords: [destination.latitude, destination.longitude] },
    shortestRoute: {
      distanceKm: shortestDistanceKm,
      estimatedWalkTimeMins: Math.round(shortestDistanceKm * 14),
      avgThermalRisk: avgPathRiskDirect,
      thermalExposureIndex: shortestThermalExposureIndex,
      description: "Direct road network via high-traffic urban corridors"
    },
    coolRoute: {
      distanceKm: coolRouteDistanceKm,
      estimatedWalkTimeMins: Math.round(coolRouteDistanceKm * 15),
      avgThermalRisk: avgPathRiskCool,
      thermalExposureIndex: coolThermalExposureIndex,
      description: "Heat-aware pathway prioritizing tree-lined avenues, green parks, and shaded river walkways",
      thermalStressReductionPct: Math.round(((shortestThermalExposureIndex - coolThermalExposureIndex) / shortestThermalExposureIndex) * 100)
    }
  };
}

module.exports = {
  calculateRiskScore,
  getHeatDrivers,
  runDigitalTwinSimulation,
  calculateCoolRoute
};
