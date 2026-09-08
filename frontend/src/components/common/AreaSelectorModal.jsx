import React, { useState } from 'react';
import { useArea } from '../../context/AreaContext';
import { Search, MapPin, Check, X, Navigation, Thermometer, ChevronRight } from 'lucide-react';

export default function AreaSelectorModal() {
  const {
    allAreas,
    currentAreaId,
    userAreaId,
    isSelectorOpen,
    closeAreaSelector,
    setAreaById,
    requestUserLocation,
    isDetectingLocation
  } = useArea();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');

  if (!isSelectorOpen) return null;

  const filteredAreas = allAreas.filter(area => {
    const matchesSearch = 
      area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.wardName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      area.topDriver?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRisk = 
      filterRisk === 'ALL' || 
      area.riskLevel.toUpperCase() === filterRisk;

    return matchesSearch && matchesRisk;
  });

  const handleSelectArea = (areaId) => {
    setAreaById(areaId);
    closeAreaSelector();
  };

  const getRiskBadgeStyles = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'severe':
      case 'critical':
        return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'moderate':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-orange-200/90 overflow-hidden flex flex-col max-h-[90vh] text-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby="area-selector-title"
      >
        {/* Header */}
        <div className="p-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 via-amber-50 to-sky-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 id="area-selector-title" className="text-lg font-black tracking-tight text-slate-900">
                Select Kanpur Nagar Ward
              </h2>
              <p className="text-xs text-slate-500">
                Choose any municipal ward to update microclimate, thermal risk, and mitigation insights
              </p>
            </div>
          </div>
          <button
            onClick={closeAreaSelector}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close area selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Location Detection Toolbar */}
        <div className="p-4 border-b border-slate-200/80 space-y-3 bg-slate-50/70">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ward name, landmark, or corridor..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-400 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => {
                requestUserLocation().then(() => closeAreaSelector()).catch(() => {});
              }}
              disabled={isDetectingLocation}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl border border-amber-300 transition-colors shrink-0 disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {isDetectingLocation ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-amber-600/30 border-t-amber-700 rounded-full animate-spin" />
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-3.5 h-3.5 text-amber-700" />
                  <span>Use My Location</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium mr-1 text-[11px]">Filter Risk:</span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                  filterRisk === risk 
                    ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-sm' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {risk === 'ALL' ? 'All Wards (12)' : `${risk}`}
              </button>
            ))}
          </div>
        </div>

        {/* Areas List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-white/40">
          {filteredAreas.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-medium text-slate-700">No Kanpur areas found matching "{searchQuery}"</p>
              <p className="text-xs mt-1 text-slate-500">Try searching for Kidwai Nagar, Civil Lines, Barra, or Central.</p>
            </div>
          ) : (
            filteredAreas.map((area) => {
              const isSelected = area.id === currentAreaId;
              const isUserLocation = area.id === userAreaId;

              return (
                <div
                  key={area.id}
                  onClick={() => handleSelectArea(area.id)}
                  className={`group relative p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-orange-50/80 border-orange-400/90 shadow-sm'
                      : 'bg-white/90 border-slate-200/80 hover:border-orange-300 hover:bg-orange-50/30'
                  }`}
                >
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-[#FF7A18] transition-colors">
                        {area.name}
                      </span>
                      {isUserLocation && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                          <Navigation className="w-2.5 h-2.5" />
                          Your Location
                        </span>
                      )}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-300 text-[10px] font-bold">
                          Active Context
                        </span>
                      )}
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskBadgeStyles(area.riskLevel)}`}>
                        {area.riskLevel} ({area.riskScore}/100)
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap mb-1.5">
                      <span>{area.wardName || area.fullName}</span>
                      <span>•</span>
                      <span>Pop: {area.populationDensity?.toLocaleString()}/km²</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                        <span>LST: <strong className="text-slate-900">{area.lst}°C</strong></span>
                        <span className="text-slate-500 text-[11px]">(Air: {area.airTemperature}°C)</span>
                      </div>
                      <div className="text-slate-600 hidden sm:inline">
                        ΔT: <strong className="text-amber-700">+{area.deltaT}°C</strong>
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px] hidden md:inline">
                        Driver: {area.topDriver}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center pl-2 shrink-0">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] text-white flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/90 flex items-center justify-between text-xs text-slate-500">
          <div>
            Kanpur Nagar Municipal Corporation • 12 Active Wards
          </div>
          <button
            onClick={closeAreaSelector}
            className="px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-100 transition-colors cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
