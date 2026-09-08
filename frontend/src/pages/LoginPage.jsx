import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone,
  ArrowRight, 
  Sparkles, 
  LogIn,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, quickDemoLogin } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your mobile number or email address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await login(identifier, password);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/personalize-location');
        }, 400);
      } else {
        setError('Login failed. Please check your credentials or try quick demo login.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCitizenLogin = () => {
    quickDemoLogin('citizen');
    navigate('/personalize-location');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-gradient-to-tr from-[#FF3D00]/10 via-[#FF7A18]/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-6">
        
        {/* Main Card */}
        <div className="cinematic-card p-6 sm:p-8 space-y-6 border border-orange-200/80 bg-white/90 shadow-xl backdrop-blur-2xl text-center text-slate-900">
          
          {/* Brand Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] text-white flex items-center justify-center mx-auto shadow-md">
            {success ? (
              <CheckCircle2 className="w-7 h-7 text-white animate-bounce" />
            ) : (
              <LogIn className="w-7 h-7" />
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              Welcome to HeatMapX
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to monitor hyper-local heat risk and cooling advisories.
            </p>
          </div>

          {/* Switcher Tab (Sign in / Sign up) */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              className="py-2 rounded-lg bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-sm font-bold transition-all cursor-default"
            >
              Sign In
            </button>
            <Link
              to="/signup"
              className="py-2 rounded-lg text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              Sign Up
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-800">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 flex items-center gap-1 pointer-events-none">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-[10px] text-slate-400">/</span>
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or you@email.com"
                  className="w-full pl-16 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 font-mono shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-800">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full heat-btn-primary py-3.5 text-xs font-black shadow-heat-glow cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-2 text-white"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Fast Citizen 1-Click Evaluation Access */}
          <div className="pt-2 border-t border-slate-200/80 space-y-2">
            <span className="text-[10px] text-slate-500 font-medium block">
              Quick Prototype Evaluation
            </span>
            <button
              onClick={handleQuickCitizenLogin}
              type="button"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Continue as Citizen Champion (1-Click)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
