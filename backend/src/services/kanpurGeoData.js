// Structured GeoJSON and data service for Kanpur Nagar urban zones
// GeoJSON coordinates strictly use [longitude, latitude] array pairs.

const kanpurZones = [
  {
    id: "loc_central",
    name: "Kanpur Central & Ghanta Ghar",
    wardName: "Ward 24 - Collectorganj / Station Core",
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
    metrics: {
      lst: 44.8,               // °C Land Surface Temp
      airTemperature: 39.1,    // °C Ambient Air Temp
      humidity: 52,            // %
      heatIndex: 49.2,         // °C Heat Index
      ndvi: 0.09,              // Sparse vegetation / paved railyards
      ndbi: 0.76,              // Extremely high built-up / asphalt / tin roofs
      smi: 0.14,               // Dry impervious surface
      albedo: 0.11,            // Dark asphalt and metal surfaces
      elevation: 126,          // Meters above sea level
      populationDensity: 34000,// Dense commercial core
      vulnerabilityScore: 82,  // High pedestrian exposure, street vendors
      anthropogenicHeatProxy: 88
    }
  },
  {
    id: "loc_naveen",
    name: "Naveen Market & The Mall Road",
    wardName: "Ward 18 - Civil Lines South / Mall Road",
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
    metrics: {
      lst: 43.6,
      airTemperature: 38.6,
      humidity: 54,
      heatIndex: 47.9,
      ndvi: 0.12,
      ndbi: 0.72,
      smi: 0.16,
      albedo: 0.13,
      elevation: 128,
      populationDensity: 31500,
      vulnerabilityScore: 76,
      anthropogenicHeatProxy: 84
    }
  },
  {
    id: "loc_sisamau",
    name: "Sisamau & P. Road Bazaar",
    wardName: "Ward 31 - Sisamau Central",
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
    metrics: {
      lst: 43.9,
      airTemperature: 38.8,
      humidity: 55,
      heatIndex: 48.4,
      ndvi: 0.11,
      ndbi: 0.74,
      smi: 0.17,
      albedo: 0.12,
      elevation: 125,
      populationDensity: 36000, // Highest density ward
      vulnerabilityScore: 88,  // High structural vulnerability, corrugated roofs
      anthropogenicHeatProxy: 80
    }
  },
  {
    id: "loc_panki",
    name: "Panki Industrial Area & Power Cluster",
    wardName: "Ward 58 - Panki Industrial Estate",
    latitude: 26.4735,
    longitude: 80.2310,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2220, 26.4800],
        [80.2400, 26.4800],
        [80.2410, 26.4670],
        [80.2230, 26.4670],
        [80.2220, 26.4800]
      ]]
    },
    metrics: {
      lst: 45.2,               // Highest LST due to heavy manufacturing & metal sheds
      airTemperature: 39.5,
      humidity: 48,
      heatIndex: 49.8,
      ndvi: 0.14,
      ndbi: 0.71,
      smi: 0.15,
      albedo: 0.10,
      elevation: 130,
      populationDensity: 11200,
      vulnerabilityScore: 64,
      anthropogenicHeatProxy: 92 // Heavy boiler & generator exhaust
    }
  },
  {
    id: "loc_jajmau",
    name: "Jajmau Industrial & Leather Belt",
    wardName: "Ward 42 - Jajmau Eastern Gate",
    latitude: 26.4290,
    longitude: 80.4045,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.3950, 26.4360],
        [80.4140, 26.4360],
        [80.4150, 26.4220],
        [80.3960, 26.4220],
        [80.3950, 26.4360]
      ]]
    },
    metrics: {
      lst: 42.7,
      airTemperature: 38.1,
      humidity: 62,            // Near river moisture
      heatIndex: 48.0,
      ndvi: 0.16,
      ndbi: 0.69,
      smi: 0.28,
      albedo: 0.14,
      elevation: 122,
      populationDensity: 26000,
      vulnerabilityScore: 79,
      anthropogenicHeatProxy: 76
    }
  },
  {
    id: "loc_iitk",
    name: "IIT Kanpur Campus & Kalyanpur",
    wardName: "Ward 02 - Kalyanpur North",
    latitude: 26.5123,
    longitude: 80.2329,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [80.2220, 26.5200],
        [80.2440, 26.5200],
        [80.2450, 26.5050],
        [80.2230, 26.5050],
        [80.2220, 26.5200]
      ]]
    },
    metrics: {
      lst: 33.4,               // Major cooling oasis
      airTemperature: 34.2,
      humidity: 50,
      heatIndex: 37.8,
      ndvi: 0.62,              // High canopy tree coverage
      ndbi: 0.18,              // Low built-up fraction
      smi: 0.44,               // Well irrigated campus grounds
      albedo: 0.24,            // Light concrete & green cover
      elevation: 132,
      populationDensity: 8500,
      vulnerabilityScore: 22,  // High resilience & shaded walkways
      anthropogenicHeatProxy: 28
    }
  },
  {
    id: "loc_allen_zoo",
    name: "Allen Forest Zoo & Nawabganj Greens",
    wardName: "Ward 07 - Nawabganj Forest Reserve",
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
    metrics: {
      lst: 31.8,               // Coldest natural island in Kanpur
      airTemperature: 33.6,
      humidity: 56,
      heatIndex: 36.9,
      ndvi: 0.74,              // Protected dense botanical reserve
      ndbi: 0.08,              // Minimal artificial structures
      smi: 0.52,               // Natural lake and damp forest floor
      albedo: 0.22,
      elevation: 129,
      populationDensity: 4200,
      vulnerabilityScore: 18,
      anthropogenicHeatProxy: 16
    }
  },
  {
    id: "loc_civil_lines",
    name: "Civil Lines & Phool Bagh",
    wardName: "Ward 14 - Civil Lines North",
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
    metrics: {
      lst: 36.8,
      airTemperature: 36.2,
      humidity: 53,
      heatIndex: 41.5,
      ndvi: 0.38,              // Mature colonial tree avenues
      ndbi: 0.42,              // Moderate institutional buildings
      smi: 0.32,
      albedo: 0.21,
      elevation: 127,
      populationDensity: 14000,
      vulnerabilityScore: 35,
      anthropogenicHeatProxy: 44
    }
  },
  {
    id: "loc_govind_nagar",
    name: "Govind Nagar & Fazalganj",
    wardName: "Ward 38 - Fazalganj Workshop Belt",
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
    metrics: {
      lst: 41.9,
      airTemperature: 37.9,
      humidity: 53,
      heatIndex: 45.8,
      ndvi: 0.15,
      ndbi: 0.66,
      smi: 0.19,
      albedo: 0.15,
      elevation: 126,
      populationDensity: 27500,
      vulnerabilityScore: 71,
      anthropogenicHeatProxy: 74
    }
  },
  {
    id: "loc_barra",
    name: "Kidwai Nagar & Barra Corridor",
    wardName: "Ward 49 - Barra South Core",
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
    metrics: {
      lst: 39.4,
      airTemperature: 37.0,
      humidity: 51,
      heatIndex: 43.2,
      ndvi: 0.24,              // Grid residential colonies with roadside trees
      ndbi: 0.58,              // Mid-rise brick & concrete construction
      smi: 0.24,
      albedo: 0.18,
      elevation: 125,
      populationDensity: 24000,
      vulnerabilityScore: 52,
      anthropogenicHeatProxy: 60
    }
  },
  {
    id: "loc_armapur",
    name: "Armapur Estate & Ordnance Enclave",
    wardName: "Ward 29 - Armapur Defense Greens",
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
    metrics: {
      lst: 35.1,
      airTemperature: 35.0,
      humidity: 52,
      heatIndex: 39.4,
      ndvi: 0.48,              // Planned defense green buffer
      ndbi: 0.32,
      smi: 0.36,
      albedo: 0.22,
      elevation: 128,
      populationDensity: 9800,
      vulnerabilityScore: 29,
      anthropogenicHeatProxy: 32
    }
  },
  {
    id: "loc_ganga_barrage",
    name: "Ganga Barrage & Riverside Embankment",
    wardName: "Ward 05 - Azad Nagar / Barrage Marg",
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
    metrics: {
      lst: 33.9,               // Water cooling & river wind
      airTemperature: 34.5,
      humidity: 68,            // Strong evaporative river vapor
      heatIndex: 40.2,
      ndvi: 0.32,
      ndbi: 0.22,
      smi: 0.58,               // Riverbank damp sand/soil
      albedo: 0.23,
      elevation: 121,
      populationDensity: 6500,
      vulnerabilityScore: 45,
      anthropogenicHeatProxy: 36
    }
  }
];

// Arterial Road Network Polylines for Kanpur Nagar
const kanpurRoads = [
  {
    id: "road_gt",
    name: "Grand Trunk Road (GT Road Corridor)",
    type: "National Highway Arterial",
    coordinates: [
      [80.2220, 26.5150],
      [80.2600, 26.4800],
      [80.3000, 26.4600],
      [80.3450, 26.4520],
      [80.4000, 26.4300]
    ]
  },
  {
    id: "road_mall",
    name: "Mall Road Boulevard",
    type: "City Commercial Spine",
    coordinates: [
      [80.3350, 26.4740],
      [80.3470, 26.4715],
      [80.3600, 26.4690],
      [80.3700, 26.4660]
    ]
  },
  {
    id: "road_vip",
    name: "VIP Road / Ganga Barrage Marg",
    type: "Riverfront Scenic Highway",
    coordinates: [
      [80.3540, 26.4820],
      [80.3350, 26.5050],
      [80.3150, 26.5180],
      [80.2950, 26.5300]
    ]
  },
  {
    id: "road_kalpi",
    name: "Kalpi Road / Fazalganj Link",
    type: "Industrial Transit Corridor",
    coordinates: [
      [80.2300, 26.4730],
      [80.2600, 26.4550],
      [80.3015, 26.4420],
      [80.3350, 26.4380]
    ]
  }
];

// Key Hotspot Markers
const kanpurHotspots = [
  { id: "hotspot_1", name: "Central Station Freight Yards", lat: 26.4535, lng: 80.3520, riskScore: 94, lst: 45.1, cause: "Metal Freight Roofs & Concrete Yard" },
  { id: "hotspot_2", name: "Panki Power Station Perimeter", lat: 26.4745, lng: 80.2325, riskScore: 92, lst: 45.5, cause: "Industrial Thermal Discharge" },
  { id: "hotspot_3", name: "Sisamau Chungi Congestion Node", lat: 26.4640, lng: 80.3270, riskScore: 89, lst: 44.2, cause: "High Density Impervious Urban Canyon" },
  { id: "hotspot_4", name: "Naveen Market Central Quad", lat: 26.4710, lng: 80.3475, riskScore: 88, lst: 43.8, cause: "Dense Concrete Retail Core" }
];

// Recommended Action Catalog for North Indian Urban Climate
const defaultMitigationCatalog = [
  {
    id: "mit_cool_roofs",
    title: "High-Albedo Reflective Cool Roof Program",
    category: "Cool Surface",
    priority: "Critical",
    expectedImpact: "-3.2°C to -4.5°C LST drop",
    difficulty: "Low / Immediate",
    cost: "₹18 - ₹25 per sq ft",
    applicableConditions: ["High NDBI", "Low Albedo"],
    description: "Apply high-solar-reflectance (SRI > 80) elastomeric coatings or white mosaic ceramic tiles to tin/concrete roofs across high-density residential and commercial clusters."
  },
  {
    id: "mit_urban_canopy",
    title: "Targeted Native Urban Tree Plantation",
    category: "Green Infrastructure",
    priority: "High",
    expectedImpact: "-2.8°C to -4.0°C microclimate cooling",
    difficulty: "Medium",
    cost: "₹350 per sapling + 3yr maintenance",
    applicableConditions: ["Low NDVI", "High Population Density"],
    description: "Plant fast-growing, drought-resilient native broadleaf species (Neem, Peepal, Jamun, Gulmohar) along wide arterial avenues (GT Road, Barra) to shade asphalt."
  },
  {
    id: "mit_permeable_pave",
    title: "Permeable Pavements & Bio-Retention Swales",
    category: "Hydrological Cooling",
    priority: "Medium",
    expectedImpact: "+18% soil moisture, -1.8°C ground heat flux",
    difficulty: "Moderate",
    cost: "₹65 - ₹80 per sq ft",
    applicableConditions: ["Low SMI", "High NDBI"],
    description: "Replace non-porous road medians and parking lots with interlocking permeable paver blocks to enable rainfall infiltration and evaporative cooling."
  },
  {
    id: "mit_cooling_centers",
    title: "Community Cool Shelters & Hydration Hubs",
    category: "Public Health / Equity",
    priority: "Critical",
    expectedImpact: "Protects ~15,000 outdoor workers daily",
    difficulty: "Low",
    cost: "₹1.5 Lakh per kiosk",
    applicableConditions: ["High Vulnerability", "High Population Density"],
    description: "Deploy solar-powered mist cooling kiosks and clean electrolyte drinking water stations at transit bottlenecks like Kanpur Central and Naveen Market."
  },
  {
    id: "mit_green_corridors",
    title: "Ganga Riverside Microclimate Green Corridors",
    category: "Ecosystem Restoration",
    priority: "High",
    expectedImpact: "-2.1°C thermal gradient penetration",
    difficulty: "High",
    cost: "₹45 Lakh per linear km",
    applicableConditions: ["River Proximity", "Low NDVI"],
    description: "Establish continuous vegetated ecological buffers along the Ganga Barrage and Jajmau floodplains to funnel river breezes into Kanpur's urban core."
  }
];

module.exports = {
  kanpurZones,
  kanpurRoads,
  kanpurHotspots,
  defaultMitigationCatalog
};
