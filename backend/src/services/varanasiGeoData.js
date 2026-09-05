// Structured GeoJSON and data service for Varanasi urban zones
// GeoJSON coordinates strictly use [longitude, latitude] array pairs.

const varanasiZones = [
  {
    id: "loc_chowk",
    name: "Chowk & Godowlia",
    wardName: "Ward 12 - Chowk Central",
    latitude: 25.3105,
    longitude: 83.0075,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [83.0015, 25.3145],
        [83.0125, 25.3145],
        [83.0135, 25.3065],
        [83.0025, 25.3065],
        [83.0015, 25.3145]
      ]]
    },
    metrics: {
      lst: 43.8,              // °C Land Surface Temp
      airTemperature: 38.2,   // °C Ambient Air Temp
      humidity: 58,           // %
      heatIndex: 47.6,        // °C Heat Index
      ndvi: 0.12,             // Low vegetation
      ndbi: 0.68,             // Very dense built-up
      smi: 0.18,              // Dry soil
      albedo: 0.13,           // Dark asphalt/tile roofs
      elevation: 76,          // Meters above sea level
      populationDensity: 28500, // people per sq km
      vulnerabilityScore: 84, // High social/structural vulnerability
      anthropogenicHeatProxy: 78
    }
  },
  {
    id: "loc_ghats",
    name: "Dashashwamedh Ghat Belt",
    wardName: "Ward 15 - Dashashwamedh",
    latitude: 25.3072,
    longitude: 83.0102,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [83.0050, 25.3100],
        [83.0160, 25.3100],
        [83.0170, 25.3020],
        [83.0060, 25.3020],
        [83.0050, 25.3100]
      ]]
    },
    metrics: {
      lst: 41.5,
      airTemperature: 37.8,
      humidity: 64, // Higher river moisture
      heatIndex: 46.2,
      ndvi: 0.15,
      ndbi: 0.62,
      smi: 0.35,
      albedo: 0.19, // Stone ghat steps & river reflection
      elevation: 72,
      populationDensity: 31000, // Very dense crowds & pilgrims
      vulnerabilityScore: 78,
      anthropogenicHeatProxy: 82
    }
  },
  {
    id: "loc_bhu",
    name: "BHU Campus & Naria",
    wardName: "Ward 45 - BHU University",
    latitude: 25.2677,
    longitude: 82.9913,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9820, 25.2750],
        [83.0000, 25.2750],
        [83.0010, 25.2600],
        [82.9830, 25.2600],
        [82.9820, 25.2750]
      ]]
    },
    metrics: {
      lst: 34.2,
      airTemperature: 34.8,
      humidity: 52,
      heatIndex: 38.5,
      ndvi: 0.58, // High canopy cover!
      ndbi: 0.21, // Open green space
      smi: 0.48, // Moist green soil
      albedo: 0.24,
      elevation: 82,
      populationDensity: 7200,
      vulnerabilityScore: 28,
      anthropogenicHeatProxy: 30
    }
  },
  {
    id: "loc_cantt",
    name: "Varanasi Junction / Cantt Station",
    wardName: "Ward 08 - Cantt Railway Hub",
    latitude: 25.3284,
    longitude: 82.9842,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9770, 25.3350],
        [82.9910, 25.3350],
        [82.9920, 25.3210],
        [82.9780, 25.3210],
        [82.9770, 25.3350]
      ]]
    },
    metrics: {
      lst: 44.5,
      airTemperature: 38.9,
      humidity: 55,
      heatIndex: 48.9,
      ndvi: 0.10,
      ndbi: 0.74, // Extreme pavement & iron track heat retention
      smi: 0.12,
      albedo: 0.11,
      elevation: 79,
      populationDensity: 24000,
      vulnerabilityScore: 72,
      anthropogenicHeatProxy: 92 // Heavy train & bus exhaust
    }
  },
  {
    id: "loc_sarnath",
    name: "Sarnath Heritage Zone",
    wardName: "Ward 02 - Sarnath Park",
    latitude: 25.3762,
    longitude: 83.0227,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [83.0130, 25.3850],
        [83.0310, 25.3850],
        [83.0320, 25.3670],
        [83.0140, 25.3670],
        [83.0130, 25.3850]
      ]]
    },
    metrics: {
      lst: 35.8,
      airTemperature: 35.1,
      humidity: 50,
      heatIndex: 39.4,
      ndvi: 0.49, // Stupa gardens & parks
      ndbi: 0.28,
      smi: 0.42,
      albedo: 0.22,
      elevation: 85,
      populationDensity: 5800,
      vulnerabilityScore: 35,
      anthropogenicHeatProxy: 32
    }
  },
  {
    id: "loc_shivpur",
    name: "Shivpur Urban Growth Corridor",
    wardName: "Ward 05 - Shivpur North",
    latitude: 25.3582,
    longitude: 82.9642,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9550, 25.3660],
        [82.9730, 25.3660],
        [82.9740, 25.3500],
        [82.9560, 25.3500],
        [82.9550, 25.3660]
      ]]
    },
    metrics: {
      lst: 40.2,
      airTemperature: 37.2,
      humidity: 54,
      heatIndex: 44.1,
      ndvi: 0.22,
      ndbi: 0.54,
      smi: 0.25,
      albedo: 0.16,
      elevation: 83,
      populationDensity: 14500,
      vulnerabilityScore: 64,
      anthropogenicHeatProxy: 58
    }
  },
  {
    id: "loc_ramnagar",
    name: "Ramnagar Fort & River South",
    wardName: "Ward 50 - Ramnagar",
    latitude: 25.2694,
    longitude: 83.0315,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [83.0210, 25.2780],
        [83.0410, 25.2780],
        [83.0420, 25.2600],
        [83.0220, 25.2600],
        [83.0210, 25.2780]
      ]]
    },
    metrics: {
      lst: 36.4,
      airTemperature: 35.4,
      humidity: 62,
      heatIndex: 41.2,
      ndvi: 0.42,
      ndbi: 0.32,
      smi: 0.46,
      albedo: 0.21,
      elevation: 74,
      populationDensity: 9800,
      vulnerabilityScore: 52,
      anthropogenicHeatProxy: 40
    }
  },
  {
    id: "loc_sigra",
    name: "Sigra & Maldahiya Commercial Core",
    wardName: "Ward 18 - Sigra Stadium",
    latitude: 25.3189,
    longitude: 82.9881,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9800, 25.3240],
        [82.9950, 25.3240],
        [82.9960, 25.3130],
        [82.9810, 25.3130],
        [82.9800, 25.3240]
      ]]
    },
    metrics: {
      lst: 42.6,
      airTemperature: 38.4,
      humidity: 56,
      heatIndex: 46.8,
      ndvi: 0.14,
      ndbi: 0.65,
      smi: 0.16,
      albedo: 0.14,
      elevation: 78,
      populationDensity: 22000,
      vulnerabilityScore: 68,
      anthropogenicHeatProxy: 84
    }
  },
  {
    id: "loc_nadesar",
    name: "Nadesar Cantonment Green",
    wardName: "Ward 10 - Nadesar Gardens",
    latitude: 25.3341,
    longitude: 82.9955,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9880, 25.3400],
        [83.0020, 25.3400],
        [83.0030, 25.3280],
        [82.9890, 25.3280],
        [82.9880, 25.3400]
      ]]
    },
    metrics: {
      lst: 35.1,
      airTemperature: 35.0,
      humidity: 53,
      heatIndex: 39.1,
      ndvi: 0.52,
      ndbi: 0.24,
      smi: 0.44,
      albedo: 0.23,
      elevation: 81,
      populationDensity: 6400,
      vulnerabilityScore: 30,
      anthropogenicHeatProxy: 36
    }
  },
  {
    id: "loc_lanka",
    name: "Lanka & Durgakund Market",
    wardName: "Ward 38 - Lanka Gate",
    latitude: 25.2815,
    longitude: 82.9968,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [82.9900, 25.2880],
        [83.0040, 25.2880],
        [83.0050, 25.2750],
        [82.9910, 25.2750],
        [82.9900, 25.2880]
      ]]
    },
    metrics: {
      lst: 41.2,
      airTemperature: 37.6,
      humidity: 57,
      heatIndex: 45.4,
      ndvi: 0.19,
      ndbi: 0.58,
      smi: 0.22,
      albedo: 0.16,
      elevation: 79,
      populationDensity: 20500,
      vulnerabilityScore: 61,
      anthropogenicHeatProxy: 70
    }
  }
];

// Presets for AI Mitigation Strategies
const defaultMitigationCatalog = [
  {
    mitigationId: "mit_cool_roofs",
    title: "High-Albedo Cool Roof Coatings",
    category: "Cool Surface",
    description: "Apply elastomeric reflective white coating ($>0.70$ albedo) on concrete flat roofs to reduce solar radiation absorption.",
    priority: "Critical",
    expectedImpact: "-3.5°C LST drop, -1.8°C indoor air temp reduction",
    applicableConditions: ["High NDBI", "Low Albedo"],
    difficulty: "Easy",
    costEstimate: "$ (Low Cost, High ROI)"
  },
  {
    mitigationId: "mit_urban_canopy",
    title: "Targeted Urban Tree Canopy & Green Corridors",
    category: "Green Infrastructure",
    description: "Plant native dense-foliage trees (Neem, Peepal, Bael) along major thoroughfares and open spaces to increase evapotranspirative cooling.",
    priority: "High",
    expectedImpact: "-4.2°C LST drop, +0.25 NDVI increase",
    applicableConditions: ["Low NDVI", "High Population Density"],
    difficulty: "Moderate",
    costEstimate: "$$ (Medium Cost)"
  },
  {
    mitigationId: "mit_permeable_pavements",
    title: "Porous & Permeable Eco-Pavements",
    category: "Cool Surface",
    description: "Replace dark impermeable asphalt with interlocking porous concrete grids allowing rainfall infiltration and evaporative cooling.",
    priority: "High",
    expectedImpact: "-2.8°C LST drop, +0.15 SMI boost",
    applicableConditions: ["High NDBI", "Low SMI"],
    difficulty: "Moderate",
    costEstimate: "$$ (Medium Cost)"
  },
  {
    mitigationId: "mit_blue_infrastructure",
    title: "Water-Sensitive Urban Design & Pond Restoration",
    category: "Blue Infrastructure",
    description: "Rehabilitate historic Kunds (water tanks) and install misting fountains in dense pedestrian plazas to enhance localized microclimate cooling.",
    priority: "Medium",
    expectedImpact: "-2.1°C air temp reduction within 150m radius",
    applicableConditions: ["High Heat Index", "Low SMI"],
    difficulty: "Complex",
    costEstimate: "$$$ (High Capital)"
  },
  {
    mitigationId: "mit_cooling_centers",
    title: "Shaded Community Cooling Hubs & Water Stations",
    category: "Policy & Emergency",
    description: "Designate solar-powered air-conditioned municipal centers and free hydration kiosks along high-pedestrian pilgrimage routes.",
    priority: "Critical",
    expectedImpact: "Immediate emergency heat stroke protection for 15,000+ daily visitors",
    applicableConditions: ["High Vulnerability", "High Population Density"],
    difficulty: "Easy",
    costEstimate: "$ (Low Cost)"
  }
];

module.exports = {
  varanasiZones,
  defaultMitigationCatalog
};
