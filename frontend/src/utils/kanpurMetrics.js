/**
 * Canonical metrics and helpers for Kanpur Nagar Urban Heat Intelligence
 */

export const KANPUR_CENTER = [26.4499, 80.3319];
export const KANPUR_CITY_NAME = "Kanpur Nagar, Uttar Pradesh, India";
export const KANPUR_TOTAL_WARDS = 12;

export const RISK_THRESHOLDS = {
  CRITICAL: 85,
  VERY_HIGH: 70,
  HIGH: 50,
  MODERATE: 30,
  LOW: 0
};

export function getRiskLevel(score = 0) {
  if (score >= 85) return 'Critical';
  if (score >= 70) return 'Very High';
  if (score >= 50) return 'High';
  if (score >= 30) return 'Moderate';
  return 'Low';
}

/**
 * High-contrast, distinctly distinguishable 5-level color scale:
 * Safe / Cool -> Blue (#3b82f6)
 * Low -> Green (#10b981)
 * Moderate -> Yellow (#eab308)
 * High -> Orange (#f97316)
 * Critical -> Red (#ef4444)
 */
export function getRiskColor(score = 0) {
  if (score >= 85) return '#ef4444'; // Red (Critical)
  if (score >= 70) return '#f97316'; // Vivid Orange (Very High)
  if (score >= 50) return '#fb923c'; // Warm Orange (High)
  if (score >= 30) return '#eab308'; // Yellow (Moderate)
  if (score >= 15) return '#10b981'; // Green (Low)
  return '#3b82f6';                  // Blue (Safe / Cool)
}

export function getRiskBadgeClasses(score = 0) {
  if (score >= 85) return 'bg-red-100 text-red-700 border border-red-300 font-bold';
  if (score >= 70) return 'bg-orange-100 text-orange-800 border border-orange-300 font-bold';
  if (score >= 50) return 'bg-amber-100 text-amber-800 border border-amber-300 font-bold';
  if (score >= 30) return 'bg-yellow-100 text-yellow-800 border border-yellow-300 font-bold';
  if (score >= 15) return 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold';
  return 'bg-blue-100 text-blue-800 border border-blue-300 font-bold';
}

export function getUvCategory(uv = 0, isDay = true) {
  const val = Number(uv);
  if (!isDay || val <= 0.2) {
    return {
      label: !isDay ? "Night" : "Minimal",
      statusText: !isDay ? "Night / No solar UV" : "Minimal solar UV",
      category: "Low",
      colorClass: "text-slate-500",
      badgeClass: "bg-slate-100 text-slate-700 border-slate-200"
    };
  }
  if (val <= 2.9) {
    return {
      label: "Low",
      statusText: "Minimal sun protection needed",
      category: "Low",
      colorClass: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    };
  }
  if (val <= 5.9) {
    return {
      label: "Moderate",
      statusText: "Protection advised in afternoon",
      category: "Moderate",
      colorClass: "text-amber-700",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300"
    };
  }
  if (val <= 7.9) {
    return {
      label: "High",
      statusText: "Wear hat & seek shade",
      category: "High",
      colorClass: "text-orange-700",
      badgeClass: "bg-orange-100 text-orange-800 border-orange-300"
    };
  }
  if (val <= 10.9) {
    return {
      label: "Very High",
      statusText: "Extra protection required",
      category: "Very High",
      colorClass: "text-red-700",
      badgeClass: "bg-red-100 text-red-800 border-red-300"
    };
  }
  return {
    label: "Extreme",
    statusText: "Avoid midday sun exposure",
    category: "Extreme",
    colorClass: "text-purple-800",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300"
  };
}

export function getRiskHumanReason(score = 0, airTemp = 28, humidity = 65, isDay = true) {
  if (score >= 85) {
    if (!isDay) {
      return 'Critical nocturnal heat retention with high humidity restricting indoor cooling.';
    }
    return 'Dangerous surface heat and extreme ambient temperatures create critical heat stress.';
  }
  if (score >= 70) {
    if (!isDay) {
      return 'Elevated nighttime thermal stress; heat trapped in dense concrete and asphalt surfaces.';
    }
    return 'Severe heat stress driven by elevated air temperature and high solar radiation.';
  }
  if (score >= 50) {
    if (!isDay) {
      return 'Warm nocturnal temperatures with elevated humidity slowing natural body cooling.';
    }
    return 'High air temperature combined with elevated humidity is increasing heat stress.';
  }
  if (score >= 30) {
    if (!isDay) {
      return 'Mild nocturnal warmth; surface heat dissipating gradually into the night sky.';
    }
    return 'Moderate daytime warmth; direct sunlight is warming unshaded paved surfaces.';
  }
  if (!isDay) {
    return 'Pleasant nighttime ambient weather with minimal nocturnal heat retention.';
  }
  return 'Comfortable ambient weather with minimal heat stress across the neighborhood.';
}

export function getRiskActionAdvice(score = 0, isDay = true) {
  if (score >= 85) {
    if (!isDay) {
      return 'Ensure active mechanical cooling or high-speed cross-ventilation; stay hydrated overnight.';
    }
    return 'Stay indoors in shaded or cooled environments; avoid direct afternoon sun exposure.';
  }
  if (score >= 70) {
    if (!isDay) {
      return 'Keep sleeping quarters ventilated; avoid strenuous outdoor activity; drink water before sleeping.';
    }
    return 'Minimize prolonged outdoor activity; drink water frequently and rest in shade.';
  }
  if (score >= 50) {
    if (!isDay) {
      return 'Keep windows open for natural cross-ventilation; maintain adequate hydration through the night.';
    }
    return 'Stay hydrated and seek shade during peak sunlight hours (12 PM – 4 PM).';
  }
  if (score >= 30) {
    if (!isDay) {
      return 'Comfortable evening/night routines; safe for outdoor walks and night travel.';
    }
    return 'Normal daily routines permitted; carry water and wear sun protection when traveling.';
  }
  if (!isDay) {
    return 'Safe and comfortable outdoor evening conditions for all citizens.';
  }
  return 'Safe outdoor conditions for citizens of all age groups.';
}

/**
 * Computes canonical city summary from a list of zones/locations.
 */
export function computeCitySummary(locations = []) {
  if (!locations || locations.length === 0) {
    return {
      totalZones: KANPUR_TOTAL_WARDS,
      avgLst: 39.2,
      avgAirTemp: 36.8,
      avgDeltaT: 2.4,
      avgNdvi: 0.30,
      avgNdbi: 0.50,
      avgAlbedo: 0.16,
      criticalHotspots: 4
    };
  }

  const count = locations.length;
  const avgLst = locations.reduce((sum, l) => sum + (Number(l.lst) || 0), 0) / count;
  const avgAirTemp = locations.reduce((sum, l) => sum + (Number(l.airTemperature) || 0), 0) / count;
  const avgNdvi = locations.reduce((sum, l) => sum + (Number(l.ndvi) || 0.3), 0) / count;
  const avgNdbi = locations.reduce((sum, l) => sum + (Number(l.ndbi) || 0.5), 0) / count;
  const avgAlbedo = locations.reduce((sum, l) => sum + (Number(l.albedo) || 0.16), 0) / count;
  const criticalHotspots = locations.filter(l => (l.riskScore || 0) >= RISK_THRESHOLDS.CRITICAL).length;

  return {
    totalZones: count,
    avgLst: Number(avgLst.toFixed(1)),
    avgAirTemp: Number(avgAirTemp.toFixed(1)),
    avgDeltaT: Number((avgLst - avgAirTemp).toFixed(1)),
    avgNdvi: Number(avgNdvi.toFixed(2)),
    avgNdbi: Number(avgNdbi.toFixed(2)),
    avgAlbedo: Number(avgAlbedo.toFixed(2)),
    criticalHotspots
  };
}
