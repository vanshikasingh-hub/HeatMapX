import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  TreePine, 
  Home, 
  Droplet, 
  Flame, 
  MapPin, 
  Trophy, 
  ChevronRight,
  ShieldCheck,
  Send,
  Camera,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  fetchCitizenActions, 
  submitCitizenAction, 
  fetchCitizenProfile, 
  fetchCitizenBadges, 
  fetchCitizenAwards, 
  fetchLeaderboard 
} from '../services/api';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { useArea } from '../context/AreaContext';
import MetricInfoTooltip from '../components/common/MetricInfoTooltip';

export default function CitizenActionPage() {
  const { currentArea } = useArea();
  const [profile, setProfile] = useState(null);
  const [actions, setActions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [awards, setAwards] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ individual: [], neighborhood: [] });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'submit', 'badges', 'leaderboard'
  
  // Submission Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formData, setFormData] = useState({
    actionType: 'Planted Trees',
    title: '',
    description: '',
    location: currentArea ? `${currentArea.name}, Kanpur` : 'Kidwai Nagar, Kanpur',
    wardName: currentArea ? currentArea.wardName : 'Ward 49 - Barra South Core',
    estimatedQuantity: '',
    impactCategory: 'Green Infrastructure',
    evidenceImage: ''
  });

  useEffect(() => {
    if (currentArea) {
      setFormData(prev => ({
        ...prev,
        location: `${currentArea.name}, Kanpur`,
        wardName: currentArea.wardName || 'Ward 49 - Barra South Core'
      }));
    }
  }, [currentArea]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prof = await fetchCitizenProfile();
    if (prof && prof.profile) setProfile(prof.profile);

    const acts = await fetchCitizenActions();
    if (acts && acts.actions) setActions(acts.actions);

    const bg = await fetchCitizenBadges();
    if (bg && bg.badges) setBadges(bg.badges);

    const aw = await fetchCitizenAwards();
    if (aw && aw.awards) setAwards(aw.awards);

    const lb = await fetchLeaderboard();
    if (lb) setLeaderboard(lb);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAction = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      citizenName: profile?.citizenName || "Aarav Sharma",
      date: new Date().toISOString().split('T')[0]
    };

    const res = await submitCitizenAction(payload);
    setIsSubmitting(false);

    if (res && res.success) {
      setSubmissionSuccess(true);
      if (res.action) {
        setActions(prev => [res.action, ...prev]);
      }
      setTimeout(() => {
        setSubmissionSuccess(false);
        setActiveTab('overview');
        // Reset form
        setFormData({
          actionType: 'Planted Trees',
          title: '',
          description: '',
          location: currentArea ? `${currentArea.name}, Kanpur` : 'Kidwai Nagar, Kanpur',
          wardName: currentArea ? currentArea.wardName : 'Ward 49 - Barra South Core',
          estimatedQuantity: '',
          impactCategory: 'Green Infrastructure',
          evidenceImage: ''
        });
      }, 2000);
    }
  };

  return (
    <ErrorBoundary title="Citizen Climate Action Center">
      <div className="min-h-screen pb-16 text-slate-900 animate-fadeIn">
      
      {/* Top Hero Banner */}
      <section className="bg-white/75 backdrop-blur-md pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-xs text-[#FF7A18] font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Community-Driven Urban Cooling & Civic Gamification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 font-heading">
                Citizen Climate <span className="heat-text-gradient">Action Center</span>
              </h1>
              <p className="text-slate-600 text-sm max-w-2xl leading-relaxed font-medium">
                Transforming HeatMapX from passive heat monitoring into an active community stewardship movement for <strong>Kanpur Nagar</strong>. Record mitigation work, unlock digital badges, earn civic awards, and cool your neighborhood.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('submit')}
              className="bg-gradient-to-r from-[#FF4500] to-[#FF7A18] hover:from-[#e03d00] hover:to-[#e66a10] text-white font-black px-5 py-3 rounded-xl text-xs shadow-[0_4px_20px_rgba(255,122,24,0.3)] flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Climate Action</span>
            </button>
          </div>

          {/* Citizen Impact Summary Strip */}
          {profile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="cinematic-card p-4 space-y-1 bg-white/85 border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-xs block font-bold">Actions Completed</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">{profile.actionsCompleted}</span>
                <span className="text-[11px] text-emerald-700 font-bold">{profile.actionsVerified} Verified</span>
              </div>

              <div className="cinematic-card p-4 space-y-1 bg-white/85 border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-xs block font-bold">Impact Points</span>
                <span className="text-2xl font-black text-[#ea580c] font-mono mt-0.5 block">{profile.impactPoints}</span>
                <span className="text-[11px] text-slate-500 font-medium">Community Rank #1</span>
              </div>

              <div className="cinematic-card p-4 space-y-1 bg-white/85 border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-xs block font-bold">Current Standing</span>
                <span className="text-base font-black text-[#0284c7] mt-1 block truncate">{profile.currentLevel}</span>
                <span className="text-[11px] text-slate-500 font-medium">Level 5 / 6</span>
              </div>

              <div className="cinematic-card p-4 space-y-1 bg-white/85 border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-xs block font-bold">Achievements</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-black text-slate-900 font-mono">{profile.badgesCount} Badges</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-base font-black text-[#d97706] font-mono">{profile.awardsCount} Awards</span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Kanpur Civic Contributor</span>
              </div>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-xs overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Action Feed & Overview', icon: Layers },
              { id: 'submit', label: 'Submit Mitigation Action', icon: PlusCircle },
              { id: 'badges', label: 'Digital Badges & Awards', icon: Award },
              { id: 'leaderboard', label: 'Community Leaderboard', icon: Trophy }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* 1. OVERVIEW & FEED TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Spatial Loop Callout */}
            <div className="cinematic-card p-6 border border-orange-200/80 bg-white/85 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wider block">
                  The Closed Loop Spatial Ecosystem
                </span>
                <h3 className="text-base font-black text-slate-900">
                  From Heat Detection to Spatial Citizen Impact
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed font-medium">
                  Every verified mitigation action you log (tree planting in Kalyanpur, cool roof in Sisamau, shading kiosk in Naveen Market) immediately populates the <strong>Kanpur Nagar Interactive Heat Map</strong> as a spatial green marker!
                </p>
              </div>
              <Link
                to="/map"
                className="bg-gradient-to-r from-[#FF4500] to-[#FF7A18] hover:from-[#e03d00] hover:to-[#e66a10] text-white font-black text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_4px_15px_rgba(255,122,24,0.25)] transition-all"
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>View Actions on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Actions Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 font-heading">Recent Verified Citizen Actions</h2>
                  <p className="text-xs text-slate-500 font-medium">Live community mitigation log in Kanpur Nagar</p>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Log your contribution</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {actions.map(action => (
                  <div key={action.id} className="cinematic-card p-5 space-y-3.5 flex flex-col justify-between hover:border-orange-300 transition-all shadow-sm bg-white/85 border border-slate-200/80 group">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-orange-50 text-[#ea580c] font-bold px-2 py-0.5 rounded text-[10px] border border-orange-200 font-mono">
                          {action.actionType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{action.status}</span>
                        </span>
                      </div>

                      <h3 className="font-black text-sm text-slate-900 group-hover:text-[#ea580c] transition-colors leading-snug">
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{action.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF7A18]" />
                          <span className="truncate max-w-[150px]">{action.location}</span>
                        </span>
                        <span className="font-mono text-slate-500">{action.date}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">By: <strong className="text-slate-900 font-bold">{action.citizenName}</strong></span>
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-black px-2.5 py-0.5 rounded-full font-mono shadow-sm">
                          +{action.impactPoints} Pts
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. SUBMIT ACTION TAB */}
        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto cinematic-card p-6 sm:p-8 border border-orange-200/80 bg-white/85 shadow-sm space-y-6">
            
            <div className="border-b border-slate-200/80 pb-4">
              <span className="text-xs font-mono text-[#ea580c] font-bold uppercase tracking-wider block">Civic Mitigation Submission</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1 font-heading">Submit Your Climate Action</h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Log environmental actions you or your community have completed to help reduce urban heat stress in Kanpur Nagar.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-black text-emerald-900">Climate Action Submitted & Verified!</h3>
                <p className="text-xs text-slate-600">
                  Your action has been recorded in the Kanpur database. You have earned +200 Impact Points and your marker will appear on the Heat Map.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAction} className="space-y-4 text-xs">
                
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Action Type</label>
                  <select
                    name="actionType"
                    value={formData.actionType}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium cursor-pointer shadow-sm"
                    required
                  >
                    <option value="Planted Trees" className="bg-white">Planted Trees (Urban Forestry)</option>
                    <option value="Maintained Urban Trees" className="bg-white">Maintained Urban Trees & Pruning</option>
                    <option value="Created Rooftop Garden" className="bg-white">Created Rooftop Terrace Garden</option>
                    <option value="Installed Cool / Reflective Roof" className="bg-white">Installed Cool / High-Albedo Roof</option>
                    <option value="Used High-Albedo Reflective Paint" className="bg-white">Used High-Albedo Reflective Paint</option>
                    <option value="Created Community Green Space" className="bg-white">Created Community Pocket Green Space</option>
                    <option value="Added Shading Structure" className="bg-white">Added Shading Structure for Vendors</option>
                    <option value="Water Body Conservation" className="bg-white">Water Body / Pond Conservation</option>
                    <option value="Reported Heat Hotspot" className="bg-white">Reported Local Heat Hotspot</option>
                    <option value="Organized Community Cooling Drive" className="bg-white">Organized Community Cooling Drive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Action Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. 20 Neem & Peepal Saplings Planted along Kalyanpur Avenue"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Detailed Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe how the action was carried out, species or materials used, and expected shade or thermal benefit..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Location / Street</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Near IIT Kanpur Gate, Kalyanpur"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Estimated Quantity / Coverage</label>
                    <input
                      type="text"
                      name="estimatedQuantity"
                      placeholder="e.g. 20 Trees (~150 sq m canopy)"
                      value={formData.estimatedQuantity}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Impact Category</label>
                    <select
                      name="impactCategory"
                      value={formData.impactCategory}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium cursor-pointer shadow-sm"
                    >
                      <option value="Green Infrastructure" className="bg-white">Green Infrastructure</option>
                      <option value="Cool Surface" className="bg-white">Cool Surface / High Albedo</option>
                      <option value="Water Cooling" className="bg-white">Water-Sensitive Cooling</option>
                      <option value="Civic Reporting" className="bg-white">Civic Hotspot Reporting</option>
                      <option value="Community Awareness" className="bg-white">Community Awareness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Evidence Photo URL (Optional)</label>
                    <input
                      type="url"
                      name="evidenceImage"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.evidenceImage}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 font-medium shadow-sm"
                    />
                  </div>
                </div>

                <div className="cinematic-card-subtle p-3 flex items-center gap-2.5 text-[11px] text-slate-700 bg-slate-50 border border-slate-200 rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Submissions receive instant prototype validation and are awarded community points based on thermal impact.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF7A18] hover:from-[#e03d00] hover:to-[#e66a10] text-white font-black py-3 px-4 rounded-xl text-xs shadow-[0_4px_15px_rgba(255,122,24,0.3)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Recording Action...' : 'Confirm & Submit Climate Action'}</span>
                </button>

              </form>
            )}

          </div>
        )}

        {/* 3. DIGITAL BADGES & AWARDS TAB */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            
            {/* Badges Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-heading">Digital Achievement Badges</h2>
                <p className="text-xs text-slate-500 font-medium">Milestones unlocked through verified heat mitigation participation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      badge.unlocked 
                        ? 'cinematic-card border-orange-200/90 bg-white/90 shadow-sm' 
                        : 'bg-slate-100/70 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{badge.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        badge.unlocked 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                          : 'bg-slate-200 border-slate-300 text-slate-600'
                      }`}>
                        {badge.unlocked ? 'Unlocked' : 'In Progress'}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-slate-900">{badge.name}</h3>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">{badge.description}</p>

                    <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span>Requirement</span>
                        <span className="font-semibold text-slate-800">{badge.requirement}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FF4500] to-[#FF7A18] rounded-full" 
                          style={{ width: `${badge.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Certificates Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200/80">
              <div>
                <h2 className="text-xl font-black text-slate-900 font-heading">Digital Honors & Awards</h2>
                <p className="text-xs text-slate-500 font-medium">Civic recognition certificates for outstanding community cooling stewardship</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {awards.map(award => (
                  <div key={award.id} className="cinematic-card p-6 border border-orange-200/80 bg-white/85 shadow-sm space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A18]/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{award.badgeIcon}</span>
                      <span className="text-[10px] font-mono bg-orange-50 text-[#ea580c] px-2 py-0.5 rounded-full border border-orange-200 font-bold">
                        {award.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-base text-slate-900">{award.name}</h3>
                      <span className="text-[11px] text-[#0284c7] font-bold block mt-0.5">Awarded to {award.awardedTo || "Aarav Sharma"}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{award.description}</p>

                    <div className="pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>{award.requirement}</span>
                      <span className="font-mono text-slate-500">{award.issuedDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Individual Leaderboard */}
            <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white/85">
              <div className="border-b border-slate-200/80 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
                  <Trophy className="w-5 h-5 text-[#d97706]" />
                  <span>Individual Citizen Champions</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Ranked by total verified heat mitigation impact points in Kanpur</p>
              </div>

              <div className="space-y-2">
                {leaderboard.individual.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs ${
                      user.rank === 1 
                        ? 'bg-orange-50 border-orange-200 text-slate-900 shadow-sm' 
                        : 'bg-slate-50/60 border-slate-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                        user.rank === 1 ? 'bg-[#FF7A18] text-white shadow-sm' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {user.rank}
                      </span>
                      <div>
                        <span className="font-black text-slate-900 block">{user.name}</span>
                        <span className="text-[11px] text-slate-500">{user.location} · {user.actionsCount} Actions</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-[#ea580c] font-mono block text-sm">{user.points} Pts</span>
                      <span className="text-[10px] text-slate-500">{user.level.split('—')[1] || user.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Leaderboard */}
            <div className="cinematic-card p-6 space-y-4 shadow-sm border border-slate-200/80 bg-white/85">
              <div className="border-b border-slate-200/80 pb-3">
                <h2 className="text-base font-black text-slate-900 flex items-center gap-2 font-heading">
                  <Flame className="w-5 h-5 text-[#FF7A18]" />
                  <span>Ward & Neighborhood Cool Index</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">Collective community actions by municipal ward</p>
              </div>

              <div className="space-y-2">
                {leaderboard.neighborhood.map((ward) => (
                  <div 
                    key={ward.rank}
                    className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/60 hover:border-orange-300 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#ea580c] font-mono">#{ward.rank}</span>
                        <strong className="text-slate-900 font-bold text-sm">{ward.wardName}</strong>
                      </div>
                      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                        {ward.coolScoreRank} Resilience
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Actions: <strong className="text-slate-800">{ward.verifiedActions}</strong> ({ward.primaryMitigation})</span>
                      <span className="font-mono font-bold text-[#ea580c]">{ward.totalPoints} Ward Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      </div>
    </ErrorBoundary>
  );
}
