import React, { useState } from 'react';
import {
  Lock,
  User,
  Shield,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Globe,
} from 'lucide-react';
import { UserRole } from '../types';
import { Language, translations, supportedLanguages } from '../utils/i18n';

interface LoginPageProps {
  onLoginSuccess: (userRole: UserRole, userIdentifier: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  lang,
  setLang,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your University Roll Number, Faculty ID or Email.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole, identifier.trim());
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#E25822]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Bar with Language and Campus Hotline */}
      <header className="w-full border-b border-[rgba(148,163,184,0.12)] bg-[#060D1E]/80 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="hidden sm:inline font-medium">Takshashila University • Ongur Campus, Tindivanam 604305</span>
          <span className="sm:hidden font-medium">Takshashila Safety Portal</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:09297623456"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-[#F5A623] border border-amber-500/30 text-xs font-bold transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-mono">092976 23456</span>
          </a>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-[#0A1428] text-xs text-white border border-[rgba(148,163,184,0.25)] rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
          >
            {supportedLanguages.map((item) => (
              <option key={item.code} value={item.code} className="bg-[#0A1428] text-white">
                {item.nativeName} ({item.name})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-[#0A1428]/95 backdrop-blur-2xl border border-[rgba(148,163,184,0.2)] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 space-y-6">
          {/* Logo Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="bg-white px-3 py-1.5 rounded-2xl shadow-lg border border-[#E25822]/40 inline-flex items-center justify-center">
              <img
                src="/takshashila_logo.png"
                alt="Takshashila University"
                className="h-12 w-auto object-contain"
              />
            </div>

            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                Campus Safety Portal
              </h1>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Sign in with your University Roll Number or Faculty ID
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Standard Login Form */}
          <form onSubmit={handleStandardLogin} className="space-y-4">
            {/* User ID / Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F1F5F9] block">
                University Roll No / Faculty ID / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. TU2024CS089 or email@takshashilauniv.ac.in"
                  className="w-full bg-[#060D1E] text-xs text-white placeholder-[#64748B] pl-10 pr-3.5 py-2.5 rounded-xl border border-[rgba(148,163,184,0.2)] focus:outline-none focus:border-[#E25822] transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F1F5F9]">Password</label>
                <span className="text-[10px] text-[#3B82F6] hover:underline cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#060D1E] text-xs text-white placeholder-[#64748B] pl-10 pr-10 py-2.5 rounded-xl border border-[rgba(148,163,184,0.2)] focus:outline-none focus:border-[#E25822] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#E25822] to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs shadow-lg shadow-orange-600/25 transition-all transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Campus Safety Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="w-full py-3 text-center text-[11px] text-[#64748B] z-10 border-t border-[rgba(148,163,184,0.08)] bg-[#030712]/90">
        Takshashila University Anti-Ragging Cell • Confidential & Secure • Ongur, Tindivanam 604305
      </footer>
    </div>
  );
};
