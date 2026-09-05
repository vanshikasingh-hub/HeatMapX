import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  Award,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Heat Map', path: '/map', icon: Map },
    { name: 'Forecast', path: '/forecast', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: Compass },
    { name: 'Mitigation AI', path: '/mitigation', icon: Lightbulb },
    { name: 'Digital Twin', path: '/digital-twin', icon: Cpu },
    { name: 'Cool Routes', path: '/cool-routes', icon: Navigation },
    { name: 'Heat Equity', path: '/heat-equity', icon: Scale },
    { name: 'Citizen Action', path: '/citizen-action', icon: Users, highlight: true },
    { name: 'About', path: '/about', icon: Info }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#071A2B] border-b border-[#1479D1]/30 backdrop-blur-md text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1479D1] via-[#28B8F2] to-[#FF7A18] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#071A2B] rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-[#FF7A18] animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  Heat<span className="text-[#FF7A18]">Map</span><span className="text-[#28B8F2]">X</span>
                </span>
                <span className="text-[10px] font-mono bg-[#1479D1]/20 text-[#28B8F2] px-1.5 py-0.5 rounded border border-[#28B8F2]/30 font-semibold">
                  Kanpur Nagar
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium block -mt-0.5 tracking-wider uppercase">
                Urban Heat Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                    ${isActive 
                      ? item.highlight 
                        ? 'bg-[#FF7A18] text-white shadow-md shadow-orange-900/40' 
                        : 'bg-[#1479D1] text-white shadow-md'
                      : item.highlight
                        ? 'text-[#FF9F43] bg-[#FF7A18]/10 hover:bg-[#FF7A18]/20 border border-[#FF7A18]/30'
                        : 'text-slate-300 hover:text-white hover:bg-[#0B2942]'
                    }
                  `}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-white' : ''}`} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* CTA Action button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/citizen-action"
              className="bg-gradient-to-r from-[#FF7A18] to-[#FF9F43] hover:from-[#ff6f00] hover:to-[#ff8f24] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Climate Action</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-[#0B2942] border border-[#1479D1]/30 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-[#071A2B] border-b border-[#1479D1]/30 px-4 pt-2 pb-5 space-y-1 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? item.highlight 
                      ? 'bg-[#FF7A18] text-white font-bold' 
                      : 'bg-[#1479D1] text-white font-bold'
                    : item.highlight
                      ? 'text-[#FF9F43] bg-[#FF7A18]/10 border border-[#FF7A18]/30'
                      : 'text-slate-300 hover:bg-[#0B2942]'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
