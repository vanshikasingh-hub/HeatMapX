import React from 'react';
import { useLocation } from 'react-router-dom';
import ThermalCity3DScene from './ThermalCity3DScene';

/**
 * Global3DEnvironment
 * Persistent WebGL & Canvas spatial background mounted at the root layout level.
 * Seamlessly transitions themes based on active route without re-instantiating WebGL contexts.
 */
export default function Global3DEnvironment() {
  const location = useLocation();
  const path = location.pathname;

  // Determine section-specific 3D visual theme
  let currentTheme = 'dashboard';
  let bgOpacity = 'opacity-55';

  if (path === '/login' || path === '/signup' || path === '/') {
    currentTheme = 'login';
    bgOpacity = 'opacity-65';
  } else if (path === '/personalize-location') {
    currentTheme = 'location';
    bgOpacity = 'opacity-70';
  } else if (path === '/forecast') {
    currentTheme = 'forecast';
    bgOpacity = 'opacity-55';
  } else if (path === '/heat-equity') {
    currentTheme = 'heat-equity';
    bgOpacity = 'opacity-60';
  } else if (path === '/map') {
    currentTheme = 'map';
    bgOpacity = 'opacity-40'; // Lighter behind the full-screen interactive Leaflet map
  } else if (path === '/digital-twin') {
    currentTheme = 'dashboard';
    bgOpacity = 'opacity-35'; // Softer behind the focused 3D studio
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-[#f8fafc]"
      aria-hidden="true"
    >
      {/* 1. Daytime Atmospheric Sunlight & Cyan Sky Blooms */}
      <div 
        className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#ffedd5]/70 via-[#fed7aa]/30 to-transparent blur-[130px] pointer-events-none" 
      />
      <div 
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#bae6fd]/60 via-[#e0f2fe]/30 to-transparent blur-[120px] pointer-events-none" 
      />
      <div 
        className="absolute -bottom-24 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#fef08a]/30 via-[#dbeafe]/40 to-transparent blur-[140px] pointer-events-none" 
      />

      {/* 2. Interactive Daylight 3D Thermal City */}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${bgOpacity}`}>
        <ThermalCity3DScene key={currentTheme} theme={currentTheme} />
      </div>

      {/* 3. Soft Daytime Aerial Light Wash (Keeps foreground cards and text crystal clear) */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 pointer-events-none" 
      />
    </div>
  );
}
