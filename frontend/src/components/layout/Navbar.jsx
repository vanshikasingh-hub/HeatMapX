import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useArea } from '../../context/AreaContext';
import { 
  Flame, 
  Map, 
  Activity, 
  Cpu, 
  Navigation, 
  Scale, 
  BarChart3, 
  Lightbulb, 
  Info, 
  Menu, 
  X,
  Compass,
  Users,
  Lock,
  LogOut,
  ShieldCheck,
  User,
  ChevronDown,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const { currentArea, openAreaSelector, locationSource } = useArea();
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic live time display in IST
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const options = { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      setCurrentTime(`${now.toLocaleDateString('en-US', options)} IST`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, []);

  // Primary citizen-facing navigation (Prioritized 5 items)
  const primaryNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Heat Map', path: '/map', icon: Map },
    { name: 'Forecast', path: '/forecast', icon: Activity },
    { name: 'Digital Twin', path: '/digital-twin', icon: Cpu },
    { name: 'Heat Equity', path: '/heat-equity', icon: Scale }
  ];

  // Secondary citizen community items accessible via More menu
  const secondaryNavItems = [
    { name: 'Cool Routes', path: '/cool-routes', icon: Navigation, desc: 'Thermal navigation' },
    { name: 'Citizen Action', path: '/citizen-action', icon: Users, desc: 'Earn climate badges' }
  ];

  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-200/90 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Active Ward Pill */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF3D00] via-[#FF7A18] to-[#FFB300] p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-[#FF7A18] animate-pulse" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans flex items-center gap-1">
                  Heat<span className="text-[#FF7A18]">Map</span><span className="text-[#0284c7]">X</span>
                </span>
                <span className="text-[9px] text-slate-500 font-medium block -mt-1 tracking-wider uppercase">
                  Kanpur Urban Heat
                </span>
              </div>
            </Link>

            {/* Active Area Quick Context Pill */}
            <button
              onClick={openAreaSelector}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-xs text-slate-800 transition-all group shrink-0 cursor-pointer shadow-sm"
              title="Click to switch active neighborhood"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-left leading-tight">
                <span className="block text-[8px] text-[#ea580c] font-bold uppercase tracking-wider">
                  Ward
                </span>
                <span className="block font-bold text-slate-900 text-xs truncate max-w-[100px] lg:max-w-[130px]">
                  {currentArea?.name || 'Kidwai Nagar'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>

          {/* Desktop Navigation Links — Prioritized 5 items + More Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-md shadow-orange-500/25' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* "More" Dropdown for Secondary Tools */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all cursor-pointer"
              >
                <span>More</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn space-y-1"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                          flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all
                          ${isActive ? 'bg-orange-500/15 text-[#ea580c] font-bold' : 'text-slate-700 hover:bg-slate-100'}
                        `}
                      >
                        <Icon className="w-4 h-4 text-[#FF7A18]" />
                        <div>
                          <strong className="block leading-none text-xs">{item.name}</strong>
                          <span className="text-[10px] text-slate-500">{item.desc}</span>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Top-Right Info & User Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Live Clock / Pilot Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-slate-600 text-[11px] font-mono bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{currentTime || 'Kanpur Nagar • Live'}</span>
            </div>

            {/* Auth Profile / Demo Actions */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100/90 border border-slate-200 hover:border-orange-500/40 transition-all text-left cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] text-white text-[11px] font-black flex items-center justify-center shadow-sm">
                    {user.avatarInitials || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <strong className="block text-xs text-slate-900 leading-tight truncate max-w-[110px]">{user.name}</strong>
                    <span className="text-[9px] text-[#ea580c] block -mt-0.5 truncate max-w-[110px]">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-xs text-slate-700 space-y-1 backdrop-blur-xl">
                    <div className="p-2 border-b border-slate-100">
                      <strong className="block text-slate-900 text-xs">{user.name}</strong>
                      <span className="text-[10px] text-slate-500 block">{user.email}</span>
                      <span className="text-[10px] text-[#ea580c] font-bold block mt-0.5">{user.ward || 'Kanpur Nagar'}</span>
                    </div>

                    <Link
                      to="/security"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
                      <span>TEE Confidential Computing</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-orange-500/40 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/login"
                  className="heat-btn-primary text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <span>Demo</span>
                </Link>
              </div>
            )}

            {/* Mobile Drawer Trigger */}
            <div className="flex xl:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-700 hover:text-slate-900 p-2 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#ea580c]" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white/95 border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-2xl backdrop-blur-2xl animate-fadeIn">
          {/* Mobile Active Area Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-[#FF7A18] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">{locationSource === 'detected' ? '📍 Your Ward:' : 'Active Ward:'}</span>
                <strong className="text-xs text-slate-900 block">{currentArea?.name || 'Kidwai Nagar'}</strong>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                openAreaSelector();
              }}
              className="px-3 py-1.5 text-xs font-bold bg-[#FF7A18] hover:bg-orange-600 text-white rounded-lg shadow-sm"
            >
              Change
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1.5">Main Navigation</p>
              <div className="grid grid-cols-2 gap-1.5">
                {primaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white font-bold shadow-md' 
                          : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-1.5">Citizen Community</p>
              <div className="grid grid-cols-2 gap-1.5">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) => `
                        flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white font-bold shadow-md' 
                          : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
