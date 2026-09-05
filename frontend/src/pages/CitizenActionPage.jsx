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
  ArrowRight
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

export default function CitizenActionPage() {
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
    location: 'Kalyanpur, Kanpur',
    wardName: 'Ward 02 - Kalyanpur North',
    estimatedQuantity: '',
    impactCategory: 'Green Infrastructure',
    evidenceImage: ''
  });

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
          location: 'Kalyanpur, Kanpur',
          wardName: 'Ward 02 - Kalyanpur North',
          estimatedQuantity: '',
          impactCategory: 'Green Infrastructure',
          evidenceImage: ''
        });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#102A43] pb-16">
      
      {/* Top Hero Banner - Deep Navy */}
      <section className="bg-[#071A2B] text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#1479D1]/30">
        <div className="max-w-7xl mx-auto space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1479D1]/20 border border-[#28B8F2]/30 text-xs text-[#28B8F2] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Community-Driven Urban Cooling & Civic Gamification</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Citizen Climate <span className="text-[#FF7A18]">Action Center</span>
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl">
                Transforming HeatMapX from purely passive heat monitoring into an active community stewardship movement for <strong>Kanpur Nagar</strong>. Record mitigation work, unlock digital badges, earn civic awards, and cool your neighborhood.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('submit')}
              className="bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] hover:from-[#ff6f00] hover:to-[#ff8f24] text-white font-bold px-5 py-3 rounded-xl text-sm shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Climate Action</span>
            </button>
          </div>

          {/* Citizen Impact Dashboard Summary Card */}
          {profile && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
              <div className="bg-[#0B2942] border border-[#1479D1]/30 p-4 rounded-xl shadow-md">
                <span className="text-slate-400 text-xs block">Actions Completed</span>
                <span className="text-2xl font-extrabold text-white font-mono mt-0.5 block">{profile.actionsCompleted}</span>
                <span className="text-[11px] text-emerald-400 font-semibold">{profile.actionsVerified} Verified</span>
              </div>

              <div className="bg-[#0B2942] border border-[#1479D1]/30 p-4 rounded-xl shadow-md">
                <span className="text-slate-400 text-xs block">Impact Points</span>
                <span className="text-2xl font-extrabold text-[#FF9F43] font-mono mt-0.5 block">{profile.impactPoints}</span>
                <span className="text-[11px] text-slate-300">Community Rank #1</span>
              </div>

              <div className="bg-[#0B2942] border border-[#1479D1]/30 p-4 rounded-xl shadow-md">
                <span className="text-slate-400 text-xs block">Current Standing</span>
                <span className="text-base font-extrabold text-[#28B8F2] mt-1 block truncate">{profile.currentLevel}</span>
                <span className="text-[11px] text-slate-300">Level 5 / 6</span>
              </div>

              <div className="bg-[#0B2942] border border-[#1479D1]/30 p-4 rounded-xl shadow-md">
                <span className="text-slate-400 text-xs block">Achievements</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base font-extrabold text-white font-mono">{profile.badgesCount} Badges</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-base font-extrabold text-[#FF9F43] font-mono">{profile.awardsCount} Awards</span>
                </div>
                <span className="text-[11px] text-slate-300">Kanpur Civic Contributor</span>
              </div>
            </div>
          )}

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-800 text-xs overflow-x-auto">
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
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition-all ${
                    isActive
                      ? 'bg-[#1479D1] text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-[#0B2942]'
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
            
            {/* Spatial Loop Explanation Callout */}
            <div className="bg-[#EAF6FF] border border-[#1479D1]/30 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1479D1] uppercase tracking-wider block">The Closed Loop Ecosystem</span>
                <h3 className="text-base font-extrabold text-[#071A2B]">From Heat Detection to Spatial Citizen Impact</h3>
                <p className="text-xs text-slate-600 max-w-2xl">
                  Every verified mitigation action you log (tree planting in Kalyanpur, cool roof in Sisamau, shading kiosk in Naveen Market) immediately populates the <strong>Kanpur Nagar Interactive Heat Map</strong> as a spatial green marker!
                </p>
              </div>
              <Link
                to="/map"
                className="bg-[#1479D1] hover:bg-[#0f60a8] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md transition-all"
              >
                <MapPin className="w-4 h-4 text-[#FF9F43]" />
                <span>View Actions on Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Actions Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#071A2B]">Recent Verified Citizen Actions</h2>
                  <p className="text-xs text-slate-500">Live community mitigation log in Kanpur Nagar</p>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="text-xs font-bold text-[#FF7A18] hover:underline flex items-center gap-1"
                >
                  <span>Log your contribution</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {actions.map(action => (
                  <div key={action.id} className="glass-card p-5 space-y-3.5 flex flex-col justify-between hover:border-[#1479D1] transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-[#EAF6FF] text-[#1479D1] font-bold px-2 py-0.5 rounded text-[11px]">
                          {action.actionType}
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{action.status}</span>
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-[#071A2B] leading-snug">{action.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{action.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF7A18]" />
                          <span className="truncate max-w-[150px]">{action.location}</span>
                        </span>
                        <span className="font-mono">{action.date}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500">By: <strong>{action.citizenName}</strong></span>
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full font-mono">
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
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#1479D1]/20 shadow-xl space-y-6">
            
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-[#FF7A18] uppercase tracking-wider block">Civic Mitigation Submission</span>
              <h2 className="text-2xl font-extrabold text-[#071A2B] mt-1">Submit Your Climate Action</h2>
              <p className="text-xs text-slate-500 mt-1">
                Log environmental actions you or your community have completed to help reduce urban heat stress in Kanpur Nagar.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-emerald-900">Climate Action Submitted & Verified!</h3>
                <p className="text-xs text-emerald-700">
                  Your action has been recorded in the Kanpur database. You have earned +200 Impact Points and your marker will appear on the Heat Map.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitAction} className="space-y-4 text-xs">
                
                <div>
                  <label className="block font-bold text-[#071A2B] mb-1">Action Type</label>
                  <select
                    name="actionType"
                    value={formData.actionType}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                    required
                  >
                    <option value="Planted Trees">Planted Trees (Urban Forestry)</option>
                    <option value="Maintained Urban Trees">Maintained Urban Trees & Pruning</option>
                    <option value="Created Rooftop Garden">Created Rooftop Terrace Garden</option>
                    <option value="Installed Cool / Reflective Roof">Installed Cool / High-Albedo Roof</option>
                    <option value="Used High-Albedo Reflective Paint">Used High-Albedo Reflective Paint</option>
                    <option value="Created Community Green Space">Created Community Pocket Green Space</option>
                    <option value="Added Shading Structure">Added Shading Structure for Vendors</option>
                    <option value="Water Body Conservation">Water Body / Pond Conservation</option>
                    <option value="Reported Heat Hotspot">Reported Local Heat Hotspot</option>
                    <option value="Organized Community Cooling Drive">Organized Community Cooling Drive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#071A2B] mb-1">Action Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. 20 Neem & Peepal Saplings Planted along Kalyanpur Avenue"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#071A2B] mb-1">Detailed Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Describe how the action was carried out, species or materials used, and expected shade or thermal benefit..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#071A2B] mb-1">Location / Street</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Near IIT Kanpur Gate, Kalyanpur"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#071A2B] mb-1">Estimated Quantity / Coverage</label>
                    <input
                      type="text"
                      name="estimatedQuantity"
                      placeholder="e.g. 20 Trees (~150 sq m canopy)"
                      value={formData.estimatedQuantity}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#071A2B] mb-1">Impact Category</label>
                    <select
                      name="impactCategory"
                      value={formData.impactCategory}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                    >
                      <option value="Green Infrastructure">Green Infrastructure</option>
                      <option value="Cool Surface">Cool Surface / High Albedo</option>
                      <option value="Water Cooling">Water-Sensitive Cooling</option>
                      <option value="Civic Reporting">Civic Hotspot Reporting</option>
                      <option value="Community Awareness">Community Awareness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-[#071A2B] mb-1">Evidence Photo URL (Optional)</label>
                    <input
                      type="url"
                      name="evidenceImage"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.evidenceImage}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7FAFC] border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-[#071A2B] focus:ring-2 focus:ring-[#1479D1] outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#EAF6FF] p-3 rounded-lg border border-[#1479D1]/20 flex items-center gap-2 text-[11px] text-[#071A2B]">
                  <ShieldCheck className="w-4 h-4 text-[#1479D1] shrink-0" />
                  <span>Submissions receive instant prototype validation and are awarded community points based on thermal impact.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] hover:from-[#ff6f00] hover:to-[#ff8f24] text-white font-bold py-3 px-4 rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
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
                <h2 className="text-xl font-extrabold text-[#071A2B]">Digital Achievement Badges</h2>
                <p className="text-xs text-slate-500">Milestones unlocked through verified heat mitigation participation</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      badge.unlocked 
                        ? 'bg-white border-[#1479D1]/30 shadow-md' 
                        : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{badge.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {badge.unlocked ? 'Unlocked' : 'In Progress'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#071A2B]">{badge.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{badge.description}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Requirement</span>
                        <span className="font-semibold text-slate-600">{badge.requirement}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1479D1] to-[#FF7A18] rounded-full" 
                          style={{ width: `${badge.progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Certificates Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <h2 className="text-xl font-extrabold text-[#071A2B]">Digital Honors & Awards</h2>
                <p className="text-xs text-slate-500">Civic recognition certificates for outstanding community cooling stewardship</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {awards.map(award => (
                  <div key={award.id} className="bg-gradient-to-br from-[#071A2B] to-[#0B2942] text-white p-5 rounded-2xl border border-[#1479D1]/30 shadow-xl space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A18]/10 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{award.badgeIcon}</span>
                      <span className="text-[10px] font-mono bg-[#FF7A18]/20 text-[#FF9F43] px-2 py-0.5 rounded border border-[#FF7A18]/30 font-bold">
                        {award.level}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-white">{award.name}</h3>
                      <span className="text-[11px] text-[#28B8F2] font-semibold block mt-0.5">Awarded to {award.awardedTo || "Aarav Sharma"}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{award.description}</p>

                    <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{award.requirement}</span>
                      <span className="font-mono text-slate-300">{award.issuedDate}</span>
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
            <div className="bg-white p-6 rounded-2xl border border-[#1479D1]/20 shadow-md space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#071A2B] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#FF9F43]" />
                  <span>Individual Citizen Champions</span>
                </h2>
                <p className="text-xs text-slate-500">Ranked by total verified heat mitigation impact points in Kanpur</p>
              </div>

              <div className="space-y-2">
                {leaderboard.individual.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs ${
                      user.rank === 1 
                        ? 'bg-[#EAF6FF] border-[#1479D1]/40 shadow-sm' 
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        user.rank === 1 ? 'bg-[#FF7A18] text-white' : user.rank === 2 ? 'bg-slate-300 text-slate-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.rank}
                      </span>
                      <div>
                        <span className="font-extrabold text-[#071A2B] block">{user.name}</span>
                        <span className="text-[11px] text-slate-400">{user.location} · {user.actionsCount} Actions</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-[#FF7A18] font-mono block">{user.points} Pts</span>
                      <span className="text-[10px] text-slate-400">{user.level.split('—')[1] || user.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Neighborhood Leaderboard */}
            <div className="bg-white p-6 rounded-2xl border border-[#1479D1]/20 shadow-md space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#071A2B] flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#1479D1]" />
                  <span>Ward & Neighborhood Cool Index</span>
                </h2>
                <p className="text-xs text-slate-500">Collective community actions by municipal ward</p>
              </div>

              <div className="space-y-2">
                {leaderboard.neighborhood.map((ward) => (
                  <div 
                    key={ward.rank}
                    className="p-3.5 rounded-xl border border-slate-100 bg-[#F7FAFC] hover:border-[#1479D1]/30 transition-all text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#1479D1] font-mono">#{ward.rank}</span>
                        <strong className="text-[#071A2B] font-bold text-sm">{ward.wardName}</strong>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                        {ward.coolScoreRank} Resilience
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Actions: <strong>{ward.verifiedActions}</strong> ({ward.primaryMitigation})</span>
                      <span className="font-mono font-bold text-[#FF7A18]">{ward.totalPoints} Ward Pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
