import React from 'react';
import { useArea } from '../../context/AreaContext';
import { MapPin, ShieldCheck, Navigation, ChevronRight, X, AlertTriangle } from 'lucide-react';

export default function LocationPromptModal() {
  const {
    isPromptOpen,
    isDetectingLocation,
    locationStatus,
    requestUserLocation,
    dismissLocationPrompt,
    openAreaSelector,
    currentArea
  } = useArea();

  if (!isPromptOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-orange-200/90 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-prompt-title"
      >
        {/* Top Header Pattern */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-sky-50 p-6 border-b border-orange-200/80 relative">
          <button
            onClick={dismissLocationPrompt}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shadow-sm"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-[10px] font-bold tracking-wide text-amber-800 mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Hyper-Local Intelligence
              </div>
              <h2 id="location-prompt-title" className="text-xl font-black tracking-tight text-slate-900">
                Personalize Your Heat Intelligence
              </h2>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-slate-600 leading-relaxed">
            Allow HeatMapX to identify your current area so your dashboard can show localized Land Surface Temperature, urban heat island intensity, and neighborhood cool routes.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <Navigation className="w-4 h-4 text-[#FF7A18] mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-snug">
                <strong className="text-slate-900 font-semibold">Ward-Level Accuracy:</strong> Automatically identifies your municipal ward (e.g., Kidwai Nagar, Civil Lines, Barra) and loads localized thermal metrics.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-600 leading-snug">
                <strong className="text-slate-900 font-semibold">Confidential Geolocation:</strong> Coordinates are reverse-geocoded against Kanpur municipal polygons locally inside your browser session.
              </div>
            </div>
          </div>

          {locationStatus === 'denied' && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                Location permission was not granted. HeatMapX is currently showing <strong className="text-slate-900">{currentArea?.name || 'Kidwai Nagar'}</strong>. You can choose any Kanpur ward manually below.
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => requestUserLocation()}
              disabled={isDetectingLocation}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl heat-btn-primary text-sm font-bold shadow-md shadow-orange-500/20 disabled:opacity-70 cursor-pointer"
            >
              {isDetectingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Detecting Your Ward...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Allow Location Access</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                dismissLocationPrompt();
                openAreaSelector();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl heat-btn-secondary text-xs font-semibold cursor-pointer"
            >
              <span>Choose Kanpur Ward Manually</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Footer note */}
          <div className="text-center">
            <button
              onClick={dismissLocationPrompt}
              className="text-xs text-slate-400 hover:text-slate-700 underline cursor-pointer transition-colors"
            >
              Continue with default ({currentArea?.name || 'Kidwai Nagar'})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
