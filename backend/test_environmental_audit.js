// Complete Environmental Data Accuracy and Semantic Audit Verification Suite
const assert = require('assert');

async function runTests() {
  console.log("===============================================================");
  console.log("HEATMAPX ENVIRONMENTAL DATA ACCURACY & SEMANTIC AUDIT SUITE");
  console.log("===============================================================\n");

  let passed = 0;
  let failed = 0;

  function record(name, condition, details = '') {
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      if (details) console.error(`   └─ ${details}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Live Weather API & Full Telemetry
  // -------------------------------------------------------------
  console.log("\n--- TEST 1: Live Weather API & Real-Time Telemetry ---");
  try {
    const res = await fetch('http://localhost:5000/api/weather?lat=26.476&lon=80.354');
    const json = await res.json();
    const data = json.data;

    record("API Status 200 & success: true", json.success === true);
    record("isLive is true", data.isLive === true);
    record("airTemperature is valid number (~20-40°C)", typeof data.airTemperature === 'number' && data.airTemperature > 15 && data.airTemperature < 45, `Air Temp: ${data.airTemperature}°C`);
    record("feelsLike is valid number", typeof data.feelsLike === 'number', `Feels Like: ${data.feelsLike}°C`);
    record("dewPoint is present and physically <= airTemperature", typeof data.dewPoint === 'number' && data.dewPoint <= data.airTemperature + 1.0, `Dew Point: ${data.dewPoint}°C vs Air: ${data.airTemperature}°C`);
    record("humidity is relative percentage (0-100%)", typeof data.humidity === 'number' && data.humidity >= 0 && data.humidity <= 100, `Humidity: ${data.humidity}%`);
    record("pressure is barometric surface pressure (hPa)", typeof data.pressure === 'number' && data.pressure > 900 && data.pressure < 1050, `Pressure: ${data.pressure} hPa`);
    record("cloudCover is valid percentage (0-100%)", typeof data.cloudCover === 'number' && data.cloudCover >= 0 && data.cloudCover <= 100, `Cloud Cover: ${data.cloudCover}%`);
    record("windSpeed is present (km/h)", typeof data.windSpeed === 'number', `Wind Speed: ${data.windSpeed} km/h`);
    record("windGusts is present and >= windSpeed", typeof data.windGusts === 'number' && data.windGusts >= (data.windSpeed - 0.5), `Wind Gusts: ${data.windGusts} km/h`);
    record("windDirection is valid compass degrees (0-360°)", typeof data.windDirection === 'number' && data.windDirection >= 0 && data.windDirection <= 360, `Wind Dir: ${data.windDirection}°`);
    record("precipitation is non-negative number", typeof data.precipitation === 'number' && data.precipitation >= 0, `Precipitation: ${data.precipitation} mm`);
    record("isDay is boolean", typeof data.isDay === 'boolean', `isDay: ${data.isDay}`);
  } catch (err) {
    record("Live Weather API execution", false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 2: Current UV vs Peak UV at Night
  // -------------------------------------------------------------
  console.log("\n--- TEST 2: UV Index Semantic Separation (Night vs Peak) ---");
  try {
    const res = await fetch('http://localhost:5000/api/weather?lat=26.476&lon=80.354');
    const json = await res.json();
    const data = json.data;

    if (!data.isDay) {
      record("Current UV at night is strictly 0", data.uvIndex === 0, `uvIndex: ${data.uvIndex}`);
      record("Today's Peak UV is preserved as daily forecast maximum", data.peakUvIndex > 0, `peakUvIndex: ${data.peakUvIndex}`);
      record("Current UV is NOT confused with Peak UV", data.uvIndex !== data.peakUvIndex, `Current UV (${data.uvIndex}) != Peak UV (${data.peakUvIndex})`);
    } else {
      record("Current UV during daytime is realistic", data.uvIndex >= 0 && data.uvIndex <= 15, `Daytime UV: ${data.uvIndex}`);
      record("Peak UV is >= Current UV", data.peakUvIndex >= data.uvIndex, `Peak (${data.peakUvIndex}) >= Current (${data.uvIndex})`);
    }
  } catch (err) {
    record("UV Index validation", false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 3: Risk Model Day/Night Context & Advice
  // -------------------------------------------------------------
  console.log("\n--- TEST 3: Heat Risk Model Day/Night Context & Guidance ---");
  try {
    const { calculateRiskScore } = require('./src/services/riskModelService');

    // Scenario A: Nighttime pleasant weather (27°C, feels like 31°C, isDay: false)
    const nightResult = calculateRiskScore({ airTemperature: 27.1, feelsLike: 31.5, humidity: 82, isDay: false, windSpeed: 7 });
    record("Nighttime moderate temperature produces Low risk score (<30)", nightResult.score < 30, `Score: ${nightResult.score}, Level: ${nightResult.level}`);
    record("Nighttime reason does NOT mention afternoon sun", !nightResult.reason.toLowerCase().includes('afternoon sun') && !nightResult.reason.toLowerCase().includes('sunlight'), `Reason: "${nightResult.reason}"`);
    record("Nighttime advice does NOT recommend seeking afternoon shade", !nightResult.advice.toLowerCase().includes('shade') && !nightResult.advice.toLowerCase().includes('12 pm'), `Advice: "${nightResult.advice}"`);

    // Scenario B: Daytime severe heat (42°C, feels like 48°C, isDay: true)
    const dayResult = calculateRiskScore({ airTemperature: 42.0, feelsLike: 48.0, humidity: 65, isDay: true, windSpeed: 4, lst: 46 });
    record("Daytime extreme heat produces Very High/Critical risk", dayResult.score >= 70, `Score: ${dayResult.score}, Level: ${dayResult.level}`);
    record("Daytime extreme heat advice recommends shade/hydration", dayResult.advice.toLowerCase().includes('shade') || dayResult.advice.toLowerCase().includes('indoors'), `Advice: "${dayResult.advice}"`);

    // Scenario C: Wind alleviation check
    const calmResult = calculateRiskScore({ airTemperature: 36, feelsLike: 40, windSpeed: 1, isDay: true });
    const breezyResult = calculateRiskScore({ airTemperature: 36, feelsLike: 40, windSpeed: 22, isDay: true });
    record("Strong wind reduces thermal hazard relative to stagnant air", breezyResult.hazard < calmResult.hazard, `Breezy Hazard: ${breezyResult.hazard} vs Calm Hazard: ${calmResult.hazard}`);
  } catch (err) {
    record("Risk Model calculation", false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 4: Location Consistency (Civil Lines vs Zoo vs Barra)
  // -------------------------------------------------------------
  console.log("\n--- TEST 4: Location Consistency Across Monitored Wards ---");
  try {
    const resCivil = await fetch('http://localhost:5000/api/weather?lat=26.4760&lon=80.3540');
    const jsonCivil = await resCivil.json();

    const resZoo = await fetch('http://localhost:5000/api/weather?lat=26.4950&lon=80.2980');
    const jsonZoo = await resZoo.json();

    record("Civil Lines returns coordinates matching query", Number(jsonCivil.data.latitude).toFixed(3) === '26.476' && Number(jsonCivil.data.longitude).toFixed(3) === '80.354');
    record("Allen Forest Zoo returns coordinates matching query", Number(jsonZoo.data.latitude).toFixed(3) === '26.495' && Number(jsonZoo.data.longitude).toFixed(3) === '80.298');
    record("Both locations provide independent, valid live weather", jsonCivil.data.isLive && jsonZoo.data.isLive);
  } catch (err) {
    record("Location Consistency validation", false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 5: Forecast Pipeline Separation (Current vs Daily Max vs Min)
  // -------------------------------------------------------------
  console.log("\n--- TEST 5: Forecast Pipeline Semantic Separation ---");
  try {
    const resForecast = await fetch('http://localhost:5000/api/forecast?locationId=loc_civil_lines');
    const jsonForecast = await resForecast.json();

    record("Forecast API returns success: true", jsonForecast.success === true);
    record("Forecast contains 7 days", Array.isArray(jsonForecast.forecast) && jsonForecast.forecast.length === 7);

    const today = jsonForecast.forecast[0];
    record("Forecast today has tempMax and tempMin properly separated", today.temperature >= today.tempMin, `Max: ${today.temperature}°C, Min: ${today.tempMin}°C`);
    record("Forecast includes rain probability (%)", typeof today.precipProbability === 'number', `Rain Prob: ${today.precipProbability}%`);
    record("Forecast includes Peak UV", typeof today.uvMax === 'number', `Peak UV: ${today.uvMax}`);
    record("Forecast includes day/night-aware advice", typeof today.riskAdvice === 'string' && today.riskAdvice.length > 0, `Advice: "${today.riskAdvice}"`);
  } catch (err) {
    record("Forecast Pipeline validation", false, err.message);
  }

  // -------------------------------------------------------------
  // TEST 6: API Fallback Reliability (Never Silently Fake Data)
  // -------------------------------------------------------------
  console.log("\n--- TEST 6: API Fallback Reliability ---");
  try {
    const { getLiveWeather } = require('./src/services/weatherService');
    // Call with invalid coordinates that Open-Meteo rejects
    const fallbackResult = await getLiveWeather(999.0, 999.0);
    record("Offline / Invalid request returns isLive: false", fallbackResult.isLive === false);
    record("Explicit error message is returned rather than a silent fabricated number", fallbackResult.error === "Live weather data temporarily unavailable", `Error: "${fallbackResult.error}"`);
    record("Air temperature is null when data is unavailable", fallbackResult.airTemperature === null);
  } catch (err) {
    record("Fallback test", false, err.message);
  }

  console.log("\n===============================================================");
  console.log(`AUDIT TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("===============================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
