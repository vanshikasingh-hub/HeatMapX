import React from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Database, 
  Layers, 
  Activity, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Globe, 
  Sparkles, 
  MapPin, 
  Users, 
  ArrowRight,
  Lock,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-slate-800">
      
      {/* Header Section */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-orange-500/10 text-[#FF7A18] font-mono text-xs px-2.5 py-1 rounded-full border border-orange-500/25 font-bold flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#FF7A18]" />
            PLATFORM METHODOLOGY & ARCHITECTURE
          </span>
          <span className="bg-emerald-500/10 text-emerald-700 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-500/25 font-bold">
            SCIENTIFIC INTEGRITY VERIFIED
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
          Methodology, Scientific Pipeline & <span className="heat-text-gradient">System Architecture</span>
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive technical overview of HeatMapX's geospatial data pipeline, physics layer, composite risk model, citizen action ecosystem, and TEE Confidential Computing architecture for <strong>Kanpur Nagar, Uttar Pradesh, India</strong>.
        </p>
      </div>

      {/* SYSTEM STATUS TELEMETRY BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="cinematic-card p-4 space-y-1 shadow-sm border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-mono block uppercase">Demonstration City</span>
          <strong className="text-sm text-sky-700 font-black block">Kanpur Nagar (12 Wards)</strong>
        </div>
        <div className="cinematic-card p-4 space-y-1 shadow-sm border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-mono block uppercase">Geospatial CRS</span>
          <strong className="text-sm text-emerald-700 font-mono font-black block">EPSG:4326 (WGS 84)</strong>
        </div>
        <div className="cinematic-card p-4 space-y-1 shadow-sm border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-mono block uppercase">Security Architecture</span>
          <strong className="text-sm text-[#FF7A18] font-black block">TEE-Ready / Simulated</strong>
        </div>
        <div className="cinematic-card p-4 space-y-1 shadow-sm border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-mono block uppercase">Multi-City Scalability</span>
          <strong className="text-sm text-purple-700 font-black block">Varanasi Adapter Ready</strong>
        </div>
      </div>

      {/* PIPELINE BREAKDOWN */}
      <section className="cinematic-card p-6 space-y-6 shadow-sm border border-slate-200/80">
        <div className="border-b border-slate-200/80 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
            <Activity className="w-5 h-5 text-[#FF7A18]" />
            <span>HeatMapX 8-Stage Geospatial Processing Pipeline</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">End-to-end telemetry transformation from orbital sensors to municipal policy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-sky-700 font-mono font-bold block">1. Multi-Source Ingestion</span>
            <p className="text-slate-600 leading-relaxed">Ingest multi-spectral satellite imagery (Landsat 8/9, Sentinel-2), meteorological feeds (IMD/ERA5), and demographic census proxies for Kanpur.</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-sky-700 font-mono font-bold block">2. Spectral Index Derivation</span>
            <p className="text-slate-600 leading-relaxed">Compute key indices: Land Surface Temp (LST), vegetation canopy (NDVI), built-up intensity (NDBI), soil moisture (SMI), and surface albedo (α).</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-[#FF7A18] font-mono font-bold block">3. Microclimate Physics Layer</span>
            <p className="text-slate-600 leading-relaxed">Quantify surface skin vs ambient air differential (ΔT = LST − T_air) and apparent heat index based on relative atmospheric humidity.</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-red-600 font-mono font-bold block">4. Composite Risk Scoring</span>
            <p className="text-slate-600 leading-relaxed">Calculate 0-100 normalized risk score synthesizing physical thermal hazard (50%), population exposure (25%), and social vulnerability (25%).</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-purple-700 font-mono font-bold block">5. Explainable AI (XAI)</span>
            <p className="text-slate-600 leading-relaxed">Decompose risk score into ranked factor attribution percentages to explain why a specific ward (e.g. Sisamau vs Kalyanpur) experiences heat stress.</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-amber-700 font-mono font-bold block">6. AI Mitigation Advisor</span>
            <p className="text-slate-600 leading-relaxed">Recommend targeted cooling interventions (high-albedo cool roofs, native tree plantations, permeable pavements, hydration kiosks).</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-sky-700 font-mono font-bold block">7. 3D Digital Twin Simulation</span>
            <p className="text-slate-600 leading-relaxed">Interactive scenario modeling: test cooling outcomes (ΔLST, ΔRisk) and citizens benefited in procedural 3D before allocating municipal capital.</p>
          </div>

          <div className="cinematic-card-subtle p-4 space-y-2 hover:border-orange-400/50 transition-all border border-slate-200/70">
            <span className="text-emerald-700 font-mono font-bold block">8. Citizen Climate Action</span>
            <p className="text-slate-600 leading-relaxed">Mobilize grassroots citizen reporting of tree planting and cool roofs, awarding digital achievement badges and mapping verified actions.</p>
          </div>

        </div>
      </section>

      {/* TEE SECURITY SECTION */}
      <section className="cinematic-card p-6 border-orange-300 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FF7A18]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">TEE Security — Architecture Ready</h3>
              <span className="text-xs text-sky-700 font-mono">Trusted Execution Environment Confidential Computing</span>
            </div>
          </div>
          <Link
            to="/security"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#FF7A18] hover:text-[#FFA726] transition-colors"
          >
            <span>Inspect Enclave Attestation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          High-resolution urban demographic census data, vulnerability indicators, and critical infrastructure geometries are sensitive municipal assets. HeatMapX's backend is architected so that sensitive geospatial risk models and demographic joins can be executed inside hardware-enforced <strong>Trusted Execution Environments (TEEs)</strong> (such as Intel SGX, AMD SEV, or AWS Nitro Enclaves).
        </p>

        <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Note: HeatMapX's architecture is TEE-ready for future deployment; it currently runs in demonstration prototype mode.</span>
          </div>
          <Link to="/security" className="text-[#FF7A18] font-bold hover:underline shrink-0">
            Open Security Verifier →
          </Link>
        </div>
      </section>

      {/* FUTURE DATA INTEGRATION ADAPTERS */}
      <section className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80">
        <div className="border-b border-slate-200/80 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
            <Globe className="w-5 h-5 text-sky-600" />
            <span>Future Real-Time Data Pipeline Adapters</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            The HeatMapX backend uses an abstracted Data Adapter interface. In future production phases, the simulated Kanpur dataset will be dynamically updated through automated connectors to:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="cinematic-card-subtle p-3.5 space-y-1 border border-slate-200/80">
            <strong className="block text-slate-900">ISRO Bhuvan / MOSDAC</strong>
            <span className="text-[11px] text-slate-500">INSAT-3D/3DR & Resourcesat thermal & optical feeds</span>
          </div>
          <div className="cinematic-card-subtle p-3.5 space-y-1 border border-slate-200/80">
            <strong className="block text-slate-900">IMD Station Grid</strong>
            <span className="text-[11px] text-slate-500">Real-time AWS weather stations across Uttar Pradesh</span>
          </div>
          <div className="cinematic-card-subtle p-3.5 space-y-1 border border-slate-200/80">
            <strong className="block text-slate-900">Google Earth Engine</strong>
            <span className="text-[11px] text-slate-500">Automated Landsat 9 & Sentinel-2 collection pipelines</span>
          </div>
          <div className="cinematic-card-subtle p-3.5 space-y-1 border border-slate-200/80">
            <strong className="block text-slate-900">NDAP & Census Data</strong>
            <span className="text-[11px] text-slate-500">National Data & Analytics Platform socio-economic layers</span>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC GUARDRAILS & HONESTY DISCLAIMER */}
      <section className="cinematic-card p-6 border-amber-300 space-y-3 shadow-sm bg-amber-50/40">
        <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Scientific Honesty Notice & Prototype Guardrails</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          HeatMapX is currently operating in <strong>PROTOTYPE DEMONSTRATION MODE</strong> using simulated/sample spatial datasets calibrated for Kanpur Nagar, UP, India. Composite risk formulas, forecast projections, and Digital Twin deltas represent prototype decision support models. They do not claim certified medical risk forecasts or live sensor feeds.
        </p>
      </section>

    </div>
  );
}
