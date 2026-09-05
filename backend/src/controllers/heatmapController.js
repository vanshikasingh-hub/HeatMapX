const { kanpurZones, kanpurRoads, kanpurHotspots, defaultMitigationCatalog } = require('../services/kanpurGeoData');
const { calculateRiskScore, getHeatDrivers, runDigitalTwinSimulation, calculateCoolRoute } = require('../services/riskModelService');
const { getCitizenActions } = require('../services/citizenService');

// GET /api/health - Health check endpoint
exports.getHealth = (req, res) => {
  res.json({
    status: "healthy",
    server: "HeatMapX REST API Server",
    port: process.env.PORT || 5000,
    demonstrationCity: "Kanpur Nagar, Uttar Pradesh, India",
    dataset: "Demo / Simulated Dataset",
    timestamp: new Date().toISOString()
  });
};

// GET /api/heatmap - Returns GeoJSON FeatureCollection for Leaflet map overlay
exports.getHeatmapGeoJSON = (req, res) => {
  try {
    // 1. Ward Polygons
    const zoneFeatures = kanpurZones.map(zone => {
      const riskAnalysis = calculateRiskScore(zone.metrics);
      const drivers = getHeatDrivers(zone.metrics);

      return {
        type: "Feature",
        id: zone.id,
        geometry: zone.geometry,
        properties: {
          featureType: "zone",
          id: zone.id,
          name: zone.name,
          wardName: zone.wardName,
          latitude: zone.latitude,
          longitude: zone.longitude,
          riskScore: riskAnalysis.score,
          riskLevel: riskAnalysis.level,
          hazardScore: riskAnalysis.hazard,
          exposureScore: riskAnalysis.exposure,
          vulnerabilityScore: riskAnalysis.vulnerability,
          lst: zone.metrics.lst,
          airTemperature: zone.metrics.airTemperature,
          humidity: zone.metrics.humidity,
          heatIndex: zone.metrics.heatIndex,
          ndvi: zone.metrics.ndvi,
          ndbi: zone.metrics.ndbi,
          smi: zone.metrics.smi,
          albedo: zone.metrics.albedo,
          elevation: zone.metrics.elevation,
          populationDensity: zone.metrics.populationDensity,
          vulnerability: zone.metrics.vulnerabilityScore,
          anthropogenicHeatProxy: zone.metrics.anthropogenicHeatProxy,
          deltaT: Number((zone.metrics.lst - zone.metrics.airTemperature).toFixed(1)),
          topDriver: drivers.drivers[0].factor
        }
      };
    });

    // 2. Road Network LineStrings
    const roadFeatures = kanpurRoads.map(road => ({
      type: "Feature",
      id: road.id,
      geometry: {
        type: "LineString",
        coordinates: road.coordinates
      },
      properties: {
        featureType: "road",
        id: road.id,
        name: road.name,
        type: road.type
      }
    }));

    // 3. Citizen Actions as Spatial Points
    const citizenActions = getCitizenActions();
    const actionFeatures = citizenActions.map(action => ({
      type: "Feature",
      id: action.id,
      geometry: {
        type: "Point",
        coordinates: [action.coordinates[1], action.coordinates[0]] // [lng, lat]
      },
      properties: {
        featureType: "citizen_action",
        id: action.id,
        title: action.title,
        actionType: action.actionType,
        citizenName: action.citizenName,
        date: action.date,
        location: action.location,
        status: action.status,
        impactPoints: action.impactPoints,
        impactCategory: action.impactCategory,
        estimatedQuantity: action.estimatedQuantity,
        description: action.description
      }
    }));

    res.json({
      type: "FeatureCollection",
      metadata: {
        city: "Kanpur Nagar, Uttar Pradesh, India",
        center: [26.4499, 80.3319],
        dataset: "Demo / Simulated Dataset",
        source: "HeatMapX GeoAI Data Pipeline",
        timestamp: new Date().toISOString(),
        zonesCount: zoneFeatures.length,
        roadsCount: roadFeatures.length,
        citizenActionsCount: actionFeatures.length
      },
      features: [...zoneFeatures, ...roadFeatures, ...actionFeatures],
      hotspots: kanpurHotspots
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate GeoJSON heatmap data", details: err.message });
  }
};

// GET /api/locations - Returns list of all locations
exports.getLocations = (req, res) => {
  try {
    const locations = kanpurZones.map(zone => {
      const risk = calculateRiskScore(zone.metrics);
      return {
        id: zone.id,
        name: zone.name,
        wardName: zone.wardName,
        latitude: zone.latitude,
        longitude: zone.longitude,
        riskScore: risk.score,
        riskLevel: risk.level,
        lst: zone.metrics.lst,
        airTemperature: zone.metrics.airTemperature,
        populationDensity: zone.metrics.populationDensity,
        vulnerabilityScore: zone.metrics.vulnerabilityScore
      };
    });
    res.json({ success: true, count: locations.length, data: locations });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch locations", details: err.message });
  }
};

// GET /api/location/:id - Detailed breakdown of a single area
exports.getLocationById = (req, res) => {
  try {
    const { id } = req.params;
    const zone = kanpurZones.find(z => z.id === id || z.id === `loc_${id}`) || kanpurZones[0];

    const risk = calculateRiskScore(zone.metrics);
    const drivers = getHeatDrivers(zone.metrics);
    const deltaT = Number((zone.metrics.lst - zone.metrics.airTemperature).toFixed(1));

    // Recommend top 3 mitigations based on conditions
    const recommendedMitigations = defaultMitigationCatalog.filter(m => {
      if (zone.metrics.ndbi > 0.5 && m.applicableConditions.includes("High NDBI")) return true;
      if (zone.metrics.ndvi < 0.25 && m.applicableConditions.includes("Low NDVI")) return true;
      if (zone.metrics.albedo < 0.18 && m.applicableConditions.includes("Low Albedo")) return true;
      if (zone.metrics.vulnerabilityScore > 65 && m.applicableConditions.includes("High Vulnerability")) return true;
      return false;
    }).slice(0, 3);

    res.json({
      success: true,
      data: {
        id: zone.id,
        name: zone.name,
        wardName: zone.wardName,
        coordinates: [zone.latitude, zone.longitude],
        risk,
        physics: {
          lst: zone.metrics.lst,
          airTemperature: zone.metrics.airTemperature,
          deltaT,
          humidity: zone.metrics.humidity,
          heatIndex: zone.metrics.heatIndex,
          ndvi: zone.metrics.ndvi,
          ndbi: zone.metrics.ndbi,
          smi: zone.metrics.smi,
          albedo: zone.metrics.albedo,
          elevation: zone.metrics.elevation
        },
        demographics: {
          populationDensity: zone.metrics.populationDensity,
          vulnerabilityScore: zone.metrics.vulnerabilityScore,
          anthropogenicHeatProxy: zone.metrics.anthropogenicHeatProxy
        },
        explainability: drivers,
        recommendedMitigations
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching location details", details: err.message });
  }
};

// GET /api/forecast - Returns 7-day forecast data
exports.getForecast = (req, res) => {
  try {
    const { locationId } = req.query;
    const baseZone = kanpurZones.find(z => z.id === locationId) || kanpurZones[0];
    const baseRisk = calculateRiskScore(baseZone.metrics).score;

    const days = [
      { dayLabel: "Today (Sat)", offset: 0, tempDelta: 0, humidityDelta: 0 },
      { dayLabel: "Tomorrow (Sun)", offset: 1, tempDelta: 1.2, humidityDelta: -3 },
      { dayLabel: "Day 3 (Mon)", offset: 2, tempDelta: 2.1, humidityDelta: -5 },
      { dayLabel: "Day 4 (Tue)", offset: 3, tempDelta: 1.8, humidityDelta: -2 },
      { dayLabel: "Day 5 (Wed)", offset: 4, tempDelta: 0.5, humidityDelta: 4 },
      { dayLabel: "Day 6 (Thu)", offset: 5, tempDelta: -1.0, humidityDelta: 8 },
      { dayLabel: "Day 7 (Fri)", offset: 6, tempDelta: -1.8, humidityDelta: 6 }
    ];

    const forecast = days.map(d => {
      const today = new Date();
      today.setDate(today.getDate() + d.offset);
      const dateStr = today.toISOString().split('T')[0];

      const temp = Number((baseZone.metrics.airTemperature + d.tempDelta).toFixed(1));
      const humidity = Math.min(90, Math.max(30, baseZone.metrics.humidity + d.humidityDelta));
      const heatIndex = Number((temp * (1 + humidity / 250)).toFixed(1));
      const riskScore = Math.min(100, Math.max(10, Math.round(baseRisk + (d.tempDelta * 3.5))));

      let riskLevel = "Moderate";
      if (riskScore >= 80) riskLevel = "Critical";
      else if (riskScore >= 65) riskLevel = "High";
      else if (riskScore < 45) riskLevel = "Low";

      return {
        date: dateStr,
        dayLabel: d.dayLabel,
        locationId: baseZone.id,
        locationName: baseZone.name,
        riskScore,
        riskLevel,
        temperature: temp,
        humidity,
        heatIndex,
        hotspotIntensity: riskScore >= 75 ? "High" : riskScore >= 50 ? "Moderate" : "Low"
      };
    });

    res.json({
      success: true,
      datasetLabel: "Prototype / Simulated Forecast Model",
      location: { id: baseZone.id, name: baseZone.name },
      forecast
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate forecast", details: err.message });
  }
};

// GET /api/environmental-factors - Aggregated city statistics
exports.getEnvironmentalFactors = (req, res) => {
  try {
    const total = kanpurZones.length;
    const avgLst = (kanpurZones.reduce((acc, z) => acc + z.metrics.lst, 0) / total).toFixed(1);
    const avgAirTemp = (kanpurZones.reduce((acc, z) => acc + z.metrics.airTemperature, 0) / total).toFixed(1);
    const avgNdvi = (kanpurZones.reduce((acc, z) => acc + z.metrics.ndvi, 0) / total).toFixed(2);
    const avgNdbi = (kanpurZones.reduce((acc, z) => acc + z.metrics.ndbi, 0) / total).toFixed(2);
    const avgAlbedo = (kanpurZones.reduce((acc, z) => acc + z.metrics.albedo, 0) / total).toFixed(2);
    const avgSmi = (kanpurZones.reduce((acc, z) => acc + z.metrics.smi, 0) / total).toFixed(2);

    res.json({
      success: true,
      city: "Kanpur Nagar, Uttar Pradesh, India",
      center: [26.4499, 80.3319],
      summary: {
        totalMonitoredZones: total,
        avgLst: Number(avgLst),
        avgAirTemp: Number(avgAirTemp),
        avgDeltaT: Number((avgLst - avgAirTemp).toFixed(1)),
        avgNdvi: Number(avgNdvi),
        avgNdbi: Number(avgNdbi),
        avgAlbedo: Number(avgAlbedo),
        avgSmi: Number(avgSmi)
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch environmental factors", details: err.message });
  }
};

// GET /api/recommendations - Mitigation recommendations
exports.getRecommendations = (req, res) => {
  try {
    const { locationId } = req.query;
    let selectedZone = kanpurZones[0];
    if (locationId) {
      selectedZone = kanpurZones.find(z => z.id === locationId) || kanpurZones[0];
    }

    const zoneRisk = calculateRiskScore(selectedZone.metrics);

    res.json({
      success: true,
      datasetLabel: "AI Mitigation Advisor (Prototype Rules Engine)",
      location: {
        id: selectedZone.id,
        name: selectedZone.name,
        riskScore: zoneRisk.score,
        riskLevel: zoneRisk.level
      },
      recommendations: defaultMitigationCatalog.map(m => ({
        ...m,
        suitableArea: selectedZone.name,
        relevanceScore: m.priority === "Critical" ? 95 : m.priority === "High" ? 85 : 70
      }))
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recommendations", details: err.message });
  }
};

// POST /api/simulation - Digital twin "What-If" scenario simulation
exports.runSimulation = (req, res) => {
  try {
    const locationId = req.body.locationId || req.body.zoneId || "loc_central";
    const scenarioParameters = req.body.scenarioParameters || req.body || {};
    const zone = kanpurZones.find(z => z.id === locationId) || kanpurZones[0];

    const result = runDigitalTwinSimulation(zone.metrics, scenarioParameters);

    res.json({
      success: true,
      datasetLabel: "Prototype Scenario Simulation",
      location: { id: zone.id, name: zone.name, wardName: zone.wardName },
      scenarioParameters,
      result
    });
  } catch (err) {
    res.status(500).json({ error: "Simulation execution failed", details: err.message });
  }
};

// GET /api/routes - Cool route planner
exports.getRoutes = (req, res) => {
  try {
    const { origin = "loc_central", destination = "loc_allen_zoo" } = req.query;
    const routeResult = calculateCoolRoute(origin, destination);

    res.json({
      success: true,
      datasetLabel: "Thermal-Weighted Pedestrian Routing Prototype",
      route: routeResult
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate route", details: err.message });
  }
};

// GET /api/equity - Heat equity analysis ranking
exports.getHeatEquity = (req, res) => {
  try {
    const equityData = kanpurZones.map(zone => {
      const risk = calculateRiskScore(zone.metrics);
      const hazardFactor = risk.hazard;
      const popFactor = zone.metrics.populationDensity / 1000;
      const vulnFactor = zone.metrics.vulnerabilityScore / 100;

      const equityPriorityScore = Math.round((hazardFactor * 0.4) + (popFactor * 3.5) + (vulnFactor * 35));

      return {
        id: zone.id,
        name: zone.name,
        wardName: zone.wardName,
        lst: zone.metrics.lst,
        riskScore: risk.score,
        riskLevel: risk.level,
        populationDensity: zone.metrics.populationDensity,
        vulnerabilityScore: zone.metrics.vulnerabilityScore,
        equityPriorityScore,
        equityPriorityRank: 'TBD',
        recommendedPriority: equityPriorityScore > 130 ? 'Immediate Intervention' : equityPriorityScore > 90 ? 'High Equity Need' : 'Standard'
      };
    }).sort((a, b) => b.equityPriorityScore - a.equityPriorityScore);

    equityData.forEach((item, index) => {
      item.equityPriorityRank = index + 1;
    });

    res.json({
      success: true,
      datasetLabel: "Heat Equity & Intervention Priority Model",
      totalZones: equityData.length,
      ranking: equityData
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate heat equity ranking", details: err.message });
  }
};
