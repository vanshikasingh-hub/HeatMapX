import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  UserPlus, 
  RotateCw,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const KANPUR_WARDS = [
  "Kidwai Nagar",
  "Civil Lines",
  "Kanpur Central",
  "Sisamau Bazaar",
  "Swaroop Nagar",
  "Naveen Market",
  "Govind Nagar",
  "Panki Industrial",
  "Jajmau",
  "Kalyanpur",
  "Allen Forest Zoo",
  "IIT Kanpur Campus"
];

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Step 1: Details, Step 2: Verification
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    ward: 'Kidwai Nagar'
  });

  // Verification state
  const [smsOtp, setSmsOtp] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [smsDevCode, setSmsDevCode] = useState('');
  const [emailDevCode, setEmailDevCode] = useState('');
  const [smsVerified, setSmsVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Status & Timers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle Step 1 submit: send codes and advance to Step 2
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.email.trim()) {
      setError('Please fill in your name, mobile number, and email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send both SMS OTP and Email code
      const [smsRes, emailRes] = await Promise.all([
        sendOtp(formData.mobile, 'sms').catch(() => null),
        sendOtp(formData.email, 'email').catch(() => null)
      ]);

      if (smsRes?.devCode) setSmsDevCode(smsRes.devCode);
      if (emailRes?.devCode) setEmailDevCode(emailRes.devCode);

      setStep(2);
      setCanResend(false);
      setCountdown(60);

      // Start 60s countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to dispatch verification codes.');
    } finally {
      setLoading(false);
    }
  };

  // Resend codes
  const handleResendCodes = async () => {
    if (!canResend) return;
    setLoading(true);
    setError('');
    try {
      const [smsRes, emailRes] = await Promise.all([
        sendOtp(formData.mobile, 'sms'),
        sendOtp(formData.email, 'email')
      ]);
      if (smsRes?.devCode) setSmsDevCode(smsRes.devCode);
      if (emailRes?.devCode) setEmailDevCode(emailRes.devCode);
      setCanResend(false);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to resend verification codes.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2 submit: verify codes and create account
  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!smsOtp.trim()) {
      setError('Please enter the 6-digit SMS OTP sent to your mobile.');
      return;
    }
    if (!emailCode.trim()) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify SMS OTP
      await verifyOtp(formData.mobile, smsOtp.trim());
      setSmsVerified(true);

      // 2. Verify Email Code
      await verifyOtp(formData.email, emailCode.trim());
      setEmailVerified(true);

      // 3. Register citizen account
      await signup({
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password || 'demo123',
        ward: formData.ward
      });

      // 4. Forward to Location Access screen
      setTimeout(() => {
        navigate('/personalize-location');
      }, 500);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the codes and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 relative select-none">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-gradient-to-tr from-[#FF3D00]/10 via-[#FF7A18]/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-6">
        
        {/* Main Card */}
        <div className="cinematic-card p-6 sm:p-8 space-y-6 border border-orange-200/80 bg-white/90 shadow-xl backdrop-blur-2xl text-center text-slate-900">
          
          {/* Badge Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF4500] to-[#FF7A18] text-white flex items-center justify-center mx-auto shadow-md">
            {step === 1 ? <UserPlus className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7 text-white" />}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              {step === 1 ? 'Create Citizen Account' : 'Verify Your Identity'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {step === 1 
                ? 'Join Kanpur Nagar’s hyper-local climate and heat intelligence network.' 
                : 'Enter the verification codes sent to your mobile and email.'}
            </p>
          </div>

          {/* Segmented Switcher (Sign in / Sign up) */}
          {step === 1 && (
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <Link
                to="/login"
                className="py-2 rounded-lg text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
              >
                Sign In
              </Link>
              <button
                type="button"
                className="py-2 rounded-lg bg-gradient-to-r from-[#FF4500] to-[#FF7A18] text-white shadow-sm font-bold transition-all cursor-default"
              >
                Sign Up
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* STEP 1: CITIZEN INFORMATION */}
          {step === 1 && (
            <form onSubmit={handleDetailsSubmit} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-800">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-800">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 font-mono shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. aarav@city.in"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 font-mono shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all placeholder:text-slate-400 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-800">
                  Home Kanpur Ward
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all cursor-pointer font-bold shadow-sm"
                  >
                    {KANPUR_WARDS.map((w) => (
                      <option key={w} value={w} className="bg-white text-slate-900">
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full heat-btn-primary py-3.5 text-xs font-black shadow-heat-glow cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 mt-3 text-white"
              >
                {loading ? (
                  <span>Sending Verification Codes...</span>
                ) : (
                  <>
                    <span>Continue to Verification</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: DUAL OTP / CODE VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerificationSubmit} className="space-y-5 text-left animate-fadeIn">
              
              {/* Mobile SMS OTP Field */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Smartphone className="w-4 h-4 text-[#FF7A18]" />
                    <span>SMS OTP ({formData.mobile})</span>
                  </div>
                  {smsVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={smsOtp}
                  onChange={(e) => setSmsOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit SMS OTP"
                  className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                  required
                />
                
                {smsDevCode && (
                  <div className="text-[10px] text-amber-700 font-mono text-center font-bold">
                    Demo SMS Code: <strong>{smsDevCode}</strong> (or use 123456)
                  </div>
                )}
              </div>

              {/* Email Verification Code Field */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <Mail className="w-4 h-4 text-[#0284c7]" />
                    <span>Email Code ({formData.email})</span>
                  </div>
                  {emailVerified && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>

                <input
                  type="text"
                  maxLength={6}
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Email Code"
                  className="w-full px-4 py-2.5 text-center text-sm font-mono tracking-widest bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
                  required
                />

                {emailDevCode && (
                  <div className="text-[10px] text-cyan-700 font-mono text-center font-bold">
                    Demo Email Code: <strong>{emailDevCode}</strong> (or use 123456)
                  </div>
                )}
              </div>

              {/* Resend Action */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={handleResendCodes}
                  disabled={!canResend || loading}
                  className="text-[#ea580c] hover:text-[#c2410c] disabled:text-slate-400 font-bold cursor-pointer disabled:cursor-not-allowed transition-colors"
                >
                  {canResend ? 'Resend Codes' : `Resend in ${countdown}s`}
                </button>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full heat-btn-primary py-3.5 text-xs font-black shadow-heat-glow cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 text-white"
                >
                  {loading ? (
                    <span>Verifying & Creating Account...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Proceed</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-[11px] text-slate-500 hover:text-slate-800 py-1 cursor-pointer transition-colors font-medium"
                >
                  ← Edit Contact Information
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
