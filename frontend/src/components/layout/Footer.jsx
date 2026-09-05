import React from 'react';
import { Flame, ShieldCheck, Heart, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#071A2B] text-slate-400 text-xs border-t border-[#1479D1]/20 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF7A18] flex items-center justify-center text-white font-black text-sm shadow-md">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-white">Heat<span className="text-[#FF7A18]">Map</span><span className="text-[#28B8F2]">X</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              A comprehensive geospatial AI and climate intelligence platform mapping urban heat risk, uncovering thermal drivers, simulating cool interventions, and rewarding citizen climate action for <strong>Kanpur Nagar, Uttar Pradesh, India</strong>.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#FF7A18]" />
              <span>Primary Demonstration City: Kanpur Nagar, UP, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#28B8F2]">Intelligence Modules</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/map" className="hover:text-white transition-colors">Kanpur Interactive Heat Map</Link></li>
              <li><Link to="/forecast" className="hover:text-white transition-colors">7-Day Thermal Risk Forecast</Link></li>
              <li><Link to="/mitigation" className="hover:text-white transition-colors">AI Mitigation Advisor</Link></li>
              <li><Link to="/digital-twin" className="hover:text-white transition-colors">Digital Twin "What-If" Simulator</Link></li>
              <li><Link to="/cool-routes" className="hover:text-white transition-colors">Thermal-Aware Cool Route Planner</Link></li>
              <li><Link to="/heat-equity" className="hover:text-white transition-colors">Urban Heat Equity Index</Link></li>
            </ul>
          </div>

          {/* Citizen & Science */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#FF9F43]">Citizen & Science</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/citizen-action" className="hover:text-white transition-colors flex items-center gap-1 text-[#FF9F43] font-semibold"><span>Citizen Climate Action</span><Sparkles className="w-3 h-3" /></Link></li>
              <li><Link to="/physics" className="hover:text-white transition-colors">Microclimate Physics Layer</Link></li>
              <li><Link to="/explain" className="hover:text-white transition-colors">Explainable AI (XAI)</Link></li>
              <li><Link to="/analytics" className="hover:text-white transition-colors">Multivariate Analytics</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Architecture & TEE Security</Link></li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#28B8F2]" />
            <span>Honest Science Notice: HeatMapX uses simulated prototype datasets for Kanpur Nagar. TEE architecture is design-ready.</span>
          </div>
          <div>
            <span>© 2026 HeatMapX Platform. Built for HBTU Hackathon.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
