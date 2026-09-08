import React, { useState, useRef, useEffect } from 'react';
import { Info, X } from 'lucide-react';

const METRIC_DEFINITIONS = {
  AIR_TEMP: {
    title: "Ambient Air Temperature",
    badge: "Real-Time Weather API",
    description: "Current outdoor air temperature measured 2 meters above ground. This is the actual atmospheric temperature people experience directly outdoors, distinct from hot asphalt or roof skin temperatures.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  AIR_TEMPERATURE: {
    title: "Ambient Air Temperature",
    badge: "Real-Time Weather API",
    description: "Current outdoor air temperature measured 2 meters above ground. This is the actual atmospheric temperature people experience directly outdoors, distinct from hot asphalt or roof skin temperatures.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  FEELS_LIKE: {
    title: "Feels Like (Apparent Temperature)",
    badge: "Real-Time Calculated",
    description: "How hot the air feels to the human body when humidity and wind speed are combined with air temperature. High humidity slows perspiration evaporation, making air feel several degrees warmer and increasing thermal stress.",
    sourceTag: "Steadman / Rothfusz Biometeorology Model"
  },
  HEAT_INDEX: {
    title: "Feels Like (Heat Index)",
    badge: "Real-Time Calculated",
    description: "How hot the air feels to the human body when humidity and wind speed are combined with air temperature. High humidity slows perspiration evaporation, making air feel several degrees warmer and increasing thermal stress.",
    sourceTag: "Steadman / Rothfusz Biometeorology Model"
  },
  LST: {
    title: "Surface Temperature (LST)",
    badge: "Satellite-Derived Baseline",
    description: "Thermodynamic skin temperature of surfaces such as asphalt roads, metal roofs, and bare ground. Because concrete and tin absorb intense sunlight, surface temperature can be 5°C to 12°C hotter than surrounding air during the day.",
    sourceTag: "Landsat 8/9 TIRS & Sentinel-2"
  },
  SURFACE_TEMP: {
    title: "Surface Temperature (LST)",
    badge: "Satellite-Derived Baseline",
    description: "Thermodynamic skin temperature of surfaces such as asphalt roads, metal roofs, and bare ground. Because concrete and tin absorb intense sunlight, surface temperature can be 5°C to 12°C hotter than surrounding air during the day.",
    sourceTag: "Landsat 8/9 TIRS & Sentinel-2"
  },
  DELTA_T: {
    title: "Surface–Air Difference (ΔT)",
    badge: "Calculated Difference",
    description: "The physical differential between surface skin temperature and ambient air (ΔT = LST − T_air). Positive values show how much excess heat urban pavements and roofs retain relative to the atmosphere, based on latest satellite surface observations vs live air.",
    sourceTag: "HeatMapX Physical Energy Balance"
  },
  SURFACE_AIR_DELTA_T: {
    title: "Surface–Air Difference (ΔT)",
    badge: "Calculated Difference",
    description: "The physical differential between surface skin temperature and ambient air (ΔT = LST − T_air). Positive values show how much excess heat urban pavements and roofs retain relative to the atmosphere, based on latest surface data vs live air.",
    sourceTag: "HeatMapX Physical Energy Balance"
  },
  HUMIDITY: {
    title: "Relative Humidity",
    badge: "Real-Time Weather API",
    description: "The percentage of water vapor held in the air relative to saturation. Higher humidity (>70%) traps heat against skin and severely restricts the body's natural evaporative sweat cooling.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  RELATIVE_HUMIDITY: {
    title: "Relative Humidity",
    badge: "Real-Time Weather API",
    description: "The percentage of water vapor held in the air relative to saturation. Higher humidity (>70%) traps heat against skin and severely restricts the body's natural evaporative sweat cooling.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  DEW_POINT: {
    title: "Dew Point Temperature",
    badge: "Real-Time Weather API",
    description: "The atmospheric temperature to which air must cool to reach 100% saturation. Dew points above 24°C indicate oppressive, muggy moisture that severely limits outdoor thermal comfort and sweat evaporation.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  WIND: {
    title: "Wind Speed",
    badge: "Real-Time Weather API",
    description: "Sustained horizontal airflow speed measured 10 meters above ground. Gentle breezes (8–15 km/h) carry trapped heat away from city streets and provide vital convective cooling.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  WIND_SPEED: {
    title: "Wind Speed",
    badge: "Real-Time Weather API",
    description: "Sustained horizontal airflow speed measured 10 meters above ground. Gentle breezes (8–15 km/h) carry trapped heat away from city streets and provide vital convective cooling.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  WIND_GUST: {
    title: "Wind Gusts",
    badge: "Real-Time Weather API",
    description: "Peak transient wind bursts over brief intervals, distinct from sustained wind speed. Gusts provide temporary thermal mixing in deep urban street canyons.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  WIND_GUSTS: {
    title: "Wind Gusts",
    badge: "Real-Time Weather API",
    description: "Peak transient wind bursts over brief intervals, distinct from sustained wind speed. Gusts provide temporary thermal mixing in deep urban street canyons.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  WIND_DIRECTION: {
    title: "Wind Direction",
    badge: "Real-Time Weather API",
    description: "Compass direction from which the wind originates. Influences whether urban breezes bring cooling moisture from the Ganges river corridor or heat from industrial clusters.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  UV: {
    title: "Current UV Radiation Index",
    badge: "Real-Time Weather API",
    description: "The real-time intensity of ultraviolet radiation from the sun. Measured on an open-ended index (0–12+). At night, the UV Index is strictly 0 because there is no direct solar UV exposure.",
    sourceTag: "Live Weather & Solar Model"
  },
  CURRENT_UV: {
    title: "Current UV Radiation Index",
    badge: "Real-Time Weather API",
    description: "The real-time intensity of ultraviolet radiation from the sun. Measured on an open-ended index (0–12+). At night, the UV Index is strictly 0 because there is no direct solar UV exposure.",
    sourceTag: "Live Weather & Solar Model"
  },
  UV_INDEX: {
    title: "Current UV Radiation Index",
    badge: "Real-Time Weather API",
    description: "The real-time intensity of ultraviolet radiation from the sun. Measured on an open-ended index (0–12+). At night, the UV Index is strictly 0 because there is no direct solar UV exposure.",
    sourceTag: "Live Weather & Solar Model"
  },
  PEAK_UV: {
    title: "Today's Peak UV Forecast",
    badge: "Daily Forecast Maximum",
    description: "The maximum solar ultraviolet index expected during peak midday hours (12 PM – 2 PM). Indicates maximum anticipated daytime sun hazard so citizens can plan sun protection in advance.",
    sourceTag: "Open-Meteo Daily Solar Forecast"
  },
  TODAY_PEAK_UV: {
    title: "Today's Peak UV Forecast",
    badge: "Daily Forecast Maximum",
    description: "The maximum solar ultraviolet index expected during peak midday hours (12 PM – 2 PM). Indicates maximum anticipated daytime sun hazard so citizens can plan sun protection in advance.",
    sourceTag: "Open-Meteo Daily Solar Forecast"
  },
  PRESSURE: {
    title: "Atmospheric Pressure",
    badge: "Real-Time Weather API",
    description: "Barometric surface pressure at local Kanpur elevation (~126m). Falling pressure frequently heralds weather changes, thunderstorms, and monsoon wind shifts.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  CLOUD_COVER: {
    title: "Cloud Cover",
    badge: "Real-Time Weather API",
    description: "Percentage of sky obscured by clouds. Dense cloud cover (>70%) shades the ground from direct shortwave solar radiance, moderating daytime surface heating.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  PRECIPITATION: {
    title: "Precipitation Rate",
    badge: "Real-Time Weather API",
    description: "Current liquid rainfall rate (mm/hr). Rainfall wets asphalt and vegetation, triggering immediate evaporative cooling that drastically reduces surface skin heat.",
    sourceTag: "Live Weather API (Open-Meteo)"
  },
  HEAT_RISK: {
    title: "Composite Heat Risk Rating",
    badge: "Calculated / Derived Index",
    description: "A normalized 0–100 safety score (Low, Moderate, High, Very High, Critical) combining live air temperature, perceived heat, day/night state, wind moderation, and neighborhood vulnerability.",
    sourceTag: "HeatMapX GeoAI Risk Engine"
  },
  NDVI: {
    title: "Tree Canopy & Vegetation (NDVI)",
    badge: "Satellite-Derived Baseline",
    description: "Normalized Difference Vegetation Index (-0.2 to +0.8) derived from satellite multispectral bands. Reflects green tree canopy coverage providing direct shade and transpiration cooling across the neighborhood.",
    sourceTag: "Sentinel-2 MSI Satellite Intelligence"
  },
  TREE_CANOPY: {
    title: "Tree Canopy & Vegetation (NDVI)",
    badge: "Satellite-Derived Baseline",
    description: "Normalized Difference Vegetation Index (-0.2 to +0.8) derived from satellite multispectral bands. Reflects green tree canopy coverage providing direct shade and transpiration cooling across the neighborhood.",
    sourceTag: "Sentinel-2 MSI Satellite Intelligence"
  },
  NDBI: {
    title: "Built-Up Density Index (NDBI)",
    badge: "Satellite-Derived Baseline",
    description: "Normalized Difference Built-Up Index (-0.3 to +0.8). Measures the proportion of concrete buildings, paved roads, and impervious structures that absorb heat during the day and re-radiate it at night.",
    sourceTag: "Sentinel-2 SWIR/NIR Satellite Intelligence"
  },
  BUILT_UP: {
    title: "Built-Up Density Index (NDBI)",
    badge: "Satellite-Derived Baseline",
    description: "Normalized Difference Built-Up Index (-0.3 to +0.8). Measures the proportion of concrete buildings, paved roads, and impervious structures that absorb heat during the day and re-radiate it at night.",
    sourceTag: "Sentinel-2 SWIR/NIR Satellite Intelligence"
  },
  ALBEDO: {
    title: "Surface Reflectance (Albedo)",
    badge: "Satellite-Derived Baseline",
    description: "Broadband solar reflectance (0.0 to 1.0). Measures how much incoming solar radiance a surface reflects away rather than absorbing. High-albedo cool roofs (>0.30) stay substantially cooler than dark asphalt.",
    sourceTag: "Landsat 8/9 & Sentinel-2 Reflectance"
  },
  SMI: {
    title: "Soil Moisture Index (SMI)",
    badge: "Satellite-Derived Baseline",
    description: "Ground soil moisture content (0.0 to 1.0). Moist ground enables latent heat flux via water evaporation, reducing local microclimate temperatures compared to dry, baked earth.",
    sourceTag: "Satellite Thermal-Optical Moisture Model"
  },
  SOIL_MOISTURE: {
    title: "Soil Moisture Index (SMI)",
    badge: "Satellite-Derived Baseline",
    description: "Ground soil moisture content (0.0 to 1.0). Moist ground enables latent heat flux via water evaporation, reducing local microclimate temperatures compared to dry, baked earth.",
    sourceTag: "Satellite Thermal-Optical Moisture Model"
  },
  HEAT_EQUITY: {
    title: "Cooling Equity Priority",
    badge: "Calculated Climate Justice Index",
    description: "Priority ranking multiplying thermal hazard by population density and socio-demographic vulnerability. Directs municipal cooling shelters, cool roofs, and shade trees to disadvantaged neighborhoods first.",
    sourceTag: "HeatMapX Municipal Equity Algorithm"
  },
  DIGITAL_TWIN: {
    title: "3D Microclimate Simulation",
    badge: "Simulated Scenario Proxy",
    description: "Physics-based 'What-If' scenario model projecting cooling outcomes from urban interventions such as expanding tree canopy, applying cool roof coatings, or adding water features.",
    sourceTag: "HeatMapX Boundary-Layer Simulation Engine"
  }
};

export default function MetricInfoTooltip({ 
  metric, 
  metricKey,
  title, 
  description, 
  position = 'top',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const lookupKey = ((metric || metricKey || '') + '').trim().toUpperCase().replace(/-/g, '_');
  const metricInfo = METRIC_DEFINITIONS[lookupKey] || {
    title: title || "Metric Information",
    badge: "Heat Metric",
    description: description || "Helpful guidance about this neighborhood heat and weather metric."
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-amber-600 focus:text-amber-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center justify-center"
        aria-label={`About ${metricInfo.title}`}
        title={`Click or hover for ${metricInfo.title} info`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div 
          role="tooltip"
          className={`absolute z-50 w-72 sm:w-80 p-3.5 rounded-xl bg-white/95 backdrop-blur-xl border border-orange-200/90 shadow-2xl shadow-slate-900/10 text-left text-xs text-slate-700 pointer-events-auto animate-fadeIn ${positionClasses[position] || positionClasses.top}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2 mb-2">
            <div>
              <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mb-1">
                {metricInfo.badge}
              </span>
              <h4 className="font-bold text-slate-900 text-xs leading-tight">
                {metricInfo.title}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded sm:hidden"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-600">
            {metricInfo.description}
          </p>

          <div className="mt-2.5 pt-1.5 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>{metricInfo.sourceTag || "Satellite & Weather Intelligence"}</span>
            <span className="font-mono text-slate-500">HeatMapX Engine</span>
          </div>
        </div>
      )}
    </div>
  );
}
