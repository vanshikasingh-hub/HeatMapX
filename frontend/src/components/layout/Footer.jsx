import React from 'react';
import { Flame, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-100/90 text-slate-600 text-xs border-t border-slate-200/90 py-12 mt-20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF3D00] to-[#FF7A18] flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-base text-slate-900">Heat<span className="text-[#FF7A18]">Map</span><span className="text-[#0284c7]">X</span></span>
              <span className="text-[10px] font-mono bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-200 font-bold">
                Kanpur Pilot
              </span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-md">
              Satellite-grade geospatial urban heat intelligence ecosystem mapping thermal hazards, forecasting microclimate stress, simulating 3D interventions, and empowering communities for <strong>Kanpur Nagar, Uttar Pradesh, India</strong>.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Municipal Focus: 12 Monitored Wards • Kanpur Nagar</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Intelligence Modules</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/map" className="hover:text-orange-600 transition-colors">Kanpur Thermal GIS Map</Link></li>
              <li><Link to="/forecast" className="hover:text-orange-600 transition-colors">7-Day Predictive Risk Forecast</Link></li>
              <li><Link to="/mitigation" className="hover:text-orange-600 transition-colors">AI Mitigation Advisor</Link></li>
              <li><Link to="/digital-twin" className="hover:text-orange-600 transition-colors">3D Digital Twin Simulator</Link></li>
              <li><Link to="/cool-routes" className="hover:text-orange-600 transition-colors">Safe Cool Route Navigation</Link></li>
              <li><Link to="/heat-equity" className="hover:text-orange-600 transition-colors">Heat Equity Matrix</Link></li>
            </ul>
          </div>

          {/* Science & Platform */}
          <div className="space-y-2">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Citizen & Security</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/citizen-action" className="hover:text-orange-600 transition-colors flex items-center gap-1 text-[#ea580c] font-semibold"><span>Citizen Climate Action</span><Sparkles className="w-3 h-3" /></Link></li>
              <li><Link to="/security" className="hover:text-orange-600 transition-colors">TEE Confidential Computing</Link></li>
              <li><Link to="/physics" className="hover:text-orange-600 transition-colors">Microclimate Physics (ΔT)</Link></li>
              <li><Link to="/explain" className="hover:text-orange-600 transition-colors">Explainable AI (XAI)</Link></li>
              <li><Link to="/about" className="hover:text-orange-600 transition-colors">Mission & Scientific Methodology</Link></li>
            </ul>
          </div>

        </div>

        {/* Honest Disclosure & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
            <span>Honest Science Notice: Demonstrating thermal physics & ML models on simulated Kanpur Nagar telemetry.</span>
          </div>
          <div>
            <span>© 2026 HeatMapX Platform. Built for HBTU Hackathon.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
