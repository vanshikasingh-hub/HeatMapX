import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArea } from '../context/AreaContext';
import { Navigation, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LocationAccessPage() {
  const navigate = useNavigate();
  const { 
    requestUserLocation, 
    isDetectingLocation, 
    currentArea, 
    setAreaById,
    allAreas,
    openAreaSelector
  } = useArea();

  const canvasRef = useRef(null);
  const [grantedSuccess, setGrantedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Subtle 3D-inspired urban thermal grid & wave particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Procedural 3D isometric grid points with thermal wave elevation
    const cols = 28;
    const rows = 20;
    let time = 0;

    // Building silhouettes in distance
    const buildings = [];
    const bCount = 24;
    for (let i = 0; i < bCount; i++) {
      buildings.push({
        x: (i / bCount) * width + (Math.random() * 20 - 10),
        w: 30 + Math.random() * 50,
        h: 90 + Math.random() * 160,
        color: i % 3 === 0 ? 'rgba(255, 122, 24, 0.08)' : i % 2 === 0 ? 'rgba(20, 121, 209, 0.09)' : 'rgba(239, 68, 68, 0.07)'
      });
    }

    const render = () => {
      time += 0.015;
      ctx.fillStyle = '#f0f9ff';
      ctx.fillRect(0, 0, width, height);

      // 1. Subtle building silhouettes in the background horizon
      const horizonY = height * 0.72;
      for (const b of buildings) {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, horizonY - b.h, b.w, b.h);
        // Roof subtle glow line
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(b.x, horizonY - b.h, b.w, 1.5);
      }

      // 2. 3D Perspective Isometric Mesh with thermal heat wave modulation
      const originX = width / 2;
      const originY = height * 0.48;
      const cellWidth = Math.max(32, width / 24);
      const cellDepth = cellWidth * 0.46;

      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const gridX = (c - cols / 2) * cellWidth;
          const gridZ = r * cellDepth;

          // Thermal wave height displacement
          const dist = Math.sqrt(gridX * gridX + gridZ * gridZ);
          const wave = Math.sin(dist * 0.012 - time) * 14 + Math.cos((c + r) * 0.3 + time * 0.8) * 8;

          // Project to 2D screen coordinates
          const screenX = originX + gridX * (1 + r * 0.035);
          const screenY = originY + gridZ * 0.75 + wave;

          // Thermal color transition based on wave height
          const normHeat = (wave + 22) / 44;
          let dotColor = 'rgba(2, 132, 199, 0.35)'; // Blue
          if (normHeat > 0.65) dotColor = 'rgba(255, 122, 24, 0.55)'; // Orange
          else if (normHeat > 0.45) dotColor = 'rgba(217, 119, 6, 0.45)'; // Amber

          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(screenX, screenY, Math.max(1, 1.2 + r * 0.08), 0, Math.PI * 2);
          ctx.fill();

          // Horizontal grid line connecting neighbor
          if (c < cols - 1) {
            const nextGridX = (c + 1 - cols / 2) * cellWidth;
            const nextWave = Math.sin(Math.sqrt(nextGridX * nextGridX + gridZ * gridZ) * 0.012 - time) * 14;
            const nextScreenX = originX + nextGridX * (1 + r * 0.035);
            const nextScreenY = originY + gridZ * 0.75 + nextWave;

            ctx.strokeStyle = normHeat > 0.6 ? 'rgba(255, 122, 24, 0.22)' : 'rgba(2, 132, 199, 0.15)';
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(nextScreenX, nextScreenY);
            ctx.stroke();
          }
        }
      }

      // 3. Central ambient thermal bloom
      const grad = ctx.createRadialGradient(originX, originY + 60, 20, originX, originY + 60, 420);
      grad.addColorStop(0, 'rgba(255, 122, 24, 0.14)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      grad.addColorStop(1, 'rgba(240, 249, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAllowLocation = async () => {
    setErrorMsg('');
    localStorage.setItem('heatmapx_loc_prompt_shown', 'true');
    try {
      await requestUserLocation();
      setGrantedSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 600);
    } catch (err) {
      // Permission denied or unavailable -> select default Kanpur ward and proceed
      setAreaById('loc_barra');
      navigate('/dashboard');
    }
  };

  const handleManualChoice = () => {
    localStorage.setItem('heatmapx_loc_prompt_shown', 'true');
    openAreaSelector();
    navigate('/dashboard');
  };

  const handleSkip = () => {
    localStorage.setItem('heatmapx_loc_prompt_shown', 'true');
    setAreaById('loc_barra');
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[92vh] flex items-center justify-center p-4 overflow-hidden select-none">
      {/* 3D Thermal Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* Main Clean Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-orange-200/80 shadow-[0_20px_60px_rgba(15,23,42,0.12)] text-center space-y-8 animate-fadeIn text-slate-900">
        
        {/* Visual Location Beacon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF3D00] via-[#FF7A18] to-[#FFB300] blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center shadow-inner">
              {grantedSuccess ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-bounce" />
              ) : (
                <MapPin className="w-10 h-10 text-[#FF7A18] animate-pulse" />
              )}
            </div>
          </div>
        </div>

        {/* Heading: Strictly clean as requested */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            Personalize Your Heat Intelligence
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Detecting your local Kanpur microclimate zone for targeted warnings
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Action Button: Allow Location Access */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleAllowLocation}
            disabled={isDetectingLocation}
            id="allow-location-btn"
            className="w-full py-4 px-6 rounded-2xl heat-btn-primary font-black text-sm text-white shadow-[0_4px_20px_rgba(255,122,24,0.35)] hover:shadow-[0_6px_25px_rgba(255,122,24,0.5)] flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-75"
          >
            {isDetectingLocation ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Identifying Your Ward...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 fill-white" />
                <span>Allow Location Access</span>
              </>
            )}
          </button>

          {/* Clean secondary option */}
          <button
            onClick={handleManualChoice}
            className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Choose Kanpur Ward Manually</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={handleSkip}
            className="text-[11px] text-slate-500 hover:text-slate-800 transition-colors pt-2 cursor-pointer block mx-auto underline underline-offset-4 font-medium"
          >
            Continue with default ({currentArea?.name || 'Kidwai Nagar'})
          </button>
        </div>
      </div>
    </div>
  );
}
