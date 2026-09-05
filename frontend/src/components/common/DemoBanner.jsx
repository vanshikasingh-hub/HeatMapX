import React, { useState } from 'react';
import { AlertCircle, X, ShieldAlert, Sparkles } from 'lucide-react';

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#071A2B] text-slate-200 border-b border-[#1479D1]/30 px-4 py-2 text-xs flex items-center justify-between shadow-sm relative z-50">
      <div className="flex items-center gap-2 max-w-5xl mx-auto text-center sm:text-left flex-wrap justify-center">
        <span className="inline-flex items-center gap-1 bg-[#FF7A18] text-white font-extrabold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-sm">
          <ShieldAlert className="w-3 h-3" />
          DEMO MODE
        </span>
        <span className="text-slate-300">
          HeatMapX is currently using simulated/sample data for demonstration for <strong>Kanpur Nagar, UP, India</strong>. Live satellite, weather and demographic data integrations can be connected through the backend data pipeline.
        </span>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="text-slate-400 hover:text-white p-1 rounded transition-colors ml-2"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
