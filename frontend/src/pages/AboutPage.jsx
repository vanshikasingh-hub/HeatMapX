import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, Activity, HelpCircle, FileText, CheckCircle2, AlertTriangle, Globe, Sparkles, MapPin, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#102A43]">
      
      {/* Header */}
      <div className="space-y-2 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="bg-[#1479D1]/10 text-[#1479D1] font-mono text-xs px-2.5 py-0.5 rounded border border-[#1479D1]/20 font-bold">
            PLATFORM METHODOLOGY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A2B] tracking-tight">
            Methodology, Pipeline & Architecture
          </h1>
        </div>
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          Comprehensive technical overview of HeatMapX's geospatial data pipeline, physics layer, composite risk model, citizen action ecosystem, and TEE Confidential Computing architecture for <strong>Kanpur Nagar, Uttar Pradesh, India</strong>.
        </p>
      </div>

      {/* PIPELINE BREAKDOWN */}
      <section className="glass-card p-6 space-y-6">
        <h3 className="text-lg font-extrabold text-[#071A2B] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#1479D1]" />
          <span>HeatMapX 8-Stage Data Processing Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[#1479D1] font-mono font-bold block">1. Multi-Source Ingestion</span>
            <p className="text-slate-600">Ingest multi-spectral satellite imagery (Landsat 8/9, Sentinel-2), meteorological feeds (IMD/ERA5), and demographic census proxies for Kanpur.</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[#28B8F2] font-mono font-bold block">2. Spectral Index Derivation</span>
            <p className="text-slate-600">Compute key indices: Land Surface Temp (LST), vegetation canopy (NDVI), built-up intensity (NDBI), soil moisture (SMI), and surface albedo (α).</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[#FF7A18] font-mono font-bold block">3. Microclimate Physics Layer</span>
            <p className="text-slate-600">Quantify surface skin vs ambient air differential (ΔT = LST − T_air) and apparent heat index based on relative atmospheric humidity.</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-red-600 font-mono font-bold block">4. Composite Risk Scoring</span>
            <p className="text-slate-600">Calculate 0-100 normalized risk score synthesizing physical thermal hazard (50%), population exposure (25%), and social vulnerability (25%).</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-purple-600 font-mono font-bold block">5. Explainable AI (XAI)</span>
            <p className="text-slate-600">Decompose risk score into ranked factor attribution percentages to explain why a specific ward (e.g. Sisamau vs Kalyanpur) experiences heat stress.</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-[#FF9F43] font-mono font-bold block">6. AI Mitigation Advisor</span>
            <p className="text-slate-600">Recommend targeted cooling interventions (high-albedo cool roofs, native tree plantations, permeable pavements, hydration kiosks).</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-cyan-700 font-mono font-bold block">7. Digital Twin Simulation</span>
            <p className="text-slate-600">Interactive scenario modeling: test cooling outcomes (ΔLST, ΔRisk) and citizens benefited before allocating municipal capital.</p>
          </div>

          <div className="bg-[#F7FAFC] p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="text-emerald-600 font-mono font-bold block">8. Citizen Climate Action</span>
            <p className="text-slate-600">Mobilize grassroots citizen reporting of tree planting and cool roofs, awarding digital achievement badges and mapping verified actions.</p>
          </div>

        </div>
      </section>

      {/* TEE SECURITY SECTION */}
      <section className="p-6 rounded-2xl border border-[#1479D1]/30 bg-gradient-to-br from-[#071A2B] to-[#0B2942] text-white space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-[#28B8F2]" />
          <div>
            <h3 className="text-lg font-extrabold text-white">TEE Security — Architecture Ready</h3>
            <span className="text-xs text-[#28B8F2] font-mono">Trusted Execution Environment Confidential Computing</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          High-resolution urban demographic census data, vulnerability indicators, and critical infrastructure geometries are sensitive municipal assets. HeatMapX's backend is architected so that sensitive geospatial risk models and demographic joins can be executed inside hardware-enforced <strong>Trusted Execution Environments (TEEs)</strong> (such as Intel SGX, AMD SEV, or AWS Nitro Enclaves).
        </p>

        <div className="p-3 bg-[#071A2B] rounded-xl border border-[#28B8F2]/30 text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Note: HeatMapX's architecture is TEE-ready for future deployment; it currently runs in demonstration prototype mode.</span>
        </div>
      </section>

      {/* FUTURE DATA INTEGRATION ADAPTERS */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-base font-extrabold text-[#071A2B] flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#1479D1]" />
          <span>Future Real-Time Data Pipeline Adapters</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The HeatMapX backend uses an abstracted Data Adapter interface. In future production phases, the simulated Kanpur dataset will be dynamically updated through automated connectors to:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F7FAFC] border border-slate-200">
            <strong className="block text-[#071A2B]">ISRO Bhuvan / MOSDAC</strong>
            <span className="text-[10px] text-slate-500">INSAT-3D/3DR & Resourcesat thermal & optical feeds</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAFC] border border-slate-200">
            <strong className="block text-[#071A2B]">IMD Station Grid</strong>
            <span className="text-[10px] text-slate-500">Real-time AWS weather stations across Uttar Pradesh</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAFC] border border-slate-200">
            <strong className="block text-[#071A2B]">Google Earth Engine</strong>
            <span className="text-[10px] text-slate-500">Automated Landsat 9 & Sentinel-2 collection pipelines</span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7FAFC] border border-slate-200">
            <strong className="block text-[#071A2B]">NDAP & Census Data</strong>
            <span className="text-[10px] text-slate-500">National Data & Analytics Platform socio-economic layers</span>
          </div>
        </div>
      </section>

      {/* SCIENTIFIC GUARDRAILS & HONESTY DISCLAIMER */}
      <section className="p-6 rounded-2xl border border-amber-300 bg-amber-50 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Scientific Honesty Notice & Prototype Guardrails</span>
        </div>

        <p className="text-xs text-amber-900 leading-relaxed">
          HeatMapX is currently operating in <strong>DEMO MODE</strong> using simulated/sample spatial datasets calibrated for Kanpur Nagar, UP, India. Composite risk formulas, forecast projections, and Digital Twin deltas represent prototype decision support models. They do not claim certified medical risk forecasts or live sensor feeds.
        </p>
      </section>

    </div>
  );
}
