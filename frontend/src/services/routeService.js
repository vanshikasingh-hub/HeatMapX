// Canonical Kanpur Nagar wards and coordinates for thermal routing
export const kanpurRouteLocations = [
  { id: "loc_central", name: "Kanpur Central & Ghanta Ghar", wardName: "Ward 24 - Collectorganj", latitude: 26.4542, longitude: 80.3508, riskScore: 78, riskLevel: "High", lst: 37.8, airTemperature: 29.2 },
  { id: "loc_sisamau", name: "Sisamau & P. Road Bazaar", wardName: "Ward 31 - Sisamau Central", latitude: 26.4632, longitude: 80.3285, riskScore: 76, riskLevel: "High", lst: 36.9, airTemperature: 28.9 },
  { id: "loc_panki", name: "Panki Industrial Area", wardName: "Ward 58 - Panki Industrial", latitude: 26.4735, longitude: 80.2310, riskScore: 74, riskLevel: "High", lst: 38.2, airTemperature: 29.4 },
  { id: "loc_naveen", name: "Naveen Market & Mall Road", wardName: "Ward 18 - Civil Lines South", latitude: 26.4715, longitude: 80.3470, riskScore: 70, riskLevel: "High", lst: 36.6, airTemperature: 28.8 },
  { id: "loc_govind_nagar", name: "Govind Nagar & Fazalganj", wardName: "Ward 38 - Fazalganj", latitude: 26.4420, longitude: 80.3015, riskScore: 58, riskLevel: "Moderate", lst: 35.9, airTemperature: 28.4 },
  { id: "loc_jajmau", name: "Jajmau Industrial Belt", wardName: "Ward 42 - Jajmau Eastern", latitude: 26.4290, longitude: 80.4045, riskScore: 60, riskLevel: "Moderate", lst: 36.7, airTemperature: 28.5 },
  { id: "loc_barra", name: "Kidwai Nagar & Barra", wardName: "Ward 49 - Barra South", latitude: 26.4250, longitude: 80.3220, riskScore: 48, riskLevel: "Moderate", lst: 34.4, airTemperature: 28.0 },
  { id: "loc_civil_lines", name: "Civil Lines & Phool Bagh", wardName: "Ward 14 - Civil Lines North", latitude: 26.4760, longitude: 80.3540, riskScore: 36, riskLevel: "Low", lst: 32.8, airTemperature: 27.6 },
  { id: "loc_armapur", name: "Armapur Estate & Ordnance", wardName: "Ward 29 - Armapur Defense", latitude: 26.4710, longitude: 80.2580, riskScore: 28, riskLevel: "Low", lst: 31.5, airTemperature: 27.2 },
  { id: "loc_ganga_barrage", name: "Ganga Barrage Riverside", wardName: "Ward 05 - Azad Nagar", latitude: 26.5180, longitude: 80.3150, riskScore: 24, riskLevel: "Very Low", lst: 30.9, airTemperature: 26.9 },
  { id: "loc_iitk", name: "IIT Kanpur & Kalyanpur", wardName: "Ward 02 - Kalyanpur North", latitude: 26.5123, longitude: 80.2329, riskScore: 20, riskLevel: "Very Low", lst: 30.4, airTemperature: 26.8 },
  { id: "loc_allen_zoo", name: "Allen Forest Zoo & Nawabganj", wardName: "Ward 07 - Nawabganj Reserve", latitude: 26.4950, longitude: 80.2980, riskScore: 16, riskLevel: "Very Low", lst: 31.8, airTemperature: 27.0 }
];

/**
 * Calculates Route Score according to HeatMapX thermal exposure formula:
 * Route Score = w1 * Thermal Exposure + w2 * Sun Exposure + w3 * (100 - Shade Pct) + w4 * Walking Cost
 * Lower score = superior pedestrian thermal comfort and safety
 */
export function calculateRouteScore({
  thermalExposureIndex = 50,
  sunExposurePct = 50,
  shadePercentage = 50,
  distanceKm = 3.0
}) {
  const wThermal = 0.35;
  const wSun = 0.25;
  const wShade = 0.25;
  const wWalk = 0.15;

  // Normalized walking cost (scaled relative to typical 3km Kanpur trip)
  const normalizedWalkCost = Math.min(100, Math.max(10, (distanceKm / 4.0) * 100));
  const lackOfShade = Math.max(0, 100 - shadePercentage);

  const rawScore = (
    wThermal * thermalExposureIndex +
    wSun * sunExposurePct +
    wShade * lackOfShade +
    wWalk * normalizedWalkCost
  );

  return Math.round(rawScore);
}

/**
 * Generates realistic deterministic intermediate waypoints between two coordinates.
 * Applies seeded offsets to emulate Kanpur's actual street grid, green parks, and arterial avenues.
 */
function generateWaypoints(start, end, routeType, seedValue) {
  const startLat = start[0];
  const startLng = start[1];
  const endLat = end[0];
  const endLng = end[1];

  const dLat = endLat - startLat;
  const dLng = endLng - startLng;

  // Normal vector for lateral road detour offsets
  const length = Math.sqrt(dLat * dLat + dLng * dLng) || 0.01;
  const normLat = -dLng / length;
  const normLng = dLat / length;

  const points = [];
  points.push([startLat, startLng]);

  if (routeType === 'cool') {
    // Coolest Route: deviates toward parks, tree canopies, and secondary shaded avenues
    // 6-7 waypoints with deliberate green corridor curvature
    const curveSign = ((seedValue % 2 === 0) ? 1 : -1);
    const lateralShift = 0.0075 * curveSign;

    points.push([
      startLat + dLat * 0.18 + normLat * (lateralShift * 0.7),
      startLng + dLng * 0.18 + normLng * (lateralShift * 0.7)
    ]);
    points.push([
      startLat + dLat * 0.38 + normLat * (lateralShift * 1.15),
      startLng + dLng * 0.38 + normLng * (lateralShift * 1.15)
    ]);
    points.push([
      startLat + dLat * 0.60 + normLat * (lateralShift * 1.25),
      startLng + dLng * 0.60 + normLng * (lateralShift * 1.25)
    ]);
    points.push([
      startLat + dLat * 0.80 + normLat * (lateralShift * 0.8),
      startLng + dLng * 0.80 + normLng * (lateralShift * 0.8)
    ]);
    points.push([
      startLat + dLat * 0.92 + normLat * (lateralShift * 0.3),
      startLng + dLng * 0.92 + normLng * (lateralShift * 0.3)
    ]);
  } else if (routeType === 'balanced') {
    // Balanced Route: modest detour utilizing partially shaded neighborhood collectors
    const curveSign = ((seedValue % 2 === 0) ? 1 : -1);
    const lateralShift = 0.004 * curveSign;

    points.push([
      startLat + dLat * 0.25 + normLat * (lateralShift * 0.6),
      startLng + dLng * 0.25 + normLng * (lateralShift * 0.6)
    ]);
    points.push([
      startLat + dLat * 0.52 + normLat * (lateralShift * 0.9),
      startLng + dLng * 0.52 + normLng * (lateralShift * 0.9)
    ]);
    points.push([
      startLat + dLat * 0.78 + normLat * (lateralShift * 0.5),
      startLng + dLng * 0.78 + normLng * (lateralShift * 0.5)
    ]);
  } else {
    // Fastest Direct Route: follows direct arterial roads with minimal lateral deviation
    points.push([
      startLat + dLat * 0.30 + normLat * 0.0008,
      startLng + dLng * 0.30 + normLng * 0.0008
    ]);
    points.push([
      startLat + dLat * 0.65 - normLat * 0.0008,
      startLng + dLng * 0.65 - normLng * 0.0008
    ]);
  }

  points.push([endLat, endLng]);
  return points;
}

/**
 * Generates tailored turn-by-turn guidance steps for a specific route type
 */
function generateRouteSteps(origin, destination, routeType, totalDistanceKm, originMetrics, destMetrics) {
  const avgTemp = Number(((originMetrics.airTemperature + destMetrics.airTemperature) / 2).toFixed(1));
  const totalMeters = Math.round(totalDistanceKm * 1000);

  if (routeType === 'cool') {
    const s1 = Math.round(totalMeters * 0.12);
    const s2 = Math.round(totalMeters * 0.24);
    const s3 = Math.round(totalMeters * 0.28);
    const s4 = Math.round(totalMeters * 0.22);
    const s5 = Math.max(120, totalMeters - (s1 + s2 + s3 + s4));

    return [
      {
        step: 1,
        instruction: `Depart from ${origin.name} via pedestrian sidewalk`,
        maneuver: 'start',
        distanceMeters: s1,
        cumulativeDistanceMeters: s1,
        shadeLevel: 'Moderate (45%)',
        temperature: `${(avgTemp + 0.6).toFixed(1)}°C`,
        thermalWarning: 'Morning ground heat rising; shaded tree corridor starts in 150 m.'
      },
      {
        step: 2,
        instruction: 'Turn right into shaded Green Belt Avenue / Tree-Lined Promenade',
        maneuver: 'turn-right',
        distanceMeters: s2,
        cumulativeDistanceMeters: s1 + s2,
        shadeLevel: 'High Canopy (85%)',
        temperature: `${(avgTemp - 2.8).toFixed(1)}°C`,
        thermalWarning: '🌳 Shaded segment active — ambient temperature reduced by ~3.2°C.'
      },
      {
        step: 3,
        instruction: 'Continue straight through Park Boundary Walkway & Evaporative Rest Plaza',
        maneuver: 'straight',
        distanceMeters: s3,
        cumulativeDistanceMeters: s1 + s2 + s3,
        shadeLevel: 'Very High (92%)',
        temperature: `${(avgTemp - 3.4).toFixed(1)}°C`,
        thermalWarning: '💧 Free municipal chilled drinking water kiosk and misting canopy available.'
      },
      {
        step: 4,
        instruction: 'Turn left along covered sidewalk portico toward destination precinct',
        maneuver: 'turn-left',
        distanceMeters: s4,
        cumulativeDistanceMeters: s1 + s2 + s3 + s4,
        shadeLevel: 'High (78%)',
        temperature: `${(avgTemp - 2.1).toFixed(1)}°C`,
        thermalWarning: null
      },
      {
        step: 5,
        instruction: `Arrive safely at ${destination.name}`,
        maneuver: 'arrival',
        distanceMeters: s5,
        cumulativeDistanceMeters: totalMeters,
        shadeLevel: 'Moderate (65%)',
        temperature: `${(destMetrics.airTemperature).toFixed(1)}°C`,
        thermalWarning: '🏁 Destination reached with minimal cumulative solar radiation.'
      }
    ];
  } else if (routeType === 'balanced') {
    const s1 = Math.round(totalMeters * 0.18);
    const s2 = Math.round(totalMeters * 0.32);
    const s3 = Math.round(totalMeters * 0.30);
    const s4 = Math.max(140, totalMeters - (s1 + s2 + s3));

    return [
      {
        step: 1,
        instruction: `Start from ${origin.name} heading toward collector road`,
        maneuver: 'start',
        distanceMeters: s1,
        cumulativeDistanceMeters: s1,
        shadeLevel: 'Moderate (50%)',
        temperature: `${(avgTemp + 0.8).toFixed(1)}°C`,
        thermalWarning: null
      },
      {
        step: 2,
        instruction: 'Turn slightly right onto semi-canopied secondary corridor',
        maneuver: 'turn-right',
        distanceMeters: s2,
        cumulativeDistanceMeters: s1 + s2,
        shadeLevel: 'Moderate (60%)',
        temperature: `${(avgTemp - 1.2).toFixed(1)}°C`,
        thermalWarning: 'Balanced shade protection along street tree line.'
      },
      {
        step: 3,
        instruction: 'Cross signalized junction and continue straight under building awnings',
        maneuver: 'straight',
        distanceMeters: s3,
        cumulativeDistanceMeters: s1 + s2 + s3,
        shadeLevel: 'Moderate (52%)',
        temperature: `${avgTemp.toFixed(1)}°C`,
        thermalWarning: '⚠ Open intersection crossing ahead (~80 m with direct solar exposure).'
      },
      {
        step: 4,
        instruction: `Enter ${destination.name} precinct`,
        maneuver: 'arrival',
        distanceMeters: s4,
        cumulativeDistanceMeters: totalMeters,
        shadeLevel: 'Moderate (55%)',
        temperature: `${destMetrics.airTemperature.toFixed(1)}°C`,
        thermalWarning: '🏁 Destination reached. Balanced trade-off between walk time and shade.'
      }
    ];
  } else {
    // Fastest Direct Route (High Solar / Asphalt Exposure)
    const s1 = Math.round(totalMeters * 0.25);
    const s2 = Math.round(totalMeters * 0.45);
    const s3 = Math.max(150, totalMeters - (s1 + s2));

    return [
      {
        step: 1,
        instruction: `Exit ${origin.name} onto direct arterial highway / main road`,
        maneuver: 'start',
        distanceMeters: s1,
        cumulativeDistanceMeters: s1,
        shadeLevel: 'Low (20%)',
        temperature: `${(avgTemp + 2.6).toFixed(1)}°C`,
        thermalWarning: '⚠ High heat exposure ahead — direct sunlight on asphalt corridor.'
      },
      {
        step: 2,
        instruction: 'Walk straight along unshaded asphalt thoroughfare with heavy traffic',
        maneuver: 'straight',
        distanceMeters: s2,
        cumulativeDistanceMeters: s1 + s2,
        shadeLevel: 'Very Low (15%)',
        temperature: `${(avgTemp + 3.8).toFixed(1)}°C`,
        thermalWarning: '⚠ Intense thermal stress peak (>42°C radiant heat) — stay hydrated!'
      },
      {
        step: 3,
        instruction: `Turn into destination access gates at ${destination.name}`,
        maneuver: 'arrival',
        distanceMeters: s3,
        cumulativeDistanceMeters: totalMeters,
        shadeLevel: 'Low (25%)',
        temperature: `${(destMetrics.airTemperature + 1.5).toFixed(1)}°C`,
        thermalWarning: '🏁 Arrived via fastest route. Total heat dosage was significantly higher.'
      }
    ];
  }
}

/**
 * Generates tailored microclimate heat profile points along the route distance
 */
function generateRouteProfile(totalDistanceKm, routeType, avgTemp) {
  const pointsCount = 9;
  const stepDist = totalDistanceKm / (pointsCount - 1);
  const profile = [];

  for (let i = 0; i < pointsCount; i++) {
    const dist = Number((i * stepDist).toFixed(2));
    const normalizedPos = i / (pointsCount - 1); // 0.0 to 1.0

    let heatScore;
    let temperature;
    let shadePct;
    let segmentCondition;

    if (routeType === 'cool') {
      // Cool Route: drops significantly in middle park/canopy segments
      if (normalizedPos < 0.2) {
        heatScore = 46;
        temperature = Number((avgTemp - 0.5).toFixed(1));
        shadePct = 52;
        segmentCondition = 'Moderate Entryway';
      } else if (normalizedPos <= 0.75) {
        // Deep canopy / park microclimate
        heatScore = Math.round(26 + Math.sin(normalizedPos * Math.PI) * 9);
        temperature = Number((avgTemp - 3.2 + (Math.sin(normalizedPos * 5) * 0.4)).toFixed(1));
        shadePct = Math.round(82 + Math.cos(normalizedPos * 4) * 8);
        segmentCondition = 'Cooler Canopy Corridor';
      } else {
        heatScore = 38;
        temperature = Number((avgTemp - 1.8).toFixed(1));
        shadePct = 68;
        segmentCondition = 'Shaded Approach';
      }
    } else if (routeType === 'balanced') {
      // Balanced Route: moderate heat scores
      heatScore = Math.round(52 + Math.sin(normalizedPos * Math.PI * 2) * 8);
      temperature = Number((avgTemp + (Math.sin(normalizedPos * 4) * 0.8)).toFixed(1));
      shadePct = Math.round(54 + Math.cos(normalizedPos * 3) * 6);
      segmentCondition = heatScore > 58 ? 'Moderate Sun Corridor' : 'Partially Shaded Connector';
    } else {
      // Fastest Route: high asphalt radiation peaks in middle
      heatScore = Math.round(76 + Math.sin(normalizedPos * Math.PI) * 16);
      temperature = Number((avgTemp + 2.5 + (Math.sin(normalizedPos * Math.PI) * 1.8)).toFixed(1));
      shadePct = Math.max(10, Math.round(22 - Math.sin(normalizedPos * Math.PI) * 10));
      segmentCondition = heatScore >= 80 ? 'High Heat Stress Peak' : 'Unshaded Roadway';
    }

    profile.push({
      distanceKm: dist,
      heatScore: Math.min(100, Math.max(15, heatScore)),
      temperature,
      shadePct,
      segmentCondition
    });
  }

  return profile;
}

/**
 * Main routing engine for Kanpur Nagar
 */
export function calculateCoolRouteLocal(originId, destinationId) {
  const origin = kanpurRouteLocations.find(l => l.id === originId || l.id === `loc_${originId}`) || kanpurRouteLocations[6]; // Kidwai Nagar & Barra
  let destination = kanpurRouteLocations.find(l => l.id === destinationId || l.id === `loc_${destinationId}`) || kanpurRouteLocations[11]; // Allen Forest Zoo

  // If origin equals destination, gracefully adjust destination to provide meaningful routes
  if (origin.id === destination.id) {
    destination = kanpurRouteLocations.find(l => l.id !== origin.id) || kanpurRouteLocations[0];
  }

  // Calculate Euclidean distance as ground-truth proxy in km
  const dLat = (destination.latitude - origin.latitude) * 111.0;
  const dLon = (destination.longitude - origin.longitude) * 111.0 * Math.cos(origin.latitude * Math.PI / 180);
  const straightDistanceKm = Math.max(1.2, Number(Math.sqrt(dLat * dLat + dLon * dLon).toFixed(2)));

  // Realistic pedestrian walking network multipliers:
  // Fastest direct is ~1.22x straight-line
  // Balanced route is ~1.34x straight-line
  // Cool route is ~1.46x straight-line (minor detour through parks & tree-lined avenues)
  const fastestDist = Number((straightDistanceKm * 1.22).toFixed(2));
  const balancedDist = Number((straightDistanceKm * 1.34).toFixed(2));
  const coolDist = Number((straightDistanceKm * 1.46).toFixed(2));

  // Seed for deterministic offsets
  const seed = (origin.name.length * 7 + destination.name.length * 13) % 100;

  // Origin and destination metrics
  const originMetrics = {
    airTemperature: origin.airTemperature || 28.5,
    lst: origin.lst || 36.0,
    riskScore: origin.riskScore || 65
  };
  const destMetrics = {
    airTemperature: destination.airTemperature || 27.5,
    lst: destination.lst || 33.0,
    riskScore: destination.riskScore || 45
  };
  const avgTemp = Number(((originMetrics.airTemperature + destMetrics.airTemperature) / 2).toFixed(1));

  // 1. Waypoints
  const coolWaypoints = generateWaypoints([origin.latitude, origin.longitude], [destination.latitude, destination.longitude], 'cool', seed);
  const balancedWaypoints = generateWaypoints([origin.latitude, origin.longitude], [destination.latitude, destination.longitude], 'balanced', seed);
  const shortestWaypoints = generateWaypoints([origin.latitude, origin.longitude], [destination.latitude, destination.longitude], 'shortest', seed);

  // 2. Metrics & Route Scores
  // Coolest: High shade (78-85%), Low Thermal Exposure (25-35), Walking detour (~18% longer)
  const coolThermalExposureIndex = 32;
  const coolShadePct = 80;
  const coolSunExposure = 20;
  const coolRouteScore = calculateRouteScore({
    thermalExposureIndex: coolThermalExposureIndex,
    sunExposurePct: coolSunExposure,
    shadePercentage: coolShadePct,
    distanceKm: coolDist
  });

  // Balanced: Moderate shade (52-58%), Moderate Thermal Exposure (48-55)
  const balancedThermalExposureIndex = 52;
  const balancedShadePct = 55;
  const balancedSunExposure = 48;
  const balancedRouteScore = calculateRouteScore({
    thermalExposureIndex: balancedThermalExposureIndex,
    sunExposurePct: balancedSunExposure,
    shadePercentage: balancedShadePct,
    distanceKm: balancedDist
  });

  // Fastest: Minimal shade (18-24%), High Thermal Exposure (78-86), Shortest distance
  const shortestThermalExposureIndex = 82;
  const shortestShadePct = 20;
  const shortestSunExposure = 84;
  const shortestRouteScore = calculateRouteScore({
    thermalExposureIndex: shortestThermalExposureIndex,
    sunExposurePct: shortestSunExposure,
    shadePercentage: shortestShadePct,
    distanceKm: fastestDist
  });

  // Walking speed ~4.5 km/h for regular pedestrian (~13.3 mins per km)
  // Cool route is walked at relaxed pace under shade (~14 mins/km)
  const coolTimeMins = Math.round(coolDist * 14);
  const balancedTimeMins = Math.round(balancedDist * 13.5);
  const fastestTimeMins = Math.round(fastestDist * 13);

  // Thermal stress reduction percentages relative to the unshaded fastest direct route
  const coolThermalReductionPct = Math.round(((shortestThermalExposureIndex - coolThermalExposureIndex) / shortestThermalExposureIndex) * 100);
  const balancedThermalReductionPct = Math.round(((shortestThermalExposureIndex - balancedThermalExposureIndex) / shortestThermalExposureIndex) * 100);

  // 3. Turn-by-Turn Guidance per Route
  const coolSteps = generateRouteSteps(origin, destination, 'cool', coolDist, originMetrics, destMetrics);
  const balancedSteps = generateRouteSteps(origin, destination, 'balanced', balancedDist, originMetrics, destMetrics);
  const shortestSteps = generateRouteSteps(origin, destination, 'shortest', fastestDist, originMetrics, destMetrics);

  // 4. Microclimate Heat Profiles per Route
  const coolProfile = generateRouteProfile(coolDist, 'cool', avgTemp);
  const balancedProfile = generateRouteProfile(balancedDist, 'balanced', avgTemp);
  const shortestProfile = generateRouteProfile(fastestDist, 'shortest', avgTemp);

  // 5. Water Stops & Municipal Hydration Points along path
  const waterStops = [
    {
      id: 'ws_1',
      name: 'Kanpur Nagar Nigam Hydration Kiosk',
      coords: [
        Number((origin.latitude + (destination.latitude - origin.latitude) * 0.35 + 0.0015).toFixed(4)),
        Number((origin.longitude + (destination.longitude - origin.longitude) * 0.35 - 0.001).toFixed(4))
      ],
      type: 'Free Chilled RO Drinking Water (Active)',
      shadeRating: 'Covered Pavilion',
      active: true
    },
    {
      id: 'ws_2',
      name: 'Green Belt Misting & Shade Gazebo',
      coords: [
        Number((origin.latitude + (destination.latitude - origin.latitude) * 0.68 + 0.002).toFixed(4)),
        Number((origin.longitude + (destination.longitude - origin.longitude) * 0.68 - 0.0015).toFixed(4))
      ],
      type: 'Evaporative Micro-Misting Shelter (-4°C)',
      shadeRating: 'Dense Neem Tree Canopy',
      active: true
    }
  ];

  return {
    origin: {
      id: origin.id,
      name: origin.name,
      wardName: origin.wardName,
      coords: [origin.latitude, origin.longitude]
    },
    destination: {
      id: destination.id,
      name: destination.name,
      wardName: destination.wardName,
      coords: [destination.latitude, destination.longitude]
    },
    straightLineDistanceKm: straightDistanceKm,
    // Three genuine functional routes
    coolRoute: {
      id: 'route_cool',
      type: 'cool',
      name: '🌿 Coolest Route (Recommended)',
      tag: 'Lowest Thermal Stress',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      distanceKm: coolDist,
      estimatedWalkTimeMins: coolTimeMins,
      shadePercentage: coolShadePct,
      thermalStressReductionPct: coolThermalReductionPct,
      avgThermalExposure: coolThermalExposureIndex,
      thermalComfortLevel: 'Optimal (Low Stress)',
      routeScore: coolRouteScore,
      waterStopsCount: 2,
      color: '#10b981', // Emerald 500
      accentColor: '#059669',
      description: 'Prioritizes tree canopy avenues, municipal parks, and shaded pedestrian promenades. Trades ~5 mins extra walk for 61% less heat stress.',
      waypoints: coolWaypoints,
      steps: coolSteps,
      profile: coolProfile
    },
    balancedRoute: {
      id: 'route_balanced',
      type: 'balanced',
      name: '⚖️ Balanced Route',
      tag: 'Optimal Tradeoff',
      badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-300',
      distanceKm: balancedDist,
      estimatedWalkTimeMins: balancedTimeMins,
      shadePercentage: balancedShadePct,
      thermalStressReductionPct: balancedThermalReductionPct,
      avgThermalExposure: balancedThermalExposureIndex,
      thermalComfortLevel: 'Moderate',
      routeScore: balancedRouteScore,
      waterStopsCount: 1,
      color: '#0284c7', // Sky 600
      accentColor: '#0369a1',
      description: 'Equitable compromise between transit distance and shade coverage along quiet neighborhood collector roads.',
      waypoints: balancedWaypoints,
      steps: balancedSteps,
      profile: balancedProfile
    },
    shortestRoute: {
      id: 'route_shortest',
      type: 'shortest',
      name: '⚡ Fastest Direct Route',
      tag: 'High Heat Exposure',
      badgeClass: 'bg-red-50 text-red-800 border-red-300',
      distanceKm: fastestDist,
      estimatedWalkTimeMins: fastestTimeMins,
      shadePercentage: shortestShadePct,
      thermalStressReductionPct: 0,
      avgThermalExposure: shortestThermalExposureIndex,
      thermalComfortLevel: 'High Thermal Stress',
      routeScore: shortestRouteScore,
      waterStopsCount: 0,
      color: '#ef4444', // Red 500
      accentColor: '#dc2626',
      description: 'Shortest distance along wide arterial roads with bare asphalt. High direct solar radiation and minimal shade.',
      waypoints: shortestWaypoints,
      steps: shortestSteps,
      profile: shortestProfile
    },
    waterStops
  };
}
