// Weather Data Service for HeatMapX
// Integrates Open-Meteo live atmospheric weather observations and multi-day forecasts.
// Provides in-memory caching (10 min TTL) and graceful error handling.

const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const WMO_CODE_MAP = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

function getWmoCondition(code) {
  return WMO_CODE_MAP[code] || "Fair weather";
}

/**
 * Fetch live current weather and 7-day forecast from Open-Meteo for exact coordinates
 */
async function getLiveWeather(latitude, longitude) {
  const lat = Number(Number(latitude || 26.4499).toFixed(3));
  const lon = Number(Number(longitude || 80.3319).toFixed(3));
  const cacheKey = `${lat}_${lon}`;

  // Check in-memory cache
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,dew_point_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,uv_index_max,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}`);
    }

    const json = await response.json();
    if (!json || !json.current) {
      throw new Error("Invalid weather payload structure");
    }

    const current = json.current;
    const daily = json.daily || {};

    const airTemperature = Number(current.temperature_2m.toFixed(1));
    const feelsLike = Number(current.apparent_temperature.toFixed(1));
    const humidity = Math.round(current.relative_humidity_2m);
    const dewPoint = typeof current.dew_point_2m === 'number' ? Number(current.dew_point_2m.toFixed(1)) : null;
    const pressure = typeof current.surface_pressure === 'number' ? Number(current.surface_pressure.toFixed(1)) : null;
    const cloudCover = typeof current.cloud_cover === 'number' ? Math.round(current.cloud_cover) : 0;
    const precipitation = typeof current.precipitation === 'number' ? Number(current.precipitation.toFixed(1)) : 0;
    const windSpeed = Number(current.wind_speed_10m.toFixed(1));
    const windDirection = typeof current.wind_direction_10m === 'number' ? Math.round(current.wind_direction_10m) : 0;
    const windGusts = typeof current.wind_gusts_10m === 'number' ? Number(current.wind_gusts_10m.toFixed(1)) : windSpeed;
    const weatherCode = current.weather_code ?? 0;
    const condition = getWmoCondition(weatherCode);

    // Day/Night and UV Index calculation
    const isDay = Boolean(current.is_day === 1);
    const rawUv = typeof current.uv_index === 'number' ? current.uv_index : 0;
    // At night (is_day === 0), current solar UV is physically 0
    const currentUvIndex = isDay ? Number(Math.max(0, rawUv).toFixed(1)) : 0;
    
    // Today's peak UV from daily max forecast
    const dailyMaxUv = daily.uv_index_max?.[0];
    const peakUvIndex = typeof dailyMaxUv === 'number' ? Number(dailyMaxUv.toFixed(1)) : (isDay ? Math.max(currentUvIndex, 6.0) : 6.0);
    const precipitationProbability = typeof daily.precipitation_probability_max?.[0] === 'number' ? daily.precipitation_probability_max[0] : 0;
    const sunrise = daily.sunrise?.[0] || null;
    const sunset = daily.sunset?.[0] || null;

    // Build 7-day daily forecast items
    const forecastDays = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const dateObj = new Date(dateStr);
        const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        let dayLabel = `Day ${i + 1} (${weekday})`;
        if (i === 0) dayLabel = `Today (${weekday})`;
        else if (i === 1) dayLabel = `Tomorrow (${weekday})`;

        forecastDays.push({
          date: dateStr,
          dayLabel,
          tempMax: Number((daily.temperature_2m_max?.[i] ?? airTemperature).toFixed(1)),
          tempMin: Number((daily.temperature_2m_min?.[i] ?? (airTemperature - 4)).toFixed(1)),
          feelsLikeMax: Number((daily.apparent_temperature_max?.[i] ?? feelsLike).toFixed(1)),
          uvMax: typeof daily.uv_index_max?.[i] === 'number' ? Number(daily.uv_index_max[i].toFixed(1)) : null,
          precipProbability: typeof daily.precipitation_probability_max?.[i] === 'number' ? daily.precipitation_probability_max[i] : null,
          weatherCode: daily.weather_code?.[i] ?? weatherCode,
          condition: getWmoCondition(daily.weather_code?.[i] ?? weatherCode)
        });
      }
    }

    const result = {
      isLive: true,
      latitude: lat,
      longitude: lon,
      airTemperature,
      feelsLike,
      dewPoint,
      humidity,
      pressure,
      cloudCover,
      precipitation,
      precipitationProbability,
      windSpeed,
      windDirection,
      windGusts,
      weatherCode,
      condition,
      isDay,
      uvIndex: currentUvIndex,
      peakUvIndex,
      sunrise,
      sunset,
      forecastDays,
      source: "Weather API (Open-Meteo)",
      timestamp: current.time ? new Date(current.time).toISOString() : new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Cache successful response
    cache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;

  } catch (err) {
    console.warn(`[WeatherService] Failed to fetch live weather for (${lat}, ${lon}):`, err.message);
    
    // Return explicit error state - NEVER return a fake number silently
    return {
      isLive: false,
      latitude: lat,
      longitude: lon,
      airTemperature: null,
      feelsLike: null,
      humidity: null,
      windSpeed: null,
      error: "Live weather data temporarily unavailable",
      source: "Weather API (Offline / Unavailable)",
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = {
  getLiveWeather,
  getWmoCondition
};
