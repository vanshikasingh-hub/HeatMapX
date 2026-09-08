import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/90 to-sky-50/90 backdrop-blur-md text-slate-700 border-b border-orange-200/80 px-4 py-2 text-xs flex items-center justify-between relative z-50 shadow-sm">
      <div className="flex items-center gap-2.5 max-w-5xl mx-auto text-center sm:text-left flex-wrap justify-center">
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase shadow-sm">
          <Sparkles className="w-2.5 h-2.5" />
          KANPUR MICROCLIMATE INTEL
        </span>
        <span className="text-[11px] text-slate-600">
          Live atmospheric <strong className="text-slate-900">Air Temperature</strong> provided via Weather API • Surface heat & spatial thermal patterns powered by <strong className="text-slate-900">Landsat 8/9 & Sentinel-2</strong> satellite intelligence.
        </span>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors ml-2 cursor-pointer"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
