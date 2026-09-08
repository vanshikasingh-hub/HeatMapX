import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Map, 
  Activity, 
  Cpu, 
  Lightbulb, 
  ArrowRight, 
  Layers, 
  Sparkles,
  Navigation,
  Scale,
  Sun,
  TreePine,
  Building2,
  MapPin,
  Users,
  Compass,
  ShieldCheck,
  ChevronRight,
  Droplets,
  Eye,
  CheckCircle2
} from 'lucide-react';

export default function LandingPage() {
  const featureCards = [
    {
      num: "01",
      title: "Interactive Heat Map",
      desc: "Explore area-level heat intelligence across 12 municipal wards with thermal satellite proxy overlays.",
      icon: Map,
      link: "/map",
      badge: "Thermal GIS"
    },
    {
      num: "02",
      title: "Heat Intelligence Dashboard",
      desc: "Understand thermal conditions, surface-air physics (ΔT), and composite risk scores for your specific ward.",
      icon: Activity,
      link: "/dashboard",
      badge: "Localized Metrics"
    },
    {
      num: "03",
      title: "3D Digital Twin",
      desc: "Simulate urban cooling interventions—tree canopy expansion and cool roofs—before committing capital.",
      icon: Cpu,
      link: "/digital-twin",
      badge: "Physics Simulator"
    },
    {
      num: "04",
      title: "Cool Route Planner",
      desc: "Find safer, lower-heat walking and cycling routes that maximize tree canopy shade and water stations.",
      icon: Navigation,
      link: "/cool-routes",
      badge: "Microclimate Navigation"
    },
    {
      num: "05",
      title: "Mitigation AI",
      desc: "Receive area-specific cooling strategies tailored to each ward's built-up density and canopy deficit.",
      icon: Lightbulb,
      link: "/mitigation",
      badge: "Decision Engine"
    },
    {
      num: "06",
      title: "Heat Equity Matrix",
      desc: "Identify climate vulnerability hotspots and guide equitable municipal cooling fund allocations.",
      icon: Scale,
      link: "/heat-equity",
      badge: "Climate Justice"
    },
    {
      num: "07",
      title: "Citizen Action",
      desc: "Empower residents to report micro-hotspots, plant trees, earn climate badges, and climb the leaderboard.",
      icon: Users,
      link: "/citizen-action",
      badge: "Community Gamification"
    },
    {
      num: "08",
      title: "TEE Confidential Security",
      desc: "Protect sensitive citizen health reports and location telemetry inside hardware-isolated enclaves.",
      icon: ShieldCheck,
      link: "/security",
      badge: "Zero-Knowledge"
    }
  ];

  return (
    <div className="space-y-24 pb-20 text-zinc-100 overflow-hidden">
      
      {/* ==========================================================================
          HERO SECTION — Atmospheric Dark Satellite & Thermal Glow
          ========================================================================== */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        
        {/* Cinematic Ambient Radial Heat Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] max-w-[95vw] h-[550px] bg-gradient-to-tr from-[#FF3D00]/25 via-[#FF7A18]/20 to-transparent blur-[160px] rounded-full pointer-events-none -z-10 animate-heat-pulse" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10" 
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Live Pilot Indicator Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-orange-500/30 text-xs font-semibold text-zinc-300 shadow-heat-glow-sm mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF7A18] animate-ping" />
          <span className="font-mono text-amber-400 font-bold">Now live</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-200">Kanpur Nagar pilot</span>
        </div>

        {/* Hero Impact Headline */}
        <div className="space-y-3 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Don't just track heat.<br />
            <span className="heat-text-gradient">Outsmart heat.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-zinc-400 font-normal max-w-2xl mx-auto pt-2 leading-relaxed">
            Satellite-grade thermal intelligence for Kanpur Nagar. Forecast, simulate, act.
          </p>
        </div>

        {/* Primary and Secondary Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-8 w-full max-w-md mx-auto">
          <Link
            to="/map"
            className="w-full sm:w-auto heat-btn-primary px-8 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-heat-glow group"
          >
            <span>View live map</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/signup"
            className="w-full sm:w-auto heat-btn-secondary px-7 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4 text-zinc-400" />
            <span>Create resident account</span>
          </Link>
        </div>

        {/* ==========================================================================
            HERO STAT STRIP — 4-Column Translucent Glass Container
            ========================================================================== */}
        <div className="w-full max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl bg-white/[0.03] border border-orange-500/20 backdrop-blur-xl shadow-2xl divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
            
            <div className="p-5 text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block">
                12
              </span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">
                Wards Monitored
              </span>
            </div>

            <div className="p-5 text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block">
                3.2M
              </span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">
                Residents Covered
              </span>
            </div>

            <div className="p-5 text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block">
                7-day
              </span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">
                Forecast Horizon
              </span>
            </div>

            <div className="p-5 text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight block">
                TEE
              </span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">
                Hardware Secured
              </span>
            </div>

          </div>
        </div>

      </section>

      {/* ==========================================================================
          NUMBERED FEATURE CARDS SECTION (01 - 08)
          ========================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FFA726] bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Intelligent Climate Stack
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Built for Extreme Urban Heat Resilience
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From Landsat thermal radiometry to turn-by-turn cool navigation and 3D digital twins, HeatMapX connects climate science directly to civic decision-making.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.num}
                to={feat.link}
                className="group cinematic-card p-6 flex flex-col justify-between space-y-5 hover:border-orange-500/40 relative overflow-hidden"
              >
                {/* Subtle card ambient highlight */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-orange-500/15 transition-all" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-amber-400 transition-colors">
                      {feat.num}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 text-[#FF7A18] flex items-center justify-center group-hover:scale-105 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 transition-all">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-zinc-400 group-hover:text-amber-400 transition-colors">
                  <span>Explore module</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ==========================================================================
          CALL TO ACTION STRIP
          ========================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cinematic-card p-8 sm:p-12 text-center relative overflow-hidden border border-orange-500/30">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-block p-3 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-amber-400 mb-2">
              <Flame className="w-8 h-8 animate-pulse" />
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ready to Navigate Kanpur Nagar's Microclimates?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Explore ward-level Land Surface Temperature, test 3D interventions in real-time, or contribute neighborhood mitigation actions.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto heat-btn-primary px-8 py-3.5 text-sm font-bold shadow-heat-glow"
              >
                Launch Intelligence Dashboard
              </Link>
              <Link
                to="/digital-twin"
                className="w-full sm:w-auto heat-btn-secondary px-7 py-3.5 text-sm font-semibold"
              >
                Open 3D Simulator
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
