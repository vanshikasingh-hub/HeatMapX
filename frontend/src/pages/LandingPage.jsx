import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Map, 
  Activity, 
  Cpu, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Navigation,
  Scale,
  Sun,
  TreePine,
  Building2,
  MapPin,
  Users,
  Compass,
  Zap,
  Globe,
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* HERO SECTION - Deep Navy with Electric Blue & Vibrant Orange Accents */}
      <section className="relative pt-12 pb-16 text-center space-y-8 overflow-hidden rounded-3xl bg-gradient-to-b from-[#071A2B] via-[#0B2942] to-[#071A2B] text-white p-8 sm:p-12 border border-[#1479D1]/30 shadow-2xl">
        
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#1479D1]/30 via-[#28B8F2]/20 to-[#FF7A18]/25 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B2942] border border-[#28B8F2]/40 text-xs text-[#28B8F2] font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-[#FF9F43] animate-spin" />
          <span>Geospatial AI + Climate Intelligence & Decision Support Platform</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Heat<span className="text-[#FF7A18]">Map</span><span className="text-[#28B8F2]">X</span>
          </h1>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-200 tracking-tight">
            More Than a Heat Map — A Complete Urban Heat Intelligence Ecosystem
          </p>
        </div>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-normal leading-relaxed">
          Map urban heat risk, understand its drivers, forecast future stress, and discover data-driven cooling strategies for <strong>Kanpur Nagar, Uttar Pradesh, India</strong>.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/map"
            className="w-full sm:w-auto bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] hover:from-[#ff6f00] hover:to-[#ff8f24] text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-xl shadow-orange-950/40 flex items-center justify-center gap-2 group"
          >
            <Map className="w-5 h-5" />
            <span>Explore Heat Intelligence</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto bg-[#1479D1] hover:bg-[#1062a8] text-white font-bold px-8 py-3.5 rounded-xl text-sm border border-[#28B8F2]/40 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Activity className="w-5 h-5 text-[#28B8F2]" />
            <span>View Dashboard</span>
          </Link>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto pt-8 text-left">
          <div className="bg-[#0B2942]/80 p-4 rounded-xl border border-[#1479D1]/30">
            <Sun className="w-5 h-5 text-[#FF9F43] mb-2" />
            <span className="text-slate-400 text-xs block">Thermal Physics</span>
            <span className="text-sm font-bold text-white">LST vs Ambient ΔT</span>
          </div>

          <div className="bg-[#0B2942]/80 p-4 rounded-xl border border-[#1479D1]/30">
            <TreePine className="w-5 h-5 text-emerald-400 mb-2" />
            <span className="text-slate-400 text-xs block">Multi-Spectral Indices</span>
            <span className="text-sm font-bold text-white">NDVI / NDBI / SMI / Albedo</span>
          </div>

          <div className="bg-[#0B2942]/80 p-4 rounded-xl border border-[#1479D1]/30">
            <Cpu className="w-5 h-5 text-[#28B8F2] mb-2" />
            <span className="text-slate-400 text-xs block">Digital Twin</span>
            <span className="text-sm font-bold text-white">What-If Cooling Sim</span>
          </div>

          <div className="bg-[#0B2942]/80 p-4 rounded-xl border border-[#1479D1]/30">
            <Users className="w-5 h-5 text-[#FF7A18] mb-2" />
            <span className="text-slate-400 text-xs block">Community Action</span>
            <span className="text-sm font-bold text-white">Citizen Badges & Awards</span>
          </div>
        </div>

      </section>

      {/* VISUAL STORYTELLING PIPELINE */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-[#1479D1] uppercase tracking-widest">End-To-End Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B]">The HeatMapX Intelligence Pipeline</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            From multi-source raw satellite observations to verified on-ground citizen cooling interventions.
          </p>
        </div>

        {/* Linear Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1', title: 'Satellite Data', subtitle: 'Thermal & Optical', color: 'border-blue-300 bg-blue-50 text-blue-900' },
            { step: '2', title: 'Heat Detection', subtitle: 'LST & Hotspots', color: 'border-orange-300 bg-orange-50 text-orange-900' },
            { step: '3', title: 'Physics Layer', subtitle: 'Delta T & Moisture', color: 'border-cyan-300 bg-cyan-50 text-cyan-900' },
            { step: '4', title: 'AI Risk Model', subtitle: 'Hazard x Pop x Vuln', color: 'border-red-300 bg-red-50 text-red-900' },
            { step: '5', title: 'Explainable AI', subtitle: 'Driver Breakdown', color: 'border-amber-300 bg-amber-50 text-amber-900' },
            { step: '6', title: 'Mitigation AI', subtitle: 'Targeted Cooling', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
            { step: '7', title: 'Digital Twin', subtitle: 'What-If Simulation', color: 'border-purple-300 bg-purple-50 text-purple-900' },
            { step: '8', title: 'Climate Action', subtitle: 'Citizen Verification', color: 'border-teal-300 bg-teal-50 text-teal-900' }
          ].map((item) => (
            <div key={item.step} className={`p-3 rounded-xl border ${item.color} shadow-sm space-y-1`}>
              <span className="w-5 h-5 rounded-full bg-white font-bold text-[10px] inline-flex items-center justify-center shadow-xs">
                {item.step}
              </span>
              <strong className="block text-xs leading-tight">{item.title}</strong>
              <span className="text-[10px] text-slate-500 block">{item.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* The Problem */}
        <div className="glass-card p-6 sm:p-8 space-y-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>The Urban Heat Crisis</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#071A2B]">Kanpur's Concrete Canyons & Asymmetric Vulnerability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            During North Indian pre-monsoon peaks, land surface temperatures across Kanpur's dense transit hubs (Kanpur Central, Ghanta Ghar) and unshaded residential corridors (Sisamau, Panki) exceed <strong>45°C</strong>. Single-variable ambient thermometer readings fail to capture surface thermal absorption, low albedo trap effects, or demographic exposure for street vendors and informal settlements.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Severe heat health risk for 34,000+ people/km² in high-density wards</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Lack of localized, ward-level physics-based actionable cooling guidance</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Zero citizen involvement mechanisms to scale mitigation</span>
            </li>
          </ul>
        </div>

        {/* The Solution */}
        <div className="glass-card p-6 sm:p-8 space-y-4 border-l-4 border-l-[#1479D1]">
          <div className="flex items-center gap-2 text-[#1479D1] font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>The HeatMapX Solution</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#071A2B]">Multi-Spectral GeoAI + Physics + Citizen Action</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            HeatMapX fuses optical and thermal satellite bands (LST, NDVI, NDBI, SMI, Albedo) with ground micrometeorology, structural vulnerability, and a prototype <strong>Digital Twin</strong>. Citizens actively report interventions (cool roofs, tree planting) and earn digital honors, closing the loop from analysis to tangible cooling.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1479D1]" />
              <span>Composite Heat Risk: Hazard (50%) + Exposure (25%) + Vulnerability (25%)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1479D1]" />
              <span>Dynamic Rule-Based Explainable AI explaining WHY each area is hot</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1479D1]" />
              <span>Community Climate Action Center with verifiable badges & awards</span>
            </li>
          </ul>
        </div>

      </section>

      {/* DEMO CITY SPOTLIGHT: KANPUR NAGAR */}
      <section className="bg-white p-8 rounded-3xl border border-[#1479D1]/20 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-[#FF7A18] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Primary Demonstration City
            </span>
            <h2 className="text-2xl font-extrabold text-[#071A2B] mt-0.5">Kanpur Nagar, Uttar Pradesh, India</h2>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1479D1] hover:underline"
          >
            <span>Inspect 12 Ward Polygons on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F7FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#071A2B]">Kanpur Central</span>
              <span className="badge-critical">Critical Risk</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Dense transit bottleneck, metal railway yards, and low albedo asphalt. 44.8°C LST.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#071A2B]">Sisamau Bazaar</span>
              <span className="badge-critical">Top Priority</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Extremely high population density (36k/km²) and vulnerable tin roof structures.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#071A2B]">Allen Forest Zoo</span>
              <span className="badge-very-low">Cool Island</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Protected urban botanical reserve and lake. Natural microclimate benchmark at 31.8°C.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7FAFC] border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-[#071A2B]">IIT Kanpur</span>
              <span className="badge-very-low">Canopy Oasis</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              High tree canopy cover (NDVI 0.62) demonstrating the tangible cooling power of urban forestry.
            </p>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#1479D1] uppercase tracking-wider">Features & Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B]">Comprehensive Urban Heat Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1479D1]/10 text-[#1479D1] flex items-center justify-center font-bold">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">12 Spatial Geospatial Layers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Leaflet GIS map with 12 distinct layers: Composite Risk, LST, NDVI, NDBI, DEM, SMI, Albedo, Population Exposure, Social Vulnerability, Roads, Anthropogenic Heat, and Citizen Actions.
            </p>
            <Link to="/map" className="inline-flex items-center gap-1 text-xs font-bold text-[#1479D1] hover:underline pt-1">
              <span>Launch Kanpur Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF7A18]/10 text-[#FF7A18] flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">Digital Twin "What-If" Simulation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive scenario modeling: evaluate how adding tree cover, high-albedo cool roofs, and bioswales lowers land surface temperature and protects citizens before deploying capital.
            </p>
            <Link to="/digital-twin" className="inline-flex items-center gap-1 text-xs font-bold text-[#FF7A18] hover:underline pt-1">
              <span>Simulate Interventions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">Citizen Action Ecosystem</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Empower citizens to record verified tree plantations, cool roof paint jobs, and terrace gardens. Unlock digital badges, earn civic honors, and track neighborhood leaderboards.
            </p>
            <Link to="/citizen-action" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline pt-1">
              <span>Enter Action Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">Cool Route Navigation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thermal-weighted pedestrian route optimization. Guides outdoor workers, students, and pedestrians through tree-lined avenues and shaded walkways to reduce physiological heat stress.
            </p>
            <Link to="/cool-routes" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:underline pt-1">
              <span>Plan Cool Route</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">Heat Equity Index</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prioritize municipal cooling funds not simply where temperature is highest, but where high heat overlaps with poverty, elderly cohorts, and dense informal housing.
            </p>
            <Link to="/heat-equity" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline pt-1">
              <span>View Equity Rankings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-[#071A2B]">7-Day Risk Forecasting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-day thermal risk projections factoring ambient temperature trends, humidity spikes, and apparent heat index to deliver early warnings for municipal health authorities.
            </p>
            <Link to="/forecast" className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline pt-1">
              <span>Inspect Forecast</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* CALL TO ACTION FOOTER BANNER */}
      <section className="bg-gradient-to-r from-[#071A2B] via-[#0B2942] to-[#1479D1] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold text-[#28B8F2] uppercase tracking-wider">Join the Urban Heat Mission</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Explore Kanpur's Thermal Intelligence?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Experience the interactive GIS workspace, simulate cooling interventions, or log your climate action today.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/map"
            className="bg-[#FF7A18] hover:bg-[#e0660e] text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-lg transition-all"
          >
            Launch Heat Map
          </Link>
          <Link
            to="/citizen-action"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs border border-white/20 transition-all"
          >
            Take Climate Action
          </Link>
        </div>
      </section>

    </div>
  );
}
